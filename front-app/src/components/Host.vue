<template>
  <div style="padding:2rem; max-width:600px; margin:auto;">
    <h2>Host Mode</h2>
    <p>
      Room ID to share: <strong>{{ roomId }}</strong>
    </p>
    <button @click="startMic" :disabled="micOn">
      🔊 Start My Mic
    </button>

    <p v-if="micOn" style="margin-top:1rem;color:green;">
      Mic is live — listeners can join using that Room ID.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Peer from 'peerjs'

// Generate a 5-character alphanumeric Room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 7)
}

const roomId = ref(generateRoomId())
const micOn = ref(false)
let hostPeer = null
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
    if (!localStream) {
      return alert('Please start your mic first!')
    }
    call.answer(localStream)
    call.on('close', () => {})
    call.on('error', console.error)
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
