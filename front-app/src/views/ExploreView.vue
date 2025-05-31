<template>
  <NavBar />
  <div id="explore-page">
    <h1 id="title-Of-Explore-Page">Explore</h1>

    <!-- Search Bar -->
    <div id="container-Of-Search-Bar">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search channels..."
        id="search-input"
      />
    </div>

    <!-- Genre Tags -->
    <div id="container-Of-Types">
      <button
        v-for="tag in tags"
        :key="tag"
        :class="{'active-tag': activeTag === tag}"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
      <button
        class="clear-tags"
        v-if="activeTag"
        @click="activeTag = ''"
      >Clear</button>
    </div>

    <!-- Channels List -->
    <div id="container-Of-People-That-Created-A-Channel">
      <div
        v-for="user in filteredUsers"
        :key="user.username"
        class="channel-card"
        @click="goToChannel(user.username)"
      >
        <img :src="user.logoUrl" alt="avatar" class="avatar" />
        <h2>{{ user.username }}</h2>
        <p class="tag">{{ user.genre || 'General' }}</p>
        <button @click.stop="follow(user.username)">Follow</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { createClient } from '@supabase/supabase-js';

// Router
const router = useRouter();

// Firebase init
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
const usersCol = collection(db, 'vexaUsers');

// Supabase init
const supabase = createClient(
  'https://pnaenrrtsasabsbxaeke.supabase.co',
  '<YOUR_ANON_KEY>'
);

// State
const users = ref([]);
const searchTerm = ref('');
const tags = ['Technology', 'Sports', 'Music', 'News', 'Gaming', 'Business'];
const activeTag = ref('');

// Load users
onMounted(async () => {
  const snapshot = await getDocs(usersCol);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const { publicUrl } = supabase.storage.from('logos').getPublicUrl(data.username).data;
    users.value.push({
      id: docSnap.id,
      username: data.username,
      logoUrl: publicUrl,
      genre: data.genre || ''
    });
  });
});

// Computed filtered list
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesTag = activeTag.value ? u.genre === activeTag.value : true;
    return matchesSearch && matchesTag;
  });
});

// Actions
function selectTag(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag;
}

async function goToChannel(clickedUsername) {
  const q = query(usersCol, where('username', '==', clickedUsername));
  const snap = await getDocs(q);
  if (snap.empty) {
    alert(`User ${clickedUsername} not found.`);
    return;
  }
  const docSnap = snap.docs[0];
  router.push({
    name: 'ProfileChannel',
    params: { idOfOwner: docSnap.id, owner: clickedUsername }
  });
}

// async function follow(username) {
//   // Get current user's username from cookie
//   const currentUsername = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('vexaUser='))
//     ?.split('=')[1];

//   if (!currentUsername) {
//     alert("Current user not logged in.");
//     return;
//   }

//   // Get current user's document
//   const currentUserQuery = query(usersCol, where('username', '==', currentUsername));
//   const currentUserSnap = await getDocs(currentUserQuery);

//   if (currentUserSnap.empty) {
//     alert(`Current user ${currentUsername} not found.`);
//     return;
//   }

//   const currentUserDoc = currentUserSnap.docs[0];
//   const currentUserRef = doc(db, 'vexaUsers', currentUserDoc.id);

//   // Get clicked user's document
//   const clickedUserQuery = query(usersCol, where('username', '==', username));
//   const clickedUserSnap = await getDocs(clickedUserQuery);

//   if (clickedUserSnap.empty) {
//     alert(`User ${username} not found.`);
//     return;
//   }

//   const clickedUserDoc = clickedUserSnap.docs[0];
//   const clickedUserRef = doc(db, 'vexaUsers', clickedUserDoc.id);

//   // Update both users
//   await updateDoc(currentUserRef, {
//     UsersThatHeFollows: arrayUnion(username)
//   });

//   await updateDoc(clickedUserRef, {
//     UsersThatFollowsHim: arrayUnion(currentUsername)
//   });

//   alert(`You are now following ${username}`);
// }


async function follow(username) {
  // Get current user's username from cookie
  const currentUsername = document.cookie
    .split('; ')
    .find(row => row.startsWith('vexaUser='))
    ?.split('=')[1];

  if (!currentUsername) {
    alert("Current user not logged in.");
    return;
  }

  // Get current user's document
  const currentUserQuery = query(usersCol, where('username', '==', currentUsername));
  const currentUserSnap = await getDocs(currentUserQuery);

  if (currentUserSnap.empty) {
    alert(`Current user ${currentUsername} not found.`);
    return;
  }

  const currentUserDoc = currentUserSnap.docs[0];
  const currentUserRef = doc(db, 'vexaUsers', currentUserDoc.id);
  const currentData = currentUserDoc.data();

  // Prevent duplicate follows
  const alreadyFollowing = currentData.UsersThatHeFollows?.includes(username);
  if (alreadyFollowing) {
    alert(`You're already following ${username}`);
    return;
  }

  // Get clicked user's document
  const clickedUserQuery = query(usersCol, where('username', '==', username));
  const clickedUserSnap = await getDocs(clickedUserQuery);

  if (clickedUserSnap.empty) {
    alert(`User ${username} not found.`);
    return;
  }

  const clickedUserDoc = clickedUserSnap.docs[0];
  const clickedUserRef = doc(db, 'vexaUsers', clickedUserDoc.id);

  // Update both users
  await updateDoc(currentUserRef, {
    UsersThatHeFollows: arrayUnion(username)
  });

  await updateDoc(clickedUserRef, {
    UsersThatFollowsHim: arrayUnion(currentUsername)
  });

  alert(`You are now following ${username}`);
}


</script>

<style scoped>
#container-Of-Search-Bar {
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
}
#search-input {
  width: 500px;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: #fff;
}
#container-Of-Types {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  gap: 8px;
}
#container-Of-Types button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #333;
  color: #fff;
  cursor: pointer;
}
#container-Of-Types .active-tag {
  background: #555;
}
.clear-tags {
  background: #777;
}

#container-Of-People-That-Created-A-Channel {
  margin: 0px 20px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;


}
.channel-card {
  background: #222;
  padding: 16px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}
.channel-card:hover {
  transform: translateY(-5px);
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 8px;
  object-fit: cover;
}
.channel-card h2 {
  color: #fff;
  margin: 8px 0;
}
.channel-card .tag {
  color: #aaa;
  margin-bottom: 12px;
}
.channel-card button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
