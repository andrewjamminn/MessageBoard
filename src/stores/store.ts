import { defineStore } from "pinia";
import db from "../firebase.ts";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { User, Post, Comment } from "../types/forum";
import bcrypt from 'bcryptjs';

function sortByID(array: any, newestFirst: boolean){
    if(newestFirst){
        array.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
    }
    else {
        array.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
    }
}

async function encrypt(password: string){
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function findUser(username: string) {
    const q = query(collection(db, "users"), where("username", "==", username));
   
    try {
      const querySnapshot = await getDocs(q);
     
      if (querySnapshot.empty) {
        console.log("No matching documents");
        return null;
      }
     
      // Get the first matching document
      const firstMatch = querySnapshot.docs[0];
      // Access individual fields
      const userData = firstMatch.data();
      const foundID = userData.id;
      const foundUsername = userData.username;
      const foundPassword = userData.password;
      const foundFavcolor = userData.favcolor; // Add this to retrieve favcolor if it exists
      console.log("Found document:", firstMatch.id);
      return {
        id: foundID,
        username: foundUsername,
        password: foundPassword,
        favcolor: foundFavcolor, // Include favcolor in the returned user object
      };
    } catch (error) {
      console.error("Error finding document:", error);
      return null;
    }
  }

export const useStore = defineStore("Forum", {
    state: () => ({
        posts: [] as Post[],
        users: [] as User[],
        currentUser: null as User | null, //logged out by default
        // Add loading state for better user experience
        isLoading: false,
        error: null as string | null,
        unsubscribePosts: null as Function | null,
        unsubscribeUsers: null as Function | null,
    }),
   
    actions: {

        // Set up real-time listeners
        setupFirestoreListeners() {
            // Clean up existing listeners if any
            this.cleanupListeners();
            
            // Posts listener
            const postsRef = collection(db, "posts");
            const postsQuery = query(postsRef, orderBy("id", "asc"));
            
            this.unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                // Handle initial data and updates
                const updatedPosts = snapshot.docs.map(doc => doc.data() as Post);
                this.posts = updatedPosts;
                //re-sort posts
                sortByID(this.posts, true);
                console.log("Posts updated from Firestore");
            }, (error) => {
                console.error("Error listening to posts:", error);
                this.error = error.message;
            });
            // Users listener
            const usersRef = collection(db, "users");
            const usersQuery = query(usersRef, orderBy("id", "asc"));
            
            this.unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
                // Handle initial data and updates
                const updatedUsers = snapshot.docs.map(doc => doc.data() as User);
                this.users = updatedUsers;
                //re-sort users
                sortByID(this.users, true);
                console.log("Users updated from Firestore");
            }, (error) => {
                console.error("Error listening to users:", error);
                this.error = error.message;
            });
        },

        // Clean up listeners to prevent memory leaks
        cleanupListeners() {
            if (this.unsubscribePosts) {
                this.unsubscribePosts();
                this.unsubscribePosts = null;
            }
            
            if (this.unsubscribeUsers) {
                this.unsubscribeUsers();
                this.unsubscribeUsers = null;
            }
        },

        async init() {
            this.isLoading = true;
            this.error = null;
            try {
                // Set up real-time listeners instead of one-time fetches
                this.setupFirestoreListeners();
            } catch (error) {
                console.error("Error initializing store:", error);
                this.error = error instanceof Error ? error.message : "Unknown error occurred";
            } finally {
                this.isLoading = false;
            }
        },
        
        async signIn(user: string, password: string) {
            //search for username -- if username found move on
            const foundUser = await findUser(user);
            //if username found
            if(foundUser){
                //does password match the username?
                const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
                if(isPasswordMatch){
                    //loginSuccess = true
                    this.currentUser = foundUser;
                    return true;
                }
                else {
                    return false;
                }
            }
            //if username not found
            else {
                //loginSuccess = false
                return false;
            }
        },
        
        async createUser(user: string, password: string){
            //search for username, if username found return error
            const foundUser = await findUser(user);
            if(foundUser){
                //signupSuccess = false
                return false;
            }
            else {
                //check to make sure password isn't empty
                if(password!=='') {
                    const highestid = this.users.length > 0 ? 
                        Math.max(...this.users.map(user => user.id)) : 0;
                    const id = highestid + 1;
                    //encrypt password
                    const hashedPassword = await encrypt(password);
                    console.log(hashedPassword);
                    const newUser: User = {
                        id: id,
                        username: user,
                        password: hashedPassword,
                        favcolor: 'Gray',
                    };
                    //add to local storage
                    this.users.push(newUser);
                    sortByID(this.users, true);
                    //add to cloud storage
                    await setDoc(doc(db, "users", id.toString()), {
                        id: id,
                        username: user,
                        password: hashedPassword,
                        favcolor: 'Gray'
                    });
                    //update current user
                    this.currentUser = newUser;
                    return true;
                }
                else {
                    return false;
                }
            }
        },

        async logOut() {
            this.currentUser = null; // Clear the current user
            console.log("User logged out successfully.");
        },
        
        async updateUserFavColor(color: string) {
            if (this.currentUser) {
                try {
                    // Update in Firestore
                    const userRef = doc(db, "users", this.currentUser.id.toString());
                    await updateDoc(userRef, {
                        favcolor: color
                    });
                    
                    // Update local state
                    this.currentUser.favcolor = color;
                    console.log("Successfully updated favorite color to:", color);
                    return true;
                } catch (error) {
                    console.error("Error updating favorite color:", error);
                    this.error = error instanceof Error ? error.message : "Unknown error occurred";
                    return false;
                }
            }
            return false;
        },
        async newPost(author: User, title: string, time: string, content: string){
            //check that title and contents are both valid posts
            if(title!=='' && content!=='' ){
                //id is the most recent id + 1
                const highestid = this.posts.length > 0 ? 
                    Math.max(...this.posts.map(post => post.id)) : 0;
                const id = highestid + 1;
                const newPost: Post = {
                    id: id,
                    author: author,
                    title: title,
                    content: content,
                    timestamp: time,
                    comments: []
                }
                //add to local storage
                //this.posts.push(newPost);
                sortByID(this.posts, true);
                //add to cloud storage
                await setDoc(doc(db, "posts", id.toString()), {
                    id: id,
                    author: author,
                    title: title,
                    content: content,
                    timestamp: time,
                    comments: []
                });
                //new post created successfully
                console.log("Success");
                return true;
            }
            else {
                return false;
            }
            
        },
        getTime() {
            // Get current date and time
            const now = new Date();
    
            // Format as 24-hour time (HH:MM:SS)
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
    
            // Format full date with 24-hour time
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const day = now.getDate().toString().padStart(2, '0');
    
            // Create formatted strings
            const timeString = `${hours}:${minutes}`;
            const dateTimeString = `${year}-${month}-${day} ${timeString}`;
    
            return dateTimeString;
        },

        async postComment(post: Post, comment: string, user: User){
            //check that comment isn't empty
            if(comment!==''){
                const highestid = post.comments.length > 0 ? 
                    Math.max(...post.comments.map(comment => comment.id)) : 0;
                const id = highestid + 1;
                const newComment: Comment = {
                    id: id,
                    author: user,
                    content: comment
                }
                    //add to local storage
                    post.comments.push(newComment);
                    sortByID(post.comments, true);
                    //add to cloud storage
                    // Reference to the document
                    const docRef = doc(db, "posts", post.id.toString());
    
                    // Update the document
                    updateDoc(docRef, {
                        comments: post.comments,
                    })
                        .then(() => {
                        console.log("Document successfully updated!");
                        return true;
                    })
                        .catch((error) => {
                        console.error("Error updating document: ", error);
                        return false;
                    });
            }
            else {
                return false;
            }
        },

        async confirmEdit(post: Post, newContent: string){
            //update the local storage
            post.content = newContent;
            //update the cloud storage
            const docRef = doc(db, "posts", post.id.toString());

            // Update the document
            updateDoc(docRef, {
                content: newContent,
            })
                .then(() => {
                console.log("Document successfully updated!");
            })
                .catch((error) => {
                console.error("Error updating document: ", error);
            });
            return true;
        },

        async confirmDelete(post: Post){
            const origlength = this.posts.length;
            //remove from local storage
            this.posts = this.posts.filter(posts => posts.id !== post.id);
            if(this.posts.length+1===origlength){
                //remove from cloud storage
                const docRef = doc(db, "posts", post.id.toString());

                //Delete the document
                deleteDoc(docRef)
                .then(() => {
                    console.log("Post successfully deleted!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }

        },

        async deleteUser (user: User){
            
            const origlength = this.users.length;
            //remove from local storage
            this.users = this.users.filter(users => users.id !== user.id);
            if(this.users.length+1===origlength){
                //remove from cloud storage
                const docRef = doc(db, "users", user.id.toString());

                //Delete the document
                deleteDoc(docRef)
                .then(() => {
                    console.log("User successfully deleted!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
                //current user is null
                this.currentUser = null;
            }
        },

        async deleteComment(post: Post, commentIndex: number) {
            post.comments.splice(commentIndex);
        },

        async editComment(post: Post, commentIndex: number, newContent: string) {
            // Update the comment in local storage
            const comment = post.comments[commentIndex];
            if (comment) {
                comment.content = newContent;
                comment.edited = true;

                // Update the post in Firestore
                const docRef = doc(db, "posts", post.id.toString());
                await updateDoc(docRef, {
                    comments: post.comments,
                });

                console.log("Comment edited successfully.");
            }
        }
    
    }
})