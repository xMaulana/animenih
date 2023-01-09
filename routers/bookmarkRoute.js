const route = require("express").Router()

route.get("/", (req,res) =>{
    try{
        res.render("bookmark/bookmark",{
            layout: "bookmark/main-layout"
        })
    }catch(err){
        res.send("<h1>Error</h1>")
    }
})


module.exports = route