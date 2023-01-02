require("dotenv").config()
const express = require("express")
const kartunRoute = require("./routers/animRoute")
const komikRoute = require("./routers/komikRoute")
const ejsLay = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express();
const PORT = process.env.NODE_ENV == "development" ? 3000 : process.env.PORT;


app.set("view engine", "ejs")
app.use(ejsLay)

if(process.env.NODE_ENV == "development"){
    app.use(morgan(":date | :method | :url | :status | :remote-addr | :response-time ms"))
}else{
    app.use(morgan(":date | :url | :remote-addr"))
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static("public"))

app.use("/kartun", kartunRoute);
app.use("/komik", komikRoute);

app.get("/",(req,res) =>{
    res.render("utama/page/home",{
        layout: "utama/main-layout"
    })
})

app.use("*",(req,res,next) =>{
    res.status(404).send("<h1>Not Found</h1>")
})

app.listen(PORT,()=> console.log("Aplikasi berjalan pada port "+ PORT) + PORT)