const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const autoplayCheckbox = document.getElementById('autoplay');
const playlistEl = document.getElementById('playlist');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

let isPlaying = false;
let currentSongIndex = 0;
let songs = [];

// Fetching the songs from iTunes API
async function fetchSongs(searchTerm = "Adele") {
  const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=10`);
  const data = await response.json();
  songs = data.results.map(song => ({
    title: song.trackName,
    artist: song.artistName,
    src: song.previewUrl,
    cover: song.artworkUrl100.replace('100x100', '300x300')
  }));
  populatePlaylist();
  loadSong(songs[currentSongIndex]);
}

// Populate playlist
function populatePlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(songs[currentSongIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

// Load song
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
  updateActiveSong();
}

// Play / Pause
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}
playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

// Next / Previous
nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});
prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
});

// Update progress
audio.addEventListener('timeupdate', () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;

  let currentMinutes = Math.floor(audio.currentTime / 60);
  let currentSeconds = Math.floor(audio.currentTime % 60);
  if(currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

  let durationMinutes = Math.floor(audio.duration / 60);
  let durationSeconds = Math.floor(audio.duration % 60);
  if(durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
  durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
});


progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Volume control
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// Autoplay
audio.addEventListener('ended', () => {
  if (autoplayCheckbox.checked) {
    nextBtn.click();
  }
});

// Highlight active song
function updateActiveSong() {
  document.querySelectorAll('#playlist li').forEach((li, idx) => {
    li.classList.toggle('active', idx === currentSongIndex);
  });
}

// Search functionality
searchBtn.addEventListener('click', () => {
  const term = searchInput.value.trim();
  if (term) {
    fetchSongs(term);
  }
});

fetchSongs();
