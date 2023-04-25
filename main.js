
import getListMusic from './getApi.js'
import handleChangeData from './changeData.js'
// import handleFindSong from './handleFindSong.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const iconPlay = $('.fa-circle-play')
const iconPause = $('.fa-circle-pause')
const audio = document.getElementById('audio')



let list, currSong=1, isPlaying = false, isRepeat = false, isRandom = false, isNext = false, isPrev = false


function getSongs(songs) {
    list = songs
    console.log(list)
    let html =''
    songs.map(song => {
        return html += `
        <li class="" id="${song.id}">
            <div class="avt" style="background-image: url(${song.img})"></div>
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

    // songs.forEach(song =>{
    //     song.onclick = () =>{
    //         handlePlayMusic()
    //         handleCdtheme()
    //         currSong = song.id  
    //     }
    // })

    songs.forEach(song =>{
        song.onclick = (e) =>{
        }
    })

    prev.onclick = () => {
        if (currSong === 1) {
            currSong = list.length
        } else {
            currSong = currSong -1
        }
        isPlaying = true
        handlePlayMusic()
        handleCdtheme()
    }

    next.onclick = () => {
        
        if (isRandom) {
            currSong = Math.floor( Math.random()* (list.length ))  +1
            
        } else {
            currSong = currSong === list.length ? 1 : currSong+1
        }
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

// when music is playing
function handlePlayMusic() {
    list.forEach(play => {
        if (play.id == currSong) {
            $('.listMusic ul .active').classList.remove('active')
            let element = document.getElementById(`${currSong}`)
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

function handleCdtheme() {
    const play = $('.cdTheme')
    console.log(play)

    // const cdThumbAnimate = $('.cdMove').animate ([
            
    //     { transform: 'rotate(0deg)'},
    //     { transform : 'rotate(360deg)' }
    // ], {
    //     duration : 10000, 
    //     iterations : Infinity,
    //     easing : 'linear'
    // })



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

function handleFindSong() {
    const $ = document.querySelector.bind(document)

    const input = document.querySelector('.find')
    const  btnFindSong = document.querySelector('.fa-magnifying-glass')
    const audio = document.getElementById('audio')


    btnFindSong.onclick = () =>{
        let song = input.value
        list.forEach(play => {
            if(play.name === song) {
                $('.listMusic ul .active').classList.remove('active')
                const iconPlay = $('.fa-circle-play')
                const iconPause = $('.fa-circle-pause')

                currSong = play.id
                let element = document.getElementById(`${currSong}`)
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
}

export {list, isPlaying, currSong, loadtime} 

start()