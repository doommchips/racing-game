var carPic = document.createElement("img");
var roadPic = document.createElement('img');
var wallPic = document.createElement('img');

var picsToLoad = 3;

function countLoadedImagesAndLaunchIfReady() {
    picsToLoad--;
    console.log(picsToLoad);
    if(picsToLoad == 0) {
        imageLoadingDoneSoStartGame();
    }
}

function carImageLoad() {
    carPic.onload = countLoadedImagesAndLaunchIfReady;
    carPic.src = '_as/player1car.png';
}

function trackImageLoad() {
    roadPic.onload = countLoadedImagesAndLaunchIfReady;
    wallPic.onload = countLoadedImagesAndLaunchIfReady;
    roadPic.src = '_as/track_road.png';
    wallPic.src = '_as/track_wall.png';
}

function loadImages() {
    carImageLoad();
    trackImageLoad();
}
