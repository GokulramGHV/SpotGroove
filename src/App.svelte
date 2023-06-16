<script>
  import { API_URL } from '../constants.js';
  import SongDetails from './SongDetails.svelte';
  let searchTerm = '';
  let goBtnLoading = false;
  let downloadFinished = false;
  let songDetails = {};
  let songs = [];
  let offset = 0;
  let next;
  let prev;

  async function getSongDetails(url) {
    const res = await fetch(`${API_URL}/songDetails`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ spotifyUrl: url }),
    });
    const text = await res.text();
    if (res.ok) {
      songDetails = JSON.parse(text);
      console.log(text);
    } else {
      goBtnLoading = false;
      alert("Couldn't find the song! Check URL and try again!");
      throw new Error(text);
    }
  }

  async function handlePrev() {
    if (offset === 0) return;
    offset -= 5;
    prev = getSongs(searchTerm, offset);
  }

  async function handleNext() {
    offset += 5;
    next = getSongs(searchTerm, offset);
  }

  async function getSongs(name, offset = 0) {
    const res = await fetch(`${API_URL}/searchTrack?search=${encodeURI(name)}&offset=${offset}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const text = await res.text();
    if (res.ok) {
      songs = JSON.parse(text);
      console.log('Songs: ', songs);
    } else {
      goBtnLoading = false;
      alert("Couldn't find the song! Check URL and try again!");
      throw new Error(text);
    }
  }

  async function handleGoClick() {
    goBtnLoading = true;
    songDetails = {};
    songs = [];

    // check if searchTerm is a spotify song URL
    if (searchTerm.includes('open.spotify.com')) {
      await getSongDetails(searchTerm);
    } else {
      await getSongs(searchTerm);
    }

    goBtnLoading = false;
    downloadFinished = false; // reset downloadFinished
  }
</script>

<main class="w-full min-h-screen flex flex-col justify-center items-center bg-[#121212] px-6 py-10">
  <div class="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="bi bi-disc text-white w-10 h-10 absolute left-0"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path
        d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 4a4 4 0 0 0-4 4 .5.5 0 0 1-1 0 5 5 0 0 1 5-5 .5.5 0 0 1 0 1zm4.5 3.5a.5.5 0 0 1 .5.5 5 5 0 0 1-5 5 .5.5 0 0 1 0-1 4 4 0 0 0 4-4 .5.5 0 0 1 .5-.5z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="bi bi-music-note-beamed text-white w-8 h-8 absolute top-4 left-4"
      viewBox="0 0 16 16"
    >
      <path
        d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"
      />
      <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
      <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
    </svg>
    <h1 class="font-kaushan text-4xl text-white ml-14">SpotGroove</h1>
  </div>

  <div class="relative flex gap-2 mt-10 w-full sm:w-fit">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-spotify text-[#1ed760] drop-shadow-lg w-7 h-7 absolute left-3 top-3.5"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"
      />
    </svg>
    <input
      on:keypress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGoClick();
        }
      }}
      type="text"
      bind:value={searchTerm}
      class="px-[51px] py-4 w-full sm:w-[500px] rounded-lg bg-[#242424] shadow-lg text-white focus:shadow-[#1ed760]/20 focus:ring-[#1ed760] focus:ring-2 focus:outline-none transition duration-200 ease-in"
      placeholder="Search or enter a song's URL"
    />
    <button
      disabled={goBtnLoading}
      on:click={handleGoClick}
      class="text-green-500 hover:text-green-400 absolute right-3 top-3 transition duration-75 ease-in-out flex justify-center items-center"
    >
      {#if goBtnLoading}
        <div class="animate-spin rounded-full h-7 w-7 border-b-[3px] border-green-500" />
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-right-square-fill w-8 h-8 cursor-pointer"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"
          />
        </svg>
      {/if}
    </button>
  </div>
  {#if songs.length > 0}
    <div class="grid gap-3 dots mt-10">
      {#each songs as song, i (song.spotifyUrl.split('/').pop())}
        <button
          class="flex w-full items-center justify-between gap-4 px-4 py-2 hover:bg-[#444444] rounded-lg"
          on:click={() => {
            songDetails = song;
            songs = [];
          }}
        >
          <img src={song.cover_url} alt="Song Cover" class="rounded-md w-10 h-10" />
          <div class="text-white h-full flex flex-col justify-center text-left">
            <p class="text-lg font-bold dots sm:w-[400px] w-[200px]">{song.name}</p>
            <p class="text-sm dots sm:w-[400px] w-[200px]">{song.artists.join(', ')}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-download w-4 h-4 text-white"
            viewBox="0 0 16 16"
          >
            <path
              d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
            />
            <path
              d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
            />
          </svg>
        </button>
      {/each}

      <div class="mx-auto flex gap-4 mt-2">
        <button
          class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex justify-center items-center gap-2"
          on:click={handlePrev}
        >
          {#await prev}
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
          {/await} Prev
        </button>
        <button
          class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex justify-center items-center gap-2"
          on:click={handleNext}
        >
          Next {#await next}
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
          {/await}
        </button>
      </div>
    </div>
  {/if}
  <SongDetails bind:downloadFinished url={searchTerm} {songDetails} />

  <div class="relative mt-10 text-gray-300 font-semibold">
    🎧 Made by <a href="https://github.com/GokulramGHV" class="text-green-500 hover:underline hover:underline-offset-2"
      >@GokulramGHV
    </a>🎶
  </div>
</main>
