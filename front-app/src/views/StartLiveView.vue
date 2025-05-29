<!-- <template>
    <NavBar/>
    <div id="startLiveContainer">
        <h1 id="startLiveTitle">Start Live</h1>
        <div id="form-Of-Live-Setup-Container">
            <form id="room-form" @submit.prevent="liveCreateRoomFormSubmit">
                <div id="streamName-Section">
                    <label id="stream-Title">StreamTitle</label>
                    <input id="stream-Title-Input"></input>
                </div>
                <div id="streamDescription-Section">
                    <label id="stream-Description">StreamDescription</label>
                    <input id="stream-Description-Input"></input>
                </div>
                <div id="streamCategory-Section">
                    <label id="stream-Category">StreamCategory</label>
                    <input id="stream-Category-Input"></input>
                </div>

                <button id="goLiveBtn">Go Live</button>
            </form>
        </div>
    </div>

</template>

<script setup>
import NavBar from '../components/NavBar.vue'



</script>

<style scoped>
#startLiveContainer
{
    width: 750px;
    height: 400px;
    /* border: 2px solid rgb(98, 98, 98); */

    position: absolute;
    left: 200px;
    top: 140px;
}

#startLiveTitle
{
         /* border: 1px solid rgb(66, 48, 48); */
    width: 400px;
    height: 56px;

    
    font-weight: 1000;
    font-size: 35px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 0px;
}

#form-Of-Live-Setup-Container
{
    width: 748px;
    height: 330px;
    border: 2px solid rgb(98, 98, 98);

    position: absolute;
    top: 70px;
    
}

#room-form
{
    width: 748px;
    height: 330px;
    /* border: 2px solid rgb(98, 98, 98) */
}

#streamName-Section
{
    width: 400px;
    height: 100px;
    /* border: 2px solid rgb(98, 98, 98) */

    position: absolute;
    top: -15px;
}

#stream-Title
{
        width: 400px;
    height: 56px;
    
    
    font-weight: 1000;
    font-size: 20px;
    color: #a4a4a4;
    position: absolute;
    left: 25px;
    top: 21px;
}

#stream-Title-Input
{
    position: absolute;
    left: 25px;
    top: 60px;
    background-color: black;
    border: 2px solid grey;
    color: rgb(255, 255, 255);

    width: 350px;

}

#streamDescription-Section
{
    width: 400px;
    height: 100px;
    /* border: 2px solid rgb(98, 98, 98) */
        position: absolute;
    top: -25px;
}

#stream-Description
{
    width: 400px;
    height: 56px;
    
    
    font-weight: 1000;
    font-size: 20px;
    color: #a4a4a4;
    position: absolute;
    left: 25px;
    top: 110px;   
}

#stream-Description-Input
{
    position: absolute;
    left: 25px;
    top: 150px;
    background-color: black;
    /* border: 2px solid grey; */
    color: rgb(255, 255, 255);

    width: 350px;
}

#streamCategory-Section
{
    width: 400px;
    height: 90px;
    /* border: 2px solid rgb(98, 98, 98) */
    position: absolute;
    top: -45px;
}

#stream-Category
{
    width: 400px;
    height: 56px;
    
    
    font-weight: 1000;
    font-size: 20px;
    color: #a4a4a4;
    position: absolute;
    left: 25px;
    top: 210px; 
}

#stream-Category-Input
{
    position: absolute;
    left: 25px;
    top: 250px;
    background-color: black;
    /* border: 2px solid grey; */
    color: rgb(255, 255, 255);

    width: 350px;
}

#goLiveBtn
{
    background-color: rgb(255, 188, 63);
    width: 190px;
    height: 40px;
    border: none;

    border-radius: 10px;
    font-weight: 1000;
    font-size: 25px;
    color: #000000;
    position: absolute;
    left: 100px;
    top: 260px;   
}

</style> -->


<!-- 
<template>
    <NavBar/>
    <div id="startLiveContainer">
        <h1 id="startLiveTitle">Start Live</h1>
        <div id="form-Of-Live-Setup-Container">
            <form id="room-form" @submit.prevent="liveCreateRoomFormSubmit">
                <div id="streamName-Section">
                    <label id="stream-Title">Stream Title</label>
                    <input 
                        id="stream-Title-Input" 
                        v-model="streamTitle"
                        placeholder="Enter your stream title..."
                        maxlength="100"
                    />
                </div>
                
                <div id="streamDescription-Section">
                    <label id="stream-Description">Stream Description</label>
                    <textarea 
                        id="stream-Description-Input"
                        v-model="streamDescription"
                        placeholder="Describe what your stream is about..."
                        maxlength="500"
                        rows="3"
                    ></textarea>
                </div>
                
                <div id="streamCategory-Section">
                    <label id="stream-Category">Stream Categories (Select 2)</label>
                    <div id="category-grid">
                        <div 
                            v-for="category in categories" 
                            :key="category.id"
                            class="category-item"
                            :class="{ 'selected': selectedCategories.includes(category.id) }"
                            @click="toggleCategory(category.id)"
                        >
                            <div class="category-icon">{{ category.icon }}</div>
                            <span class="category-name">{{ category.name }}</span>
                        </div>
                    </div>
                    <div id="selected-count">{{ selectedCategories.length }}/2 selected</div>
                </div>

                <button 
                    id="goLiveBtn" 
                    type="submit"
                    :disabled="!canGoLive"
                    :class="{ 'disabled': !canGoLive }"
                >
                    {{ canGoLive ? 'Go Live' : 'Fill Required Fields' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed } from 'vue'

const streamTitle = ref('')
const streamDescription = ref('')
const selectedCategories = ref([])

const categories = ref([
    { id: 1, name: 'Gaming', icon: '🎮' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Art & Design', icon: '🎨' },
    { id: 4, name: 'Technology', icon: '💻' },
    { id: 5, name: 'Lifestyle', icon: '✨' }
])

const toggleCategory = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId)
    
    if (index > -1) {
        // Remove if already selected
        selectedCategories.value.splice(index, 1)
    } else if (selectedCategories.value.length < 2) {
        // Add if less than 2 selected
        selectedCategories.value.push(categoryId)
    }
}

const canGoLive = computed(() => {
    return streamTitle.value.trim() !== '' && 
           streamDescription.value.trim() !== '' && 
           selectedCategories.value.length === 2
})

const liveCreateRoomFormSubmit = () => {
    if (canGoLive.value) {
        const selectedCategoryNames = categories.value
            .filter(cat => selectedCategories.value.includes(cat.id))
            .map(cat => cat.name)
        
        console.log({
            title: streamTitle.value,
            description: streamDescription.value,
            categories: selectedCategoryNames
        })
        // Handle form submission here
    }
}
</script>

<style scoped>
#startLiveContainer
{
    width: 750px;
    height: 500px;
    position: absolute;
    left: 200px;
    top: 140px;
}

#startLiveTitle
{
    width: 400px;
    height: 56px;
    font-weight: 1000;
    font-size: 35px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 0px;
}

#form-Of-Live-Setup-Container
{
    width: 748px;
    height: 430px;
    border: 2px solid rgb(98, 98, 98);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8));
    backdrop-filter: blur(10px);
    position: absolute;
    top: 70px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

#room-form
{
    width: 748px;
    height: 430px;
    padding: 20px;
    box-sizing: border-box;
}

#streamName-Section
{
    width: 400px;
    height: 80px;
    position: absolute;
    top: 5px;
}

#stream-Title
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;
}

#stream-Title-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Title-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Title-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamDescription-Section
{
    width: 400px;
    height: 120px;
    position: absolute;
    top: 85px;
}

#stream-Description
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;   
}

#stream-Description-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 80px;
    padding: 15px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Description-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Description-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamCategory-Section
{
    width: 400px;
    height: 160px;
    position: absolute;
    top: 205px;
}

#stream-Category
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px; 
}

#category-grid
{
    position: absolute;
    left: 25px;
    top: 50px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    width: 350px;
}

.category-item
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.category-item:hover
{
    border-color: rgba(255, 188, 63, 0.7);
    background-color: rgba(40, 40, 40, 0.9);
    transform: translateY(-2px);
}

.category-item.selected
{
    border-color: rgb(255, 188, 63);
    background-color: rgba(255, 188, 63, 0.2);
    box-shadow: 0 0 15px rgba(255, 188, 63, 0.4);
}

.category-icon
{
    font-size: 20px;
    margin-bottom: 4px;
}

.category-name
{
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
}

#selected-count
{
    position: absolute;
    left: 25px;
    top: 125px;
    color: rgba(164, 164, 164, 0.8);
    font-size: 12px;
    font-weight: 500;
}

#goLiveBtn
{
    background: linear-gradient(135deg, rgb(255, 188, 63), rgb(255, 165, 0));
    width: 190px;
    height: 45px;
    border: none;
    border-radius: 12px;
    font-weight: 1000;
    font-size: 20px;
    color: #000000;
    position: absolute;
    left: 100px;
    top: 350px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 188, 63, 0.3);
}

#goLiveBtn:hover:not(.disabled)
{
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 188, 63, 0.4);
    background: linear-gradient(135deg, rgb(255, 200, 80), rgb(255, 180, 20));
}

#goLiveBtn.disabled
{
    background: rgba(98, 98, 98, 0.5);
    color: rgba(164, 164, 164, 0.8);
    cursor: not-allowed;
    box-shadow: none;
}

#goLiveBtn:active:not(.disabled)
{
    transform: translateY(0);
}
</style> -->


<!-- <template>
    <NavBar/>
    <div id="startLiveContainer">
        <h1 id="startLiveTitle">Start Live</h1>
        <div id="form-Of-Live-Setup-Container">
            <form id="room-form" @submit.prevent="liveCreateRoomFormSubmit">
                <div id="streamName-Section">
                    <label id="stream-Title">Stream Title</label>
                    <input 
                        id="stream-Title-Input" 
                        v-model="streamTitle"
                        placeholder="Enter your stream title..."
                        maxlength="100"
                    />
                </div>
                
                <div id="streamDescription-Section">
                    <label id="stream-Description">Stream Description</label>
                    <textarea 
                        id="stream-Description-Input"
                        v-model="streamDescription"
                        placeholder="Describe what your stream is about..."
                        maxlength="500"
                        rows="3"
                    ></textarea>
                </div>
                
                <div id="streamCategory-Section">
                    <label id="stream-Category">Stream Categories (Select 2)</label>
                    <div id="category-grid">
                        <div 
                            v-for="category in categories" 
                            :key="category.id"
                            class="category-item"
                            :class="{ 'selected': selectedCategories.includes(category.id) }"
                            @click="toggleCategory(category.id)"
                        >
                            <div class="category-icon">{{ category.icon }}</div>
                            <span class="category-name">{{ category.name }}</span>
                        </div>
                    </div>
                    <div id="selected-count">{{ selectedCategories.length }}/2 selected</div>
                </div>

                <div id="microphone-section">
                    <label id="microphone-label">Microphone</label>
                    <div id="microphone-container">
                        <select 
                            id="microphone-select"
                            v-model="selectedMicrophone"
                            @change="handleMicrophoneChange"
                            :disabled="!microphonePermission"
                        >
                            <option value="">{{ microphonePermission ? 'Select Microphone' : 'Getting microphones...' }}</option>
                            <option 
                                v-for="mic in availableMicrophones" 
                                :key="mic.deviceId" 
                                :value="mic.deviceId"
                            >
                                {{ mic.label || `Microphone ${mic.deviceId.slice(0, 8)}` }}
                            </option>
                        </select>
                        
                        <div id="mic-status" :class="microphoneStatus">
                            <div class="status-indicator"></div>
                            <span class="status-text">{{ getStatusText() }}</span>
                        </div>
                        
                        <div id="audio-visualizer" v-if="selectedMicrophone && audioStream">
                            <div class="audio-bar" v-for="i in 12" :key="i" :style="{ height: audioLevels[i] + '%' }"></div>
                        </div>
                    </div>
                </div>

                <button 
                    id="goLiveBtn" 
                    type="submit"
                    :disabled="!canGoLive"
                    :class="{ 'disabled': !canGoLive }"
                >
                    {{ canGoLive ? 'Go Live' : getButtonText() }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { reactive } from 'vue';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "vexaRooms");



const streamTitle = ref('')
const streamDescription = ref('')
const selectedCategories = ref([])
const selectedMicrophone = ref('')
const availableMicrophones = ref([])
const microphonePermission = ref(false)
const audioStream = ref(null)
const audioContext = ref(null)
const analyser = ref(null)
const audioLevels = ref(Array(12).fill(0))
const microphoneStatus = ref('inactive')

const categories = ref([
    { id: 1, name: 'Gaming', icon: '🎮' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Art & Design', icon: '🎨' },
    { id: 4, name: 'Technology', icon: '💻' },
    { id: 5, name: 'Lifestyle', icon: '✨' }
])

const toggleCategory = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId)
    
    if (index > -1) {
        // Remove if already selected
        selectedCategories.value.splice(index, 1)
    } else if (selectedCategories.value.length < 2) {
        // Add if less than 2 selected
        selectedCategories.value.push(categoryId)
    }
}

const canGoLive = computed(() => {
    return streamTitle.value.trim() !== '' && 
           streamDescription.value.trim() !== '' && 
           selectedCategories.value.length === 2 &&
           selectedMicrophone.value !== ''
})

const getButtonText = () => {
    if (!streamTitle.value.trim() || !streamDescription.value.trim()) {
        return 'Fill Required Fields'
    }
    if (selectedCategories.value.length !== 2) {
        return 'Select 2 Categories'
    }
    if (!selectedMicrophone.value) {
        return 'Select Microphone'
    }
    return 'Go Live'
}

const getStatusText = () => {
    switch (microphoneStatus.value) {
        case 'inactive': return 'No microphone selected'
        case 'requesting': return 'Requesting permission...'
        case 'active': return 'Microphone active'
        case 'error': return 'Permission denied'
        default: return 'Unknown status'
    }
}

const getMicrophones = async () => {
    try {
        // Request microphone permission first
        microphoneStatus.value = 'requesting'
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        microphonePermission.value = true
        
        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        availableMicrophones.value = devices.filter(device => device.kind === 'audioinput')
        
        // Stop the temporary stream
        stream.getTracks().forEach(track => track.stop())
        microphoneStatus.value = 'inactive'
    } catch (error) {
        console.error('Error accessing microphones:', error)
        microphonePermission.value = false
        microphoneStatus.value = 'error'
    }
}

const handleMicrophoneChange = async () => {
    if (!selectedMicrophone.value) {
        stopAudioStream()
        return
    }

    try {
        microphoneStatus.value = 'requesting'
        
        // Stop previous stream
        stopAudioStream()
        
        // Start new stream with selected microphone
        const constraints = {
            audio: {
                deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined
            }
        }
        
        audioStream.value = await navigator.mediaDevices.getUserMedia(constraints)
        microphoneStatus.value = 'active'
        
        // Set up audio visualization
        setupAudioVisualization()
    } catch (error) {
        console.error('Error starting microphone:', error)
        microphoneStatus.value = 'error'
        selectedMicrophone.value = ''
    }
}

const setupAudioVisualization = () => {
    if (!audioStream.value) return
    
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    const source = audioContext.value.createMediaStreamSource(audioStream.value)
    
    source.connect(analyser.value)
    analyser.value.fftSize = 32
    
    const bufferLength = analyser.value.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const updateLevels = () => {
        if (!analyser.value) return
        
        analyser.value.getByteFrequencyData(dataArray)
        
        // Update audio levels for visualization
        for (let i = 0; i < 12; i++) {
            const index = Math.floor((i / 12) * bufferLength)
            audioLevels.value[i] = (dataArray[index] / 255) * 100
        }
        
        requestAnimationFrame(updateLevels)
    }
    
    updateLevels()
}

const stopAudioStream = () => {
    if (audioStream.value) {
        audioStream.value.getTracks().forEach(track => track.stop())
        audioStream.value = null
    }
    if (audioContext.value) {
        audioContext.value.close()
        audioContext.value = null
    }
    analyser.value = null
    audioLevels.value = Array(12).fill(0)
}

onMounted(() => {
    getMicrophones()
})

onUnmounted(() => {
    stopAudioStream()
})

const liveCreateRoomFormSubmit = () => {
    if (canGoLive.value) {
        const selectedCategoryNames = categories.value
            .filter(cat => selectedCategories.value.includes(cat.id))
            .map(cat => cat.name)
        
        console.log({
            title: streamTitle.value,
            description: streamDescription.value,
            categories: selectedCategoryNames
        })
        // Handle form submission here
    }
}
</script>

<style scoped>
#startLiveContainer
{
    width: 900px;
    height: 500px;
    position: absolute;
    left: 200px;
    top: 140px;
}

#startLiveTitle
{
    width: 400px;
    height: 56px;
    font-weight: 1000;
    font-size: 35px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 0px;
}

#form-Of-Live-Setup-Container
{
    width: 900px;
    height: 430px;
    border: 2px solid rgb(98, 98, 98);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8));
    backdrop-filter: blur(10px);
    position: absolute;
    top: 70px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

#room-form
{
    width: 900px;
    height: 430px;
    padding: 20px;
    box-sizing: border-box;
}

#streamName-Section
{
    width: 400px;
    height: 80px;
    position: absolute;
    top: 5px;
}

#stream-Title
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;
}

#stream-Title-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Title-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Title-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamDescription-Section
{
    width: 400px;
    height: 120px;
    position: absolute;
    top: 85px;
}

#stream-Description
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;   
}

#stream-Description-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 80px;
    padding: 15px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Description-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Description-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamCategory-Section
{
    width: 400px;
    height: 160px;
    position: absolute;
    top: 205px;
}

#stream-Category
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px; 
}

#category-grid
{
    position: absolute;
    left: 25px;
    top: 50px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    width: 350px;
}

.category-item
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.category-item:hover
{
    border-color: rgba(255, 188, 63, 0.7);
    background-color: rgba(40, 40, 40, 0.9);
    transform: translateY(-2px);
}

.category-item.selected
{
    border-color: rgb(255, 188, 63);
    background-color: rgba(255, 188, 63, 0.2);
    box-shadow: 0 0 15px rgba(255, 188, 63, 0.4);
}

.category-icon
{
    font-size: 20px;
    margin-bottom: 4px;
}

.category-name
{
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
}

#selected-count
{
    position: absolute;
    left: 25px;
    top: 125px;
    color: rgba(164, 164, 164, 0.8);
    font-size: 12px;
    font-weight: 500;
}

#goLiveBtn
{
    background: linear-gradient(135deg, rgb(255, 188, 63), rgb(255, 165, 0));
    width: 190px;
    height: 45px;
    border: none;
    border-radius: 12px;
    font-weight: 1000;
    font-size: 20px;
    color: #000000;
    position: absolute;
    left: 100px;
    top: 350px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 188, 63, 0.3);
}

#goLiveBtn:hover:not(.disabled)
{
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 188, 63, 0.4);
    background: linear-gradient(135deg, rgb(255, 200, 80), rgb(255, 180, 20));
}

#goLiveBtn.disabled
{
    background: rgba(98, 98, 98, 0.5);
    color: rgba(164, 164, 164, 0.8);
    cursor: not-allowed;
    box-shadow: none;
}

#goLiveBtn:active:not(.disabled)
{
    transform: translateY(0);
}

/* Microphone Section Styles */
#microphone-section
{
    width: 300px;
    height: 370px;
    position: absolute;
    right: 25px;
    top: 5px;
}

#microphone-label
{
    width: 300px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 21px;
}

#microphone-container
{
    position: absolute;
    top: 50px;
    left: 0px;
    width: 280px;
    height: 320px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
}

#microphone-select
{
    width: 100%;
    height: 40px;
    background-color: rgba(20, 20, 20, 0.9);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    padding: 0 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
}

#microphone-select:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#microphone-select:disabled
{
    opacity: 0.6;
    cursor: not-allowed;
}

#microphone-select option
{
    background-color: rgba(20, 20, 20, 0.9);
    color: rgb(255, 255, 255);
}

#mic-status
{
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-indicator
{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.inactive .status-indicator
{
    background-color: #666;
}

.requesting .status-indicator
{
    background-color: #ffbc3f;
    animation: pulse 1.5s infinite;
}

.active .status-indicator
{
    background-color: #4CAF50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.error .status-indicator
{
    background-color: #f44336;
}

.status-text
{
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 500;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

#audio-visualizer
{
    margin-top: 20px;
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 3px;
    height: 80px;
    padding: 10px;
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 8px;
}

.audio-bar
{
    width: 8px;
    background: linear-gradient(to top, #4CAF50, #81C784, #A5D6A7);
    border-radius: 4px;
    min-height: 4px;
    transition: height 0.1s ease;
}

#goLiveBtn
{
    background: linear-gradient(135deg, rgb(255, 188, 63), rgb(255, 165, 0));
    width: 190px;
    height: 45px;
    border: none;
    border-radius: 12px;
    font-weight: 1000;
    font-size: 18px;
    color: #000000;
    position: absolute;
    left: 100px;
    top: 350px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 188, 63, 0.3);
}
</style> -->

<!-------------------------------------------------------------->
<!-- <template>
    <NavBar/>
    <div id="startLiveContainer">
        <h1 id="startLiveTitle">Start Live</h1>
        <div id="form-Of-Live-Setup-Container">
            <form id="room-form" @submit.prevent="liveCreateRoomFormSubmit">
                <div id="streamName-Section">
                    <label id="stream-Title">Stream Title</label>
                    <input 
                        id="stream-Title-Input" 
                        v-model="streamTitle"
                        placeholder="Enter your stream title..."
                        maxlength="100"
                    />
                </div>
                
                <div id="streamDescription-Section">
                    <label id="stream-Description">Stream Description</label>
                    <textarea 
                        id="stream-Description-Input"
                        v-model="streamDescription"
                        placeholder="Describe what your stream is about..."
                        maxlength="500"
                        rows="3"
                    ></textarea>
                </div>
                
                <div id="streamCategory-Section">
                    <label id="stream-Category">Stream Categories (Select 2)</label>
                    <div id="category-grid">
                        <div 
                            v-for="category in categories" 
                            :key="category.id"
                            class="category-item"
                            :class="{ 'selected': selectedCategories.includes(category.id) }"
                            @click="toggleCategory(category.id)"
                        >
                            <div class="category-icon">{{ category.icon }}</div>
                            <span class="category-name">{{ category.name }}</span>
                        </div>
                    </div>
                    <div id="selected-count">{{ selectedCategories.length }}/2 selected</div>
                </div>

                <div id="microphone-section">
                    <label id="microphone-label">Microphone</label>
                    <div id="microphone-container">
                        <select 
                            id="microphone-select"
                            v-model="selectedMicrophone"
                            @change="handleMicrophoneChange"
                            :disabled="!microphonePermission"
                        >
                            <option value="">{{ microphonePermission ? 'Select Microphone' : 'Getting microphones...' }}</option>
                            <option 
                                v-for="mic in availableMicrophones" 
                                :key="mic.deviceId" 
                                :value="mic.deviceId"
                            >
                                {{ mic.label || `Microphone ${mic.deviceId.slice(0, 8)}` }}
                            </option>
                        </select>
                        
                        <div id="mic-status" :class="microphoneStatus">
                            <div class="status-indicator"></div>
                            <span class="status-text">{{ getStatusText() }}</span>
                        </div>
                        
                        <div id="audio-visualizer" v-if="selectedMicrophone && audioStream">
                            <div class="audio-bar" v-for="i in 12" :key="i" :style="{ height: audioLevels[i] + '%' }"></div>
                        </div>
                    </div>
                </div>

                <button 
                    id="goLiveBtn" 
                    type="submit"
                    :disabled="!canGoLive"
                    :class="{ 'disabled': !canGoLive }"
                >
                    {{ canGoLive ? 'Go Live' : getButtonText() }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "vexaUsers");
const roomsCol = collection(db, "vexaRooms");

// Router instance
const router = useRouter();

const streamTitle = ref('')
const streamDescription = ref('')
const selectedCategories = ref([])
const selectedMicrophone = ref('')
const availableMicrophones = ref([])
const microphonePermission = ref(false)
const audioStream = ref(null)
const audioContext = ref(null)
const analyser = ref(null)
const audioLevels = ref(Array(12).fill(0))
const microphoneStatus = ref('inactive')

const categories = ref([
    { id: 1, name: 'Gaming', icon: '🎮' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Art & Design', icon: '🎨' },
    { id: 4, name: 'Technology', icon: '💻' },
    { id: 5, name: 'Lifestyle', icon: '✨' }
])

const toggleCategory = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId)
    
    if (index > -1) {
        // Remove if already selected
        selectedCategories.value.splice(index, 1)
    } else if (selectedCategories.value.length < 2) {
        // Add if less than 2 selected
        selectedCategories.value.push(categoryId)
    }
}

const canGoLive = computed(() => {
    return streamTitle.value.trim() !== '' && 
           streamDescription.value.trim() !== '' && 
           selectedCategories.value.length === 2 &&
           selectedMicrophone.value !== ''
})

const getButtonText = () => {
    if (!streamTitle.value.trim() || !streamDescription.value.trim()) {
        return 'Fill Required Fields'
    }
    if (selectedCategories.value.length !== 2) {
        return 'Select 2 Categories'
    }
    if (!selectedMicrophone.value) {
        return 'Select Microphone'
    }
    return 'Go Live'
}

const getStatusText = () => {
    switch (microphoneStatus.value) {
        case 'inactive': return 'No microphone selected'
        case 'requesting': return 'Requesting permission...'
        case 'active': return 'Microphone active'
        case 'error': return 'Permission denied'
        default: return 'Unknown status'
    }
}

const getMicrophones = async () => {
    try {
        // Request microphone permission first
        microphoneStatus.value = 'requesting'
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        microphonePermission.value = true
        
        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        availableMicrophones.value = devices.filter(device => device.kind === 'audioinput')
        
        // Stop the temporary stream
        stream.getTracks().forEach(track => track.stop())
        microphoneStatus.value = 'inactive'
    } catch (error) {
        console.error('Error accessing microphones:', error)
        microphonePermission.value = false
        microphoneStatus.value = 'error'
    }
}

const handleMicrophoneChange = async () => {
    if (!selectedMicrophone.value) {
        stopAudioStream()
        return
    }

    try {
        microphoneStatus.value = 'requesting'
        
        // Stop previous stream
        stopAudioStream()
        
        // Start new stream with selected microphone
        const constraints = {
            audio: {
                deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined
            }
        }
        
        audioStream.value = await navigator.mediaDevices.getUserMedia(constraints)
        microphoneStatus.value = 'active'
        
        // Set up audio visualization
        setupAudioVisualization()
    } catch (error) {
        console.error('Error starting microphone:', error)
        microphoneStatus.value = 'error'
        selectedMicrophone.value = ''
    }
}

const setupAudioVisualization = () => {
    if (!audioStream.value) return
    
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    const source = audioContext.value.createMediaStreamSource(audioStream.value)
    
    source.connect(analyser.value)
    analyser.value.fftSize = 32
    
    const bufferLength = analyser.value.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const updateLevels = () => {
        if (!analyser.value) return
        
        analyser.value.getByteFrequencyData(dataArray)
        
        // Update audio levels for visualization
        for (let i = 0; i < 12; i++) {
            const index = Math.floor((i / 12) * bufferLength)
            audioLevels.value[i] = (dataArray[index] / 255) * 100
        }
        
        requestAnimationFrame(updateLevels)
    }
    
    updateLevels()
}

const stopAudioStream = () => {
    if (audioStream.value) {
        audioStream.value.getTracks().forEach(track => track.stop())
        audioStream.value = null
    }
    if (audioContext.value) {
        audioContext.value.close()
        audioContext.value = null
    }
    analyser.value = null
    audioLevels.value = Array(12).fill(0)
}

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Helper function to generate unique Room ID
function generateRoomID() {
    return 'vexaroom_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
}

// Helper function to get user data by username
async function getUserByUsername(username) {
    const q = query(usersCol, where("username", "==", username));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        return {
            id: userDoc.id,
            docRef: userDoc.ref,
            ...userDoc.data()
        };
    }
    return null;
}

// Updated form submission function
const liveCreateRoomFormSubmit = async () => {
    if (!canGoLive.value) {
        return;
    }

    try {
        // Get current user from cookie
        const currentUsername = getCookie('vexaUser');
        if (!currentUsername) {
            alert('Please log in to start a live stream.');
            router.push('/login');
            return;
        }

        // Get user data from Firebase
        const userData = await getUserByUsername(currentUsername);
        if (!userData) {
            alert('User data not found. Please log in again.');
            router.push('/login');
            return;
        }

        // Get selected category names
        const selectedCategoryNames = categories.value
            .filter(cat => selectedCategories.value.includes(cat.id))
            .map(cat => cat.name);

        // Generate unique room ID
        const roomID = generateRoomID();

        // Create room data object
        const roomData = {
            RoomID: roomID,
            'Room-Owner': userData.username,
            'Room-Owner-PeerID': userData.PeerID,
            'Room-Name': streamTitle.value.trim(),
            'Room-Desc': streamDescription.value.trim(),
            'Room-Category': selectedCategoryNames,
            'Participants-Usernames': [userData.username], // Owner is first participant
            createdAt: new Date(),
            isActive: true,
            startTime: new Date()
        };

        // Add room to Firebase
        const docRef = await addDoc(roomsCol, roomData);
        
        console.log('Room created successfully:', {
            documentId: docRef.id,
            roomData: roomData
        });

        // Update user's live status
        await updateDoc(userData.docRef, {
            isLiveNow: true,
            currentRoomID: roomID
        });

        alert(`Live stream started successfully! Room ID: ${roomID}`);
        
        // Optionally redirect to the live stream page
        // router.push(`/live/${roomID}`);
        
        // Stop audio stream since we're going live
        stopAudioStream();
        
    } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to start live stream. Please try again.');
    }
}

onMounted(() => {
    getMicrophones()
})

onUnmounted(() => {
    stopAudioStream()
})
</script> -->

<template>
  <NavBar />
  <div id="startLiveContainer">
    <h1 id="startLiveTitle">Start Live</h1>
    <div id="form-Of-Live-Setup-Container">
      <form id="room-form" @submit.prevent="liveCreateRoomFormSubmit">
        <!-- Stream Title -->
        <div id="streamName-Section">
          <label id="stream-Title">Stream Title</label>
          <input
            id="stream-Title-Input"
            v-model="streamTitle"
            placeholder="Enter your stream title..."
            maxlength="100"
          />
        </div>
        
        <!-- Stream Description -->
        <div id="streamDescription-Section">
          <label id="stream-Description">Stream Description</label>
          <textarea
            id="stream-Description-Input"
            v-model="streamDescription"
            placeholder="Describe what your stream is about..."
            maxlength="500"
            rows="3"
          ></textarea>
        </div>
        
        <!-- Categories -->
        <div id="streamCategory-Section">
          <label id="stream-Category">Stream Categories (Select 2)</label>
          <div id="category-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ 'selected': selectedCategories.includes(category.id) }"
              @click="toggleCategory(category.id)"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
          <div id="selected-count">{{ selectedCategories.length }}/2 selected</div>
        </div>

        <!-- Microphone -->
        <div id="microphone-section">
          <label id="microphone-label">Microphone</label>
          <div id="microphone-container">
            <select
              id="microphone-select"
              v-model="selectedMicrophone"
              @change="handleMicrophoneChange"
              :disabled="!microphonePermission"
            >
              <option value="">
                {{ microphonePermission ? 'Select Microphone' : 'Getting microphones...' }}
              </option>
              <option
                v-for="mic in availableMicrophones"
                :key="mic.deviceId"
                :value="mic.deviceId"
              >
                {{ mic.label || (`Microphone ${mic.deviceId.slice(0, 8)}`) }}
              </option>
            </select>

            <div id="mic-status" :class="microphoneStatus">
              <div class="status-indicator"></div>
              <span class="status-text">{{ getStatusText() }}</span>
            </div>

            <div id="audio-visualizer" v-if="selectedMicrophone && audioStream">
              <div
                class="audio-bar"
                v-for="i in 12"
                :key="i"
                :style="{ height: audioLevels[i] + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Go Live Button -->
        <button
          id="goLiveBtn"
          type="submit"
          :disabled="!canGoLive"
          :class="{ 'disabled': !canGoLive }"
        >
          {{ canGoLive ? 'Go Live' : getButtonText() }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQpMoxAKJrkave5D9e8CqKeLffCCUeGAw",
  authDomain: "vexa-d596e.firebaseapp.com",
  projectId: "vexa-d596e",
  storageBucket: "vexa-d596e.appspot.com",
  messagingSenderId: "79833394084",
  appId: "1:79833394084:web:1e5f41859b4125ef342f31"
}

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const usersCol = collection(db, 'vexaUsers')
const roomsCol = collection(db, 'vexaRooms')

// Router instance
const router = useRouter()

// Reactive state
const streamTitle = ref('')
const streamDescription = ref('')
const selectedCategories = ref([])
const selectedMicrophone = ref('')
const availableMicrophones = ref([])
const microphonePermission = ref(false)
const audioStream = ref(null)
const audioContext = ref(null)
const analyser = ref(null)
const audioLevels = ref(Array(12).fill(0))
const microphoneStatus = ref('inactive')

// Categories
const categories = ref([
  { id: 1, name: 'Gaming', icon: '🎮' },
  { id: 2, name: 'Music', icon: '🎵' },
  { id: 3, name: 'Art & Design', icon: '🎨' },
  { id: 4, name: 'Technology', icon: '💻' },
  { id: 5, name: 'Lifestyle', icon: '✨' }
])

// Toggle category
function toggleCategory(categoryId) {
  const idx = selectedCategories.value.indexOf(categoryId)
  if (idx > -1) selectedCategories.value.splice(idx, 1)
  else if (selectedCategories.value.length < 2) selectedCategories.value.push(categoryId)
}

// Button & form validation
const canGoLive = computed(() =>
  streamTitle.value.trim() !== '' &&
  streamDescription.value.trim() !== '' &&
  selectedCategories.value.length === 2 &&
  selectedMicrophone.value !== ''
)

function getButtonText() {
  if (!streamTitle.value.trim() || !streamDescription.value.trim()) return 'Fill Required Fields'
  if (selectedCategories.value.length !== 2) return 'Select 2 Categories'
  if (!selectedMicrophone.value) return 'Select Microphone'
  return 'Go Live'
}

function getStatusText() {
  switch (microphoneStatus.value) {
    case 'inactive': return 'No microphone selected'
    case 'requesting': return 'Requesting permission...'
    case 'active': return 'Microphone active'
    case 'error': return 'Permission denied'
    default: return 'Unknown status'
  }
}

// Microphone handling
async function getMicrophones() {
  try {
    microphoneStatus.value = 'requesting'
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    microphonePermission.value = true
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableMicrophones.value = devices.filter(d => d.kind === 'audioinput')
    stream.getTracks().forEach(t => t.stop())
    microphoneStatus.value = 'inactive'
  } catch (e) {
    console.error("Error accessing microphones:", e)
    microphonePermission.value = false
    microphoneStatus.value = 'error'
  }
}

async function handleMicrophoneChange() {
  if (!selectedMicrophone.value) {
    stopAudioStream()
    return
  }
  try {
    microphoneStatus.value = 'requesting'
    stopAudioStream()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: selectedMicrophone.value } } })
    audioStream.value = stream
    microphoneStatus.value = 'active'
    setupAudioVisualization()
  } catch (e) {
    console.error("Error starting microphone:", e)
    microphoneStatus.value = 'error'
    selectedMicrophone.value = ''
  }
}

// function setupAudioVisualization() {
//   if (!audioStream.value) return
//   audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
//   analyser.value = audioContext.value.createAnalyser()
//   const src = audioContext.value.createMediaStreamSource(audioStream.value)
//   src.connect(analyser.value)
//   analyser.value.fftSize = 32
//   const bufLen = analyser.value.frequencyBinCount
//   const dataArr = new Uint8Array(bufLen)
//   function update() {
//     analyser.value.getByteFrequencyData(dataArr)
//     for (let i = 0; i < 12; i++) {
//       const idx = Math.floor((i / 12) * bufLen)
//       audioLevels.value[i] = (dataArr[idx] / 255) * 100
//     }
//     requestAnimationFrame(update)
//   }
//   update()
// }

function setupAudioVisualization() {
  if (!audioStream.value) return

  audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
  analyser.value = audioContext.value.createAnalyser()

  const src = audioContext.value.createMediaStreamSource(audioStream.value)
  src.connect(analyser.value)

  analyser.value.fftSize = 32
  const bufLen = analyser.value.frequencyBinCount
  const dataArr = new Uint8Array(bufLen)

  function update() {
    // ✅ SAFETY CHECK: avoid calling if analyser is null or destroyed
    if (!analyser.value || !audioLevels.value) return

    analyser.value.getByteFrequencyData(dataArr)
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor((i / 12) * bufLen)
      audioLevels.value[i] = (dataArr[idx] / 255) * 100
    }

    requestAnimationFrame(update)
  }

  update()
}


function stopAudioStream() {
  if (audioStream.value) audioStream.value.getTracks().forEach(t => t.stop())
  if (audioContext.value) audioContext.value.close()
  audioStream.value = null
  audioContext.value = null
  analyser.value = null
  audioLevels.value = Array(12).fill(0)
}

// Cookie & user lookup
function getCookie(name) {
  const v = `; ${document.cookie}`
  const parts = v.split(`; ${name}=`)
  return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : null
}

async function getUserByUsername(username) {
  const q = query(usersCol, where('username', '==', username))
  const snap = await getDocs(q)
  if (!snap.empty) {
    const docSnap = snap.docs[0]
    return { id: docSnap.id, docRef: docSnap.ref, ...docSnap.data() }
  }
  return null
}

function generateRoomID() {
  return 'vexaroom_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now()
}

// Form submit
const liveCreateRoomFormSubmit = async () => {
  if (!canGoLive.value) return

  try {
    const currentUsername = getCookie('vexaUser')
    if (!currentUsername) {
      alert('Please log in to start a live stream.')
      return router.push('/')
    }

    const userData = await getUserByUsername(currentUsername)
    if (!userData) {
      alert('User data not found. Please log in again.')
      return router.push('/')
    }

    const catNames = categories.value
      .filter(c => selectedCategories.value.includes(c.id))
      .map(c => c.name)

    const roomID = generateRoomID()
    const roomData = {
      RoomID: roomID,
      'Room-Owner': userData.username,
      'Room-Owner-PeerID': userData.PeerID,
      'Room-Name': streamTitle.value.trim(),
      'Room-Desc': streamDescription.value.trim(),
      'Room-Category': catNames,
      'Participants-Usernames': [userData.username],
      createdAt: new Date(),
      isActive: true,
      startTime: new Date()
    }

    // Write room under username
    await setDoc(doc(db, 'vexaRooms', userData.username), roomData)
    
    // Update user's live status
    await updateDoc(userData.docRef, {
      isLiveNow: true,
      currentRoomID: roomID
    })

    alert(`Live stream started! Room owner: ${userData.username}`)
    router.push({ name: 'AudioLiveView', params: { idOfOwner: userData.id, owner: userData.username } })
    // router.push({ path: `/${userData.id}/${userData.username}` })


    stopAudioStream()
  } catch (e) {
    console.error('Error creating room:', e)
    alert('Failed to start live stream. Please try again.')
  }
}

onMounted(() => getMicrophones())
onUnmounted(() => stopAudioStream())
</script>

<style scoped>
#startLiveContainer
{
    width: 900px;
    height: 500px;
    position: absolute;
    left: 200px;
    top: 140px;
}

#startLiveTitle
{
    width: 400px;
    height: 56px;
    font-weight: 1000;
    font-size: 35px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 0px;
}

#form-Of-Live-Setup-Container
{
    width: 900px;
    height: 430px;
    border: 2px solid rgb(98, 98, 98);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 40, 40, 0.8));
    backdrop-filter: blur(10px);
    position: absolute;
    top: 70px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

#room-form
{
    width: 900px;
    height: 430px;
    padding: 20px;
    box-sizing: border-box;
}

#streamName-Section
{
    width: 400px;
    height: 80px;
    position: absolute;
    top: 5px;
}

#stream-Title
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;
}

#stream-Title-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Title-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Title-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamDescription-Section
{
    width: 400px;
    height: 120px;
    position: absolute;
    top: 85px;
}

#stream-Description
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;   
}

#stream-Description-Input
{
    position: absolute;
    left: 25px;
    top: 50px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 350px;
    height: 80px;
    padding: 15px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#stream-Description-Input:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#stream-Description-Input::placeholder
{
    color: rgba(164, 164, 164, 0.7);
}

#streamCategory-Section
{
    width: 400px;
    height: 160px;
    position: absolute;
    top: 205px;
}

#stream-Category
{
    width: 400px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px; 
}

#category-grid
{
    position: absolute;
    left: 25px;
    top: 50px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    width: 350px;
}

.category-item
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.category-item:hover
{
    border-color: rgba(255, 188, 63, 0.7);
    background-color: rgba(40, 40, 40, 0.9);
    transform: translateY(-2px);
}

.category-item.selected
{
    border-color: rgb(255, 188, 63);
    background-color: rgba(255, 188, 63, 0.2);
    box-shadow: 0 0 15px rgba(255, 188, 63, 0.4);
}

.category-icon
{
    font-size: 20px;
    margin-bottom: 4px;
}

.category-name
{
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    font-weight: 600;
}

#selected-count
{
    position: absolute;
    left: 25px;
    top: 125px;
    color: rgba(164, 164, 164, 0.8);
    font-size: 12px;
    font-weight: 500;
}

#goLiveBtn
{
    background: linear-gradient(135deg, rgb(255, 188, 63), rgb(255, 165, 0));
    width: 190px;
    height: 45px;
    border: none;
    border-radius: 12px;
    font-weight: 1000;
    font-size: 20px;
    color: #000000;
    position: absolute;
    left: 100px;
    top: 350px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 188, 63, 0.3);
}

#goLiveBtn:hover:not(.disabled)
{
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 188, 63, 0.4);
    background: linear-gradient(135deg, rgb(255, 200, 80), rgb(255, 180, 20));
}

#goLiveBtn.disabled
{
    background: rgba(98, 98, 98, 0.5);
    color: rgba(164, 164, 164, 0.8);
    cursor: not-allowed;
    box-shadow: none;
}

#goLiveBtn:active:not(.disabled)
{
    transform: translateY(0);
}

/* Microphone Section Styles */
#microphone-section
{
    width: 300px;
    height: 370px;
    position: absolute;
    right: 25px;
    top: 5px;
}

#microphone-label
{
    width: 300px;
    height: 30px;
    font-weight: 1000;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 0px;
    top: 21px;
}

#microphone-container
{
    position: absolute;
    top: 50px;
    left: 0px;
    width: 280px;
    height: 320px;
    background-color: rgba(30, 30, 30, 0.8);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
}

#microphone-select
{
    width: 100%;
    height: 40px;
    background-color: rgba(20, 20, 20, 0.9);
    border: 2px solid rgba(98, 98, 98, 0.5);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    padding: 0 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
}

#microphone-select:focus
{
    outline: none;
    border-color: rgb(255, 188, 63);
    box-shadow: 0 0 10px rgba(255, 188, 63, 0.3);
}

#microphone-select:disabled
{
    opacity: 0.6;
    cursor: not-allowed;
}

#microphone-select option
{
    background-color: rgba(20, 20, 20, 0.9);
    color: rgb(255, 255, 255);
}

#mic-status
{
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-indicator
{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.inactive .status-indicator
{
    background-color: #666;
}

.requesting .status-indicator
{
    background-color: #ffbc3f;
    animation: pulse 1.5s infinite;
}

.active .status-indicator
{
    background-color: #4CAF50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.error .status-indicator
{
    background-color: #f44336;
}

.status-text
{
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 500;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

#audio-visualizer
{
    margin-top: 20px;
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 3px;
    height: 80px;
    padding: 10px;
    background-color: rgba(10, 10, 10, 0.5);
    border-radius: 8px;
}

.audio-bar
{
    width: 8px;
    background: linear-gradient(to top, #4CAF50, #81C784, #A5D6A7);
    border-radius: 4px;
    min-height: 4px;
    transition: height 0.1s ease;
}
</style>