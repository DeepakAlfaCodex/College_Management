const express = require("express");
const app = express();
const port = 5500;
const path = require("path");
const mysql = require("mysql2");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/cs")));
app.use(express.static(path.join(__dirname, "public/js")));
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "srk_college",
  password: "069468",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to Database");
});

app.get("/", (req, res) => {
  let qTotal = "SELECT COUNT(*) AS total FROM students"; 
  let qList = "SELECT * FROM students";
  connection.query(qTotal, (err, result) => {
   if(err) throw err;
   connection.query(qList, (err, data) => {
     if(err) throw err;
    res.render("index.ejs", {
        total: result[0].total,
        data: data
    });
   })
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/delete/:id", (req, res) => {
    let studentId = req.params.id; 

    let q = "DELETE FROM students WHERE registrationId = ?";

    connection.query(q, [studentId], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Delete karne mein error aaya.");
        } else {
            console.log("Deleted Successfully");
            res.redirect("/"); 
        }
    });
});

app.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  let q = "SELECT * FROM students WHERE registrationId = ?";
  connection.query(q, [id], (err, result) => {
    if (err) throw err;
    res.render("update.ejs", {student: result[0]});
  })
}); 

app.post("/update/:id", (req, res) => {
    let id = req.params.id;
    let { name, email, class: studentClass } = req.body;

    let q = "UPDATE students SET studentName = ?, email = ?, class = ? WHERE registrationId = ?";

    connection.query(q, [name, email, studentClass, id], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Update failed!");
        } else {
            res.redirect("/");
        }
    });
});

app.post("/login", (req, res) => {
  let studentName = req.body.name;
  let email = req.body.email;   
  let password = req.body.password;
  let registrationId = req.body.id;
  let classs = req.body.class;

  console.log(
    studentName,
    email,
    password,
    registrationId,
    classs,
  );

  let q =
    "INSERT INTO students (studentName, email, password, registrationId, class) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    q,
    [studentName, email, password, registrationId, classs],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Login was Failed");
      } else {
        console.log("Data saved: ", result);
        res.redirect("/");
      }
    },
  );
});


app.listen(port, (req, res) => {
  console.log(`You are listening at port ${port}`);
});
