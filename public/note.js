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
                    data.forEach(element => {
                        let p= $("<div>");
                        p.addClass("comment");
                        p.text("Comment: " + element.body)
                        p.appendTo(".commSec");
                    });
                }
            })
        }
    })  

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