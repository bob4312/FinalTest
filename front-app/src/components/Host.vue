<!--Host.vue Code-->
<template>
  <div class="host-container">
    <div class="host-card">
      <!-- Header Section -->
      <div class="header">
        <div class="header-content">
          <h2 class="title">🎙️ Host Mode</h2>
          <p class="subtitle">Share your voice with the world</p>
        </div>
        <div class="broadcast-icon">
          <div class="pulse-ring"></div>
          <div class="broadcast-dot"></div>
        </div>
      </div>

      <!-- Room ID Section -->
      <div class="room-section">
        <p class="room-label">Share this Room ID with your listeners:</p>
        <div class="room-id-container">
          <div class="room-id">{{ roomId }}</div>
          <button class="copy-btn" title="Copy Room ID">
            📋
          </button>
        </div>
      </div>

      <!-- Mic Control Section -->
      <div class="control-section">
        <button 
          @click="startMic" 
          :disabled="micOn"
          class="mic-button"
          :class="{ 'active': micOn, 'disabled': micOn }"
        >
          <span class="mic-icon">🔊</span>
          <span class="mic-text">{{ micOn ? 'Mic is Live' : 'Start My Mic' }}</span>
        </button>
        
        <div v-if="micOn" class="status-indicator">
          <div class="live-dot"></div>
          <p class="live-text">Mic is live — listeners can join using that Room ID</p>
        </div>
      </div>

      <!-- Local Audio Monitor -->
      <div v-if="micOn" class="audio-section">
        <h3 class="audio-title">Your live audio monitor:</h3>
        <div class="audio-container">
          <audio
            ref="localAudio"
            autoplay
            controls
            playsinline
            class="audio-player"
          ></audio>
        </div>
      </div>

      <!-- Listeners Section -->
      <div v-if="listeners.length" class="listeners-section">
        <div class="listeners-header">
          <h3 class="listeners-title">Connected Listeners</h3>
          <div class="listeners-count">{{ listeners.length }}</div>
        </div>
        <div class="listeners-grid">
          <div 
            v-for="id in listeners" 
            :key="id" 
            class="listener-card"
          >
            <div class="listener-avatar">👤</div>
            <span class="listener-id">{{ id }}</span>
          </div>
        </div>
      </div>
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
.host-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.host-card {
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
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
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

.broadcast-icon {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.broadcast-dot {
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Room ID Section */
.room-section {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.room-label {
  font-size: 1.1rem;
  color: #555;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.room-id-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.room-id {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  padding: 1rem 2rem;
  border-radius: 16px;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  box-shadow: 0 8px 16px rgba(79, 172, 254, 0.3);
  min-width: 150px;
}

.copy-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Control Section */
.control-section {
  padding: 2rem;
  text-align: center;
}

.mic-button {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1.25rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(17, 153, 142, 0.3);
  min-width: 200px;
  justify-content: center;
}

.mic-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(17, 153, 142, 0.4);
}

.mic-button.active {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3);
}

.mic-button.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mic-icon {
  font-size: 1.5rem;
}

.status-indicator {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.live-dot {
  width: 12px;
  height: 12px;
  background: #ff4757;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.live-text {
  color: #27ae60;
  font-weight: 600;
  margin: 0;
}

/* Audio Section */
.audio-section {
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.audio-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
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

/* Listeners Section */
.listeners-section {
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.listeners-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.listeners-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.listeners-count {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.listeners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.listener-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.listener-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.listener-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.listener-id {
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

/* Responsive Design */
@media (max-width: 768px) {
  .host-container {
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
  
  .room-id-container {
    flex-direction: column;
  }
  
  .room-id {
    font-size: 1.2rem;
    padding: 0.75rem 1.5rem;
  }
  
  .mic-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
  
  .listeners-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .host-card {
    margin: 0.5rem;
  }
  
  .header,
  .room-section,
  .control-section,
  .audio-section,
  .listeners-section {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.3rem;
  }
  
  .room-id {
    font-size: 1rem;
    letter-spacing: 1px;
  }
}
</style>