
import getListMusic from './getApi.js'
import handleChangeData from './changeData.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const iconPlay = $('.fa-circle-play')
const iconPause = $('.fa-circle-pause')
const audio = document.getElementById('audio')



let list, currSong=0, isPlaying = false, isRepeat = false, isRandom = false, isNext = false, isPrev = false
let favoritesSong = []

// render song
function getSongs(songs) {
    list = songs
    console.log(list)
    let html =''
    songs.map((song,index) => {
        return html += `
        <li class="song" data-index="${index}">
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

function handleEventTab() {
    const tab2 = $('.tab2')
    tab2.onclick = () => {
        $('.active').classList.remove('active')
        tab2.classList.add('active')
        $('.listMusic > ul').innerHTML = ''
        handleEvent()

        let html =''
    favoritesSong.map(song => {
        return html += `
        <li class="song" id="${song.id}">
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

    // click song
    Array.from(songs).map((song,index) =>{
        //click song
        song.onclick = (e) =>{
            const songNode = e.target.closest('.song:not(.active)')
            const listIcons = e.target.closest('.icons')

            if(!songNode && !isPlaying && !listIcons) {
                currSong = Number(song.id)
                handlePlayMusic()
                handleCdtheme()

            }
            if(songNode && !listIcons) {
                currSong = Number(song.id)
                handlePlayMusic()
                handleCdtheme()
            }
        }


        const favoBtn = song.children[2].children[0]
        favoBtn.addEventListener('click', function() {
            let indexCurr = index
            if (this.classList.contains('favo')) {
                this.classList.remove('favo');
                list.map((play,index) => {
                    if (index == indexCurr) {
                        favoritesSong.map((song, index) => {
                            if(index == indexCurr) favoritesSong.splice(index, 1)
                        })
                    }
                })
                
            } else {
                this.classList.add('favo');
                list.map((play,index) => {
                    if (index == indexCurr) favoritesSong.push(play)
                })
            }
            console.log(favoritesSong)
        });

    })


    prev.onclick = () => {
        if (currSong === 0) {
            currSong = list.length-1
        } else {
            currSong = currSong -1
        }
        isPlaying = true
        handlePlayMusic()
        handleCdtheme()
    }

    next.onclick = () => {

        
        if (isRandom) {
            currSong = Math.floor( Math.random()* (list.length ))  
            
        } else {
            currSong = currSong === list.length-1 ? 0 : currSong + 1
        }

        console.log(currSong)
        isNext = true
        isPlaying = true
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
    })

}

// handle favorite Song
function handleFavor(song, index) {
        
}

// when music is playing
function handlePlayMusic() {
    list.map((play,index) => {
        if (index == currSong) {
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

// cd 
function handleCdtheme() {
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


//  render first song 
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
}

// handle search song
function handleFindSong() {
    const $ = document.querySelector.bind(document)

    const input = document.querySelector('.find')
    const  btnFindSong = document.querySelector('.fa-magnifying-glass')
    const audio = document.getElementById('audio')


    btnFindSong.onclick = () =>{
        let song = input.value
        list.map((play,index) => {
            if(play.name === song) {
                $('.listMusic ul .active').classList.remove('active')
                currSong = index
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

                audio.play()
                isPlaying = true
                input.value=''
                currSong = index

            } 
        })
        handleCdtheme()
        loadtime()
    }
}


async function start() {
    // render list songs
    await getListMusic(getSongs)
    await loadFirstSong()
    await handleEvent()
    await handleChangeData()
    await handleFindSong()
    await handleEventTab()
}

start()