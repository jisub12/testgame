// express 

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "page")));

app.get('/', (req ,res ) => {
   const page = fs.readFileSync("./page/index.html","utf-8");
    res.send(page);
})

app.listen(8000, () => {
    console.log("8000 Server Open");
})