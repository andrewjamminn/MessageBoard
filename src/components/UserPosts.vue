<template>
<div id="box">
    <ul>
        <div id = "post">
            <!--render the title-->
            <h1> {{ post.title }}</h1>
            <!-- Toggle button to expand/collapse content -->
            <li>
                <button id="expand" @click="toggleContent">
                    {{ isExpanded ? "Collapse" : "Expand" }}
                </button> 
            </li>
            
            <!-- Render the content only if expanded -->
            <div v-if="isExpanded">
                <h2>{{ post.author.username }} | {{ post.timestamp }}</h2>
                <!--if editing, display contents in textarea-->
                <h3 v-if="editing">
                    <textarea id="textbox" maxlength="1000" type="text" v-model="newContent">{{ post.content }}</textarea>
                </h3>
                <li v-if="editing">
                    <button @click="confirmEdit">Save</button>
                    <button @click="cancelEdit">Cancel</button>
                </li>
                
                <!--if not editing, display contents normally-->
                <h3 v-else>{{ post.content }}</h3>
            </div>
        </div>
        <template v-if="isExpanded">
            <li>
                <button id="editrm" @click="editPost">Edit Post</button>
                <button id="editrm" @click="deletePost">Delete Post</button>
                <!--confirm delete-->
                <li v-if="deleting">
                    <button @click="confirmDelete">Confirm Delete</button>
                    <button @click="cancelDelete">Cancel</button>
                </li>
            </li>
        </template>
        <div id="comments" v-if="isExpanded">
            <li id="individualcomment" v-for="comment in comments">
                <!--render comment author-->
                <h2> {{ comment.author.username }} | {{ store.getTime() }}</h2>
                <!--render comment contents-->
                <h3>{{ comment.content }}</h3>
            </li>
        </div>
    </ul>
    
</div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { Post, Comment } from "../types/forum.ts"
    import { useStore } from '../stores/store.ts'

    const store = useStore();
        type Props = {
            post: Post;
            comments: Comment[] | undefined;
        }; 
        const props = defineProps<Props>();
    
    const isExpanded = ref(false);
    const editing = ref(false);
    const deleting = ref(false);
    const newContent = ref(props.post.content);

    const toggleContent = () => {
        isExpanded.value = !isExpanded.value;
    };

    const editPost = () => {
        editing.value = !editing.value;
    }

    const deletePost = () => {
        deleting.value = true;
    }

    const confirmEdit = () => {
        //no longer editing
        editing.value = !editing.value
        //update contents in databases
        store.confirmEdit(props.post, newContent.value);
    }
    const cancelEdit = () => {
        newContent.value = props.post.content;
        editing.value = !editing.value;
    }
    const confirmDelete = () => {
        //remove contents from database
        store.confirmDelete(props.post);
        isExpanded.value = false;
    }
    const cancelDelete = () => {
        deleting.value = !deleting.value;
    }

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
#box {
    background-color: #d1d1d1;
    margin: 5px;
    padding: 10px;
}
#comments {
    background-color: whitesmoke;
    
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
    margin-left: 10px;
    padding:10px;
    border: 5px solid whitesmoke;
}
#expand {
    background-color: transparent;
    color:#4b0082;
    text-decoration:underline;
}
#editrm {
    background-color: transparent;
    color:#4b0082;
    text-decoration: underline;
}
ul {
    padding-left: 0;
}
</style>