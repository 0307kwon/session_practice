const express = require("express");
const session = require("express-session");

const app = express();

app.use(session({
    secret: "dskvnDT12#$#!@",
    resave: false,
    saveUninitialized: true,
}));

app.get("/",(req,res)=>{
    if(req.session.count !== undefined){
        req.session.count++;
        
    }else{
        req.session.count = 0;
    }
    res.send(`count : ${req.session.count}`);
})

app.listen(3002,()=>{
    console.log("실행");
})