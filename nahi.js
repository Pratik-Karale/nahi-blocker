// INSERT API KEY HERE
API_KEY="abcdefgh212"

function getVidId(link) {
    let id = ""
    if (link.includes("shorts")) id = link.split("/").at(-1);
    else id = link.split("v=").at(-1);
    return id
}
let loadedCounter = 0
// all categories are
// {1: 'Film & Animation', 2: 'Autos & Vehicles', 10: 'Music', 15: 'Pets & Animals', 17: 'Sports', 18: 'Short Movies', 19: 'Travel & Events', 20: 'Gaming', 21: 'Videoblogging', 22: 'People & Blogs', 23: 'Comedy', 24: 'Entertainment', 25: 'News & Politics', 26: 'Howto & Style', 27: 'Education', 28: 'Science & Technology', 29: 'Nonprofits & Activism', 30: 'Movies', 31: 'Anime/Animation', 32: 'Action/Adventure', 33: 'Classics', 34: 'Comedy', 35: 'Documentary', 36: 'Drama', 37: 'Family', 38: 'Foreign', 39: 'Horror', 40: 'Sci-Fi/Fantasy', 41: 'Thriller', 42: 'Shorts', 43: 'Shows', 44: 'Trailers'}
let neededCategoriesIds=[26,25,27,28,29]
let onLoadInterval = setInterval(() => {
    let ytVidLinks = [...document.querySelectorAll("ytd-rich-grid-media"),...document.querySelectorAll(".ytd-video-renderer"),...document.querySelectorAll(".ytd-compact-video-renderer")]

    if (ytVidLinks.length > 0 && ytVidLinks.length > loadedCounter) {
        ytVidLinks.forEach(elem => {
            let vidURLTag = elem.querySelector(".yt-simple-endpoint")
            let vidId = "";
            if (vidURLTag && vidURLTag.href) {
                vidId = getVidId(vidURLTag.href);
            }
            else return;

            fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=${API_KEY}`).then(resp => resp.json())
                .then(d => {
                    let categoryId=d.items[0].snippet.categoryId
                    return neededCategoriesIds.includes(+categoryId)
                })
                .then(isImportant => {
                    if (isImportant) return;
                    elem.setAttribute("style", "{display: grid;place-items: center;}")
                    elem.innerHTML = `<h1 style="color: white; padding:1em;">"Hello there im from another world"<br>youtube.com${vidURLTag.href}</h1>`
                })
        })
        loadedCounter = ytVidLinks.length
        // clearInterval(onLoadInterval)
    }
}, 500)

document.querySelector("yt-formatted-string").onload = () => {

    alert(1212)
}