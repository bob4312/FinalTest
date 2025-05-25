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

const roomId    = ref(generateRoomId())
const micOn     = ref(false)
const listeners = ref([])

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
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micOn.value = true
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
