const express = require("express");
const app = express();
const port = 5500;
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public/cs")));
app.use(express.static(path.join(__dirname, "public/js")));
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, (req, res) => {
    console.log(`You are listening at port ${port}`);
});