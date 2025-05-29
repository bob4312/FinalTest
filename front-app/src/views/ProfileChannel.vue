<!-- <template>
    <div id="channelProfileContainer">
        <div id="containerTopSection">
            <div id="logoContainer"></div>
            <h1 id="name-Of-The-Username-Channel">Name</h1>
            <h1 id="followers-of-this-channel-count">0 Followers</h1>
            <button id="follow-this-channel-button">FOLLOW</button>
        </div>

        <div id="containerBottomSection">
            <button style="border: none; background: none;">
                <h1 id="about-me-section">ABOUT ME</h1>
                <div id="line-Below-About-Me-Section-Title"></div>
            </button>
            <button style="border: none; background: none; position: absolute; left: 130px;">
                <h1 id="social-section">SOCIAL</h1>
                <div id="line-Below-Social-Section-Title"></div>
            </button>
            <div id="info-section-inside-bottom-section">
            </div>
        </div>
    </div>

    <NavBar/>

</template>


<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<style scoped>

#channelProfileContainer
{
    /* border: 2px solid orange; */
    width: 1352px;
    height: 699px;

    position: absolute;
    top: 63px;
    left: 0px;
}

#containerTopSection
{
    /* border: 2px solid rgb(0, 255, 213); */
    width: 1000px;
    height: 300px;

    position: absolute;
    top: 40px;
    left: 150px;
}


#logoContainer
{
  width: 190px;
  height: 190px;
  background-color: blue;
  position: absolute;
  border-radius: 50%;
  top: 48px;
  left: 85px;
}  

#name-Of-The-Username-Channel
{
    font-weight: 1000;
    font-size: 50px;
    color: #ffffff;
    position: absolute;
    left: 310px;
    top: 80px;
}

#followers-of-this-channel-count
{
    font-weight: 1000;
    font-size: 25px;
    color: #ffffff;
    position: absolute;
    left: 313px;
    top: 145px;
}

#follow-this-channel-button
{
    border: none;
    font-weight: 1000;
    width: 120px;
    height: 37px;
    font-size: 15px;
    color: #ffffff;
    font-family: 'Verdana', sans-serif;
    border-radius: 15%;
    background-color: #01535e;
    position: absolute;
    top: 195px;
    left: 310px;
}



#containerBottomSection
{
    /* border: 2px solid rgb(255, 0, 144); */
    width: 1000px;
    height: 300px;
    background-color: #101010;

    position: absolute;
    top: 350px;
    left: 150px;
}


#about-me-section
{
    font-weight: 1000;
    font-size: 20px;
    color: #ffffff;
    position: absolute;
    left: 40px;
    top: 20px;
}

#line-Below-About-Me-Section-Title
{
    width: 114px;
    height: 2px;
    background-color: #4b4b4b;
    position: absolute;
    top: 45px;
    left: 37px;
}

#social-section
{
    font-weight: 1000;
    font-size: 20px;
    color: #ffffff;
    position: absolute;
    left: 56px;
    top: 20px;
}

#line-Below-Social-Section-Title
{
    width: 114px;
    height: 2px;
    background-color: #4b4b4b;
    position: absolute;
    top: 45px;
    left: 37px;
}

#info-section-inside-bottom-section
{
    /* border: 2px solid orange; */

    width: 900px;
    height: 230px;

    position: absolute;
    top: 60px;
    left: 33px;
}
</style> -->

<template>
  <NavBar />
  <div id="channelProfileContainer" v-if="!loading">
    <div id="containerTopSection">
      <div id="logoContainer">
        <img
          v-if="user.username"
          :src="user.logoUrl"
          alt="Channel Logo"
          class="logo-img"
        />
      </div>
      <h1 id="name-Of-The-Username-Channel">{{ user.username }}</h1>
      <h1 id="followers-of-this-channel-count">{{ user.followersCount }} Followers</h1>
      <button id="follow-this-channel-button" @click="toggleFollow">
        {{ isFollowing ? 'UNFOLLOW' : 'FOLLOW' }}
      </button>
    </div>

    <div id="containerBottomSection">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'about' }"
        @click="activeTab = 'about'"
      >
        ABOUT ME
        <div class="underline" v-if="activeTab === 'about'"></div>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'social' }"
        @click="activeTab = 'social'"
        style="left: 130px;"
      >
        SOCIAL
        <div class="underline" v-if="activeTab === 'social'"></div>
      </button>

      <div id="info-section-inside-bottom-section">
        <p v-if="activeTab === 'about'">{{ user.about || 'No bio available.' }}</p>
        <div v-else>
          <p v-for="(link, name) in user.socialLinks" :key="name">
            <strong>{{ name }}:</strong>
            <a :href="link" target="_blank">{{ link }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { createClient } from '@supabase/supabase-js';

// Router & Route
const route = useRoute();
const router = useRouter();

// Firebase init
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
};const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, 'vexaUsers');

// Supabase init
const supabase = createClient(
  'https://pnaenrrtsasabsbxaeke.supabase.co',
  '<YOUR_ANON_KEY>'
);

// Reactive state
const user = reactive({
  id: '',
  username: '',
  followersCount: 0,
  logoUrl: '',
  about: '',
  socialLinks: {}
});
const loading = ref(true);
const isFollowing = ref(false);
const activeTab = ref('about');

onMounted(async () => {
  // Extract username param from route
  const usernameParam = route.params.owner;
  if (!usernameParam) {
    router.push('/');
    return;
  }

  // Fetch user doc by username
  const q = query(usersCol, where('username', '==', usernameParam));
  const snap = await getDocs(q);
  if (snap.empty) {
    alert('User not found.');
    router.push('/');
    return;
  }
  const docSnap = snap.docs[0];
  const data = docSnap.data();

  // Populate user data
  user.id = docSnap.id;
  user.username = data.username;
  user.followersCount = (data.UsersThatFollowsHim || []).length;
  user.about = data.about || '';
  user.socialLinks = data.socialLinks || {};

  // Get logo URL from Supabase
  const { data: urlData, error: urlError } = supabase
    .storage
    .from('logos')
    .getPublicUrl(user.username);
  if (!urlError) {
    user.logoUrl = urlData.publicUrl;
  }

  loading.value = false;
});

function toggleFollow() {
  // Implement follow/unfollow logic here
  isFollowing.value = !isFollowing.value;
  // Optionally update Firestore array fields
}
</script>

<style scoped>
#channelProfileContainer {
  position: absolute;
  top: 63px;
  left: 0;
  width: 100%;
}
#containerTopSection {
  position: absolute;
  top: 40px;
  left: 150px;
  width: 1000px;
  height: 300px;
}
.logo-img {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  object-fit: cover;
}
#name-Of-The-Username-Channel {
  position: absolute;
  left: 310px;
  top: 80px;
  font-size: 50px;
  color: #fff;
  font-weight: 1000;
}
#followers-of-this-channel-count {
  position: absolute;
  left: 313px;
  top: 145px;
  font-size: 25px;
  color: #fff;
  font-weight: 1000;
}
#follow-this-channel-button {
  position: absolute;
  top: 195px;
  left: 310px;
  border: none;
  width: 120px;
  height: 37px;
  font-size: 15px;
  color: #fff;
  background-color: #01535e;
  border-radius: 15%;
}
#containerBottomSection {
  position: absolute;
  top: 350px;
  left: 150px;
  width: 1000px;
  background-color: #101010;
  height: 300px;
}
.tab-btn {
  border: none;
  background: none;
  font-size: 20px;
  color: #fff;
  position: absolute;
}
.tab-btn .underline {
  width: 114px;
  height: 2px;
  background-color: #4b4b4b;
  margin-top: 4px;
}
#info-section-inside-bottom-section {
  position: absolute;
  top: 60px;
  left: 33px;
  width: 900px;
  height: 230px;
  color: #fff;
}
</style>
