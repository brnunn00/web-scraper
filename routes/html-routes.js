// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
// Requiring our custom middleware for checking if a user is logged in

// Routes
// =============================================================
module.exports = function (app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/saved", function(req,res){

   
      res.sendFile(path.join(__dirname, "../public/saved.html"));
    
})

app.get("/viewArticle", function(req,res){

   
  res.sendFile(path.join(__dirname, "../public/article.html"));

})


}