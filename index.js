require("dotenv").config()

//package
const express = require("express")
const ejsLay = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const uuid = require("uuid")
const cookieParser = require("cookie-parser")

// const WebSocket = require("ws")
const session = require("express-session")

//route
const kartunRoute = require("./routers/animRoute")
const komikRoute = require("./routers/komikRoute")
const saranRoute = require("./routers/saranRoute")
const bookmarkRoute = require("./routers/bookmarkRoute")

//db
// const db = require("./db/dbconfig")

//env
const app = express();
const server = require("http").createServer(app)
// const io = require("socket.io")(server)
const PORT = process.env.NODE_ENV == "development" ? 3000 : process.env.PORT;
const sessionParser = session({
    cookie: {maxAge: 24 * 60 * 60 * 1000, httpOnly:false, sameSite: "none"},
    saveUninitialized: true,
    secret: "sheilaSev7n",
    resave: false
})

//inisiasi
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

//sesion & last online
let uOn ={
    todayT: new Date(),
    curr: new Date(),
    today: 9,
    total: 537,
    users: {}
}
app.use(sessionParser)
app.use(cookieParser())

app.use(async (req, res, next) =>{
    if(!req.session.userId){
        const id = uuid.v4()
        req.session.userId = id;
        uOn.today++;
        uOn.total++;
    }

    if(!req.cookies["sleepingowl"]){
        let hex = require("crypto").randomBytes(30).toString("hex")
        await res.cookie("sleepingowl",hex , {sameSite: "none", secure: true})
        await db.getCol("akun").insertOne({ip:req.ip,userAgent: req.headers["user-agent"],cookie: hex})
    }

    if(req.session.userId){
        uOn.users[req.session.userId] = Date.now();
    }
    next();
})

///////////////// interval
let now;
setInterval(() =>{
    now = Date.now();
    uOn.curr = new Date();
    Object.keys(uOn.users).forEach(id =>{
        if(now - uOn.users[id] > 60000){
            delete uOn.users[id];
        }
    })

    if(uOn.todayT.getDate() != uOn.curr.getDate()){
        uOn.today = 0;
        uOn.todayT = new Date();
    }
}, 1000)

/////////////////

//pake routing
app.use("/kartun", kartunRoute);
app.use("/komik", komikRoute);
app.use("/kotakSaran", saranRoute)
app.use("/bookmark", bookmarkRoute)
app.get("/",(req,res) =>{
    res.render("utama/page/home",{
        layout: "utama/main-layout",
        style: "/landing.css"
    })
})

app.get("/ngapainkesini", async (req,res) =>{
    let data = "data"
    res.send(`
    <center>
        <h1>Ngapain kesini? </h1>
        <br>
        <p>${data}</p>
        <p>Online: ${Object.keys(uOn.users).length}</p>
        <p>Today: ${uOn.today}</p>
        <p>Total: ${uOn.total}</p>
    </center>
    `);
})

app.use("*",(req,res,next) =>{
    res.status(404).send("<h1>Not Found</h1>")
})


server.listen(PORT, async()=>{
    try{
        // let data = await db.connect();
        // console.log(data.msg);
        console.log("Aplikasi berjalan pada port "+ PORT) + PORT
    }catch(err){
        console.log(err)
    }
   
})
