const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const firebase = require("firebase");

const app = express();

var firebaseConfig = {
  apiKey: "AIzaSyAcSmLC_s0hwYIly5CmgIEKS4LQhTIC7vI",
  authDomain: "bookly-38d82.firebaseapp.com",
  databaseURL: "https://bookly-38d82-default-rtdb.firebaseio.com",
  projectId: "bookly-38d82",
  storageBucket: "bookly-38d82.appspot.com",
  messagingSenderId: "1011253680302",
  appId: "1:1011253680302:web:73f7677cc51a7f6b02f53f",
};

firebase.initializeApp(firebaseConfig);

//set ejs as a main engine
app.set("view engine", "ejs");

//for using body parser
app.use(bodyParser.urlencoded({ extended: true }));
//join the public folder
app.use(express.static("public"));

let library = [];

let Name;
firebase
  .database()
  .ref("Books/")
  .once("value", (snap) => {
    snap.forEach((e) => {
      let bookInfo = {};
      bookInfo.Name = e.val().Name;
      bookInfo.URL = e.val().URL;
      bookInfo.Editor = e.val().Editor;
      bookInfo.Author = e.val().Author;
      bookInfo.Rating = e.val().Rating;
      library.push(bookInfo);
    });
  });
app.get("/", (req, res) => {
  res.render("home", { library: library });
});

app.get("/add", (req, res) => {
  res.render("add");
});
app.post("/add", (req, res) => {
  let Info = req.body;
  let URL = Info.BookURL;
  Name = Info.BookTitle;
  let Author = Info.BookAuthor;
  let Rating = Info.BookRating;
  let Editor = Info.BookEditor;
  let BookInput = {
    Name: Name,
    URL: URL,
    Author: Author,
    Rating: Rating,
    Editor: Editor,
  };
  firebase
    .database()
    .ref("Books/" + Name)
    .set({
      Name: Name,
      URL: URL,
      Author: Author,
      Rating: Rating,
      Editor: Editor,
    });
  library.push(BookInput);

  res.redirect("/");
});

// listen on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
