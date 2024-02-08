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
let benjaminButtonClicked = false;
let addButton = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => { 
  res.render("index.ejs", {
    listBooks: listBooks,
    myLibraryButtonClicked: myLibraryButtonClicked,
    benjaminButtonClicked: benjaminButtonClicked,
    addButton: addButton,
  });
});

app.get ("/add", (req, res) => { 
  res.render("index.ejs", {
    listBooks: listBooks,
    myLibraryButtonClicked: myLibraryButtonClicked,
    benjaminButtonClicked: benjaminButtonClicked,
    addButton: addButton,
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
        benjaminButtonClicked: benjaminButtonClicked,
        addButton: addButton,
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

   return listBooks;
} catch (err) {
  console.log(err);
    console.log("Query not executed");
}
}


app.post("/add", async (req, res) => {
  const title = req.body["title"];
  const author = req.body["author"];
  const completed = req.body.completed;
  const type = req.body["type"];
  const rating = req.body["rating"];
  const recency = req.body["recency"];
  
      try{
          if(!benjaminButtonClicked)
          {
            await addNewBook( title, author, completed, type, rating, recency);
            benjaminButtonClicked = true;     
            console.log("Book added to the database " + listBooks);
            res.redirect("/");
          } else {
            console.log("Book not added to DB");
          }
      
        }catch{
            console.log(err);
      } 
    });

async function addNewBook( title, author, completed, type, rating, recency){
  try {
    await db.query(
      "INSERT INTO books (title, author, completed, type, rating, recency) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, completed, type, rating, recency]
    );
    console.log("Book added successfully")
  } catch (err) {
    console.log(err);
      console.log("Query not executed");
  }
}


app.get("/myLibraryArchive", async (req, res) => {
  try 
  {
      const fullBookList = await getBooksList();
      //console.log("rendering next")
      res.render("myLibraryArchive.ejs", {
        listBooks: fullBookList,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  

