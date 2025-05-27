<template>
  <div id="watch-root">
    <!-- Not found state -->
    <div v-if="!exists && !loading" class="not-found">
      <h2>Stream Not Found</h2>
      <p>The host "{{ owner }}" is not streaming right now or the room does not exist.</p>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="loading">
      <p>Checking stream availability…</p>
    </div>

    <!-- Listening interface -->
    <div v-else class="listen-section">
      <h2>Listening to {{ owner }}'s Stream</h2>
      <audio
        ref="remoteAudio"
        controls
        autoplay
        playsinline
        class="audio-player"
      ></audio>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Peer from 'peerjs'
import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'
import { getFirestore, collection, doc, getDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
import { useRoute } from 'vue-router'

// Firebase config & init
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
}
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

// Collections
const usersCol = collection(db, 'vexaUsers')

// Helpers
function getCookie(name) {
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : null
}

async function getUserByUsername(username) {
  const q = query(usersCol, where('username', '==', username))
  const snap = await getDocs(q)
  if (!snap.empty) {
    const docSnap = snap.docs[0]
    return { id: docSnap.id, ...docSnap.data() }
  }
  return null
}

// Route param
const route = useRoute()
const owner = route.params.owner

// State
const loading = ref(true)
const exists = ref(false)
const roomData = ref(null)
const remoteAudio = ref(null)
let peer = null

onMounted(async () => {
  // get viewer's username and PeerID
  const currentUsername = getCookie('vexaUser')
  const userData = await getUserByUsername(currentUsername)
  const viewerPeerId = userData?.PeerID
  if (!viewerPeerId) {
    console.error('Viewer PeerID not found for', currentUsername)
    loading.value = false
    exists.value = false
    return
  }

  // get microphone (needed for WebRTC handshake)
  let localStream = null
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    console.warn('Could not get local audio:', e)
  }

  // check if room exists
  const roomRef = doc(db, 'vexaRooms', owner)
  const snap = await getDoc(roomRef)
  if (!snap.exists()) {
    exists.value = false
    loading.value = false
    return
  }
  roomData.value = snap.data()
  exists.value = true
  loading.value = false

  // start peer and call host
  peer = new Peer(viewerPeerId)
  peer.on('open', () => {
    const hostPeerId = roomData.value['Room-Owner-PeerID']
    const call = peer.call(hostPeerId, localStream)
    if (!call) {
      console.error('Call returned undefined — check PeerIDs and stream')
      return
    }
    call.on('stream', async stream => {
      await nextTick()
      if (remoteAudio.value) remoteAudio.value.srcObject = stream
    })
    call.on('error', err => console.error('Call error:', err))
  })
  peer.on('error', err => console.error('Peer error:', err))
})
</script>

<style scoped>
#watch-root { padding: 2rem; font-family: sans-serif; text-align: center; }
.loading, .not-found { color: #555; }
.listen-section { margin-top: 2rem; }
.audio-player { width: 100%; max-width: 600px; border-radius: 8px; }
.not-found h2 { color: #c00; }
</style>
