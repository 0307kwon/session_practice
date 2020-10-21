const express = require("express");
const session = require("express-session");
const body_parser = require("body-parser");
const app = express(); 
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
    uri:"mongodb+srv://0307kwon:12345@cluster0.etajt.mongodb.net/test?retryWrites=true&w=majority",
    collection:"session",
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
})

store.on("error",(err)=>{
    console.log(err);
})
store.once("open",()=>{
    console.log("연결");
})
app.use(body_parser.urlencoded({extended: false}))

app.use(session({
    secret: "dskvnDT12#$#!@",
    resave: false,
    saveUninitialized: true,
    store:store,
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
        req.session.save((err)=>{
            if(err) throw err;
            res.redirect("/welcome");
        });
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