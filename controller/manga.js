const {JSDOM} = require("jsdom");
const axios = require('axios');

const website = "https://komikindo.pro/";

const user_agent = [
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
]

const getData= async(link) =>{
    const data = await axios.get(link, {
        headers: {
            "User-Agent": user_agent[Math.floor(Math.random()%user_agent.length)],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        }
    })
    return new JSDOM(data.data).window.document
}


const homeManga = async () =>{
    try{
     let jdom = await getData(website)
     let data2 = jdom.querySelector(".postbody");
     let b = {
         populer: [],
         terbaru: []
     }
     
     //ambil manga populer
     data2.querySelector(".mangapopuler").querySelectorAll(".animepost").forEach(res =>{
         let p = res.querySelector(".animposx");
         let toPush = {
            judul: p.querySelector(".tt").querySelector("h4").innerHTML,
            linkGambar: p.querySelector("img").getAttribute("src").split("?")[0],
            linkManga: p.querySelector("a").getAttribute("href").split("/")
         }
         b.populer.push(toPush)
     })

     //ambil manga terbaru
     data2.querySelector(".chapterbaru").querySelectorAll(".animepost").forEach(res =>{
         let p = res.querySelector(".animposx").querySelector(".animepostxx-top");
         let toPush = {
             judul : p.querySelector("h4").innerHTML,
             linkGambar: p.querySelector("img").getAttribute("src").split("?")[0],
             linkManga: p.querySelector("a").getAttribute("href").split("/")
         }
         b.terbaru.push(toPush)
     })
     

     return b;
    }catch(err){
        console.log(err)
    }
 }

const readManga = async(title) =>{
    let jdom = await getData(`${website}${title}`);
    let b = {
        allImg: [],
        nePr: []
    }
    //ambil semua gambar
    jdom.querySelector("#chimg-auh").querySelectorAll("img").forEach(res =>{
        let imgdat = res.getAttribute("src")
        let temp = imgdat.split("/")[2].replace(/\./g,"-") + ".translate.goog";
        imgdat = imgdat.replace(imgdat.split("/")[2], temp);
        b.allImg.push(imgdat)
    })
    jdom.querySelector(".nextprev").querySelectorAll("a").forEach(res =>{
        b.nePr.push(res.getAttribute("href").split("/"))
    })



    return b
}

const searchManga = async (judul) =>{
    let jdom = await getData(`${website}?s=${judul}`);
    let b = {
        data: []
    }
    let data2 = jdom.querySelector("#content").querySelector(".film-list").querySelectorAll(".animepost");

    data2.forEach(res => {
        let p ={
            judul: res.querySelector(".bigors").querySelector("h4").innerHTML,
            linkGambar: res.querySelector(".animposx").querySelector("a").querySelector("img").getAttribute("src").split("?")[0],
            linkManga: res.querySelector(".animposx").querySelector("a").getAttribute("href").split("/")
        }
        b.data.push(p)
    })
    return b
}

const viewManga = async (judul) =>{
    try{
    let link = `${website}komik/${judul}`
    let jdom = await getData(link)
    let data2 = jdom.querySelector(".postbody")
    let b = {
        info: [],
        thumb: data2.querySelector(".thumb").querySelector("img").getAttribute("src"),
        chapter: []
    }

    //mendapatkan info
    data2.querySelector(".infox").querySelectorAll("span").forEach((res,i) =>{
        if(res.querySelector("a")){
            b.info.push(res.querySelector("a").innerHTML)
        }else{
            let pro = res.innerHTML.split(/\<.*?\>/g)
            b.info.push(pro[pro.length -1])
        }
    })

    //mendapatkan chapter list
    jdom.querySelector("#chapter_list").querySelector("ul").querySelectorAll("li").forEach(res =>{
        let p ={
            chap: res.querySelector(".lchx").querySelector("a").querySelector("chapter").innerHTML,
            linkManga: res.querySelector(".lchx").querySelector("a").getAttribute("href").split(/[\s;]+|\/{2}/)[1].split("/")[1]
        }
        b.chapter.push(p)
    })

    return b
}catch(err){
    console.log(err)
}
}
 
module.exports = {homeManga, searchManga, viewManga, readManga}
