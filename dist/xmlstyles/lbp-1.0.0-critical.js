$(document).ready(function(){

  $(document).on("mouseenter", "tei-lem", function(){
    var rdg = $(this).siblings("tei-rdg");
    $(this).append("<div class='rdg-info' style='border-top: 1px dotted gray; border-bottom: 1px dotted gray; padding-top: 6px;'></div>");
    $(rdg).each(function(){
      var siglum = $(this).attr("wit");
      var type = $(this).attr("type") ? $(this).attr("type") : "";
      var text = $(this).text() ? $(this).text() : "";
      $(".rdg-info").append("<p>" + text + " " + siglum + " <em>" + type + "</em></p>");
    });
  });
  $(document).on("mouseleave", "tei-lem", function(){
    $(this).children(".rdg-info").remove()
  });
  //add popup for quote citations
  $(document).on("mouseenter", "tei-quote", function(){
    var biblOrNote = $(this).siblings("tei-bibl, tei-note");
    $(this).append("<div class='bibl-info' style='border-top: 1px dotted gray; border-bottom: 1px dotted gray; padding-top: 6px;'></div>");
    $(biblOrNote).each(function(){
      var text = $(this).text() ? $(this).text() : "";
      $(".bibl-info").append("<p>" + text + "</p>");
    });
  });
  $(document).on("mouseleave", "tei-quote", function(){
    $(this).children(".bibl-info").remove()
  });
});
