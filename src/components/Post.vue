<template>
<div id="box">
    <ul>
        <li id = "post">
            <!--render the title-->
            <h1> {{ post.title }}</h1>
            <!--render the author-->
            <h2> {{ post.author.username}} | {{ post.timestamp }}</h2>
            <!--render the content-->
            <h3> {{ post.contents }}</h3>
        </li>
        <li id="comments">
            <!-- new comment only displays if you're logged in-->
            <div v-if="store.currentUser!==null">
                <!--new comment box-->
                <input id="newcomment" maxlength="150" v-model="newComment" placeholder="Say something! (150 character limit)"/>
                <!--post comment button-->
                <button @click="postComment">Post Comment</button>
                <!--comment error-->
                <li id = "error">
                    {{ errorMsg }}
                </li>
            </div>
            <li id="individualcomment" v-for="comment in comments">
                <!--render comment author-->
                <h2> {{ comment.author.username }} | {{ store.getTime() }}</h2>
                <!--render comment contents-->
                <h3>{{ comment.content }}</h3>
            </li>
        </li>
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
    
    const newComment = ref('');
    const errorMsg = ref('');

    const postComment = async () => {
        if(store.currentUser!==null){
            const commentSuccess = await store.postComment(props.post, newComment.value, store.currentUser)
            //if comment was successful
            if(commentSuccess===true){
                errorMsg.value='';
                //clear input field
                newComment.value='';
            }
            //if comment was unsuccessful
            else {
                errorMsg.value="Couldn't post message -- field was empty.";
                //don't clear input field
            }
        }
        
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
    padding:5px;
    border: 5px solid whitesmoke;
}
</style>