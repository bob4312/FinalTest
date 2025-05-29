<!-- <script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue'

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

import { createClient } from '@supabase/supabase-js';

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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuYWVucnJ0c2FzYWJzYnhhZWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjI5ODgsImV4cCI6MjA2NDA5ODk4OH0.bAlA2tC2SPE9F0E5AlGqT_O5Qx8hjHQw7u4MVZXN33Q'
);


// Cookie getter
function getCookie() {
  const cookies = document.cookie.split('; ');
  const result = {};
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key && value !== undefined) {
      result[key] = decodeURIComponent(value);
    }
  }
  return result;
}

const router = useRouter();

const userProfile = reactive({
  username: '',
  followersCount: 0,
  followingCount: 0,
  logoUrl: ''
});


const loading = ref(true);


// Redirect if not logged in
onMounted(async () => 
{
  const cookies = getCookie();
  const username = cookies.vexaUser;

  if (!username) {
    alert("You must be logged in to access this page.");
    router.push('/');
  }

  const q = query(usersCol, where('username', '==', username));
  const snap = await getDocs(q);
  if (snap.empty) {
    alert('User not found.');
    router.push('/');
    return;
  }

  const data = snap.docs[0].data();
  userProfile.username = data.username;
  userProfile.followersCount = (data.UsersThatFollowsHim || []).length;
  userProfile.followingCount = (data.UsersThatHeFollows || []).length;

//   //getting the current username number of followers he has, and number of users he follows
//   const data = snap.docs[0].data();
//   userProfile.username = data.username;
//   userProfile.followersCount = (data.UsersThatFollowsHim || []).length;
//   userProfile.followingCount = (data.UsersThatHeFollows || []).length;

  const { data: urlData, error: urlError } = supabase
    .storage
    .from('logos')
    .getPublicUrl(username);
  if (urlError) {
    console.error('Logo URL error', urlError);
  } else {
    userProfile.logoUrl = urlData.publicUrl;
  }
  loading.value = false;

});

</script>

<template>
    <NavBar/>
    <div id="containerHomePage" v-if="!loading">
        <div id="containerOfProfile">
              <div id="logoContainer">
                <img v-if="userProfile.logoUrl" :src="userProfile.logoUrl" alt="Profile-Logo" id="user-logo-IMG">
              </div>
              

              <h1 id="nameOfTheChannel">{{ userProfile.username }}</h1>
              <div id="container-Of-Followers-And-Following-Count">

                    <div id="followersCountContainer">
                          <h1 id="numOfFollowers">{{ userProfile.followersCount }}</h1>
                          <h2 id="subtitleFollowers">Followers</h2>
                    </div>
                    <div id="followingCountContainer">
                          <h1 id="numOfFollowing">{{ userProfile.followingCount }}</h1>
                          <h2 id="subtitleFollowing">Following</h2>
                    </div>

              </div>
              <div id="sectionButtons">
                    <div id="homeButtonSection">
                        <button id="homeButton" style="border: none;">
                            <img id="homeIcon" src="../assets/iconHome.webp">
                            <h1 id="homeTitle">Home</h1>
                        </button>
                    </div>

                    <div id="BrowseButtonSection">
                        <button id="BrowseButton" style="border: none;">
                            <img id="browseIcon" src="../assets/iconBrowse.webp">
                            <h1 id="browseTitle">Browse</h1>
                        </button>
                    </div>
                    <div id="ExploreButtonSection">
                        <router-link to="/explore"><button id="ExploreButton" style="border: none;">
                            <img id="ExploreIcon" src="../assets/iconFriends.webp">
                            <h1 id="exploreTitle">Explore</h1>
                        </button></router-link>
                    </div>
              </div>
        </div>


        <div id="containerOfPreviewAudioStreams">
            <h1 id="streamsTitle">Streams</h1>
            <div id="previewStreamsList">
            </div>
        </div>
    </div>
</template>

<style scoped>

#containerHomePage
{
    /* border: 2px solid orange; */
    width: 1355px;
    height: 703px;

    position: absolute;
    top: 60px;
    left: 0px;
}


#containerOfProfile
{
    border: 2px solid orange;
    width: 320px;
    height: 700px;

    position: absolute;
    top: 0px;
    left: 0px;
}

/* #logoContainer
{
  width: 150px;
  height: 150px;
  background-color: blue;
  position: absolute;
  border-radius: 50%;
  top: 20px;
  left: 78px;
    object-fit: cover;

}

#user-logo-IMG
{
  border-radius: 50%;
  width: 150px;
  height: 150px;
} */

#logoContainer {
  width: 220px;
  height: 200px;
  position: relative;      /* so absolute children are positioned inside it */
  top:  5px;
  left: 39px;
  border-radius: 50%;
  overflow: hidden;        /* clip anything sticking out */
}

#user-logo-IMG {
  position: absolute;      /* take the img out of normal flow */
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;       /* fill the box, cropping as needed */
  object-position: center; /* center the cropping */
  transform: translate(-50%, -50%);
}

#nameOfTheChannel
{
    font-size: 25px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
   position: absolute;
   top: 190px;
   left: 114px;
}

#container-Of-Followers-And-Following-Count
{
        border: 2px solid rgb(24, 24, 24);
    width: 286px;
    height: 100px;
    background-color: #101010;
    border-radius: 15%;

    position: absolute;
    top: 250px;
    left: 17px;
}

#numOfFollowers
{
    font-size: 30px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
   position: absolute;
   
   top: 0px;
   left: 80px;
}

#numOfFollowing
{
    font-size: 30px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
   position: absolute;
   
   top: 0px;
   left: 180px;
}
#subtitleFollowers
{
    font-size: 15px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
    opacity: 0.3;
   position: absolute;
   
   top: 50px;
   left: 53px;
}

#subtitleFollowing
{
    font-size: 15px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
    opacity: 0.3;
   position: absolute;
   
   top: 50px;
   left: 153px;
}

#followersCountContainer
{
    position: absolute;
    top: 10px;
}

#followingCountContainer
{
    position: absolute;
    top: 10px;
}

#sectionButtons
{
          border: 2px solid rgb(24, 24, 24);
    width: 286px;
    height: 330px;
    background-color: #101010;
    border-radius: 10%;

    position: absolute;
    top: 360px;
    left: 17px;
}


#homeButton
{
    width: 230px;
    height: 45px;
    font-size: 25px;
    font-family: 'Verdana', sans-serif;
    color: rgba(0, 0, 0, 0.466);
    font-weight: 1000;
    border-radius: 12%;
    background-color: #424242;
    position: absolute;
    top: 20px;
    left: 23px;
}

#homeIcon
{
    width: 170px;
    height: 170px;
    position: absolute;
    top: -58px;
    left: -50px;
}

#homeTitle
{
    font-size: 15px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
    position: absolute;
    left: 60px;
    top: 13px;
}

#BrowseButton
{
    width: 230px;
    height: 45px;
    font-size: 25px;
    font-family: 'Verdana', sans-serif;
    color: rgba(0, 0, 0, 0.466);
    font-weight: 1000;
    border-radius: 12%;
    background-color: #424242;
    position: absolute;
    top: 20px;
    left: 23px;
}

#browseIcon
{
    width: 120px;
    height: 140px;
    position: absolute;
    top: -56px;
    left: -22px;
}

#browseTitle
{
    font-size: 15px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
    position: absolute;
    left: 60px;
    top: 13px;
}

#BrowseButtonSection
{
  position: absolute;
  top: 55px;
}









#ExploreButton
{
    width: 230px;
    height: 45px;
    font-size: 25px;
    font-family: 'Verdana', sans-serif;
    color: rgba(0, 0, 0, 0.466);
    font-weight: 1000;
    border-radius: 12%;
    background-color: #424242;
    position: absolute;
    top: 75px;
    left: 23px;
}

#ExploreIcon
{
    width: 150px;
    height: 140px;
    position: absolute;
    top: -47px;
    left: -39px;
}

#exploreTitle
{
    font-size: 15px;
    color: white;
    font-family: 'Verdana', sans-serif;
    font-weight: 1000;
    position: absolute;
    left: 60px;
    top: 13px;
}

#ExploreButtonSection
{
  position: absolute;
  top: 55px;
}















#containerOfPreviewAudioStreams
{
    border: 2px solid orange;
    width: 760px;
    height: 700px;

    position: absolute;
    top: 0px;
    left: 330px;
}

#streamsTitle
{
      font-weight: 1000;
    font-size: 30px;
    color: #ffffff;
    position: absolute;
    top: 30px;
    left: 30px;
}

#previewStreamsList
{
    border: 2px solid rgb(134, 144, 255);
    width: 759px;
    height: 610px;

    position: absolute;
    top: 90px;
    left: 0px;
}

</style> 



 -->


 <script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,      // ← added
  limit,        // ← added
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

import { createClient } from '@supabase/supabase-js';

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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuYWVucnJ0c2FzYWJzYnhhZWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjI5ODgsImV4cCI6MjA2NDA5ODk4OH0.bAlA2tC2SPE9F0E5AlGqT_O5Qx8hjHQw7u4MVZXN33Q'
);

// Cookie getter
function getCookie() {
  const cookies = document.cookie.split('; ');
  const result = {};
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key && value !== undefined) result[key] = decodeURIComponent(value);
  }
  return result;
}

const router = useRouter();

const userProfile = reactive({
  username: '',
  followersCount: 0,
  followingCount: 0,
  logoUrl: ''
});

// ← new: holds the top-4 streams
const streams = ref([]);

const loading = ref(true);

onMounted(async () => {
  // Redirect if not logged in
  const cookies = getCookie();
  const username = cookies.vexaUser;
  if (!username) {
    alert("You must be logged in to access this page.");
    router.push('/');
    return;
  }

  // Load profile
  const q = query(usersCol, where('username', '==', username));
  const snap = await getDocs(q);
  if (snap.empty) {
    alert('User not found.');
    router.push('/');
    return;
  }
  const data = snap.docs[0].data();
  userProfile.username       = data.username;
  userProfile.followersCount = (data.UsersThatFollowsHim || []).length;
  userProfile.followingCount = (data.UsersThatHeFollows || []).length;

  // Load logo
  const { data: urlData, error: urlError } = supabase
    .storage
    .from('logos')
    .getPublicUrl(username);
  if (!urlError) userProfile.logoUrl = urlData.publicUrl;

  // ← NEW: fetch top-4 streams by viewersCount
  const roomsCol  = collection(db, 'rooms');  // adjust to your actual collection name
  const roomsQ    = query(
    roomsCol,
    orderBy('viewersCount', 'desc'),
    limit(4)
  );
  const roomsSnap = await getDocs(roomsQ);
  streams.value = roomsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  loading.value = false;
});
</script>

<template>
  <NavBar/>
  <div id="containerHomePage" v-if="!loading">
    <div id="containerOfProfile">
      <div id="logoContainer">
        <img
          v-if="userProfile.logoUrl"
          :src="userProfile.logoUrl"
          alt="Profile-Logo"
          id="user-logo-IMG"
        />
      </div>

      <h1 id="nameOfTheChannel">{{ userProfile.username }}</h1>
      <div id="container-Of-Followers-And-Following-Count">
        <div id="followersCountContainer">
          <h1 id="numOfFollowers">{{ userProfile.followersCount }}</h1>
          <h2 id="subtitleFollowers">Followers</h2>
        </div>
        <div id="followingCountContainer">
          <h1 id="numOfFollowing">{{ userProfile.followingCount }}</h1>
          <h2 id="subtitleFollowing">Following</h2>
        </div>
      </div>

      <div id="sectionButtons">
        <div id="homeButtonSection">
          <button id="homeButton" style="border: none;">
            <img id="homeIcon" src="../assets/iconHome.webp">
            <h1 id="homeTitle">Home</h1>
          </button>
        </div>

        <div id="BrowseButtonSection">
          <button id="BrowseButton" style="border: none;">
            <img id="browseIcon" src="../assets/iconBrowse.webp">
            <h1 id="browseTitle">Browse</h1>
          </button>
        </div>

        <div id="ExploreButtonSection">
          <router-link to="/explore">
            <button id="ExploreButton" style="border: none;">
              <img id="ExploreIcon" src="../assets/iconFriends.webp">
              <h1 id="exploreTitle">Explore</h1>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <div id="containerOfPreviewAudioStreams">
      <h1 id="streamsTitle">Streams</h1>
      <div id="previewStreamsList">
        <template v-if="streams.length">
          <div
            v-for="stream in streams"
            :key="stream.id"
            class="stream-item"
            @click="router.push(`/watch/${stream.id}`)"
          >
            <h3>{{ stream.name || stream.roomName }}</h3>
            <p>{{ stream.viewersCount }} viewer{{ stream.viewersCount === 1 ? '' : 's' }}</p>
          </div>
        </template>
        <div v-else class="no-streams">
          <p>No streams available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#containerHomePage {
  width: 1355px;
  height: 703px;
  position: absolute;
  top: 60px;
  left: 0;
}

#containerOfProfile {
  border: 2px solid orange;
  width: 320px;
  height: 700px;
  position: absolute;
  top: 0;
  left: 0;
}

#logoContainer {
  width: 220px;
  height: 200px;
  position: relative;
  top: 5px;
  left: 39px;
  border-radius: 50%;
  overflow: hidden;
}

#user-logo-IMG {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: translate(-50%, -50%);
}

#nameOfTheChannel {
  font-size: 25px;
  color: white;
  font-family: 'Verdana', sans-serif;
  font-weight: 1000;
  position: absolute;
  top: 190px;
  left: 114px;
}

#container-Of-Followers-And-Following-Count {
  border: 2px solid rgb(24, 24, 24);
  width: 286px;
  height: 100px;
  background-color: #101010;
  border-radius: 15%;
  position: absolute;
  top: 250px;
  left: 17px;
}

#numOfFollowers,
#numOfFollowing {
  font-size: 30px;
  color: white;
  font-family: 'Verdana', sans-serif;
  font-weight: 1000;
  position: absolute;
  top: 0;
}

#numOfFollowers { left: 80px; }
#numOfFollowing { left: 180px; }

#subtitleFollowers,
#subtitleFollowing {
  font-size: 15px;
  color: white;
  font-family: 'Verdana', sans-serif;
  font-weight: 1000;
  opacity: 0.3;
  position: absolute;
  top: 50px;
}

#subtitleFollowers { left: 53px; }
#subtitleFollowing { left: 153px; }

#sectionButtons {
  border: 2px solid rgb(24, 24, 24);
  width: 286px;
  height: 330px;
  background-color: #101010;
  border-radius: 10%;
  position: absolute;
  top: 360px;
  left: 17px;
}

/* … your existing button styles below … */

#containerOfPreviewAudioStreams {
  border: 2px solid orange;
  width: 760px;
  height: 700px;
  position: absolute;
  top: 0;
  left: 330px;
}

#streamsTitle {
  font-weight: 1000;
  font-size: 30px;
  color: #ffffff;
  position: absolute;
  top: 30px;
  left: 30px;
}

#previewStreamsList {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
  height: 610px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
}

.stream-item {
  flex: 1 1 calc(50% - 12px);
  background: #1a1a1a;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.stream-item h3 {
  margin: 0 0 4px;
  color: #fff;
}
.stream-item p {
  margin: 0;
  color: #ccc;
}
.no-streams {
  padding: 20px;
  color: #777;
}
</style>
