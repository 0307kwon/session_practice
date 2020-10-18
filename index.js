const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("안녕하세요");
})

app.listen(3002,()=>{
    console.log("실행");
})