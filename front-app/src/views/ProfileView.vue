<template>
    <NavBar/>
    <div id="profileContainer">
        <div id="personSection">
            <div id="circle"></div>
            <div id="textsContainer">
                <h1 id="profileName">Yoav Goldstein</h1>
                <h2 id="followersCount">0 followers</h2>
                <h2 id="profileDescription">Descriptions</h2>
            </div>
            <div id="btnsContainer">
                <button id="profileSettingsBtn">Settings</button>
                <router-link to="/startlive">
                    <button id="goLiveBtn">GoLive</button>
                </router-link>
            </div>
        </div>
    </div>
</template>


<script setup>
import NavBar from '../components/NavBar.vue'


</script>


<style scoped>
#profileContainer
{
    background-color: rgb(11, 11, 11);
    width: 990px;
    height: 500px;

    position: absolute;
    left: 100px;
    top: 130px;
}

#circle
{
    background-color: rgb(0, 0, 0);
    border: 2px solid rgb(6, 74, 97);
    width: 110px;
    height: 110px;

    border-radius: 60px;

    position: absolute;
    left: 100px;
    top: 25px;
}

#textsContainer
{
    /* background-color: aquamarine; */
    /* border: 1px solid rgb(66, 48, 48); */
    width: 600px;
    height: 170px;

    position: absolute;
    left: 230px;
}

#profileName
{
     /* border: 1px solid rgb(66, 48, 48); */
    width: 400px;
    height: 56px;
    
    
    font-weight: 1000;
    font-size: 35px;
    color: #ffffff;
    position: absolute;
    left: 25px;
    top: 21px;
    
}

#followersCount
{     
    /* border: 1px solid rgb(66, 48, 48); */
    width: 400px;
    height: 30px;

    
    font-weight: 1000;
    font-size: 15px;
    color: #b1b1b1;
    position: absolute;
    left: 28px;
    top: 78px;
}

#profileDescription
{
    /* border: 1px solid rgb(66, 48, 48); */
    width: 400px;
    height: 50px;

    
    font-weight: 1000;
    font-size: 11px;
    color: #b1b1b1;
    position: absolute;
    left: 28px;
    top: 110px;
}

#btnsContainer
{
    position: absolute;
    top: -10px;
}

#profileSettingsBtn
{
    width: 100px;
    height: 30px;

    position: absolute;
    top: 100px;
    left: 700px;

    font-size: 20px;
    font-weight: 800;
    background-color: rgb(6, 74, 97);
    border: none;
}

#goLiveBtn
{
    width: 100px;
    height: 30px;

    position: absolute;
    top: 60px;
    left: 700px;

    font-size: 20px;
    font-weight: 800;
    background-color: rgb(97, 6, 6);
    border: none;
}

</style>