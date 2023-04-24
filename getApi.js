let api = 'https://api-sp2t.onrender.com/api/music'
async function getListMusic(callback) {
    await fetch(api)
        .then(response => response.json())
        .then(callback)
}

export default getListMusic