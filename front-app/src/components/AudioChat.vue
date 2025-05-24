<template>
  <div class="audio-chat">
    <h1>3-Way Audio Chat</h1>
    <p>Your Peer ID: <strong>{{ peerId || '…connecting…' }}</strong></p>

    <button @click="startMic" :disabled="micStarted">🔊 Start Microphone</button>

    <label for="remoteIds">Other Peer IDs (comma-separated):</label>
    <input id="remoteIds" v-model="remoteIds" :disabled="!micStarted" placeholder="peerId1,peerId2" />

    <button @click="callAll" :disabled="!micStarted || calling">📞 Call All</button>

    <audio ref="localAudio" autoplay muted></audio>

    <div v-for="streamInfo in remoteStreams" :key="streamInfo.id" class="remote">
      <audio :ref="el => setRemoteAudioRef(streamInfo.id, el)" autoplay controls />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Peer from 'peerjs';

// Generate a random 5-character alphanumeric ID
function generatePeerId() {
  return Math.random().toString(36).substring(2, 7);
}

const peerId = ref('');
const micStarted = ref(false);
const calling = ref(false);
const remoteIds = ref('');
const localAudio = ref(null);
const localStream = ref(null);
const remoteStreams = ref([]);
const calls = ref({});

// Initialize Peer with a 5-char ID
const peer = new Peer(generatePeerId());

peer.on('open', id => {
  peerId.value = id;
});

peer.on('error', err => {
  console.error(err);
  alert('PeerJS error: ' + err);
});

peer.on('call', call => {
  if (!localStream.value) return alert('Start your mic first!');
  call.answer(localStream.value);
  setupCall(call);
});

async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.value = stream;
    localAudio.value.srcObject = stream;
    micStarted.value = true;
  } catch (e) {
    alert('Could not get mic: ' + e.message);
  }
}

function callAll() {
  if (!localStream.value) return;
  const ids = remoteIds.value
    .split(',')
    .map(s => s.trim())
    .filter(s => s && s !== peerId.value);
  if (!ids.length) return alert('Enter at least one other Peer ID.');

  calling.value = true;
  ids.forEach(id => {
    if (!calls.value[id]) {
      const call = peer.call(id, localStream.value);
      setupCall(call);
    }
  });
}

function setupCall(call) {
  const id = call.peer;
  calls.value[id] = call;

  call.on('stream', remoteStream => addRemoteStream(id, remoteStream));
  call.on('close', () => cleanupCall(id));
  call.on('error', () => cleanupCall(id));
}

function addRemoteStream(id, stream) {
  if (!remoteStreams.value.find(r => r.id === id)) {
    remoteStreams.value.push({ id, stream });
  }
}

function cleanupCall(id) {
  remoteStreams.value = remoteStreams.value.filter(r => r.id !== id);
  delete calls.value[id];
}

function setRemoteAudioRef(id, el) {
  const streamInfo = remoteStreams.value.find(r => r.id === id);
  if (el && streamInfo) el.srcObject = streamInfo.stream;
}
</script>

<style scoped>
.audio-chat {
  font-family: sans-serif;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}

input, button {
  font-size: 1rem;
  padding: .5rem;
  margin: .5rem 0;
  width: 100%;
}

.remote audio {
  display: block;
  margin-top: 1rem;
  width: 100%;
  border: 1px solid #ccc;
  padding: .5rem;
}
</style>
