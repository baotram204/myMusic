function handleChangeData() {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    let currAvt, currColor =  window.getComputedStyle(document.documentElement).getPropertyValue('--active-color');

    const img = $('.img');
    let isChanged = false
    img.onclick = () =>{
        if(isChanged === false) {
            isChanged = true
            $('.setting').style.display = 'block';
            handleUpdateData()
    } else {
            isChanged = false
            $('.setting').style.display = 'none';
    }
    }


    function handleUpdateData() {
        
        const avts = $$('.set-av')
        const colors = $$('.set-color')
        const btnSubmit = $('.save')

        avts.forEach(avt => {
            avt.onclick = () =>{
                currAvt = avt.style.backgroundImage
                let tam = $('.choose1')
                tam.classList.remove('choose1')
                avt.classList.add('choose1')
            }
        })

        colors.forEach(color => {
            color.onclick = () => {
                currColor = color.style.backgroundColor
                let tam = $('.choose2')
                tam.classList.remove('choose2')
                color.classList.add('choose2')

            }
        })

        btnSubmit.onclick = () => {
            const name = $('.fullName')
            const bio = $('.bio')
            $('.img').style.backgroundImage = currAvt
            document.documentElement.style.setProperty('--active-color', `${currColor}`);
            $('.avata > .content > h3').innerHTML = name.value
            $('.avata > .content > p').innerHTML = bio.value
            $('.setting').style.display = 'none';
        }

    }

    function editData() {

    }
}

export default handleChangeData