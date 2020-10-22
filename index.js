const express = require("express");
const session = require("express-session");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); 
const MongoStore = require("connect-mongoose-only")(session);

mongoose.connect(`mongodb+srv://0307kwon:12345@cluster0.etajt.mongodb.net/test?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    id:String,
    pwd:String,
    nickname:String,
});

const User = mongoose.model("User",userSchema);

app.use(body_parser.urlencoded({extended: false}))

app.use(session({
    secret: "dskvnDT12#$#!@",
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
}));

app.get("/",(req,res)=>{
    if(req.session.test !== undefined){
        req.session.test = Number(req.session.test)+1
    }else{
        req.session.test = 1;
    }
    res.send(req.session);
});

app.get("/auth/logout", (req,res)=>{
    delete req.session.nickname;
    res.redirect("/welcome");
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
                <p><a href="/auth/login/page">Login</a></p>
                <p><a href="/auth/register/page">Register</a></p>
            </body>
        `)
    }
});

app.get("/auth/register/page",(req,res)=>{
    res.send(`
    <body>
        <h1>Register</h1>
        <form action="/auth/register/process"method="POST">
            <p><input type="text" name="id" placeholder="id"></p>
            <p><input type="password" name="pwd"></p>
            <p><input type="text" name="nickname" placeholder="nickname"></p>
            <p><input type="submit"></p>
        </form>
    </body>
    `)
})

app.post("/auth/register/process",(req,res)=>{
    const id = req.body.id;
    const pwd = req.body.pwd;
    const nickname = req.body.nickname;
    const user = new User({
        id:id,
        pwd:pwd,
        nickname:nickname,
    });
    user.save((err)=>{
        if(err) throw err;
        res.redirect("/welcome");
    })


});

app.post("/auth/login/process",(req,res)=>{
    User.findOne({id:req.body.id},(err,user)=>{
        if(err) throw err;
        if(user === null){
            res.send("없는 아이디 입니다.");
        }else{
            if(user.pwd === req.body.pwd){
                req.session.nickname = user.nickname;
                req.session.save((err)=>{
                    if(err) throw err;
                    res.redirect("/welcome");
                });
            }else{
                res.send("비밀번호 틀림");
            }
        }
    });
});

app.get("/auth/login/page",(req,res)=>{
    res.send(`
    <body>
        <h1>Login</h1>
        <form action="/auth/login/process" method="POST">
            <p><input type="text" name="id" placeholder="id"></p>
            <p><input type="password" name="pwd"></p>
            <input type="submit">
        </form>
    </body>
    `);
})

app.listen(3002,()=>{
    console.log("실행");
})