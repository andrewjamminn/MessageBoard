<template>
  <div id="postcreate">
    <span v-if="store.currentUser!=null" id=title>Create a new post:</span>
    <NewPost />
  </div>
  <div id="parent" :class="bgColorClass">
    <div id="feed">
      <!-- iterate through post collection backwards, show most recent first-->
      <span id=title>Feed</span>
      <ul> 
        <li v-for="i in store.posts.length" :key="i">
          <Post :post="store.posts[store.posts.length-i]" :comments="store.posts[store.posts.length-i].comments" />
        </li>
      </ul>
    </div> 
    <div id="user">
      <UserTab />
    </div>
  </div>
</template>
<script setup lang="ts">
  import UserTab from "./components/UserTab.vue"
  import NewPost from "./components/NewPost.vue"
  import Post from "./components/Post.vue"
  import { useStore } from "./stores/store"
  import { computed } from 'vue';

  const store = useStore();

// Compute the background color class based on the user's favorite color
  const bgColorClass = computed(() => {
    if (store.currentUser && store.currentUser.favcolor) {
      return `bg-${store.currentUser.favcolor.toLowerCase()}`;
    }
    return 'bg-default';
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

</style>