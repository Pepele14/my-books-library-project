import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

//db.connect();

let books = [
  { id: 1, title: "Lepanto", author:"Alessandro Barbero", completed: "true",  type: "History", rating: 5, recency: "2023" },

];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => { 
  res.render("index.ejs");
});

app.get("/myLibrary", async(req, res) => {  
  try {
    const allBooks = await db.query("SELECT * FROM books ORDER BY id ASC");
    books = allBooks.rows;

    res.render("index.ejs", {
      listBooks: books
    });
} catch (err) {
  console.log(err);
}
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  