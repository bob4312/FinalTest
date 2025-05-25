<template>
  <div style="padding:2rem; max-width:600px; margin:auto;">
    <h2>Host Mode</h2>
    <p>Room ID to share: <strong>{{ roomId }}</strong></p>

    <button @click="startMic" :disabled="micOn">
      🔊 Start My Mic
    </button>

    <p v-if="micOn" style="margin-top:1rem;color:green;">
      Mic is live — listeners can join using that Room ID.
    </p>

    <!-- New: local monitor audio -->
    <div v-if="micOn" style="margin-top:1rem;">
      <p><strong>Your live audio monitor:</strong></p>
      <audio
        ref="localAudio"
        autoplay
        controls
        playsinline
        style="width:100%;"
      ></audio>
    </div>

    <div v-if="listeners.length" style="margin-top:1.5rem;">
      <p><strong>Connected listeners ({{ listeners.length }}):</strong></p>
      <ul>
        <li v-for="id in listeners" :key="id">{{ id }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Peer from 'peerjs'

// 5-char alphanumeric generator
function generateRoomId() {
  return Math.random().toString(36).substring(2, 7)
}

const roomId     = ref(generateRoomId())
const micOn      = ref(false)
const listeners  = ref([])
const localAudio = ref(null)

let hostPeer    = null
let localStream = null

onMounted(() => {
  hostPeer = new Peer(roomId.value)

  hostPeer.on('open', id => {
    roomId.value = id
    console.log('Host Peer ready with ID:', id)
  })

  hostPeer.on('error', err => {
    console.error('PeerJS error (host):', err)
    alert('Host error: ' + err)
  })

  hostPeer.on('call', call => {
    console.log('Incoming call from listener:', call.peer)

    if (!localStream) {
      alert('Please start your mic first!')
      return
    }

    // answer and send your mic stream
    call.answer(localStream)

    // track connected listener
    if (!listeners.value.includes(call.peer)) {
      listeners.value.push(call.peer)
    }

    call.on('close', () => {
      listeners.value = listeners.value.filter(id => id !== call.peer)
    })

    call.on('error', err => {
      console.error('Listener connection error:', err)
      listeners.value = listeners.value.filter(id => id !== call.peer)
    })
  })
})

async function startMic() {
  try {
    // get mic stream
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micOn.value = true

    // attach to local <audio> for self-monitor
    if (localAudio.value) {
      localAudio.value.srcObject = localStream
      localAudio.value.volume = 1
      // you can auto-play; most browsers allow autoplay for user-initiated actions
      await localAudio.value.play().catch(() => {
        // fallback: user can click play manually
      })
    }
  } catch (e) {
    alert('Could not access mic: ' + e.message)
  }
}
</script>

<style scoped>
button {
  font-size: 1rem;
  padding: .5rem 1rem;
}
</style>
