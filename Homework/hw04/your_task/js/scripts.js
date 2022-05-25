const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
// console.log(`
//        get tracks from spotify based on the search term
//        "${term}" and load the first five tracks into the #tracks section 
//        of the DOM...`);
const elem = document.querySelector("#tracks");
elem.innerHTML = "";

fetch(baseURL + "?type=track&limit=5&q=" + term)
    .then(response => response.json())
    .then(tracks => {
        console.log(tracks);
        if (tracks.length === 0) {
            document.querySelector("#tracks").innerHTML += `
            <p> no songs available </p>`;
        }
        for (const track of tracks) {
            document.querySelector("#tracks").innerHTML += `
            <button class="track-item preview" data-preview-track="${track.id}" onclick="handleTrackClick(event);">
                <img alt="Image of ${track.name}" src="${track.album.image_url}">
                <i class="fas play-track fa-play" aria-hidden="true"></i>
                <div class="label">
                    <h2>${track.name}</h2>
                    <p>${track.artist.name}</p>
                </div>
            </button>`;
        }
    });
}


const getAlbums = (term) => {
    // console.log(`
//        get albums from spotify based on the search term
//        "${term}" and load albums
//        of the DOM...`);
const elem = document.querySelector("#albums");
elem.innerHTML = "";

fetch(baseURL + "?type=album&q=" + term)
    .then(response => response.json())
    .then(albums => {
        console.log(albums);
        if (albums.length === 0) {
            document.querySelector("#albums").innerHTML += `
            <p> no albums available </p>`;
        }
        for (const album of albums) {
            document.querySelector("#albums").innerHTML += `
            <section class="album-card" id="${album.id}">
                <div>
                    <img alt="Image of ${album.name}" src="${album.image_url}">
                    <h2>${album.name}</h2>
                    <div class="footer">
                        <a href=${album.spotify_url} target="_blank">
                            view on spotify
                        </a>
                    </div>
                </div>
            </section>`;
        }
    });
}


const getArtist = (term) => {
// console.log(`
//        get artists from spotify based on the search term
//        "${term}" and load the first artist into the #artist section 
//        of the DOM...`);
    const elem = document.querySelector("#artist");
    elem.innerHTML = "";

    fetch(baseURL + "?type=artist&q=" + term)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                const firstArtist = data[0];
                elem.innerHTML += getArtistHTML(firstArtist);
                console.log(firstArtist);
            } else {
                elem.innerHTML += `<p> no results returned</p>`;
            }
        });
};

const getArtistHTML = (data) => {
    if (!data.image_url) {
        data.image_url =
            "https://www.pngkit.com/png/full/943-9439413_blue-butterfly-free-png-image-dark-blue-to.png";
    }
    return `<section class="artist-card" id="${data.id}">
                <div>
                    <img alt="Image of ${data.name}" src="${data.image_url}">
                    <h2>${data.name}</h2>
                    <div class="footer">
                        <a href="${data.spotify_url}" target="_blank">
                            view on spotify
                        </a>
                    </div>
                </div>
            </section>`;
};


const handleTrackClick = (ev) => {
        const currentTrackElem = document.querySelector("#current-track");
        currentTrackElem.innerHTML = ev.currentTarget.innerHTML;
        const preview_url = ev.currentTarget.dataset.previewTrack;
        console.log(preview_url);
        if (audioPlayer.getAudioFile() !== preview_url) {
            audioPlayer.setAudioFile(preview_url);
        }
        audioPlayer.play();
    };


document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    // console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};