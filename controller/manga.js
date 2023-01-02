const {JSDOM} = require("jsdom");
const axios = require('axios');

const website = "https://komikindo.id/";

const homeManga = async () =>{
    try{
     let data = await axios.get(website)
     let jdom = new JSDOM(data.data).window.document;
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
    let data = await axios.get(`${website}${title}`);
    let jdom = new JSDOM(data.data).window.document;
    let b = {
        allImg: [],
        nePr: []
    }
    //ambil semua gambar
    jdom.querySelector("#chimg-auh").querySelectorAll("img").forEach(res =>{
        b.allImg.push(res.getAttribute("src"))
    })
    jdom.querySelector(".nextprev").querySelectorAll("a").forEach(res =>{
        b.nePr.push(res.getAttribute("href").split("/"))
    })



    return b
}

const searchManga = async (judul) =>{
    let data = await axios.get(`${website}?s=${judul}`);
    let jdom = new JSDOM(data.data).window.document;
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
    let data = await axios.get(link)
    let jdom = new JSDOM(data.data).window.document
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