<template>
    <NavBar/>
    <div id="containerOfStreams">

    </div>
</template>


<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue'

const router = useRouter();


// Cookie getter
function getCookie() {
  const cookies = document.cookie.split('; ');
  const result = {};
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key && value !== undefined) {
      result[key] = decodeURIComponent(value);
    }
  }
  return result;
}

// Redirect if not logged in
onMounted(() => {
  const cookies = getCookie();
  const username = cookies.vexaUser;

  if (!username) {
    alert("You must be logged in to access this page.");
    router.push('/');
  }
});
</script>


<style scoped>

#containerOfStreams
{
    width: 990px;
    height: 450px;
    background-color: rgb(11, 11, 11);

    position: absolute;
    left: 100px;
    top: 150px;
}

</style>
