<template>
<!--if user isn't signed in-->
<div v-if="store.currentUser===null">
    <ul class = "sign-in">
        <li>
            <input type="text" v-model="enteredUser" placeholder="Username">
        </li>
        <li>
            <input type="text" v-model="enteredPwd" placeholder="Password">
        </li>
        <li>
            <button @click="signIn">Sign In</button>
            <button @click="signUp">Sign Up</button>
        </li>
        <li class = "error">
            {{ errorMsg }}
        </li>
    </ul>
</div>
<!--otherwise-->
<div v-else>
    {{ store.currentUser.username }} is signed in!
    <button @click="logOut">Log out!</button>
    <body class="favcolor" v-if="store.currentUser.favcolor===undefined">
        <!--site bullies you into choosing your favorite color-->
        You haven't chosen a favorite color yet! <br>
        <label for="dropdown">Select an option:</label><br>
            <select id="dropdown" v-model="selected" @change="updateFavColor">
                <option disabled value="">Please select one</option>
                <option v-for="color in colors" :key="color" :value="color">
                {{ color }}
                </option>
            </select>
    </body>
</div>

<div v-if="store.currentUser">
    Signed in. User's posts appear in this column.
</div>

</template>

<script setup lang="ts">
import { useStore } from "../stores/store"
const store = useStore();
import { onMounted, ref } from 'vue';
const enteredUser = ref('');
const enteredPwd = ref('');
const errorMsg = ref('');

// When user signs in, set the selected color to their saved favorite
onMounted(() => {
  if (store.currentUser && store.currentUser.favcolor) {
    selected.value = store.currentUser.favcolor;
  }
});

// Sign in function
const signIn = async () => {
    const loginSuccess = await store.signIn(enteredUser.value, enteredPwd.value);
    enteredUser.value = '';
    enteredPwd.value = '';
    if (loginSuccess===true){
        errorMsg.value = '';
        // Set selected color to user's favorite if it exists
        if (store.currentUser && store.currentUser.favcolor) {
            selected.value = store.currentUser.favcolor;
        }
    }
    else {
        errorMsg.value = "Username or password was incorrect";
    }
}

const signUp = async () => {
    const signupSuccess = await store.createUser(enteredUser.value, enteredPwd.value);
    enteredUser.value = '';
    enteredPwd.value = '';
    if(signupSuccess===true){
        errorMsg.value = '';
    }
    else {
        errorMsg.value = "Couldn't create new user -- password was empty or username already exists";
    }
}

// Log out function
const logOut = () => {
  store.logOut();
};

// Function to update favorite color
const updateFavColor = async () => {
  if (store.currentUser && selected.value) {
    await store.updateUserFavColor(selected.value);
  }
}

const selected = ref('');
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'];

</script>

<style lang="scss">

html {
    margin: 10px;
    padding: 10px;
    background-color: whitesmoke
}

ul {
    list-style: none;
}
.sign-in {
    margin: 10px;
    padding: 10px;

    input[type="text"] {
        padding: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
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
}

.error {
    color: red;
    margin: 10px;
}

.favcolor {
    background: whitesmoke;
    margin: 20px;
}

</style>