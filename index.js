const express = require("express");
const session = require("express-session");
const body_parser = require("body-parser");

const app = express();

app.use(body_parser.urlencoded({extended: false}))

app.use(session({
    secret: "dskvnDT12#$#!@",
    resave: false,
    saveUninitialized: true,
}));

app.get("/auth/logout", (req,res)=>{
    req.session.nickname = undefined;
    res.redirect("/auth/login/page");
});

app.get("/welcome",(req,res)=>{
    if(req.session.nickname !== undefined){
        res.send(`
            <body>
                <h1>welcome</h1>
                <p>안녕하세요 ${req.session.nickname} 님!</p>
                <a href="/auth/logout">Logout</a>
            </body>
        `)
    }else{
        res.send(`
            <body>
                <h1>welcome</h1>
                <a href="/auth/login/page">Login</a>
            </body>
        `)
    }
});

app.post("/auth/login/process",(req,res)=>{
    console.log(req.body);
    const db = {
        id:"0307kwon",
        password:"1234",
        nickname:"감군",
    }
    const id = req.body.id;
    const pwd = req.body.password;
    if(id === db.id && pwd === db.password){
        req.session.nickname = db.nickname;
        res.redirect("/welcome");
    }else{
        res.send("로그인 실패");
    }
});

app.get("/auth/login/page",(req,res)=>{
    res.send(`
    <body>
        <h1>Login</h1>
        <form action="/auth/login/process" method="POST">
            <p><input type="text" name="id" placeholder="id"></p>
            <p><input type="password" name="password"></p>
            <input type="submit">
        </form>
    </body>
    `);
})

app.listen(3002,()=>{
    console.log("실행");
})