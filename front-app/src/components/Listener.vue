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

const hostId     = ref('')
const joined     = ref(false)
const remoteAudio = ref(null)
let listenerPeer  = null

function joinHost() {
  const id = hostId.value.trim()
  if (id.length !== 5) {
    return alert('Room ID must be exactly 5 characters.')
  }

  listenerPeer = new Peer()  
  listenerPeer.on('open', () => {
    console.log('Listener Peer open, calling host:', id)
    const call = listenerPeer.call(id)   // <-- no `null` here

    if (!call) {
      console.error('peer.call returned:', call)
      return alert('Unable to initiate call')
    }

    call.on('stream', stream => {
      if (!remoteAudio.value) {
        console.error('remoteAudio ref is missing')
        return
      }
      console.log('Received remote stream:', stream)
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
  })

  listenerPeer.on('error', err => {
    console.error('PeerJS error (listener):', err)
    alert('Listener peer error: ' + err)
  })
}
</script>
