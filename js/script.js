console.log(' write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3"))
             {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
//  console.log(songs)

  // Show all the songs in the playlist
  let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songul.innerHTML = '';
  for (const song of songs) {
     songul.innerHTML = songul.innerHTML +  `<li><img class="invert" width="34" src="img/music.svg" alt="">
                             <div class="info">
                                 <div> ${song.replaceAll("%20", " ")}</div>
                                 <div>Harry</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="img/play.svg" alt="">
                             </div> </li>`;
  }
 
 // Attach an event listener to each song
 Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
     e.addEventListener("click", element => {
         console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
 
     })
 })
 
 
 return songs

}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/`  + track;
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
  
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}





async function main() {
//   songs = 
await getSongs("songs/ss")
 playMusic(songs[0], true)
//  console.log(songs)


   


// Attach an event listener to play, next and previous
play.addEventListener("click", () => {
    if (currentSong.paused) {       

        currentSong.play()
        play.src = "img/pause.svg"
        
    }
    else {
         currentSong.pause()
        play.src = "img/play.svg"       
    }
})

 // Listen for timeupdate event
 currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

// Add an event listener to previous
previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

 // Add an event listener to next
 next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // console.log(index)
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

// load playlist wheever card click
Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])
        // console.log(songs)

    })
})


 }


main()
    