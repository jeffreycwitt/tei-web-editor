global.jQuery = require('jQuery');
var $ = global.jQuery;

var Doc = {
  state: null,
  modified: true,
  set: function(data){
    this.state = data;
    this.displayCurrentDoc(data);
  },
  displayCurrentDoc(data){
    $("#document-info").remove();
    if (data){
      var url = data.url
      var branch = url.split("?ref=")[1]
      var repo = url.split("https://api.github.com/repos/")[1].split("/contents/")[0];
      if (branch === "gh-pages"){
        $("#navbar-menu-list").append('<li id="document-info" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Current doc: ' + data.name + '<span class="caret"></span></a><ul id="document-info-list" class="dropdown-menu"></ul></li>');
        var ghpagesLink = 'http://' + repo.split('/')[0] +'.github.io/' + repo.split('/')[1];
        $("#document-info-list").append("<li><a href='" + ghpagesLink + "' target='_blank'>View on Github Pages</a></li>");
      }
      else{
        $("#navbar-menu-list").append('<li id="document-info"><a>Current doc: ' + data.name + '</a></li>');
      }
    }
  }
}

export default Doc;
