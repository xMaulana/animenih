const app = require("express").Router()
const {homeManga, searchManga, viewManga, readManga} = require("../controller/manga")

app.post("/cariManga", async (req,res) =>{
    try{
        let data = await searchManga(req.body.manga)

        res.render("komik/search",{
            layout: "komik/layouts/main-layout",
            title: `${req.body.manga}`,
            header1: req.body.manga,
            data
        })
    }catch(err){
        console.log(req.body)
        console.log(err)
        res.send(`<h1>Error</h1>`)
    }
})
    
app.get("/readManga/:title1",async (req,res) =>{
    try{
        let data = await readManga(req.params.title1);
        res.render("komik/read",{
            layout: "komik/layouts/main-layout",
            title: req.params.title1.split("-").join(" ").toUpperCase(),
            header1:req.params.title1.split("-").join(" ").toUpperCase(),
            baca: true,
            data
        })
    }catch(err){
        res.send(`<h1>Error</h1>`)
    }
})
app.get("/bacaManga/:judul", async (req,res) =>{
    try{
        let data = await viewManga(req.params.judul)
        let jodoel = req.params.judul.split("-").join(" ")
        res.render("komik/info",{
            baca: true,
            layout: "komik/layouts/main-layout",
            title: `KOMIK ${jodoel.toUpperCase()}`,
            header1: `BACA KOMIK<br>${jodoel.toUpperCase()}`,
            info: data.info,
            chapter : data.chapter,
            thumb: data.thumb
        })
    }
    catch(err){
        res.send("<h1>404 NOT FOUND </h1>")
    }
})
    
    
app.get("/", async(req,res) =>{
    try{
        let data = await homeManga();
        res.render("komik/home",{
            layout : "komik/layouts/main-layout",
            title: "WEB BACA MANGA",
            header1: "WEB BACA MANGA",
            data
        })
    }catch(err){
        res.send(`<h1>Error</h1>`)
    }
})


module.exports = app;