
import getListMusic from './getApi.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const iconPlay = $('.fa-circle-play')
const iconPause = $('.fa-circle-pause')
const audio = document.getElementById('audio')



let list, currSong=1, isPlaying = false, isRepeat = false, isRandom = false

function getSongs(songs) {
    list = songs
    console.log(list)
    let html =''
    songs.map(song => {
        return html += `
        <li class="" id="${song.id}">
            <div class="avt" style="${song.img}"></div>
            <div class="content">
                <h3>${song.name}</h3>
                <p>${song.author}</p>
            </div>
            <div class="icons">
                <i class="fa-regular fa-heart"></i>
                <div class="options">
                    <i class="fa-solid fa-ellipsis"></i>
                    <div class="list-Option">
                        <div class="delete">Xóa</div>
                        <div class="nextSong">Phát tiếp theo</div>
                        <div class="add">Thêm vào yêu thích</div>
                    </div>
                </div>
            </div>
        </li>
        `
    })

    $('.listMusic > ul').innerHTML = html


}



function handleEvent() {
    const songs = $$('.listMusic ul li') 
    const prev = $('.fa-backward-step')
    const next = $('.fa-forward-step')
    const btnPlay = $('.btnPlay')
    const repeat = $('.fa-rotate-right')
    const random = $('.fa-shuffle')
    const progressBar = $('.progress')
    const volume = $('.volume')

    songs.forEach(song =>{
        song.onclick = () =>{
            handlePlayMusic()
            handleCdtheme()
            currSong = song.id  
        }
    })

    prev.onclick = () => {
        if (currSong === 1) {
            currSong = list.length
        } else {
            currSong = currSong -1
        }
        console.log(currSong)
        handlePlayMusic()
        handleCdtheme()
    }

    next.onclick = () => {

        if (isRandom) {
            currSong = Math.floor( Math.random()* (list.length ))  +1
            
        } else {
            currSong = currSong === list.length ? 1 : currSong+1
        }

        handlePlayMusic()
        handleCdtheme()
        
    }

    audio.onended = () => {
        if (isRepeat) {
            audio.play()
        } else {
            next.click()
        }
    }

    btnPlay.onclick = () => {
        if (isPlaying) {
            isPlaying = false
            iconPlay.style.display = 'block'
            iconPause.style.display = 'none'
            audio.pause()
        } else {
            isPlaying = true
            iconPlay.style.display = 'none'
            iconPause.style.display = 'block'
            if (currSong === 1) {
                   audio.src = list[0].link
            }
            audio.play()
        }
        handleCdtheme()
        loadtime()
    }

   

    repeat.onclick = () => {
        if (!isRepeat) {
            repeat.style.color = 'green'
            isRepeat = true
        } else {
            repeat.style.color = '#fff'
            isRepeat = false
        }
    }

    random.onclick = () => {
        if (!isRandom) {
            random.style.color = 'green'
            isRandom = true
        } else {
            random.style.color = '#fff'
            isRandom = false
        }
    }

    //progress 
    audio.ontimeupdate = function () {
        const currentTimeDisplay = document.querySelector('.current-time');

        let audioCurr = audio.currentTime
        
        const minutes = Math.floor(audioCurr / 60);
        const seconds = Math.floor(audioCurr % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $('.nu1').textContent = formattedTime;

        let lengthAudio = 0
        if (audio.duration) {
            lengthAudio = audioCurr * 100 / audio.duration
        } 
        progressBar.value = lengthAudio
    }
    
    //Rewind progress
    progressBar.onchange = function () {
        if (audio.duration) {
            let lengCurr = this.value * audio.duration / 100
            audio.currentTime = lengCurr   
        }
    }

    // volume change
    volume.addEventListener('input', function () {
        audio.volume = volume.value;
        console.log(audio.volume)
    })
}

function handlePlayMusic() {
    list.forEach(play => {
        if (play.id == currSong) {
            $('.listMusic ul .active').classList.remove('active')
            let element = document.getElementById(`${currSong}`)
            element.classList.add('active')
            iconPlay.style.display = 'none'
            iconPause.style.display = 'block'
            audio.src = play.link
            audio.play()
            isPlaying = true
        }
    })

    loadtime()
}

function loadtime() {
    audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $('.nu2').textContent = formattedTime;
        
    })

}

function handleCdtheme() {
    const play = $('.cdMove')
    if (isPlaying) {
        play.classList.add('active')
    } else {
        play.classList.remove('active')
    }

    // const cdThumbAnimate = play.animate ([
            
    //     { transform: 'rotate(0deg)'},
    //     { transform : 'rotate(360deg)' }
    // ], {
    //     duration : 10000, 
    //     iterations : Infinity,
    //     easing : 'linear'
    // })
    // cdThumbAnimate.play()
}

function loadFirstSong() {
    const song = $('.listMusic ul > li') 
    song.classList.add('active')
}


async function start() {
    // render list songs
    await getListMusic(getSongs)
    await loadFirstSong()
    await handleEvent()

}

start()