<script>
  import { API_URL } from '../constants.js';
  export let url = '';
  export let songDetails = {};
  let downloadBtnLoading = false;
  export let downloadFinished = false;
  let downloadTime = 0.0; // in seconds
  let modalOpen = false;

  async function downloadSong() {
    let startTime = Date.now();
    downloadBtnLoading = true;
    const res = await fetch(`${API_URL}/download`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ spotifyUrl: songDetails.spotifyUrl ? songDetails.spotifyUrl : url }),
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
    downloadTime = (Date.now() - startTime) / 1000;
    downloadBtnLoading = false;
  }
</script>

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
        <p>This might take upto a minute!</p>
        <div class="animate-spin rounded-full h-7 w-7 border-b-[3px] border-green-500 mt-2" />
      </div>
    {:else if downloadFinished}
      <p class="text-white font-bold">
        Download Finished! Took {Math.round((downloadTime + Number.EPSILON) * 100) / 100}s
      </p>
    {:else}
      <button
        on:click={() => {
          if (localStorage.getItem('agree') === 'true') downloadSong();
          else modalOpen = true;
        }}
        class="px-5 py-3 rounded-lg text-[#121212] font-bold bg-[#1ed760] hover:bg-green-300 flex justify-center items-center gap-2"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-download w-4 h-4" viewBox="0 0 16 16">
          <path
            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
          />
          <path
            d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
          />
        </svg>
        Download
      </button>
    {/if}
  </div>

  <div
    class="absolute top-0 left-0 w-full min-h-screen backdrop-blur-md z-40 flex justify-center items-center delay-75 ease-in-out px-5"
    class:scale-0={!modalOpen}
  >
    <div class="z-50 bg-white rounded-lg p-5 sm:w-[500px] w-full shadow-xl">
      <h3 class="text-2xl font-bold mb-2">Before you procced...</h3>
      <div class="h-[250px] overflow-y-auto mb-4">
        <p>
          This web app doesn't download songs from spotify, instead it uses the spotify api to get the song's meta data
          and using that meta data it searches for the song on youtube and downloads the song from youtube. This app
          uses the following packages:
          <a
            href="https://www.npmjs.com/package/spotifydl-core"
            class="text-green-500 font-semibold hover:underline whitespace-nowrap"
            target="_blank"
          >
            spotifydl-core
          </a>
          &
          <a
            href="https://github.com/fent/node-ytdl-core"
            class="text-green-500 font-semibold hover:underline whitespace-nowrap"
            target="_blank"
          >
            ytdl-core
          </a>
          <br />
          <br />
          By using this web app, you agree to the following terms: You must not use copyrighted music obtained through this
          web app for commercial purposes or engage in copyright infringement. This web app is made for educational and experimental
          purposes only, and do not guarantee the accuracy or completeness of the content. You are responsible for complying
          with applicable laws and copyrights.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-5 py-2 rounded-lg text-[#121212] font-bold bg-green-500 hover:bg-green-400"
          on:click={() => {
            modalOpen = false;
            localStorage.setItem('agree', 'true');
            downloadSong();
          }}
        >
          Agree
        </button>
        <button
          class="px-5 py-2 rounded-lg text-[#121212] font-bold bg-gray-200 hover:bg-gray-300"
          on:click={() => {
            modalOpen = false;
          }}
        >
          Disagree
        </button>
      </div>
    </div>
  </div>
{/if}
