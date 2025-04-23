<template>
<div id="box">
    <ul>
        <div id="post">
            <!-- Render the title -->
            <h1>{{ post.title }}</h1>
            <!-- Render the content only if expanded -->
            <div v-if="isExpanded">
                <h2>{{ post.author.username }} | {{ post.timestamp }}</h2>
                <h3>{{ post.content }}</h3>
                <li>
            </li>
            </div>
        </div>
        <div id="comments" v-if="isExpanded">
            <!-- New comment only displays if you're logged in -->
            <div v-if="store.currentUser !== null">
                <!-- New comment box -->
                <input id="newcomment" maxlength="150" v-model="newComment" placeholder="Say something! (150 character limit)" />
                <!-- Post comment button -->
                <button @click="postComment">Post Comment</button>
                <!-- Comment error -->
                <li id="error">
                    {{ errorMsg }}
                </li>
            </div>
            <li id="individualcomment" v-for="(comment, index) in comments" :key="comment.id">
                <!-- Render comment author -->
                <h2>
                    {{ comment.author.username }} | {{ store.getTime() }}
                    <span v-if="comment.edited">(edited)</span>
                </h2>
                <!-- Render comment contents -->
                <div v-if="editingCommentIndex === index">
                    <textarea id="editcomment" v-model="editedComment" maxlength="150"></textarea>
                    <button @click="saveComment(index)">Save</button>
                    <button @click="cancelEdit">Cancel</button>
                </div>
                <div v-else>
                    <h3 v-if="!comment.deleted">{{ comment.content }}</h3>
                    <h3 v-else>This comment has been deleted.</h3>
                </div>
                <!-- Edit and Delete buttons -->
                <div v-if="comment.author.id === store.currentUser?.id || store.currentUser?.username==='admin'">
                    <button v-if="!confirmingDelete[index]" @click="confirmDelete(index)">Delete</button>
                    <div v-else>
                        <h3><strong>Are you sure?</strong></h3>
                        <button @click="deleteComment(index)">Confirm Delete</button>
                        <button @click="cancelDelete(index)">Cancel</button>
                    </div>
                    <!-- Hide the Edit button when confirming delete -->
                    <button v-if="!confirmingDelete[index]" @click="editComment(index, comment.content)">Edit</button>
                </div>
            </li>
        </div>
        <!-- Toggle button to expand/collapse content -->
        <button id="expand" @click="toggleContent">
                {{ isExpanded ? "Collapse" : "Expand" }}
        </button>
        <button v-if="store.currentUser?.username==='admin'" id="editrm" @click="deletePost">Delete Post</button>
                <!--confirm delete-->
                <li v-if="deleting">
                    <button @click="confirmDeletePost">Confirm Delete</button>
                    <button @click="cancelDeletePost">Cancel</button>
                </li>
    </ul>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Post, Comment } from "../types/forum.ts";
import { useStore } from "../stores/store.ts";

const store = useStore();
type Props = {
    post: Post;
    comments: Comment[] | undefined;
};
const props = defineProps<Props>();

const newComment = ref('');
const errorMsg = ref('');
const isExpanded = ref(true);
const editingCommentIndex = ref<number | null>(null); // Track which comment is being edited
const editedComment = ref(""); // Store the edited comment content
const confirmingDelete = ref<Record<number, boolean>>({}); // Track confirmation state for each comment
const deleting = ref(false);

const confirmDeletePost = () => {
        //remove contents from database
        store.confirmDelete(props.post);
        isExpanded.value = false;
    }
const cancelDeletePost = () => {
        deleting.value = !deleting.value;
}
const deletePost = () => {
        deleting.value = true;
    }

// Post a new comment
const postComment = async () => {
    if (store.currentUser !== null && props.post!==undefined && newComment.value!=='') {
        await store.postComment(props.post, newComment.value, store.currentUser);
        errorMsg.value = '';
        newComment.value = ''; // Clear input field
    } else {
            errorMsg.value = "Couldn't post message -- field was empty.";
    }
};

// Edit a comment
const editComment = (index: number, content: string) => {
    editingCommentIndex.value = index;
    editedComment.value = content;
};

// Save the edited comment
const saveComment = async (index: number) => {
    if (editedComment.value.trim() === "") {
        errorMsg.value = "Comment cannot be empty.";
        return;
    }
    await store.editComment(props.post, index, editedComment.value);
    editingCommentIndex.value = null;
    editedComment.value = "";
};

// Cancel editing
const cancelEdit = () => {
    editingCommentIndex.value = null;
    editedComment.value = "";
};

// Confirm delete
const confirmDelete = (index: number) => {
    confirmingDelete.value[index] = true;
};

// Cancel delete
const cancelDelete = (index: number) => {
    confirmingDelete.value[index] = false;
};

// Delete a comment
const deleteComment = async (index: number) => {
    store.deleteComment(props.post, index);
};

// Toggle post content visibility
const toggleContent = () => {
    isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss">
html {
    margin: 10px;
    padding: 10px;
    background-color: whitesmoke
}
h1 {
    font-size: 24px;
    font-weight: bold;
}
h2 {
    font-size: 18px;
    font-weight: bold;
}
h3 {
    font-size: 18px;
    font-weight:normal;
}
button {
        padding: 5px 10px;
        margin: 10px;
        background-color: #4b0082;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
            background-color: #6800b2
        }
}
#post {
    word-wrap: break-word;
}
#box {
    background-color: #d1d1d1;
    margin: 10px;
    padding: 10px;
}
#comments {
    background-color: whitesmoke;
    margin-left: 30px;
}
#newcomment {
    width: 90%;
    align-content: right;
    margin: 10px;
}
#individualcomment {
    background-color: #d1d1d1;
    width: 90%;
    align-content: right;
    margin-left: 30px;
    padding:10px;
    border: 5px solid whitesmoke;
    word-wrap: break-word;
}
#expand {
    background-color: transparent;
    color:#4b0082;
}
#editcomment {
    width: 80%; 
    height: auto; 
    padding: 5px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none; 
    overflow-y: auto; 
    white-space: pre-wrap; 
    word-wrap: break-word; 
}
</style>