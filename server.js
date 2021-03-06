var express = require("express");

var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT|| 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
require("./routes/html-routes")(app);
// Connect to the Mongo DB
mongoose.connect( MONGODB_URI, { useNewUrlParser: true });

// Routes


app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://old.reddit.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
  
    // Now, we grab every h2 within an article tag, and do the following:
    $("p.title").each(function(i, element) {
  //  console.log(i);
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
// console.log(result.title);
// console.log(result.link);
      // Create a new Article using the `result` object built from scraping
     
      // db.Article.create(result)
      const query = { "title": result.title };
      const update = {
        "$set": {
          "link": result.link,
          "title": result.title
        }
      };
      const options = { "upsert": true };
      
      db.Article.updateOne(query, update, options)
        .then(result => {
          console.log('success');
        })
        .catch(err => console.error(`Failed to update the item: ${err}`))
        
        
      });
    // Send a message to the client

    res.send("Completed scraping");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({}).sort({"title": 1})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
      
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/articleNotes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.find({ artId: req.params.id })
    // ..and populate all of the notes associated with it
    
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
app.put("/addFav/:id", function(req, res) {
  console.log(req.body.favorite);
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.updateOne({ _id: req.params.id },{$set: {favorite:req.body.favorite}})
    // ..and populate all of the notes associated with it
    
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
//
app.post("/newNote",  function(req, res) {
  // Create a new note and pass the req.body to the entry
  
  db.Note.create(req.body).then(function(dbNote) {res.json(dbNote)});
   
})




// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
