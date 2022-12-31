const router = require("express").Router();
const sData = require("../controller/anime");



router.get("/", async (req,res) =>{
    try{
        let data = await sData.getHome();
        data = data.data
        res.render("page/home", {
            onGoing: data.onGoing,
            selesai: data.selesai,
            current: "home",
            layout: "main-layout"
        })
    }catch(err){
        res.status(400).send("error!")
    }
})

router.get("/anime/:judul",async (req,res) =>{
    try{
        const data = await sData.getAnime(req.params.judul);

        res.render("page/animdat",{
            animdat: data.data,
            layout: "main-layout",
            current: "nothing",
        })
    }catch(err){
        res.status(400).send("error!")
    }
})

router.get("/episode/:juduleps", async (req,res) =>{
    try{
        const data = await sData.getEpisode(req.params.juduleps)
        
        res.render("page/episode", {
            data: data.data,
            layout: "main-layout",
            current: "nothing"
        })
    }catch(err){
        res.status(400).send("error!")
    }
})

router.get("/batch/:juduleps", async (req,res) =>{
    try{
        const data = await sData.getBatch(req.params.juduleps)

        res.render("page/batch", {
            data: data.data,
            layout: "main-layout",
            current: "nothing"
        })
    }catch(err){
        res.status(400).send("error!")
    }
})

router.get("/lengkap/:judul", async(req, res) =>{
    try{
        let data = await sData.getLengkap(req.params.judul);
        // res.json({data})
        res.render("page/lengkap",{
            data: data.data,
            layout: "main-layout",
            current: "nothing"
        })
    }catch(err){
        res.status(400).send("error!")
    }
})


router.get("/list-anime", async (req,res) =>{
    try{
        let data = await sData.getAnimeList();

        // res.json({data})
        res.render("page/list-anim",{
            data: data.data,
            layout: "main-layout",
            current: "list-anime"
        })
    }catch(err){
        res.status(400).send("error!")
    }
})

router.get("/list-genre", async (req, res) =>{
    try{
        let data = await sData.getGenreList();

        // res.json({data})
        res.render("page/list-genre",{
            data: data.data,
            layout: "main-layout",
            current: "list-genre"
        })
    }catch(err){
        res.status(400).send("error!")
    }
   
})

router.get("/genre/:genre/page/:page", async(req,res,next) =>{
    try{
    let data = await sData.getGenre(req.params.genre, req.params.page)

    // res.json({data})
    res.render("page/genre",{
        page: req.params.page,
        genre: req.params.genre,
        data: data.data.anim,
        jml: data.data.jmlPage,
        layout: "main-layout",
        current: "nothing"
    })
    }
    catch(err){
        res.status(400).send("error!")
    }
})

router.get("/search", async(req, res) =>{
    try{
        const data = await sData.searchAnim(req.query.judul);
        console.log(data)
        // res.json({data})
        res.render("page/search",{
            current: "nothing",
            search: req.query.judul,
            layout: "main-layout",
            data: data.data
        })
    }catch(err){
        res.status(404).render("page/notfound",{
            layout: "main-layout",
            current: "nothing"
        });
    }
})




module.exports = router;