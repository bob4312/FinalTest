<template>
    <div id="formsContainer">
        <div id="registerContainer">
            <Register/>
        </div>    

        <div id="loginContainer">
            <Login/>
        </div>
    </div>
</template>

<script setup>
import Register from '../components/RegisterLoginComps/Register.vue'
import Login from '../components/RegisterLoginComps/Login.vue'
</script>

<style scoped>

#formsContainer
{
    width: 950px;
    height: 500px;
    background-color: #0e1925;

    position: absolute;
    top: 80px;
    left: 120px;
    border-radius: 45px;
}

</style>