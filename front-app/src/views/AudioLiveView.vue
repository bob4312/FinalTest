<template>
  <div id="live-root">
    <!-- Loading state -->
    <div v-if="!loaded" class="loading">
      <p>Loading stream data...</p>
    </div>

    <!-- Main live section -->
    <div v-else id="live-section">
      <div class="stream-layout">

        <!-- Stream Info -->
        <section class="stream-info">
          <h2>{{ roomData['Room-Name'] }}</h2>
          <p>{{ roomData['Room-Desc'] }}</p>
          <div class="stream-meta">
            <span>👤 Host: {{ roomData['Room-Owner'] }}</span>
            <span>📁 Categories: {{ roomData['Room-Category'].join(', ') }}</span>
            <span>👥 Viewers: {{ participants.length }}</span>
          </div>

          <!-- Audio Monitor / Player for both Host and Viewer -->
          <div class="audio-section">
            <h4>
              <template v-if="isHost">🎧 Live Monitor</template>
              <template v-else>🔊 Listening</template>
            </h4>
            <audio
              ref="localAudio"
              controls
              autoplay
              playsinline
              class="audio-player"
            ></audio>
          </div>

          <!-- Viewers List -->
          <div class="participants-section">
            <h4>🟢 Currently Watching</h4>
            <ul>
              <li v-for="user in participants" :key="user">👤 {{ user }}</li>
            </ul>
          </div>
        </section>

        <!-- Chat Section -->
        <section class="chat-section">
          <div class="chat-header">💬 Live Chat</div>
          <div class="chat-box">
            <div v-for="(msg, i) in messages" :key="i" class="chat-message">
              <strong>{{ msg.sender }}:</strong> {{ msg.text }}
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="chat-input">
            <input v-model="chatInput" placeholder="Type your message..." />
            <button type="submit" :disabled="!chatInput">Send</button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Peer from 'peerjs'
import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
import { doc, onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
import { useRoute } from 'vue-router'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
}

// Initialize or reuse existing app
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()
const db = getFirestore(app)

// Router and route params
const route = useRoute()
const owner = route.params.owner

// State
const currentUsername = decodeURIComponent(
  (document.cookie.split('; ').find(c => c.startsWith('vexaUser=')) || '').split('=')[1] || ''
)
const roomData = ref({})
const participants = ref([])
const messages = ref([])
const chatInput = ref('')
const loaded = ref(false)

// Host check and audio state
const isHost = computed(() => roomData.value['Room-Owner'] === currentUsername)
const localStream = ref(null)
const localAudio = ref(null)
let peerConnection = null

// Host audio setup
async function initHostAudio() {
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    await nextTick()
    if (localAudio.value) {
      localAudio.value.srcObject = localStream.value
      await localAudio.value.play().catch(() => {})
    }
  } catch (e) {
    console.error('Host audio error:', e)
  }
}

function initHostPeer() {
  peerConnection = new Peer(roomData.value['Room-Owner-PeerID'])
  peerConnection.on('call', call => call.answer(localStream.value))
}

// Viewer setup
async function initViewerPeer() {
  peerConnection = new Peer()
  peerConnection.on('open', () => {
    const call = peerConnection.call(
      roomData.value['Room-Owner-PeerID'],
      null
    )
    call.on('stream', st => {
      if (localAudio.value) localAudio.value.srcObject = st
    })
  })

  // update participants once
  const roomRef = doc(db, 'vexaRooms', owner)
  if (!participants.value.includes(currentUsername)) {
    try {
      await updateDoc(roomRef, {
        'Participants-Usernames': [...participants.value, currentUsername]
      })
    } catch (err) {
      console.warn('Could not update participants:', err)
    }
  }
}

// Chat
function sendMessage() {
  if (!chatInput.value.trim()) return
  messages.value.push({ sender: currentUsername, text: chatInput.value.trim() })
  chatInput.value = ''
}

// On mount: listen to Firestore and init streams
onMounted(() => {
  const roomRef = doc(db, 'vexaRooms', owner)
  onSnapshot(roomRef, snap => {
    if (!snap.exists()) {
      console.error('No room for owner:', owner)
      return
    }
    roomData.value = { id: snap.id, ...snap.data() }
    participants.value = snap.data()['Participants-Usernames'] || []
    if (!loaded.value) {
      loaded.value = true
      if (isHost.value) initHostAudio().then(initHostPeer)
      else initViewerPeer()
    }
  })
})
</script>

<style scoped>
/* your existing styles */
#live-root { padding: 20px; }
.loading { font-family: sans-serif; text-align: center; }
.stream-layout { display: flex; justify-content: space-between; gap: 20px; }
.stream-info { width: 60%; background: #f8f8f8; padding: 15px; border-radius: 12px; box-shadow: 0 0 5px #ccc; }
.chat-section { width: 35%; background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 0 5px #ccc; display: flex; flex-direction: column; }
.chat-box { flex-grow: 1; max-height: 400px; overflow-y: auto; margin-bottom: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 6px; }
.chat-message { margin-bottom: 8px; }
.chat-input { display: flex; gap: 10px; }
.chat-input input { flex-grow: 1; padding: 6px; border: 1px solid #aaa; border-radius: 6px; }
.chat-input button { padding: 6px 12px; background-color: #6200ea; color: white; border: none; border-radius: 6px; cursor: pointer; }
</style>
