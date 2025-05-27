<template>

   <div id="container">
        <div id="logo">
            <img id="logo" src="../assets/VexaLogoStartup.webp">
            <h1 id="title">VEXA</h1>
        </div>

        <div id="buttons">
            <router-link to="/home">
                <button id="homeBtn" style="background: none; border: none;">Home</button>
            </router-link>

            <router-link to="/browse">
                <button id="browseBtn" style="background: none; border: none;">Browse</button>
            </router-link>

            <router-link to="/profile">
                <button id="ProfileBtn" style="background: none; border: none;">Profile</button>
            </router-link>
        </div>

        <div id="actions">
        </div>
   </div>




</template>

<style scoped>
#container
{
    width: 1000px;
    height: 90px;
    position: absolute;
    left: 93px;
    top: 20px;
    border-radius: 15%;
}



#logo
{
    width: 70px;
    height: 70px;
    /* background-color: rgb(0, 119, 255); */
    border-radius: 30px;
    position: absolute;
    
    top: 6px;
    left: 0px;
}

#title
{
    font-weight: 1000;
    font-size: 27px;
    color: #ffffff;
    position: absolute;
    left: 90px;
    top: 20px;
    
}

#homeBtn
{
    position: absolute;
    top: 36px;
    left: 341px;
    font-weight: 1000;
    font-size: 20px;
    color: #767676;

}

#browseBtn
{
    position: absolute;
    top: 36px;
    left: 431px;
    font-weight: 1000;
    font-size: 20px;
    color: #767676;

}

#ProfileBtn
{
    position: absolute;
    top: 36px;
    left: 539px;
    font-weight: 1000;
    font-size: 20px;
    color: #767676;

}

</style>