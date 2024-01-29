import express from "express";
import bodyParser from "body-parser";
import db from "./config.js"; // Import the db object from config.js

const app = express();
const port = 3000;
db.connect();


let listBooks = [];
let myLibraryButtonClicked = false;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => { 
  res.render("index.ejs", {
    listBooks: listBooks,
    myLibraryButtonClicked: myLibraryButtonClicked,
  });
});


app.get("/myLibrary", async (req, res) => {  
  try {
    if (!myLibraryButtonClicked) {
      //myLibraryButtonClicked = true;
      const allBooks = await db.query("SELECT * FROM books ORDER BY id ASC");
      const booksFromDB = allBooks.rows;

      

      res.render("index.ejs", {
        listBooks: booksFromDB, 
        myLibraryButtonClicked: myLibraryButtonClicked,
      });
    } else {
      res.render("index.ejs", {
        listBooks: [], // Empty array or handle accordingly if the list has already been displayed
      });
    }
  } catch (err) {
    console.log(err);
  }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  