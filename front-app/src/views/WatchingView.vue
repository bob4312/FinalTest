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
 <template>
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

</style> 

