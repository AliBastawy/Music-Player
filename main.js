let container = document.querySelector(".container")

let repeat_playlist = document.getElementById("repeat-plist");

let more_music = document.getElementById("more-music");

let nextBtn = document.querySelector("#next");

let prevBtn = document.querySelector("#prev");

let div_playlist = document.querySelector(".playlist");

let closeButton = document.querySelector("#close");

let song_playlist = document.querySelector("ul");

let playButton = document.querySelector(".play");

let currentMusicTime = document.querySelector(".current-time");

let musicDuration = document.querySelector(".max-duration");

let progressBar = document.querySelector(".progressBar");

let progressSong = document.querySelector(".progressSong");

let audio = document.querySelector("audio");

let audioDuration = Math.floor(document.querySelector("audio").duration);

let musicName = document.querySelector(".audioName");
let musicArtist = document.querySelector(".audioSinger");
let musicImg = document.querySelector(".image img");
let mainAudio = document.querySelector("audio");

let musicIndex = 1;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    displayMusic();
});


function loadMusic(indexNumb){
    musicName.innerText = playlist[indexNumb - 1].name;
    musicArtist.innerText = playlist[indexNumb - 1].artist;
    musicImg.src = `${playlist[indexNumb - 1].image}`;
    mainAudio.src = `${playlist[indexNumb - 1].src}`;
}


repeat_playlist.onclick = () => {

    if (repeat_playlist.innerHTML === "repeat") {
        repeat_playlist.innerHTML = "repeat_one";
        repeat_playlist.setAttribute('title', 'Song looped');
    }
    else if (repeat_playlist.innerHTML === "repeat_one") {
        repeat_playlist.innerHTML = "shuffle";
        repeat_playlist.setAttribute('title', 'Playback shuffle');
    }
    else {
        repeat_playlist.innerHTML = "repeat";
        repeat_playlist.setAttribute('title', 'Playlist looped');
    }
}

function displayMusic() {
    for (let i = 0; i < playlist.length; i++) {
        let div_song = document.createElement("li");
        div_song.classList.add("song");

        let div_songTitle = document.createElement("div");
        div_songTitle.classList.add("song-title");

        
        let music = document.createElement("audio");
        music.src = playlist[i].src;
        let spanMusicDuration = music.duration;

        let span_duration = document.createElement("span");
        span_duration.classList.add("duration");
        // span_duration.innerText = spanMusicDuration;

        let audioName = document.createElement("p");
        audioName.classList.add("audioName");

        audioName.innerHTML = playlist[i].name;

        let audioSinger = document.createElement("p");
        audioSinger.classList.add("audioSinger");

        audioSinger.innerHTML = playlist[i].artist;

        div_songTitle.appendChild(audioName);
        div_songTitle.appendChild(audioSinger);
        
        div_song.appendChild(div_songTitle);

        div_song.appendChild(span_duration);

        div_song.appendChild(music);

        div_song.setAttribute("onclick", "clicked(this)");
        div_song.setAttribute("index", `${i+1}`);

        song_playlist.appendChild(div_song);

        music.addEventListener("loadeddata", ()=>{
            let duration = music.duration;
            let totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if(totalSec < 10){ //if sec is less than 10 then add 0 before it
                totalSec = `0${totalSec}`;
            };
            span_duration.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
            span_duration.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
        });
    }
}

more_music.onclick = ()=> {
    div_playlist.classList.add("show");
}

closeButton.onclick = function () {
    div_playlist.classList.remove("show");
}

playButton.onclick = function () {
    playButton.classList.contains("pause") ? playSong() : pauseSong();
}

nextBtn.onclick = function nextMusic() {
    musicIndex++;
    if (musicIndex >= playlist.length) {
        musicIndex = 1;
    }
    loadMusic(musicIndex);
    playSong();
}

prevBtn.onclick = function () {
    musicIndex--;
    if (musicIndex === 0) {
        musicIndex = playlist.length;
    }
    loadMusic(musicIndex);
    playSong();
}

mainAudio.addEventListener("timeupdate", (e)=>{ 
    let currentTime = e.target.currentTime;
    let duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressSong.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", ()=>{
        // update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if(totalSec < 10){ //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // Current Time
    let minCurrentTime = Math.floor(currentTime / 60);
    let secCurrentTime = Math.floor(currentTime % 60);
    if (secCurrentTime < 10) {
        secCurrentTime = `0${secCurrentTime}`;
    }
    currentMusicTime.innerText = `${minCurrentTime}:${secCurrentTime}`;

})

progressBar.onclick = function (e) {
    let width = progressBar.clientWidth;
    let clickMouse = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickMouse / width) * songDuration;

    playSong();
}


function playSong() {
    audio.play();
    playButton.innerHTML = "pause";
    playButton.classList.remove("pause");
    playingSong();
}
function pauseSong() {
    audio.pause();
    playButton.classList.add("pause");
    playButton.innerHTML = "play_arrow";
}


function playingSong() {
    const li = container.querySelectorAll(".song");
    
    for (let i of li) {
        if (i.classList.contains("playing")) {
            i.classList.remove("playing");
            let spanDuration = i.querySelector(".duration");
            let t_duration = spanDuration.getAttribute("t-duration");
            spanDuration.innerText = t_duration;
        }

        // Check If Playing Audio equals to Audio In Playlist
        if (mainAudio.src === i.querySelector("audio").src) {
            let spanDuration = i.querySelector(".duration");
            spanDuration.innerText = "Playing";
            i.classList.add("playing");
        }
    }
}


mainAudio.addEventListener("ended", () => {

    let loop = repeat_playlist.innerHTML;
    switch(loop){
        case "repeat":
            endMusic();
            break;
        case "repeat_one":
            musicIndex--;
            endMusic();
            break;
        case "shuffle":
            let playlistLength = playlist.length;
            let randomIndex = Math.floor((Math.random() * (playlistLength)) + 1);
            do {
                randomIndex = Math.floor((Math.random() * (playlistLength)) + 1);
            }
            while(randomIndex === musicIndex)
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playSong();
            break;
    }

});



function endMusic() {
    musicIndex++;
    if (musicIndex >= playlist.length) {
        musicIndex = 1;
    }
    loadMusic(musicIndex);
    playSong();
}

function clicked(event) {
    playingSong();
    let spanDuration = event.querySelector(".duration");
    spanDuration.innerText = "Playing";

    event.classList.add("playing");
    let liIndex = event.getAttribute("index");
    musicIndex = liIndex;

    loadMusic(liIndex);
    playSong();
}

