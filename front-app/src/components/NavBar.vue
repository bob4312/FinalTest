<template>

   <div id="container">
        <div id="logo">
            <img id="logo" src="../assets/VexaLogoStartup.webp">
            <h1 id="title">VEXA</h1>
        </div>

        <div id="buttons">
            <router-link to="/home">
                <button id="goBackBtn" style="background: none; border: none;">Home</button>
            </router-link>

            <!-- <router-link to="/browse"> -->
                <button id="networkBtn" style="background: none; border: none;">Network</button>
            <!-- </router-link> -->

            <router-link to="/profile">
                <button id="accountBtn" style="background: none; border: none;">Account</button>
            </router-link>
        </div>

        <div id="actions">
        </div>
   </div>




</template>

<style scoped>
#container
{
    width: 1356px;
    height: 60px;
    position: absolute;
    left: 0px;
    top: 0px;
    /* border-radius: 15%; */
    /* border: 2px solid orange; */
    background-color: #171717;

    
}



#logo
{
    width: 45px;
    height: 45px;
    /* background-color: rgb(0, 119, 255); */
    border-radius: 30px;
    position: absolute;
    
    top: 5px;
    left: 10px;
}

#title
{
    font-weight: 1000;
    font-size: 20px;
    color: #ffffff;
    position: absolute;
    left: 65px;
    top: 12px;
    
}

#buttons
{
    position: absolute;
    left: 170px;
    top: -2px;
}

#goBackBtn
{
    position: absolute;
    top: 25px;
    left: 341px;
    font-weight: 1000;
    font-size: 15px;
    color: #767676;

}

#networkBtn
{
    position: absolute;
    top: 25px;
    left: 421px;
    font-weight: 1000;
    font-size: 15px;
    color: #767676;

}

#accountBtn
{
    position: absolute;
    top: 25px;
    left: 519px;
    font-weight: 1000;
    font-size: 15px;
    color: #767676;

}

</style>