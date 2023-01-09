const app = require("express").Router()
const acc = require("../controller/account")
const flash = require("connect-flash")
const cookiename = "sleepingowl"


const msg_success = `
            <!doctype html>
            <html>
            <head><title>Redirect</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous"></head>
            <body>
            <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Anda telah berhasil login! mengalihkan..."
            })
            setTimeout(() => window.location.href = "/akun",1500)
            </script>
            </body>
            </html>
            `;

app.use(flash())

app.get("/login", async (req, res) =>{
    try{
        console.log(req.cookies[cookiename])
        if((await acc.getAkunbyCookie(req.cookies[cookiename])).status){
            res.send(msg_success)
        }else{
            res.render("akun/login", {
                layout: "utama/main-layout",
                style: "/style/login.css",
                pesan: req.flash("login")
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err})
    }
})


app.post("/login", async (req,res) =>{
    try{
        await acc.login(req.body.username, req.body.password, req.cookies[cookiename])
        res.redirect("/akun/login")
    }catch(err){
        req.flash("login", "login gagal!")
        res.redirect("/akun/login")
    }
})

app.get("/registrasi", async(req,res) =>{
    try{
        if((await acc.getAkunbyCookie(req.cookies[cookiename])).status){
            res.send(msg_success)
        }else{
            res.render("akun/register",{
                layout: "utama/main-layout",
                style: "/style/login.css",
                flashMsg: req.flash("regis")
            })
        }
    }catch(err){
        res.status(500).json(err)
    }
})

app.post("/registrasi", async(req,res) =>{
    try{
        await acc.createAcc(req.body.username, req.body.password, req.cookies[cookiename])
        req.flash("regis", "success");
        req.flash("regis", "Sukses!");
        req.flash("regis", "Akun sukses dibuat!");
        res.redirect("/akun/registrasi");
    }catch(err){
        req.flash("regis", "error");
        req.flash("regis", "Gagal!");
        req.flash("regis", "Akun gagal dibuat! " + err.err);
        res.redirect("/akun/registrasi");
    }
})

app.get("/", async(req,res) =>{
    try{
        if(!(await acc.getAkunbyCookie(req.cookies[cookiename])).status){
            res.redirect("/akun/login")
        }else{
            res.render("akun/home",{
                layout: "utama/main-layout",
                style: "none"
            })
        }
    }catch(err){
        res.json(err)
    }
})


module.exports = app