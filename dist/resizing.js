$(document).ready(function() {
  editor = ace.edit('editor');
  $( "#resizable-editor" ).resizable({
    minWidth:100,
    resize: function( event, ui ) {
      editor.resize();
    }
  });
  $("#mirador-viewer").resizable({
    alsoResize: "#xml-wrapper",
    minWidth:100,
    resize: function(event,ui){
      $(".mirador-container .layout-slot").height("100%");
    }
  })
  $("#xml-wrapper").resizable();

});
