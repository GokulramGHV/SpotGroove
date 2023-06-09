<script>
  const API_URL = 'https://spotgroove-backend.gokulramghv.repl.co';
  let url = '';
  let goBtnLoading = false;
  let downloadBtnLoading = false;
  let downloadFinished = false;
  let songDetails = {};
  async function handleGoClick() {
    goBtnLoading = true;
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
    goBtnLoading = false;
  }

  async function downloadSong() {
    downloadBtnLoading = true;
    const res = await fetch(`${API_URL}/download`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ spotifyUrl: url }),
    });
    if (res.ok) {
      const blob = await res.blob();
      let blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${songDetails.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      downloadFinished = true;
    } else {
      throw new Error('Not able to download the song!');
    }
    downloadBtnLoading = false;
  }
</script>

<main class="w-full h-screen flex flex-col justify-center items-center bg-[#121212] px-10">
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

  <div class="relative flex gap-2 mt-10">
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
      bind:value={url}
      class="px-[51px] py-4 w-full sm:w-[500px] rounded-lg bg-[#242424] shadow-lg text-white focus:shadow-[#1ed760]/20 focus:ring-[#1ed760] focus:ring-2 focus:outline-none transition duration-200 ease-in"
      placeholder="What's the song's URL?"
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

  {#if Object.keys(songDetails).length !== 0}
    <div class="flex sm:flex-row flex-col w-full justify-center items-center mt-10 gap-4">
      <img src={songDetails.cover_url} alt="Song Cover" class="rounded-lg w-28 h-28" />
      <div class="text-white h-full flex flex-col justify-center text-center sm:text-left">
        <p class="text-2xl font-bold dots max-w-[15rem] sm:max-w-[20rem]">{songDetails.name}</p>
        <div class="flex gap-2 items-center mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <p class="text-lg dots max-w-[15rem] sm:max-w-[20rem]">{songDetails.artists.join(', ')}</p>
        </div>

        <div class="flex gap-2 items-center mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-vinyl text-white w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" />
            <path d="M9 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <p class="text-lg dots max-w-[15rem] sm:max-w-[20rem]">{songDetails.album_name}</p>
        </div>
      </div>
    </div>
    <div class="mt-10">
      {#if downloadBtnLoading}
        <div class="text-white flex flex-col justify-center items-center">
          <p>We're preparing your song, please wait...</p>
          <p>This might take upto a minute! Don't close your browser!</p>
          <div class="animate-spin rounded-full h-7 w-7 border-b-[3px] border-green-500 mt-2" />
        </div>
      {:else if downloadFinished}
        <p class="text-white font-bold">Download Finished!</p>
      {:else}
        <button
          on:click={downloadSong}
          class="px-5 py-3 rounded-lg text-[#121212] font-bold bg-[#1ed760] hover:bg-green-300 flex justify-center items-center gap-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-download w-4 h-4"
            viewBox="0 0 16 16"
          >
            <path
              d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
            />
            <path
              d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
            />
          </svg>Download</button
        >
      {/if}
    </div>
  {/if}
  <div class="relative top-10 text-gray-300 font-bold">
    🎧 Made by <a href="https://github.com/GokulramGHV" class="text-blue-500 hover:underline hover:underline-offset-2"
      >@GokulramGHV
    </a>🎶
  </div>
</main>
