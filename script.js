const username = "factsuser123321";
const repository = "nostalgichub";

const apiBase =
    `https://api.github.com/repos/${username}/${repository}/contents`;


// ==========================================
// ELEMENTS
// ==========================================

const audioPlayer = document.getElementById("audio-player");
const musicToggle = document.getElementById("music-toggle");
const musicStatus = document.getElementById("music-status");
const currentSong = document.getElementById("current-song");
const songNumber = document.getElementById("song-number");

let musicFiles = [];
let currentSongIndex = 0;
let musicStarted = false;


// ==========================================
// LOAD FILES FROM GITHUB
// ==========================================

async function getFolderFiles(folder) {

    try {

        const response = await fetch(`${apiBase}/${folder}`);

        if (!response.ok) {
            throw new Error(`Could not load ${folder}`);
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        return [];

    }
}


// ==========================================
// IMAGES
// ==========================================

async function loadImages() {

    const gallery =
        document.getElementById("image-gallery");

    const files =
        await getFolderFiles("images");

    const images = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
    );

    if (images.length === 0) {

        gallery.innerHTML = `
            <div class="loading-card">
                No memories have been added yet.
            </div>
        `;

        return;
    }

    gallery.innerHTML = "";

    images.forEach((image, index) => {

        const card =
            document.createElement("div");

        card.className = "image-card";

        card.style.animationDelay =
            `${index * 0.08}s`;

        card.innerHTML = `
            <img
                src="${image.download_url}"
                alt="${image.name}"
                loading="lazy"
            >
        `;

        gallery.appendChild(card);

    });
}


// ==========================================
// MUSIC
// ==========================================

async function loadMusic() {

    const musicList =
        document.getElementById("music-list");

    const files =
        await getFolderFiles("music");

    musicFiles = files.filter(file =>
        /\.(mp3|wav|ogg|m4a)$/i.test(file.name)
    );

    if (musicFiles.length === 0) {

        musicList.innerHTML = `
            <div class="loading-card">
                No music has been added yet.
            </div>
        `;

        currentSong.textContent =
            "No music available";

        songNumber.textContent =
            "Add an audio file to the music folder.";

        return;
    }

    musicList.innerHTML = "";

    musicFiles.forEach((song, index) => {

        const card =
            document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `
            <h3>${song.name}</h3>
            <span>${String(index + 1).padStart(2, "0")}</span>
        `;

        card.addEventListener("click", () => {

            currentSongIndex = index;

            playSong();

        });

        musicList.appendChild(card);

    });

    currentSongIndex = 0;

    prepareSong();

}


// ==========================================
// PREPARE SONG
// ==========================================

function prepareSong() {

    if (!musicFiles.length) {
        return;
    }

    const song =
        musicFiles[currentSongIndex];

    audioPlayer.src =
        song.download_url;

    audioPlayer.loop = false;

    currentSong.textContent =
        cleanFileName(song.name);

    songNumber.textContent =
        `${String(currentSongIndex + 1).padStart(2, "0")} / ${String(musicFiles.length).padStart(2, "0")}`;

}


// ==========================================
// PLAY SONG
// ==========================================

async function playSong() {

    if (!musicFiles.length) {
        return;
    }

    prepareSong();

    try {

        await audioPlayer.play();

        musicStarted = true;

        setMusicState(true);

    } catch (error) {

        console.log(
            "Autoplay was blocked by the browser."
        );

        setMusicState(false);

    }

}


// ==========================================
// NEXT SONG
// ==========================================

function nextSong() {

    if (!musicFiles.length) {
        return;
    }

    currentSongIndex++;

    if (currentSongIndex >= musicFiles.length) {
        currentSongIndex = 0;
    }

    playSong();

}


// ==========================================
// MUSIC ENDED
// ==========================================

audioPlayer.addEventListener(
    "ended",
    nextSong
);


// ==========================================
// MUSIC TOGGLE
// ==========================================

musicToggle.addEventListener(
    "click",
    () => {

        if (!musicFiles.length) {
            return;
        }

        if (audioPlayer.paused) {

            playSong();

        } else {

            audioPlayer.pause();

            setMusicState(false);

        }

    }
);


// ==========================================
// MUSIC STATE
// ==========================================

function setMusicState(playing) {

    if (playing) {

        document.body.classList.add(
            "music-playing"
        );

        musicToggle.classList.add(
            "playing"
        );

        musicStatus.textContent =
            "Playing";

    } else {

        document.body.classList.remove(
            "music-playing"
        );

        musicToggle.classList.remove(
            "playing"
        );

        musicStatus.textContent =
            "Music";

    }

}


// ==========================================
// TRY AUTOPLAY
// ==========================================

function tryStartMusic() {

    if (
        !musicFiles.length ||
        musicStarted
    ) {
        return;
    }

    playSong();

}


// ==========================================
// START MUSIC AFTER USER INTERACTION
// ==========================================

[
    "click",
    "touchstart",
    "keydown"
].forEach(event => {

    document.addEventListener(
        event,
        () => {

            if (!musicStarted) {
                tryStartMusic();
            }

        },
        {
            once: true
        }
    );

});


// ==========================================
// CLEAN FILE NAMES
// ==========================================

function cleanFileName(name) {

    return name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );

}


// ==========================================
// VIDEOS
// ==========================================

async function loadVideos() {

    const gallery =
        document.getElementById("video-gallery");

    const files =
        await getFolderFiles("videos");

    const videos = files.filter(file =>
        /\.(mp4|webm|ogg|mov)$/i.test(file.name)
    );

    if (videos.length === 0) {

        gallery.innerHTML = `
            <div class="loading-card">
                No videos have been added yet.
            </div>
        `;

        return;
    }

    gallery.innerHTML = "";

    videos.forEach((video, index) => {

        const card =
            document.createElement("div");

        card.className = "video-card";

        card.style.animationDelay =
            `${index * 0.08}s`;

        card.innerHTML = `
            <video
                controls
                preload="metadata"
            >
                <source
                    src="${video.download_url}"
                >
            </video>

            <h3>
                ${cleanFileName(video.name)}
            </h3>
        `;

        gallery.appendChild(card);

    });

}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

async function initialize() {

    await Promise.all([
        loadImages(),
        loadMusic(),
        loadVideos()
    ]);

}


// START

initialize();
