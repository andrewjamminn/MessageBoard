<template>
    <div v-if="store.currentUser!==null">
        <ul>
            <!-- title text box-->
            <li id="posttitle">
                <input type="text" v-model="newPostTitle" placeholder="Title">
            </li>
            <!-- body text box, can be resized vertically if you have a lot to say -->
            <li>
                <textarea id="textbox" maxlength="1000" type="text" v-model="newPostContents" placeholder="What's on your mind? (1000 character limit)"></textarea>
            </li>
            <!--create post button-->
            <button @click="newPost">Create Post</button>
            <li id = "error">
                {{ errorMsg }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useStore } from '../stores/store'

    const store = useStore();
    const newPostTitle = ref('');
    const newPostContents = ref('');
    const errorMsg = ref('');

    const getTime = () => {
        // Get current date and time
        const now = new Date();

        // Format as 24-hour time (HH:MM:SS)
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Format full date with 24-hour time
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = now.getDate().toString().padStart(2, '0');

        // Create formatted strings
        const timeString = `${hours}:${minutes}:${seconds}`;
        const dateTimeString = `${year}-${month}-${day} ${timeString}`;

        return dateTimeString;
    }
    const newPost = async () => {
        if(store.currentUser!==null){
            const postSuccess = await store.newPost(store.currentUser, newPostTitle.value, getTime(), newPostContents.value)
            if (postSuccess===true){
                errorMsg.value = '';
                //ONLY clear values on success -- so users don't lose entire drafts
                newPostTitle.value = '';
                newPostContents.value = '';
            }
            else {
                errorMsg.value = "Couldn't create post. Either title field or contents were empty."
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
    input[type="text"] {
        padding: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    ul {
        list-style: none;
    }
    #error {
        color: red;
        margin: 10px;
    }
    #textbox {
        padding: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
        width: 400px;
        height: 100px;
        resize: none;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    
</style>
