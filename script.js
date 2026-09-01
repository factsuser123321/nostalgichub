const username = "factsuser123321";
const repository = "nostalgichub";

const apiBase = `https://api.github.com/repos/${username}/${repository}/contents`;


// -------------------------
// LOAD IMAGES
// -------------------------

async function loadImages() {
    const gallery = document.getElementById("image-gallery");

    try {
        const response = await fetch(`${apiBase}/images`);
        const files = await response.json();

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
        );

        if (images.length === 0) {
            return;
        }

        gallery.innerHTML = "";

        images.forEach(image => {
            const card = document.createElement("div");
            card.className = "image-card";

            card.innerHTML = `
                <img src="${image.download_url}" alt="${image.name}">
            `;

            gallery.appendChild(card);
        });

    } catch (error) {
        console.error("Could not load images:", error);
    }
}


// -------------------------
// LOAD MUSIC
// -------------------------

async function loadMusic() {
    const musicList = document.getElementById("music-list");

    try {
        const response = await fetch(`${apiBase}/music`);
        const files = await response.json();

        const music = files.filter(file =>
            /\.(mp3|wav|ogg|m4a)$/i.test(file.name)
        );

        if (music.length === 0) {
            return;
        }

        musicList.innerHTML = "";

        music.forEach(song => {
            const card = document.createElement("div");
            card.className = "music-card";

            card.innerHTML = `
                <h3>🎵 ${song.name}</h3>
                <audio controls>
                    <source src="${song.download_url}">
                    Your browser does not support audio.
                </audio>
            `;

            musicList.appendChild(card);
        });

    } catch (error) {
        console.error("Could not load music:", error);
    }
}


// -------------------------
// LOAD VIDEOS
// -------------------------

async function loadVideos() {
    const videoGallery = document.getElementById("video-gallery");

    try {
        const response = await fetch(`${apiBase}/videos`);
        const files = await response.json();

        const videos = files.filter(file =>
            /\.(mp4|webm|ogg|mov)$/i.test(file.name)
        );

        if (videos.length === 0) {
            return;
        }

        videoGallery.innerHTML = "";

        videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "video-card";

            card.innerHTML = `
                <video controls preload="metadata">
                    <source src="${video.download_url}">
                    Your browser does not support video.
                </video>

                <h3>🎬 ${video.name}</h3>
            `;

            videoGallery.appendChild(card);
        });

    } catch (error) {
        console.error("Could not load videos:", error);
    }
}


// -------------------------
// START EVERYTHING
// -------------------------

loadImages();
loadMusic();
loadVideos();
