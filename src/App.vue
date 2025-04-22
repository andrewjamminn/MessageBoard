<template>
  <!-- Search bar -->
  <div id="search">
    <textarea
      v-model="searchTerm"
      placeholder="Search posts by title..."
      @keydown.enter.prevent
    ></textarea>
  </div>
  <div id="postcreate">
    <span v-if="store.currentUser!=null" id="title">Create a new post:</span>
    <NewPost />
  </div>
  <div id="parent" :class="bgColorClass">
    <div id="feed">
      <!-- iterate through filtered posts -->
      <span id="title">Feed</span>
      <ul>
        <li v-for="post in filteredPosts" :key="post.id">
          <Post :post="post" :comments="post.comments" />
        </li>
      </ul>
    </div>
    <div id="user">
      <UserTab />
    </div>
  </div>
</template>
<script setup lang="ts">
  import UserTab from "./components/UserTab.vue";
  import NewPost from "./components/NewPost.vue";
  import Post from "./components/Post.vue";
  import { useStore } from "./stores/store";
  import { computed, ref } from "vue";

  const store = useStore();
  const searchTerm = ref(""); // Search term entered by the user

  // Filtered posts based on the search term
  const filteredPosts = computed(() => {
    if (!searchTerm.value.trim()) {
      return store.posts; // Show all posts if no search term
    }
    return store.posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });

  // Compute the background color class based on the user's favorite color
  const bgColorClass = computed(() => {
    if (store.currentUser && store.currentUser.favcolor) {
      return `bg-${store.currentUser.favcolor.toLowerCase()}`;
    }
    return "bg-default";
  });
</script>

<style lang="scss">
body,
html {
  position: relative;
  align-items: center;
  justify-content: center;
  //height: 100%;
  background-color: #59b7f6;
  background: linear-gradient(to bottom, #c9c9c9 0%, #f4f4f4 100%);
}

ul {
  list-style: none;
}

// Default background
.bg-default {
  background-color: #59b7f6;
  background: linear-gradient(to bottom, #c9c9c9 0%, #f4f4f4 100%);
}

// Color backgrounds
.bg-red {
  background-color: #ff5555;
  background: linear-gradient(to bottom, #ff5555 0%, #ffaaaa 100%);
}

.bg-orange {
  background-color: #ff9955;
  background: linear-gradient(to bottom, #ff9955 0%, #ffdcaa 100%);
}

.bg-yellow {
  background-color: #ffff55;
  background: linear-gradient(to bottom, #ffff55 0%, #ffffaa 100%);
}

.bg-green {
  background-color: #55ff55;
  background: linear-gradient(to bottom, #55ff55 0%, #aaffaa 100%);
}

.bg-blue {
  background-color: #5555ff;
  background: linear-gradient(to bottom, #7e7eff 0%, #aaaaff 100%);
}

.bg-purple {
  background-color: #aa55ff;
  background: linear-gradient(to bottom, #aa55ff 0%, #ddaaff 100%);
}

.bg-pink {
  background-color: #ff55aa;
  background: linear-gradient(to bottom, #ff55aa 0%, #ffaadd 100%);
}

#parent {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
}
#postcreate {
  flex: 1;
  width: 90%;
  margin: 20px;
  padding: 15px;
  background: whitesmoke
}
#user {
  width: 25%;
  flex: 5;
  margin: 20px;
  padding: 15px;
  background: whitesmoke
}
#feed {
  flex: 7;
  width: 75%;
  margin: 20px;
  padding: 15px;
  background: whitesmoke
}
#title {
  font-size: 30px;
  font-weight:bold;
  padding: 20px;
}

#search {
  margin-bottom: 20px;
}

#search textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

#search textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

</style>