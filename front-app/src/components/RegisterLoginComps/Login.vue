<template>
  <div id="LoginContainer">
    <h2>Login</h2>
    <form @submit.prevent="submitLogin">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="loginForm.username"
          required
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="loginForm.password"
          required
          placeholder="Enter your password"
        />
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>


<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "vexaUsers");

const router = useRouter();

const loginForm = reactive({
  username: '',
  password: '',
});

// Set cookie for 7 days
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

async function submitLogin() {
  const { username, password } = loginForm;

  if (!username.trim() || !password.trim()) {
    alert("Please enter both username and password.");
    return;
  }

  const q = query(
    usersCol,
    where("username", "==", username.trim()),
    where("password", "==", password.trim())
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("Login successful!");
    setCookie("vexaUser", username.trim());
    router.push('/home');
  } else {
    alert("Invalid username or password.");
  }
}
</script>


<style scoped>
#LoginContainer {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
    background-color: #ccc;

    position: absolute;
    left: 500px;
    top: 100px;
}
label {
  display: block;
  margin-top: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
button {
  margin-top: 16px;
  padding: 10px 20px;
}
</style>
