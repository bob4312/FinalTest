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

    <!-- always in DOM, just hidden until joined -->
    <audio
      ref="remoteAudio"
      autoplay
      controls
      playsinline
      v-show="joined"
      style="display:block; width:100%; margin-top:1rem;"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Peer from 'peerjs'

// 5-char ID generator
function generatePeerId() {
  return Math.random().toString(36).substring(2, 7)
}

const listenerId  = ref(generatePeerId())
const hostId      = ref('')
const joined      = ref(false)
const micReady    = ref(false)
const remoteAudio = ref(null)

let listenerPeer = null
let localStream  = null

onMounted(async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micReady.value = true
  } catch (e) {
    console.warn('Listener: mic access denied', e)
  }

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

async function joinHost() {
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
    console.log('🔊 Received remote stream', stream)
    // now ref is guaranteed to exist
    remoteAudio.value.srcObject = stream
    remoteAudio.value.volume    = 1

    // when metadata is loaded, start playback
    remoteAudio.value.onloadedmetadata = () => {
      remoteAudio.value.play().then(() => {
        joined.value = true
        console.log('▶️ Playback started')
      }).catch(err => {
        console.error('❌ Playback failed:', err)
      })
    }
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
