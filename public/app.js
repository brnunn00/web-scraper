// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});
$(document).on("click", ".clearEm", function() {
  // Empty the notes from the note section
  $(".article-container").empty();


})

$(document).on("click", "#fav", function() {
  // Empty the notes from the note section
  $.ajax({
    method:"POST",
    url: "/addFav"

  }).then(function(data){

  })


})
$(document).on("click", ".scrape-new", function() {
  // Empty the notes from the note section
  $(".article-container").empty();
  
  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
     $.ajax({
       method: "GET",
      url: "/articles"
     }).then(function(data){
      data.forEach(element => {
        let p = $("<p>")
        p.attr("data-id", element._id);
        let tit = $("<h3>");element._id
        tit.text(element.title);
        p.append(tit);
     
        let favB = $("<button>");
        favB.text("Favorite")
        favB.attr("id","fav");
        favB.attr("data-id",element._id);
        favB.appendTo(p);
        let viewC = $("<button>"); 
        viewC.text("View Article")
        viewC.attr("data-id",element._id);
        viewC.attr("id","view");
        let viewA =$("<a href=/viewArticle?id="+element._id+"><button>View Article</button></a>");       
        viewA.appendTo(p);
     
        p.appendTo(".article-container");
      });
     })
       });
});


