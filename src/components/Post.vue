<template>
<div id="box">
    <ul>
        <li id = "post">
            <!--render the title-->
            <h1> {{ post.title }}</h1>
            <!--render the author-->
            <h2> {{ post.author}} | {{ post.timestamp }}</h2>
            <!--render the content-->
            <body> {{ post.contents }}</body>
        </li>
        <!-- add new comment box -->
        <li id="comments">
            <li id="individualcomment" v-for="comment in comments">
                <!--render comment author-->
                <h1> {{ comment.author }}</h1>
                <!--render comment contents-->
                <body>{{ comment.content }}</body>
            </li>
        </li>
    </ul>
    
</div>
</template>

<script setup lang="ts">
import { Post, Comment } from "../types/forum.ts"
    type Props = {
        post: Post;
        comments: Comment[] | null;
    }; 
    defineProps<Props>();
</script>

<style lang="scss">
html {
    margin: 10px;
    padding: 10px;
    background-color: whitesmoke
}
</style>