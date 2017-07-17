global.jQuery = require('jQuery');
var $ = global.jQuery;

var Preview = {
  selectPreviewStyle: function(styleName){
    $("link[class='preview-style-link']").prop('disabled',true);
    $("link[title='" + styleName + "']").prop('disabled',false);
    this.unBindPreviewEvents("all");
    this.bindPreviewEvents(styleName);
  },
  createPreviewStylesList: function(previewStyles){
    var defaultStyle = previewStyles ? previewStyles[0].name : 'default';
    this.bindPreviewEvents(defaultStyle)
    this.selectPreviewStyle(defaultStyle);
    if (previewStyles && previewStyles.length > 1){
      $("#navbar-menu-list").append('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Preview Styles<span class="caret"></span></a><ul id="preview-styles-menu" class="dropdown-menu"></ul></li>');
      for (var i = 0, len = previewStyles.length; i < len; i++) {
        $("#preview-styles-menu").append("<li><a href='#' class='select-preview-style' data-style-name='" + previewStyles[i].name + "' title='" + previewStyles[i].description + "'>" + previewStyles[i].name + "</a></li>");
      }
    }
  },
  bindPreviewEvents: function(styleName){
    //custom events for each style should be bound as a different step in the conditional
    if (styleName === 'lbp-1.0.0-critical' || styleName === 'all'){
      console.log("bind preview events fired");
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
    }
  },
  unBindPreviewEvents: function(styleName){
    //custom events for each style should be unbound as a different step in the conditional
    if (styleName === 'lbp-1.0.0-critical' || styleName === 'all'){
      $(document).off("mouseenter", "tei-lem");
      $(document).off("mouseleave", "tei-lem");
      //add popup for quote citations
      $(document).off("mouseenter", "tei-quote");
      $(document).off("mouseleave", "tei-quote");
    }
  }

}

export default Preview;
