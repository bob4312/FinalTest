<template>
  <div style="padding:2rem; max-width:600px; margin:auto;">
    <h2>Listener Mode</h2>

    <label for="hostId">Enter Room ID:</label>
    <input
      id="hostId"
      v-model="hostId"
      placeholder="e.g. abcde"
      style="display:block; width:100%; margin:.5rem 0; padding:.5rem;"
    />

    <button @click="joinHost" :disabled="joined">
      👂 Join Stream
    </button>

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
import { ref } from 'vue'
import Peer from 'peerjs'

const hostId = ref('')
const joined = ref(false)
const remoteAudio = ref(null)
let listenerPeer = null

function joinHost() {
  const id = hostId.value.trim()
  if (id.length !== 5) {
    return alert('Room ID must be 5 characters.')
  }

  listenerPeer = new Peer()
  listenerPeer.on('open', () => {
    const call = listenerPeer.call(id, null)
    call.on('stream', stream => {
      remoteAudio.value.srcObject = stream
      joined.value = true
    })
    call.on('error', err => {
      console.error('Call error:', err)
      alert('Could not connect to host: ' + err)
    })
  })

  listenerPeer.on('error', err => {
    console.error('PeerJS error (listener):', err)
    alert('Listener error: ' + err)
  })
}
</script>
