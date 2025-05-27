<template>
  <div id="RegisterContainer">
    <h2>Register</h2>
    <form id="user-form" @submit.prevent="submitForm">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
          placeholder="Enter unique username"
        />
      </div>

      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          placeholder="Enter email"
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          placeholder="Enter password"
        />
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
</template>


<script type="module" setup>

import { reactive } from 'vue';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "vexaUsers");

// Reactive form data
const form = reactive({
  username: '',
  email: '',
  password: ''
});

// Generate unique PeerID
function generatePeerID() {
  return 'vexapeercodeforstream_' + Math.random().toString(36).substring(2, 12);
}

// Check uniqueness for a field
async function isValueTaken(field, value) {
  const q = query(usersCol, where(field, "==", value));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// Submit form logic
async function submitForm() {
  const { username, email, password } = form;

  if (!username.trim() || !email.trim() || !password.trim()) {
    alert("Please fill out all fields.");
    return;
  }

  // Check if username or email already exist
  if (await isValueTaken("username", username.trim())) {
    alert("Username is already taken.");
    return;
  }
  if (await isValueTaken("email", email.trim())) {
    alert("Email is already registered.");
    return;
  }

  // Generate a unique PeerID
  let peerID;
  do {
    peerID = generatePeerID();
  } while (await isValueTaken("PeerID", peerID));

  try {
    const docRef = await addDoc(usersCol, {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(), // ⚠️ Consider hashing this in real apps!
      PeerID: peerID,
      Role: "Vexian",
      isLiveNow: false,
      UsersThatFollowsHim: []
    });

    alert(`User Added With ID: ${docRef.id}`);

    // Reset form
    form.username = '';
    form.email = '';
    form.password = '';
  } catch (err) {
    console.error("Error Adding User:", err);
    alert("Failed to add user. See console for details.");
  }
}

</script>



<style scoped>
#RegisterContainer {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ccc;

  position: absolute;
  top: 65px;
  left: 180px;
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



