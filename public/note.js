$(document).ready(function(){

    var urlParm = getUrlParameter("id");

    $.get("/articles/" + urlParm, function (data) {
        if (data){
            var title = data.title
            $("h2").text(title);
            $("#artLink").attr("href","https://www.reddit.com"+data.link+ " target='_blank'");
            $("#artLink").text("View article");
        $.get("/articleNotes/" +urlParm, function (data) {
                if (data){
                    console.log(data);
                }
            })
        }
    })  

    // $(document).on("click", "#savenote", function() {
    //     // Grab the id associated with the article from the submit button
    //     var thisId = $(this).attr("data-id");
      
    //     // Run a POST request to change the note, using what's entered in the inputs
    //     $.ajax({
    //       method: "POST",
    //       url: "/articles/" + thisId,
    //       data: {
    //         // Value taken from title input
    //         title: $("#titleinput").val(),
    //         // Value taken from note textarea
    //         body: $("#bodyinput").val()
    //       }
    //     })
    //       // With that done
    //       .then(function(data) {
    //         // Log the response
    //         console.log(data);
    //         // Empty the notes section
    //         $("#notes").empty();
    //       });
      
    //     // Also, remove the values entered in the input and textarea for note entry
    //     $("#titleinput").val("");
    //     $("#bodyinput").val("");
    //   });

    $("#savenote").on("click", function(event){
      
        event.preventDefault();
       
        var com =  $("#comment").val().trim();
      
        var tit =  $("#title").text();
        $.post("/newNote", 
        {
            body: com,
            title: tit,
            artId:urlParm
        }, function(res){
             $("#comment").val("");
              location.reload();
                
        })
    
    })

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
});