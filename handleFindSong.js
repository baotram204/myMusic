// import { list, isPlaying, currSong, loadtime } from "./main.js"


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
                console.log(isPlaying)
            } 
        })
        loadtime()
    }
}


// export default handleFindSong