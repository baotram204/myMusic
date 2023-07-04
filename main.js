import getListMusic from './getApi.js'
import handleCostumeData from './costumeData.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const iconPlay = $('.fa-circle-play')
const iconPause = $('.fa-circle-pause')
const audio = document.getElementById('audio')
const songs = $$('.listMusic ul li') 
const prev = $('.fa-backward-step')
const next = $('.fa-forward-step')
const btnPlay = $('.btnPlay')
const repeat = $('.fa-rotate-right')
const random = $('.fa-shuffle')
const progressBar = $('.progress')
const volume = $('.volume')
const tabs = $$('.tabs')
const listMusic = $('.listMusic')
const input = document.querySelector('.find')
const  btnFindSong = document.querySelector('.fa-magnifying-glass')

let list, currSong=0, isPlaying = false, isRepeat = false, isRandom = false, isNext = false, isPrev = false, isheart = false, isFindSong = false
let favoritesSong = []

// render song
function render(songs) {
    list = songs
    let html =''
    songs.map((song,index) => {
        return html += `
        <li class="song" data-index="${index}" id="${song.id}">
            <div class="avt" style="background-image: url(${song.img})"></div>
            <div class="content">
                <h3>${song.name}</h3>
                <p>${song.author}</p>
            </div>
            <div class="icons">
                <div class="heart">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <div class="options">
                    <div></div>
                </div>
            </div>
        </li>
        `
    })
    
    $('.listMusic > ul').innerHTML = html
}

function loadFirstSong() {
    const song = $('.listMusic ul > li') 
    song.classList.add('active')
    audio.src = list[0].link
    const cdTheme = $('.cdTheme')
    let hmtl = [`
        <div class="cd" style="background-image: url(${list[0].img})"></div>
        <div class="cdMove" style="background-image: url(${list[0].img})" >
            <div class="dot"></div>
        </div>
        <div class="content">
            <p>...</p>
            <h2>${list[0].name}</h2>
            <p>${list[0].author}</p>
        </div>
    `]
    cdTheme.innerHTML = hmtl.join('')
    loadtime()
}


function nextSong() {
    if (isRandom) {
        currSong = Math.floor( Math.random()* (list.length ))  
    } else {
        currSong = currSong === list.length-1 ? 0 : currSong + 1
    }
    isNext = true
    isPlaying = true
    playMusic()
    loadtime()
}

function prevSong() {
    if (currSong === 0) {
        currSong = list.length-1
    } else {
        currSong = currSong -1
    }
    isPlaying = true
    playMusic()
    loadtime()
}

function repeatSong() {
    if (!isRepeat) {
        repeat.style.color = 'green'
        isRepeat = true
    } else {
        repeat.style.color = '#fff'
        isRepeat = false
    }
}

function randomSong() {
    if (!isRandom) {
        let color =  window.getComputedStyle(document.documentElement).getPropertyValue('--active-color')
        random.style.color = (color === '#eee') ? 'red' : color
        isRandom = true
    } else {
        random.style.color = '#fff'
        isRandom = false
    }
}

function clickSong() {
    listMusic.onclick = (e) => {
        const songNode = e.target.closest('.song:not(.active)')
        const listIcons = e.target.closest('.icons')
        if(!songNode && !isPlaying && !listIcons) {
            currSong = Number(songNode.dataset.index);
            playMusic()
        }
        if(songNode && !listIcons) {
            currSong = Number(songNode.dataset.index);
            playMusic()
        }
        // click options
        else {
            let heart = e.target.closest('.heart')
            let song = heart.parentNode.parentNode
            let indexCurr = song.id


            if (heart.classList.contains('favo')) {
                heart.classList.remove('favo');
                heart = e.target.closest('.heart')
                song = heart.parentNode.parentNode
                indexCurr = song.id
                
                console.log(indexCurr)

                favoritesSong = favoritesSong.filter(play => play.id != indexCurr)
                
            } else {
                heart.classList.add('favo');
                list.map((play) => {
                    if (play.id == indexCurr) {
                        favoritesSong.push(play)
                    }
                })
            }
            
            console.log(favoritesSong)
            
        }
    }

    console.log(favoritesSong)
}

function playBtnSong() {
    if (isPlaying === false) { 
        isPlaying = true
        iconPlay.style.display = 'none'
        iconPause.style.display = 'block'
        audio.play()
    } else {
        isPlaying = false
        iconPlay.style.display = 'block'
        iconPause.style.display = 'none'
        audio.pause()
    }
    circleCd()
    loadtime()
}

function progress() {
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

function rewindProgressBar() {
    if (audio.duration) {
        let lengCurr = this.value * audio.duration / 100
        audio.currentTime = lengCurr   
    }
}

function loadtime() {
    audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $('.nu2').textContent = formattedTime;
        
    })
}

// when music is playing
function playMusic() {
    let song = input.value

    list.map((play,index) => {
        let temp = false
        if (isFindSong){
            let song = input.value
            temp = (song === play.name)
        } else {
            temp = (index == currSong)
        }
        if (temp) {
            console.log(index)
            $('.listMusic ul .active').classList.remove('active')
            let element = document.querySelector(`[data-index= "${index}"]`)
            element.classList.add('active')
            iconPlay.style.display = 'none'
            iconPause.style.display = 'block'
            audio.src = play.link

            // set img cursor position
            const cdTheme = $('.cdTheme')
            let hmtl = [`
                <div class="cd" style="background-image: url(${play.img})"></div>
                <div class="cdMove" style="background-image: url(${play.img})" >
                    <div class="dot"></div>
                </div>
                <div class="content">
                    <p>...</p>
                    <h2>${play.name}</h2>
                    <p>${play.author}</p>
                </div>
            `]
            cdTheme.innerHTML = hmtl.join('')
            isPlaying = true
            audio.play()
            circleCd()
            currSong = index
            isFindSong = false
        }
    })
}

function circleCd() {
    const play = $('.cdTheme')
    // bug quay mãi 
    const cdThumbAnimate = $('.cdMove').animate ([
        { transform: 'rotate(0deg)'},
        { transform : 'rotate(360deg)' }
    ], {
        duration : 10000, 
        iterations : Infinity,
        easing : 'linear'
    })
    cdThumbAnimate.play()

    if (isPlaying) {
        play.classList.add('active')
        // cdThumbAnimate.play()
    } else {
        play.classList.remove('active')
        play.classList.add('reset')
        setTimeout(() => {
            play.classList.remove('reset')
        }, 2000)

        // cdThumbAnimate.pause()
    }

}

function customeVolume(){
    audio.volume = volume.value;
        if (audio.volume === 0) {
            $('.fa-volume-high').style.display = 'none'
            $('.fa-volume-low').style.display = 'none'
            $('.fa-volume-xmark').style.display = 'block'
        }
        if (audio.volume >0 && audio.volume < 0.5) {
            $('.fa-volume-high').style.display = 'none'
            $('.fa-volume-low').style.display = 'block'
            $('.fa-volume-xmark').style.display = 'none'
        } 
        if (audio.volume >= 0.5) {
            $('.fa-volume-high').style.display = 'block'
            $('.fa-volume-low').style.display = 'none'
            $('.fa-volume-xmark').style.display = 'none'
        }
        console.log(audio.volume)
}

function handleEvent() {
    prev.onclick = prevSong
    next.onclick = nextSong
    repeat.onclick = repeatSong
    random.onclick = randomSong
    btnPlay.onclick = playBtnSong
    audio.ontimeupdate = progress
    audio.onended = () => {
        if (isRepeat) {
            audio.play()
        } else {
            next.click()
        }
    }
    progressBar.onchange = rewindProgressBar
    volume.addEventListener('input', customeVolume)
    clickSong()
    btnFindSong.onclick = () => {
        isFindSong = true
        playMusic()
    }
}


async function start() {
    // render list songs
    await getListMusic(render)
    await loadFirstSong()
    await handleEvent()
    await handleCostumeData()
}

start()
