// INSERT API KEY HERE
API_KEY = "abcd"

function getVidId(link) {
    let id = ""
    if (link.includes("shorts")) id = link.split("/").at(-1);
    else id = link.split("v=").at(-1);
    return id
}
let loadedCounter = 0
let loadedURL = window.location.href;
let onLoadInterval;
// all categories are
// {1: 'Film & Animation', 2: 'Autos & Vehicles', 10: 'Music', 15: 'Pets & Animals', 17: 'Sports', 18: 'Short Movies', 19: 'Travel & Events', 20: 'Gaming', 21: 'Videoblogging', 22: 'People & Blogs', 23: 'Comedy', 24: 'Entertainment', 25: 'News & Politics', 26: 'Howto & Style', 27: 'Education', 28: 'Science & Technology', 29: 'Nonprofits & Activism', 30: 'Movies', 31: 'Anime/Animation', 32: 'Action/Adventure', 33: 'Classics', 34: 'Comedy', 35: 'Documentary', 36: 'Drama', 37: 'Family', 38: 'Foreign', 39: 'Horror', 40: 'Sci-Fi/Fantasy', 41: 'Thriller', 42: 'Shorts', 43: 'Shows', 44: 'Trailers'}
let neededCategoriesIds = [26, 25, 27, 28, 29, 22]
function restartScript() {
    clearInterval(onLoadInterval)
    alert("changed url")
    onLoadInterval = setInterval(mainScript, 500)
}
function removeExtraShelves() {
    // shelves are shorts, community posts, etc on recomended page
    // alert("removing shelves");
    [...document.querySelectorAll(".ytd-rich-section-renderer")].forEach(elem => elem.remove())
}
function mainScript() {
    if (window.location.href !== loadedURL) {
        restartScript()
        removeExtraShelves()
        loadedCounter = 0
        loadedURL = window.location.href
        return;
    }

    let ytVidLinks = [...document.querySelectorAll("ytd-rich-grid-media"), ...document.querySelectorAll(".ytd-video-renderer"), ...document.querySelectorAll("ytd-compact-video-renderer")]
    if (window.location.href.includes("watch")) {
        let vidId=window.location.href.split("v=").at(-1)
        fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=${API_KEY}`)
            // only for test
            .catch(() => {
                return { items: [{ snippet: { categoryId: Math.round(Math.random() * 10) + 20 } }] }
            })
            .then(resp => resp.json())
            .then(d => {
                // when yt api quota is exceeded
                if (d.error) {
                    return { items: [{ snippet: { categoryId: Math.round(Math.random() * 10) + 20} }] }
                    // return {items:[{snippet:Math.round(Math.random()*10)+20}]}
                } else return d;
            })
            // only for test

            .then(d => {
                let categoryId = d.items[0].snippet.categoryId
                return neededCategoriesIds.includes(+categoryId)
            }).then(isImportant => {
                if (isImportant) return;
                // alert("oof")
                let vidPage=document.querySelector("ytd-watch-flexy");
                [...vidPage.children].forEach(child=>child.remove())
                vidPage.setAttribute("style","display: grid;color: white;place-items: center;height: 100vh;overflow-y: hidden;")
                vidPage.innerHTML="<h1>\"ABCD EII EJI #ORJO JFDEO\"</h1>"

            })
    }
    if (ytVidLinks.length > 0 && ytVidLinks.length > loadedCounter) {
        removeExtraShelves()
        // alert("new links found")
        ytVidLinks.forEach(elem => {
            let vidURLTag = elem.querySelector(".yt-simple-endpoint")
            let vidId = "";
            if (vidURLTag && vidURLTag.href) {
                vidId = getVidId(vidURLTag.href);
            }
            else return;

            fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=${API_KEY}`)
                // only for test
                .catch(() => {
                    return { items: [{ snippet: { categoryId: Math.round(Math.random() * 10) + 20 } }] }
                })
                .then(resp => resp.json())
                .then(d => {
                    // when yt api quota is exceeded
                    if (d.error) {
                        return { items: [{ snippet: { categoryId: Math.round(Math.random() * 10) + 20 } }] }
                        // return {items:[{snippet:Math.round(Math.random()*10)+20}]}
                    } else return d;
                })
                // only for test

                .then(d => {
                    let categoryId = d.items[0].snippet.categoryId
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
}
onLoadInterval = setInterval(mainScript, 500)

document.querySelector("yt-formatted-string").onload = () => {

    alert(1212)
}