<!-- <template>
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
      ref="remoteAudio"
      autoplay
      controls
      playsinline
      v-show="joined"
      style="display:block; width:100%; margin-top:1rem;"
    ></audio>
  </div>
</template> -->

<template>
  <div class="listener-container">
    <div class="listener-card">
      <!-- Header Section -->
      <div class="header">
        <div class="header-content">
          <h2 class="title">👂 Listener Mode</h2>
          <p class="subtitle">Join a live audio stream</p>
        </div>
        <div class="listen-icon">
          <div class="sound-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
          </div>
        </div>
      </div>

      <!-- Listener Info Section -->
      <div class="info-section">
        <div class="listener-info">
          <span class="info-label">Your Listener ID:</span>
          <div class="listener-id">{{ listenerId }}</div>
        </div>
      </div>

      <!-- Connection Section -->
      <div class="connection-section">
        <div class="input-group">
          <label for="hostId" class="input-label">Enter Room ID to join:</label>
          <div class="input-container">
            <input
              id="hostId"
              v-model="hostId"
              placeholder="e.g. ABCDE"
              class="room-input"
              :class="{ 'error': hasError }"
            />
            <div class="input-icon">🔗</div>
          </div>
        </div>

        <button 
          @click="joinHost" 
          :disabled="joined || !micReady"
          class="join-button"
          :class="{ 
            'joined': joined, 
            'disabled': !micReady,
            'loading': isConnecting 
          }"
        >
          <span class="button-icon" v-if="!isConnecting">
            {{ joined ? '🎧' : '👂' }}
          </span>
          <div class="spinner" v-if="isConnecting"></div>
          <span class="button-text">
            {{ joined ? 'Connected to Stream' : 'Join Stream' }}
          </span>
        </button>

        <div v-if="!micReady" class="permission-notice">
          <div class="notice-icon">⚠️</div>
          <p class="notice-text">Please allow microphone access to connect to the stream</p>
        </div>

        <div v-if="joined" class="connection-status">
          <div class="status-dot"></div>
          <p class="status-text">Connected and streaming</p>
        </div>
      </div>

      <!-- Audio Player Section -->
      <div class="audio-section" :class="{ 'visible': joined }">
        <div class="audio-header">
          <h3 class="audio-title">🎵 Live Audio Stream</h3>
          <div class="equalizer">
            <div class="bar bar-1"></div>
            <div class="bar bar-2"></div>
            <div class="bar bar-3"></div>
            <div class="bar bar-4"></div>
          </div>
        </div>
        <div class="audio-container">
          <audio
            ref="remoteAudio"
            autoplay
            controls
            playsinline
            class="audio-player"
          ></audio>
        </div>
      </div>
    </div>
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






<style scoped>
.listener-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.listener-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header Section */
.header {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.header-content {
  flex: 1;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.listen-icon {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sound-waves {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.wave {
  width: 4px;
  background: white;
  border-radius: 2px;
  animation: wave-animation 1.5s ease-in-out infinite;
}

.wave-1 {
  height: 20px;
  animation-delay: 0s;
}

.wave-2 {
  height: 35px;
  animation-delay: 0.2s;
}

.wave-3 {
  height: 25px;
  animation-delay: 0.4s;
}

@keyframes wave-animation {
  0%, 100% {
    transform: scaleY(1);
    opacity: 0.7;
  }
  50% {
    transform: scaleY(1.5);
    opacity: 1;
  }
}

/* Info Section */
.info-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.listener-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-label {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

.listener-id {
  background: linear-gradient(135deg, #a8e6cf, #88d8a3);
  color: #2d5016;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  box-shadow: 0 4px 8px rgba(168, 230, 207, 0.3);
}

/* Connection Section */
.connection-section {
  padding: 2rem;
}

.input-group {
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.room-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  background: white;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.room-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  transform: translateY(-1px);
}

.room-input.error {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.input-icon {
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
  color: #adb5bd;
}

.join-button {
  width: 100%;
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1.25rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 8px 16px rgba(17, 153, 142, 0.3);
  margin-bottom: 1rem;
}

.join-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(17, 153, 142, 0.4);
}

.join-button.joined {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3);
}

.join-button.disabled {
  background: #adb5bd;
  cursor: not-allowed;
  box-shadow: none;
}

.join-button.loading {
  cursor: default;
}

.button-icon {
  font-size: 1.3rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.permission-notice {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notice-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notice-text {
  color: #856404;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}

.status-text {
  color: #28a745;
  font-weight: 600;
  margin: 0;
  font-size: 0.95rem;
}

/* Audio Section */
.audio-section {
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  max-height: 0;
  overflow: hidden;
}

.audio-section.visible {
  opacity: 1;
  transform: translateY(0);
  max-height: 300px;
}

.audio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.audio-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.equalizer {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 30px;
}

.bar {
  width: 4px;
  background: linear-gradient(to top, #4facfe, #00f2fe);
  border-radius: 2px;
  animation: equalizer 1.5s ease-in-out infinite;
}

.bar-1 {
  animation-delay: 0s;
}

.bar-2 {
  animation-delay: 0.2s;
}

.bar-3 {
  animation-delay: 0.4s;
}

.bar-4 {
  animation-delay: 0.6s;
}

@keyframes equalizer {
  0%, 100% {
    height: 8px;
  }
  50% {
    height: 25px;
  }
}

.audio-container {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.audio-player {
  width: 100%;
  border-radius: 12px;
  outline: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .listener-container {
    padding: 0.5rem;
  }
  
  .header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .listener-info {
    flex-direction: column;
    text-align: center;
  }
  
  .room-input {
    font-size: 1rem;
    padding: 0.875rem 2.5rem 0.875rem 0.875rem;
  }
  
  .join-button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .listener-card {
    margin: 0.5rem;
  }
  
  .header,
  .info-section,
  .connection-section,
  .audio-section {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.3rem;
  }
  
  .listener-id {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>