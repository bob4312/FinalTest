<template>
  <div style="padding:2rem; max-width:600px; margin:auto;">
    <h2>Listener Mode</h2>

    <p>Your Listener ID: <strong>{{ listenerId }}</strong></p>

    <label for="hostId">Enter Room ID:</label>
    <input
      id="hostId"
      v-model="hostId"
      placeholder="e.g. abcde"
      style="display:block; width:100%; margin:.5rem 0; padding:.5rem;"
    />

    <button @click="joinHost" :disabled="joined || !micReady">
      👂 Join Stream
    </button>
    <p v-if="!micReady" style="color:gray; font-size:.9rem;">
      Allow mic access to connect...
    </p>

    <audio
      v-if="joined"
      ref="remoteAudio"
      autoplay
      controls
      style="display:block; width:100%; margin-top:1rem;"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Peer from 'peerjs'

// 5-char generator
function generatePeerId() {
  return Math.random().toString(36).substring(2, 7)
}

const listenerId = ref(generatePeerId())
const hostId     = ref('')
const joined     = ref(false)
const micReady   = ref(false)
const remoteAudio = ref(null)

let listenerPeer  = null
let localStream   = null

onMounted(async () => {
  // 1) ask for mic (you can keep it muted in your UI or OS)
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micReady.value = true
  } catch (e) {
    console.warn('Listener: mic access denied', e)
    // we could fallback to a silent stream, but user permission is easiest
  }

  // 2) initialize Peer with your 5-char ID
  listenerPeer = new Peer(listenerId.value)

  listenerPeer.on('open', id => {
    listenerId.value = id
    console.log('Listener Peer ready with ID:', id)
  })

  listenerPeer.on('error', err => {
    console.error('PeerJS error (listener):', err)
    alert('Listener error: ' + err)
  })
})

function joinHost() {
  const id = hostId.value.trim()
  if (id.length !== 5) {
    return alert('Room ID must be exactly 5 characters.')
  }
  if (!micReady.value) {
    return alert('Mic not ready; please allow microphone access.')
  }

  console.log('Calling host:', id)
  const call = listenerPeer.call(id, localStream)

  call.on('stream', stream => {
    if (!remoteAudio.value) return
    remoteAudio.value.srcObject = stream
    joined.value = true
  })

  call.on('error', err => {
    console.error('Call error:', err)
    alert('Could not connect to host: ' + err)
  })

  call.on('close', () => {
    console.log('Host closed the call')
    joined.value = false
  })
}
</script>
