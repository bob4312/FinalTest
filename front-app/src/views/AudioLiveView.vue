<!-- <template>
  <div id="live-root">
    <div v-if="!loaded" class="loading">
      <p>Loading stream data...</p>
    </div>

    <div v-else id="live-section">
      <div class="stream-layout">

        <section class="stream-info">
          <h2>{{ roomData['Room-Name'] }}</h2>
          <p>{{ roomData['Room-Desc'] }}</p>
          <div class="stream-meta">
            <span>👤 Host: {{ roomData['Room-Owner'] }}</span>
            <span>📁 Categories: {{ roomData['Room-Category'].join(', ') }}</span>
            <span>👥 Viewers: {{ participants.length }}</span>
          </div>

          <div v-if="isHost" class="stop-section">
            <button @click="stopStream" class="stop-btn">🛑 Stop Stream</button>
          </div>

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

          <div class="participants-section">
            <h4>🟢 Currently Watching</h4>
            <ul>
              <li v-for="user in participants" :key="user">👤 {{ user }}</li>
            </ul>
          </div>
        </section>

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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Peer from 'peerjs'
import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'

import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
import { useRoute, useRouter } from 'vue-router'

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

// Router and route params
const route = useRoute()
const router = useRouter()
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

// Stop Stream: cleanup and delete Firestore doc
async function stopStream() 
{
  // close PeerJS
  if (peerConnection) peerConnection.destroy()
  // stop all tracks
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop())
  }
  // delete room document
  const roomRef = doc(db, 'vexaRooms', owner)
  try {
    await deleteDoc(roomRef)
    console.log('Room deleted')
  } catch (err) {
    console.error('Error deleting room:', err)
  }


  
// Step 1: Define the collection
const usersCol = collection(db, 'vexaUsers')

// Step 2: Create query to match username
const q = query(usersCol, where('username', '==', owner)) // Replace 'Mine' with your actual username

// Step 3: Run query
const snap = await getDocs(q)


if (!snap.empty) {
  const userDoc = snap.docs[0]
  const userId = userDoc.id // ← This is what you need 🎯
  const userDocRef = doc(db, 'vexaUsers', userId)

  await updateDoc(userDocRef, {
          isLiveNow: false
  })
} else {
  console.log('No user found with that username')
}

  // navigate away
  router.push('/home')
}

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

// Host PeerJS setup
function initHostPeer() {
  peerConnection = new Peer(roomData.value['Room-Owner-PeerID'])
  peerConnection.on('call', call => call.answer(localStream.value))
}

// Viewer setup
async function initViewerPeer() {
  // fetch viewer PeerID
  const usersCol = collection(db, 'vexaUsers')
  const q = query(usersCol, where('username', '==', currentUsername))
  const userSnap = await getDocs(q)
  const viewerPeerId = userSnap.empty ? null : userSnap.docs[0].data().PeerID
  if (!viewerPeerId) {
    console.error('Viewer PeerID not found for', currentUsername)
    return
  }

  // connect peer
  peerConnection = new Peer(viewerPeerId)
  peerConnection.on('open', () => {
    const call = peerConnection.call(
      roomData.value['Room-Owner-PeerID'],
      null
    )
    call.on('stream', st => {
      if (localAudio.value) localAudio.value.srcObject = st
    })
  })
  peerConnection.on('error', err => console.error('Peer error:', err))

  // update participants
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


// 🟡 Stop stream if host leaves tab or closes it
window.addEventListener('beforeunload', () => {
  if (isHost.value) {
    stopStream()
  }
})

// Clean up on unmount
onBeforeUnmount(() => {
  if (isHost.value) stopStream()
  else if (peerConnection) peerConnection.destroy()
})

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
#live-root { padding: 20px; }
.loading { font-family: sans-serif; text-align: center; }
.stream-layout { display: flex; justify-content: space-between; gap: 20px; }
.stream-info { width: 60%; background: #f8f8f8; padding: 15px; border-radius: 12px; box-shadow: 0 0 5px #ccc; }
.stop-btn { margin: 10px 0; padding: 8px 12px; background: #c00; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
.chat-section { width: 35%; background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 0 5px #ccc; display: flex; flex-direction: column; }
.chat-box { flex-grow: 1; max-height: 400px; overflow-y: auto; margin-bottom: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 6px; }
.chat-message { margin-bottom: 8px; }
.chat-input { display: flex; gap: 10px; }
.chat-input input { flex-grow: 1; padding: 6px; border: 1px solid #aaa; border-radius: 6px; }
.chat-input button { padding: 6px 12px; background-color: #6200ea; color: white; border: none; border-radius: 6px; cursor: pointer; }
</style>


 -->















<template>
  <div id="live-root">
    <!-- Loading state -->
    <div v-if="!loaded" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading stream data...</p>
    </div>

    <!-- Main live section -->
    <div v-else id="live-section">
      <div class="stream-layout">

        <!-- Stream Info -->
        <section class="stream-info">
          <div class="stream-header">
            <div class="live-indicator">
              <span class="live-dot"></span>
              LIVE
            </div>
            <h1 class="stream-title">{{ roomData['Room-Name'] }}</h1>
            <p class="stream-description">{{ roomData['Room-Desc'] }}</p>
          </div>

          <div class="stream-meta">
            <div class="meta-item">
              <div class="meta-icon">👤</div>
              <div class="meta-content">
                <span class="meta-label">Host</span>
                <span class="meta-value">{{ roomData['Room-Owner'] }}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon">📁</div>
              <div class="meta-content">
                <span class="meta-label">Categories</span>
                <span class="meta-value">{{ roomData['Room-Category'].join(', ') }}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon">👥</div>
              <div class="meta-content">
                <span class="meta-label">Viewers</span>
                <span class="meta-value">{{ participants.length }}</span>
              </div>
            </div>
          </div>

          <!-- Stop Stream Button for Host -->
          <div v-if="isHost" class="stop-section">
            <button @click="stopStream" class="stop-btn">
              <span class="btn-icon">🛑</span>
              Stop Stream
            </button>
          </div>

          <!-- Audio Monitor / Player for both Host and Viewer -->
          <div class="audio-section">
            <div class="audio-header">
              <h3>
                <span v-if="isHost">🎧 Live Monitor</span>
                <span v-else>🔊 Listening</span>
              </h3>
              <div class="audio-visualizer">
                <div class="wave-bar" v-for="n in 5" :key="n"></div>
              </div>
            </div>
            <div class="audio-player-container">
              <audio
                ref="localAudio"
                controls
                autoplay
                playsinline
                class="audio-player"
              ></audio>
            </div>
          </div>

          <!-- Viewers List -->
          <div class="participants-section">
            <h3 class="participants-title">
              <span class="online-dot"></span>
              Currently Watching
            </h3>
            <div class="participants-grid">
              <div v-for="user in participants" :key="user" class="participant-card">
                <div class="participant-avatar">
                  {{ user.charAt(0).toUpperCase() }}
                </div>
                <span class="participant-name">{{ user }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Chat Section -->
        <section class="chat-section">
          <div class="chat-header">
            <h3>💬 Live Chat</h3>
            <div class="chat-status">
              <div class="status-dot"></div>
              Active
            </div>
          </div>
          <div class="chat-box" ref="chatBox">
            <div v-for="msg in messages" :key="msg.id" class="chat-message">
              <div class="message-avatar">
                {{ msg.sender.charAt(0).toUpperCase() }}
              </div>
              <div class="message-content">
                <span class="message-sender">{{ msg.sender }}</span>
                <span class="message-text">{{ msg.text }}</span>
              </div>
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="chat-input">
            <input 
              v-model="chatInput" 
              placeholder="Type your message..." 
              class="chat-input-field"
            />
            <button type="submit" :disabled="!chatInput.trim()" class="send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m22 2-7 20-4-9-9-4z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Peer from 'peerjs'

import {
  initializeApp,
  getApp,
  getApps
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'

import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'

import { useRoute, useRouter } from 'vue-router'

// ───────────────────────────────────────────────────────────────────
//  Firebase configuration & initialization
// ───────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f342f31"
}
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

// ───────────────────────────────────────────────────────────────────
//  Router & Route Params
// ───────────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const owner = route.params.owner // the stream-owner's username

// ───────────────────────────────────────────────────────────────────
//  State
// ───────────────────────────────────────────────────────────────────
const currentUsername = decodeURIComponent(
  (document.cookie.split('; ').find(c => c.startsWith('vexaUser=')) || '').split('=')[1] || ''
)
const roomData = ref({})
const participants = ref([])
const messages = ref([])    // array of { id, sender, text, timestamp }
const chatInput = ref('')
const loaded = ref(false)

const isHost = computed(() => roomData.value['Room-Owner'] === currentUsername)
const localStream = ref(null)
const localAudio = ref(null)
let peerConnection = null

// References for unsubscribing
let unsubscribeRoom = null
let unsubscribeChat = null

// ───────────────────────────────────────────────────────────────────
//  Utility: Scroll chat to bottom whenever new messages arrive
// ───────────────────────────────────────────────────────────────────
const chatBox = ref(null)
function scrollChatToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

// ───────────────────────────────────────────────────────────────────
//  Stop Stream (host ONLY): 
//  • Disconnect PeerJS 
//  • Stop local audio tracks 
//  • Delete Firestore room document 
//  • Delete all chat messages under vexaChats/{owner}/messages 
//  • Delete parent chat document vexaChats/{owner} 
//  • Update isLiveNow flag under vexaUsers 
//  • Navigate back to /home
// ───────────────────────────────────────────────────────────────────
async function stopStream() {
  // 1) Destroy PeerJS
  if (peerConnection) peerConnection.destroy()

  // 2) Stop local tracks
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop())
  }

  // 3) Delete the room document in Firestore
  const roomRef = doc(db, 'vexaRooms', owner)
  try {
    await deleteDoc(roomRef)
    console.log('Room document deleted.')
  } catch (err) {
    console.error('Error deleting room:', err)
  }

  // 4) Delete chat messages subcollection under vexaChats/{owner}/messages
  try {
    const chatMessagesCol = collection(db, 'vexaChats', owner, 'messages')
    const snapshot = await getDocs(chatMessagesCol)
    const batchDeletes = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'vexaChats', owner, 'messages', docSnap.id)))
    await Promise.all(batchDeletes)
    console.log('All chat messages deleted.')
  } catch (err) {
    console.error('Error deleting chat messages:', err)
  }

  // 5) Delete the parent chat document vexaChats/{owner} (now that subcollection is empty)
  try {
    await deleteDoc(doc(db, 'vexaChats', owner))
    console.log('Chat document deleted.')
  } catch (err) {
    console.error('Error deleting chat parent document:', err)
  }

  // 6) Update the owner's isLiveNow flag to false in vexaUsers
  try {
    const usersCol = collection(db, 'vexaUsers')
    const q = query(usersCol, where('username', '==', owner))
    const snap = await getDocs(q)
    if (!snap.empty) {
      const userDoc = snap.docs[0]
      const userId = userDoc.id
      const userDocRef = doc(db, 'vexaUsers', userId)
      await updateDoc(userDocRef, { isLiveNow: false })
      console.log('isLiveNow set to false for user:', owner)
    }
  } catch (err) {
    console.error('Error updating isLiveNow flag:', err)
  }

  // 7) Navigate back to home
  router.push('/home')
}

// ───────────────────────────────────────────────────────────────────
//  Host Audio Setup
// ───────────────────────────────────────────────────────────────────
async function initHostAudio() {
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    await nextTick()
    if (localAudio.value) {
      localAudio.value.srcObject = localStream.value
      await localAudio.value
        .play()
        .catch(() => { /* user may not allow autoplay, but OK */ })
    }
  } catch (e) {
    console.error('Host audio error:', e)
  }
}

function initHostPeer() {
  peerConnection = new Peer(roomData.value['Room-Owner-PeerID'])
  peerConnection.on('call', call => {
    call.answer(localStream.value)
  })
}

// ───────────────────────────────────────────────────────────────────
//  Viewer PeerJS Setup
// ───────────────────────────────────────────────────────────────────
async function initViewerPeer() {
  // Fetch this viewer's PeerID from vexaUsers
  const usersCol = collection(db, 'vexaUsers')
  const q = query(usersCol, where('username', '==', currentUsername))
  const userSnap = await getDocs(q)
  const viewerPeerId = userSnap.empty ? null : userSnap.docs[0].data().PeerID
  if (!viewerPeerId) {
    console.error('Viewer PeerID not found for', currentUsername)
    return
  }

  peerConnection = new Peer(viewerPeerId)
  peerConnection.on('open', () => {
    const call = peerConnection.call(
      roomData.value['Room-Owner-PeerID'],
      null
    )
    call.on('stream', st => {
      if (localAudio.value) localAudio.value.srcObject = st
    })
  })
  peerConnection.on('error', err => console.error('Peer error:', err))

  // Add this viewer to participants array (if not already present)
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

// ───────────────────────────────────────────────────────────────────
//  Chat: Send a new message to Firestore
// ───────────────────────────────────────────────────────────────────
async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return

  try {
    const chatMessagesCol = collection(db, 'vexaChats', owner, 'messages')
    await addDoc(chatMessagesCol, {
      sender: currentUsername,
      text,
      timestamp: serverTimestamp()
    })
    chatInput.value = ''
  } catch (err) {
    console.error('Failed to send chat message:', err)
  }
}

// ───────────────────────────────────────────────────────────────────
//  onMounted: Listen for Firestore room data & initialize audio/chat
// ───────────────────────────────────────────────────────────────────
onMounted(() => {
  // 1) Listen to the room document in real time
  const roomRef = doc(db, 'vexaRooms', owner)
  unsubscribeRoom = onSnapshot(roomRef, snap => {
    if (!snap.exists()) {
      console.error('No room for owner:', owner)
      return
    }
    roomData.value = { id: snap.id, ...snap.data() }
    participants.value = snap.data()['Participants-Usernames'] || []

    // Initialize audio & PeerJS once
    if (!loaded.value) {
      loaded.value = true

      if (isHost.value) {
        initHostAudio().then(initHostPeer)
      } else {
        initViewerPeer()
      }

      // 2) Set up the chat listener
      const chatMessagesCol = collection(db, 'vexaChats', owner, 'messages')
      const chatQuery = query(chatMessagesCol, orderBy('timestamp', 'asc'))
      unsubscribeChat = onSnapshot(chatQuery, snapshot => {
        messages.value = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          sender: docSnap.data().sender,
          text: docSnap.data().text,
          timestamp: docSnap.data().timestamp
        }))
        scrollChatToBottom()
      })
    }
  })
})

// ───────────────────────────────────────────────────────────────────
//  Cleanup on unmount or when host closes tab
// ───────────────────────────────────────────────────────────────────
window.addEventListener('beforeunload', () => {
  if (isHost.value) {
    stopStream()
  }
})

onBeforeUnmount(() => {
  if (isHost.value) {
    stopStream()
  } else if (peerConnection) {
    peerConnection.destroy()
  }
  if (unsubscribeRoom) unsubscribeRoom()
  if (unsubscribeChat) unsubscribeChat()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#live-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Loading State */
/* ═══════════════════════════════════════════════════════════ */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  font-weight: 500;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main Layout */
/* ═══════════════════════════════════════════════════════════ */
.stream-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Stream Info Section */
/* ═══════════════════════════════════════════════════════════ */
.stream-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stream-header {
  margin-bottom: 30px;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 59, 48, 0.9);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.stream-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stream-description {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

.stream-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.meta-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 12px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Stop Button */
/* ═══════════════════════════════════════════════════════════ */
.stop-section {
  margin-bottom: 30px;
}

.stop-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff416c, #ff4757);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
}

.stop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 65, 108, 0.5);
}

.stop-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Audio Section */
/* ═══════════════════════════════════════════════════════════ */
.audio-section {
  margin-bottom: 30px;
}

.audio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.audio-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.audio-visualizer {
  display: flex;
  align-items: center;
  gap: 3px;
}

.wave-bar {
  width: 4px;
  height: 20px;
  background: linear-gradient(to top, #4facfe, #00f2fe);
  border-radius: 2px;
  animation: wave 1.5s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }

@keyframes wave {
  0%, 100% { height: 20px; }
  50% { height: 8px; }
}

.audio-player-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.audio-player {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  outline: none;
}

.audio-player::-webkit-media-controls-panel {
  background-color: rgba(255, 255, 255, 0.1);
}

/* ═══════════════════════════════════════════════════════════ */
/*  Participants Section */
/* ═══════════════════════════════════════════════════════════ */
.participants-section {
  margin-top: 30px;
}

.participants-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.online-dot {
  width: 12px;
  height: 12px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.participant-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.participant-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.participant-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
}

.participant-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  opacity: 0.9;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Chat Section */
/* ═══════════════════════════════════════════════════════════ */
.chat-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 80vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.8;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.chat-box {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 8px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.chat-input {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input-field {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.chat-input-field:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.send-btn {
  padding: 12px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.send-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.6;
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* ═══════════════════════════════════════════════════════════ */
/*  Custom Scrollbar */
/* ═══════════════════════════════════════════════════════════ */
.chat-box::-webkit-scrollbar {
  width: 6px;
}

.chat-box::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.chat-box::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.chat-box::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* ═══════════════════════════════════════════════════════════ */
/*  Responsive Design */
/* ═══════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .stream-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stream-info {
    padding: 24px;
  }
  
  .chat-section {
    max-height: 50vh;
  }
}

@media (max-width: 768px) {
  #live-root {
    padding: 16px;
  }
  
  .stream-info,
  .chat-section {
    padding: 20px;
    border-radius: 16px;
  }
  
  .stream-title {
    font-size: 24px;
  }
  
  .stream-meta {
    grid-template-columns: 1fr;
  }
  
  .participants-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .chat-input {
    gap: 8px;
  }
  
  .chat-input-field {
    padding: 10px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

@media (max-width: 480px) {
  .stream-meta {
    gap: 12px;
  }
  
  .meta-item {
    padding: 12px;
  }
  
  .participants-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }
  
  .participant-card {
    padding: 12px 8px;
  }
  
  .participant-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

/* ═══════════════════════════════════════════════════════════ */
/*  Accessibility & Focus States */
/* ═══════════════════════════════════════════════════════════ */
.stop-btn:focus,
.send-btn:focus,
.chat-input-field:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Dark Mode Enhancements */
/* ═══════════════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
  .audio-player {
    filter: invert(1) hue-rotate(180deg);
  }
}

/* ═══════════════════════════════════════════════════════════ */
/*  Animation Performance */
/* ═══════════════════════════════════════════════════════════ */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.meta-item,
.participant-card,
.chat-message,
.stop-btn,
.send-btn {
  will-change: transform;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Hover Effects for Touch Devices */
/* ═══════════════════════════════════════════════════════════ */
@media (hover: none) {
  .meta-item:hover,
  .participant-card:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .stop-btn:hover,
  .send-btn:hover {
    transform: none;
  }
}

</style>