require("dotenv").config()
const express = require("express")
const route = require("./routers/animRoute")
const ejsLay = require("express-ejs-layouts")
const app = express();
const PORT = process.env.PORT;


app.set("view engine", "ejs")
app.use(ejsLay)

app.use(express.static("public"))

app.use("/", route);

app.use("*",(req,res,next) =>{
    res.status(404).render("page/notfound",{
        layout: "main-layout",
        current: "nothing"
    });
})

app.listen(PORT)