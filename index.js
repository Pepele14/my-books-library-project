import express from "express";
import bodyParser from "body-parser";
import db from "./config.js"; // Import the db object from config.js

const app = express();
const port = 3000;

db.connect()
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    });


let listBooks  = [];
let myLibraryButtonClicked = false;
let addButtonClicked = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => { 
  res.render("index.ejs", {
    listBooks: listBooks,
    myLibraryButtonClicked: myLibraryButtonClicked,
    addButtonClicked: addButtonClicked,


  });
});

app.get("/myLibrary", async (req, res) => {  
  try {
    if (!myLibraryButtonClicked) {
      const fullBookList = await getBooksList();
      myLibraryButtonClicked = true;

      res.render("index.ejs", {
        listBooks: fullBookList,
        myLibraryButtonClicked: myLibraryButtonClicked,
      });
    
  }} catch (err) {
    console.log(err);
  }
});

async function getBooksList() {
  try {
    const allBooks = await db.query("SELECT * FROM books");
    listBooks  = allBooks.rows;
      console.log("Query executed");
      console.log(listBooks);
   return listBooks;
} catch (err) {
  console.log(err);
    console.log("Query not executed");
}
}


app.post("/add", async (req, res) => {
  const title = req.body["title"];
  const author = req.body["author"];
  const completed = req.body["completed"];
  const type = req.body["type"];
  const rating = req.body["rating"];
  const recency = req.body["recency"];

      try {
        if(!addButtonClicked){
        const addBook = await addNewBook();
        addButtonClicked = true;

        res.redirect("/");
      }} catch (err) {
        console.log(err);
      }
});

async function  addNewBook(){
  try {
    addBook();
    const addNewBook = await db.query(
      "INSERT INTO books (id, title, author, completed, type, rating, recency) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, author, completed, type, rating, recency]
    );
    console.log("Book added successfully")
  } catch (err) {
    console.log(err);
      console.log("Query not executed");
  }
}


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  


  function addBook() {
    const form = document.querySelector('.formAdd');
  
    // Toggle the 'visible' class on each input element
    form.querySelectorAll('input, select').forEach(input => {
      input.classList.toggle('visible');
    });
  }