import { defineStore } from "pinia";
import db from "../firebase.ts";
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    doc,
    updateDoc,
    setDoc
} from "firebase/firestore";
import { User, Comment, Post } from "../types/forum";

async function addDataToCollection(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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
      const foundUsername = userData.username;
      const foundPassword = userData.password;
      const foundFavcolor = userData.favcolor; // Add this to retrieve favcolor if it exists
      console.log("Found document:", firstMatch.id);
      return {
        id: firstMatch.id,
        username: foundUsername,
        password: foundPassword,
        favcolor: foundFavcolor // Include favcolor in the returned user object
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
    }),
   
    actions: {
        async init() {
            this.isLoading = true;
            this.error = null;
            try {
                //fetch posts collection
                const postSnapshot = await getDocs(collection(db, "posts"));
                this.posts = postSnapshot.docs.map(doc => doc.data() as Post);
                console.log("Successfully fetched post database");
                //fetch users collection
                const userSnapshot = await getDocs(collection(db, "users"));
                this.users = userSnapshot.docs.map(doc => doc.data() as User);
                console.log("Successfully fetched registered users");
            } catch (error) {
                console.error("Error initializing store:", error);
                this.error = error instanceof Error ? error.message : "Unknown error occured";
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
                if(foundUser.password === password){
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
                    const id = this.users.length;
                    const newUser: User = {
                        id: id.toString(),
                        username: user,
                        password: password,
                    };
                    //add to local storage
                    this.users.push(newUser);
                    //add to cloud storage
                    await setDoc(doc(db, "users", id.toString()), {
                        id: id.toString(),
                        username: user,
                        password: password
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
                    const userRef = doc(db, "users", this.currentUser.id);
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
        }
    }
})