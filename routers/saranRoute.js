const route = require("express").Router();
const uuid = require("uuid");
const flash = require("connect-flash");
const dbClient = require("../db/dbconfig");
// const map = new Map();


route.use(flash());

route.get("/", (req,res)=>{
    res.render("saran/chat",{
        layout: "utama/main-layout",
        style: "/style/saran.css",
        id: req.session.userId,
        flashMsg: req.flash("hasil")
    })
})

route.post("/", async(req,res)=>{
    try{
        await dbClient.getCol("saran")
            .insertOne({userId: req.session.userId , username: req.body.username, saran: req.body.saran});
    
        req.flash("hasil", "Saran berhasil dikirimkan!"),
        req.flash("hasil", "Sukses")
        res.redirect("/kotakSaran")
    }catch(err){
        req.flash("hasil", "Gagal terkirim!"),
        req.flash("hasil", "Error")
        res.redirect("/kotakSaran")
    }
})

route.get("/listSaran", (req,res) =>{
    res.redirect("/kotakSaran/listSaran/i")
})

route.get("/listSaran/:cred", async (req,res) =>{
    try{
        if(req.params.cred != "opensesame"){
            throw new Error("Credential salah!")
        }
        const data = await dbClient.getCol("saran").find().toArray()
        res.json({data})
    }catch(err){
        req.flash("hasil", err.msg || err.message)
        req.flash("hasil", "Error")
        res.redirect("/kotakSaran")
    }
})

route.get("/u", (req,res) =>{
    const id = uuid.v4()

    if(!req.session.userId) req.session.userId = id;

    res.json({id: req.session.userId})
})


module.exports = route;