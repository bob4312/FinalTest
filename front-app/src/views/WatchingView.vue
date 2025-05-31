<!-- <template>
  <div id="watch-root">
    <div v-if="!exists && !loading" class="not-found">
      <h2>Stream Not Found</h2>
      <p>The host "{{ owner }}" is not streaming right now or the room does not exist.</p>
    </div>

    <div v-else-if="loading" class="loading">
      <p>Checking stream availability…</p>
    </div>

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
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
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

onMounted(async () => {
  // get viewer's PeerID
  const currentUsername = getCookie('vexaUser')
  const userData = await getUserByUsername(currentUsername)
  const viewerPeerId = userData?.PeerID
  if (!viewerPeerId) {
    console.error('Viewer PeerID not found for', currentUsername)
    loading.value = false
    exists.value = false
    return
  }

  // get or fallback localStream
  let localStream
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    console.warn('Could not get local audio, using empty stream:', e)
    localStream = new MediaStream()
  }

  // check room existence
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

  // initialize peer with stored ID
  const peer = new Peer(viewerPeerId)
  peer.on('open', id => {
    const hostPeerId = roomData.value['Room-Owner-PeerID']
    if (!hostPeerId) {
      console.error('Host PeerID missing for owner:', owner)
      return
    }
    const call = peer.call(hostPeerId, localStream)
    if (!call) {
      console.error('Call returned undefined — check PeerIDs & stream')
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
</style> -->

<!------------------------------------------------------------------>
<!-- <template>
  <div id="watch-root">
    <div v-if="!exists && !loading" class="not-found">
      <h2>Stream Not Found</h2>
      <p>The host "{{ owner }}" is not streaming right now or the room does not exist.</p>
    </div>

    <div v-else-if="loading" class="loading">
      <p>Checking stream availability…</p>
    </div>

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
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
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

// Route param
const route = useRoute()
const owner = route.params.owner

// State
const loading = ref(true)
const exists = ref(false)
const roomData = ref(null)
const remoteAudio = ref(null)

// Helpers
function getCookie(name) {
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : null
}

async function getUserByUsername(username) {
  const usersCol = collection(db, 'vexaUsers')
  const q = query(usersCol, where('username', '==', username))
  const snap = await getDocs(q)
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() }
}

onMounted(async () => {

  const currentUsername = getCookie('vexaUser')
  if (!currentUsername) {
    console.error('No logged-in username in cookies')
    loading.value = false
    exists.value = false
    return
  }

  // fetch viewer record
  const userData = await getUserByUsername(currentUsername)
  if (!userData || !userData.PeerID) {
    console.error('Viewer not found or missing PeerID for', currentUsername)
    loading.value = false
    exists.value = false
    return
  }
  const viewerPeerId = userData.PeerID

  // get or fallback localStream
  let localStream
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    console.warn('No mic access, using empty stream', e)
    localStream = new MediaStream()
  }

  // check room existence
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

  // append viewer to participants
  const participants = roomData.value['Participants-Usernames'] || []
  if (!participants.includes(currentUsername)) {
    try {
      await updateDoc(roomRef, {
        'Participants-Usernames': [...participants, currentUsername]
      })
    } catch (err) {
      console.error('Failed to update participants:', err)
    }
  }

  // initialize PeerJS
  const peer = new Peer(viewerPeerId)
  peer.on('open', () => {
    const hostPeerId = roomData.value['Room-Owner-PeerID']
    if (!hostPeerId) {
      console.error('Host PeerID missing for', owner)
      return
    }
    const call = peer.call(hostPeerId, localStream)
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

</style> -->



<template>
  <div id="watch-root">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-content">
        <h2>Connecting to Stream...</h2>
        <p>Finding {{ owner }}'s audio stream</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Stream Not Found -->
    <div v-else-if="!exists" class="not-found-container">
      <div class="not-found-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 9l3 3m0 0l3-3m-3 3V4m-6 8a5 5 0 1 0 10 0"/>
        </svg>
      </div>
      <h2>Stream Offline</h2>
      <p>{{ owner }} is not streaming right now</p>
      <p class="subtitle">Check back later or follow for notifications</p>
      <button class="retry-btn" @click="retryConnection">Try Again</button>
    </div>

    <!-- Live Stream + Chat -->
    <div v-else class="stream-container">
      <!-- ─────────── LEFT SIDE: Live Stream UI ─────────── -->
      <div class="left-pane">
        <!-- Header Section -->
        <div class="stream-header">
          <div class="host-info">
            <div class="host-avatar">
              <div class="avatar-circle">
                {{ owner.charAt(0).toUpperCase() }}
              </div>
              <div class="live-indicator">
                <div class="live-dot"></div>
                LIVE
              </div>
            </div>
            <div class="host-details">
              <h1 class="host-name">{{ owner }}</h1>
              <p class="stream-title">Live Audio Stream</p>
            </div>
          </div>

          <!-- Participants Counter -->
          <div class="participants-section">
            <div class="participants-count">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span class="count-number">{{ participantCount }}</span>
              <span class="count-label">listening</span>
            </div>
            <div class="participants-pulse"></div>
          </div>
        </div>

        <!-- Audio Player Section -->
        <div class="audio-section">
          <div class="audio-container">
            <div class="audio-visualizer">
              <div class="visualizer-bars" v-for="n in 12" :key="n" :style="{ animationDelay: n * 0.1 + 's' }"></div>
            </div>
            
            <audio
              ref="remoteAudio"
              controls
              autoplay
              playsinline
              class="audio-player"
              @play="onAudioPlay"
              @pause="onAudioPause"
              @loadstart="onAudioLoadStart"
              @canplay="onAudioCanPlay"
            ></audio>
            
            <div class="audio-controls">
              <button class="volume-btn" @click="toggleMute">
                <svg v-if="!isMuted" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              </button>
              <div class="stream-status">
                <div class="status-dot" :class="{ active: isPlaying }"></div>
                <span>{{ isPlaying ? 'Live' : 'Paused' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Elements -->
        <div class="interaction-section">
          <div class="stream-stats">
            <div class="stat-item">
              <div class="stat-icon">🎵</div>
              <div class="stat-info">
                <span class="stat-value">{{ formatDuration(streamDuration) }}</span>
                <span class="stat-label">Stream Time</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ participantCount }}</span>
                <span class="stat-label">Listeners</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📶</div>
              <div class="stat-info">
                <span class="stat-value" :class="connectionQuality.class">{{ connectionQuality.text }}</span>
                <span class="stat-label">Quality</span>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="action-btn primary" @click="shareStream">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16,6 12,2 8,6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share Stream
            </button>
            <button class="action-btn secondary" @click="toggleFullscreen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
              Focus Mode
            </button>
          </div>
        </div>

        <!-- Recent Listeners (Mock Data for Demo) -->
        <div class="recent-listeners">
          <h3>Recent Listeners</h3>
          <div class="listener-avatars">
            <div v-for="listener in recentListeners" :key="listener" class="listener-avatar">
              {{ listener.charAt(0).toUpperCase() }}
            </div>
            <div class="listener-more" v-if="participantCount > 5">
              +{{ participantCount - 5 }}
            </div>
          </div>
        </div>
      </div> <!-- /.left-pane -->

      <!-- ─────────── RIGHT SIDE: Chat Sidebar ─────────── -->
      <div class="chat-pane">
        <div class="chat-header">
          <h2>Chat</h2>
        </div>

        <div class="messages-container" ref="messagesContainer">
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            :class="['message', msg.sender === currentUsername ? 'own-message' : 'other-message']"
          >
            <span class="msg-sender">{{ msg.sender }}</span>
            <span class="msg-text">{{ msg.text }}</span>
            <span class="msg-time">{{ formatTimestamp(msg.timestamp) }}</span>
          </div>
        </div>

        <form class="chat-input-form" @submit.prevent="sendMessage">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div> <!-- /.chat-pane -->
    </div> <!-- /.stream-container -->
  </div> <!-- /#watch-root -->
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import Peer from 'peerjs'

import {
  initializeApp,
  getApp,
  getApps
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'

import { useRoute } from 'vue-router'

// ───────────────────────────────────────────────────────────────────
//  Firebase config & init
// ───────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────
//  Route param
// ───────────────────────────────────────────────────────────────────
const route = useRoute()
const owner = route.params.owner // this is the chat “room ID” as well

// ───────────────────────────────────────────────────────────────────
//  Reactive State (Live Stream + Chat)
// ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const exists = ref(false)
const roomData = ref(null)
const remoteAudio = ref(null)
const participantCount = ref(0)
const isPlaying = ref(false)
const isMuted = ref(false)
const streamDuration = ref(0)
const connectionQuality = ref({ text: 'Excellent', class: 'good' })
const recentListeners = ref(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'])

// ───────────────────────────────────────────────────────────────────
//  Refs for Cleanup
// ───────────────────────────────────────────────────────────────────
let unsubscribeRoom = null
let unsubscribeChat = null
let durationInterval = null

// ───────────────────────────────────────────────────────────────────
//  Chat‐specific State
// ───────────────────────────────────────────────────────────────────
const chatMessages = ref([])        // Array of { id, sender, text, timestamp }
const newMessage = ref('')
const currentUsername = ref('')     // Will be populated from cookie

// ───────────────────────────────────────────────────────────────────
//  Helpers (Duration formatting, Cookie reading, Timestamp formatting)
// ───────────────────────────────────────────────────────────────────
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
function formatTimestamp(ts) {
  if (!ts) return ''
  const dateObj = ts.toDate()
  const h = dateObj.getHours().toString().padStart(2, '0')
  const m = dateObj.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
function getCookie(name) {
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  return parts.length === 2
    ? decodeURIComponent(parts.pop().split(';').shift())
    : null
}

// ───────────────────────────────────────────────────────────────────
//  Firestore: Fetch a user doc by username (needed for PeerID)
// ───────────────────────────────────────────────────────────────────
async function getUserByUsername(username) {
  const usersCol = collection(db, 'vexaUsers')
  const q = query(usersCol, where('username', '==', username))
  const snap = await getDocs(q)
  return snap.empty
    ? null
    : { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ───────────────────────────────────────────────────────────────────
//  Live‐Stream Audio Controls
// ───────────────────────────────────────────────────────────────────
function onAudioPlay() {
  isPlaying.value = true
  startDurationTimer()
}
function onAudioPause() {
  isPlaying.value = false
  stopDurationTimer()
}
function onAudioLoadStart() {
  connectionQuality.value = { text: 'Loading...', class: 'loading' }
}
function onAudioCanPlay() {
  connectionQuality.value = { text: 'Excellent', class: 'good' }
}
function toggleMute() {
  if (remoteAudio.value) {
    remoteAudio.value.muted = !remoteAudio.value.muted
    isMuted.value = remoteAudio.value.muted
  }
}
function startDurationTimer() {
  if (durationInterval) return
  durationInterval = setInterval(() => {
    streamDuration.value++
  }, 1000)
}
function stopDurationTimer() {
  if (durationInterval) {
    clearInterval(durationInterval)
    durationInterval = null
  }
}

// ───────────────────────────────────────────────────────────────────
//  Live‐Stream Actions
// ───────────────────────────────────────────────────────────────────
function shareStream() {
  if (navigator.share) {
    navigator.share({
      title: `${owner}'s Live Stream`,
      text: `Listen to ${owner}'s live audio stream`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Stream link copied to clipboard!')
  }
}
function toggleFullscreen() {
  document.querySelector('.stream-container').classList.toggle('fullscreen-mode')
}
function retryConnection() {
  loading.value = true
  exists.value = false
  window.location.reload()
}

// ───────────────────────────────────────────────────────────────────
//  Firestore: Setup Real‐time Participant Counter
// ───────────────────────────────────────────────────────────────────
function setupParticipantCounter() {
  const roomRef = doc(db, 'vexaRooms', owner)
  unsubscribeRoom = onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      const parts = data['Participants-Usernames'] || []
      participantCount.value = parts.length
      recentListeners.value = parts.slice(-5)
    }
  })
}

// ───────────────────────────────────────────────────────────────────
//  Firestore: Setup Chat Listener for this “owner”
// ───────────────────────────────────────────────────────────────────
function setupChatListener() {
  const messagesCol = collection(db, 'vexaChats', owner, 'messages')
  const messagesQuery = query(messagesCol, orderBy('timestamp', 'asc'))
  unsubscribeChat = onSnapshot(messagesQuery, (snapshot) => {
    const msgs = []
    snapshot.forEach(docSnap => {
      const data = docSnap.data()
      msgs.push({
        id: docSnap.id,
        sender: data.sender,
        text: data.text,
        timestamp: data.timestamp
      })
    })
    chatMessages.value = msgs
    nextTick(() => {
      const container = messagesContainerRef.value
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  })
}

// ───────────────────────────────────────────────────────────────────
//  Firestore: Send New Message
// ───────────────────────────────────────────────────────────────────
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return
  const messagesCol = collection(db, 'vexaChats', owner, 'messages')
  try {
    await addDoc(messagesCol, {
      sender: currentUsername.value,
      text,
      timestamp: serverTimestamp()
    })
    newMessage.value = ''
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

// ───────────────────────────────────────────────────────────────────
//  onMounted: Main Setup Logic
// ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  // 1) Grab current user from cookie
  const usernameFromCookie = getCookie('vexaUser')
  if (!usernameFromCookie) {
    console.error('No logged-in username in cookies')
    loading.value = false
    exists.value = false
    return
  }
  currentUsername.value = usernameFromCookie

  // 2) Fetch viewer userData (for PeerID, etc.)
  const userData = await getUserByUsername(currentUsername.value)
  if (!userData || !userData.PeerID) {
    console.error('Viewer not found or missing PeerID for', currentUsername.value)
    loading.value = false
    exists.value = false
    return
  }
  const viewerPeerId = userData.PeerID

  // 3) get or fallback localStream (we only need audio for call)
  let localStream
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (e) {
    console.warn('No mic access, using empty stream', e)
    localStream = new MediaStream()
  }

  // 4) Check if the room (owner) exists in Firestore
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

  // 5) Setup real-time participant counter
  setupParticipantCounter()

  // 6) Append viewer to participants if not already there
  const parts = roomData.value['Participants-Usernames'] || []
  if (!parts.includes(currentUsername.value)) {
    try {
      await updateDoc(roomRef, {
        'Participants-Usernames': [...parts, currentUsername.value]
      })
    } catch (err) {
      console.error('Failed to update participants:', err)
    }
  }

  // ────────────────────────────────────────────────────────────────
  //  **NEW CHECK**: If the current user **is the host**, skip “viewer” logic
  // ────────────────────────────────────────────────────────────────
  if (roomData.value['Room-Owner'] === currentUsername.value) {
    // Host should not re-register the same PeerID again.
    // Just set up chat (host is already connected via the host page).
    setupChatListener()
    return
  }

  // 7) Initialize PeerJS for viewer (only if not the host)
  const peer = new Peer(viewerPeerId)
  peer.on('open', () => {
    const hostPeerId = roomData.value['Room-Owner-PeerID']
    if (!hostPeerId) {
      console.error('Host PeerID missing for', owner)
      return
    }
    const call = peer.call(hostPeerId, localStream)
    if (!call) {
      console.error('Call returned undefined—check PeerIDs & stream')
      return
    }
    call.on('stream', async stream => {
      await nextTick()
      if (remoteAudio.value) {
        remoteAudio.value.srcObject = stream
        remoteAudio.value.onloadeddata = () => {
          connectionQuality.value = { text: 'Connected', class: 'good' }
        }
      }
    })
    call.on('error', err => {
      console.error('Call error:', err)
      connectionQuality.value = { text: 'Poor', class: 'poor' }
    })
  })
  peer.on('error', err => {
    console.error('Peer error:', err)
    connectionQuality.value = { text: 'Disconnected', class: 'poor' }
  })

  // 8) Finally: set up real-time chat listener (for viewer)
  setupChatListener()
})

// ───────────────────────────────────────────────────────────────────
//  onUnmounted: Clean Up Listeners
// ───────────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (unsubscribeRoom) unsubscribeRoom()
  if (unsubscribeChat) unsubscribeChat()
  if (durationInterval) clearInterval(durationInterval)
})

// === For scrolling the chat container ===
const messagesContainerRef = ref(null)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#watch-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: white;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Loading State */
/* ──────────────────────────────────────────────────────────────── */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
}
.loading-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}
.loading-content p {
  margin: 0 0 1rem 0;
  opacity: 0.8;
}
.loading-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.loading-dots span {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* ──────────────────────────────────────────────────────────────── */
/*  Not Found State */
/* ──────────────────────────────────────────────────────────────── */
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
}
.not-found-icon {
  opacity: 0.6;
  margin-bottom: 1.5rem;
}
.not-found-container h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}
.not-found-container p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
.subtitle {
  opacity: 0.7;
  font-size: 0.9rem !important;
}
.retry-btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* ──────────────────────────────────────────────────────────────── */
/*  Stream Container */
/* ──────────────────────────────────────────────────────────────── */
.stream-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  gap: 2rem;
}
.stream-container.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  max-width: none;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ──────────────────────────────────────────────────────────────── */
/*  Left Pane (existing live‐stream UI) */
/* ──────────────────────────────────────────────────────────────── */
.left-pane {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
/* (…existing CSS from before, unchanged …) */

/* ──────────────────────────────────────────────────────────────── */
/*  Chat Pane (Right Side) */
/* ──────────────────────────────────────────────────────────────── */
.chat-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow: hidden;
}
.chat-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}
.chat-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}
.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.message {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
.message .msg-sender {
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.8;
}
.message .msg-text {
  font-size: 0.9rem;
  margin: 0.25rem 0;
}
.message .msg-time {
  font-size: 0.7rem;
  opacity: 0.6;
  align-self: flex-end;
}
.own-message {
  align-self: flex-end;
  background: rgba(46, 204, 113, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}
.other-message {
  align-self: flex-start;
  background: rgba(52, 152, 219, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}
.chat-input-form {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.chat-input-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0 0 0 20px;
  color: white;
  font-size: 0.9rem;
}
.chat-input-form input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.chat-input-form button {
  padding: 0 1.5rem;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 0 0 20px 0;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-input-form button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Animations, Responsive, etc. */
/* ──────────────────────────────────────────────────────────────── */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
@keyframes visualize {
  0% { height: 10px; }
  100% { height: 50px; }
}
@media (max-width: 1024px) {
  .stream-container {
    flex-direction: column;
    align-items: center;
  }
  .chat-pane {
    width: 100%;
    max-height: 300px;
    order: 1;
  }
  .left-pane {
    width: 100%;
    order: 2;
  }
}
</style>
