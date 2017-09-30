global.jQuery = require('jQuery');
var $ = global.jQuery;
var base64 = require('base-64');

import Renderer from "./Renderer.js";
import Doc from "./Doc.js";
import Recent from "./Recent.js";
import Repo from "./Repo.js";

var ace = require('brace');
var aceEditor;

var Util = {
  access_token: "",
  setAccessToken: function(access_token){
    this.access_token = access_token;
  },
  togglePreview: function(){
    if ($('#preview').is(':visible')){
      $("#editor").animate({"width": "100%"})
      $('#preview').slideToggle();
      if (!$('#editor').is(':visible')){
        //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
        $("#mirador-viewer").animate({"height": "100%"}, function(){
          window.dispatchEvent(new Event('resize'));
        });
      }
    }
    else{
      $("#editor").animate({"width": "50%"})
      //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
      $("#mirador-viewer").animate({"height": "40%"})
      $('#preview').slideToggle("slow", function(){
          window.dispatchEvent(new Event('resize'));
      });
    }
  },
  toggleEditor: function(){
    if ($('#editor').is(':visible')){
      $("#preview").animate({"width": "100%"})
      $('#editor').slideToggle();
      if (!$('#preview').is(':visible')){
        //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
        $("#mirador-viewer").animate({"height": "100%"}, function(){
          window.dispatchEvent(new Event('resize'));
        });
      }
    }
    else{
      $("#preview").animate({"width": "50%"})
      //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
      $("#mirador-viewer").animate({"height": "40%"})
      $('#editor').slideToggle("slow", function(){
        window.dispatchEvent(new Event('resize'));
      });

    }
  },
  toggleMirador: function(){
    $('#mirador-viewer').slideToggle("slow", function(){
      window.dispatchEvent(new Event('resize'));
    });

  },
  undarken: function(){
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
  },
  darken: function(){
    console.log($("#preview"));
    $('#editor').addClass("darkened");
    $('#preview').addClass("darkened");
  },
  hideFileWindow: function(){
    $(".file-window").removeClass("visible");
    this.undarken();
  },
  fileNew: function(){
    this.undarken();
    $('.file-window').removeClass("visible")
    this.loadTemplateText();
  },
  retrieveAPIData: function(url){
    // this should render obsolute the need for access token as a parameter.
    var access_token = this.access_token
    var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
    return $.get(url_with_access);
  },
  parseXMLContent: function(data){
    var content = base64.decode(data.content);
    return content;
  },
  addXMLContent: function(content){
    aceEditor = ace.edit("editor");
    aceEditor.setValue(content);
    aceEditor.clearSelection();
    aceEditor.gotoLine(0);
    aceEditor.scrollToLine(0);
  },
  createPreviewContent: function(content){
    var newText = Renderer.tei_conversion(content, function(data){});
    $("#preview").html(newText);
  },
  setSaveParameters: function(data){
    var branch = data.url.split("?ref=")[1]
    var repo = data.repo ? data.repo : data.url.split("https://api.github.com/repos/")[1].split("/contents/")[0];
    var path = data.path.split("/" + data.name)[0] === data.name ? "" : data.path.split("/" + data.name)[0];
    $("#sha").val(data.sha);
    $("#save-url").html(data.url);
    $("#repo").val(repo);
    $("#path").val(path);
    $("#file-name").val(data.name);
    $("#branch").val(branch);
    $('#message').val("");

    Doc.set(data);
    Doc.setModified(false);
    // Doc.modified = false;
    // Util.browserNavCheck(false);
    Repo.retrieveAndSetRepoState("https://api.github.com/repos/" + repo)
  },
  clearSaveParameters: function(){
    $("#sha").val("");
    $("#save-url").html("");
    $("#repo").val("");
    $("#path").val("");
    $("#file-name").val("");
    $("#branch").val("");
    $('#message').val("");

    Doc.set(null);
    Doc.setModified(false);
    // Doc.modified = false;
    // Util.browserNavCheck(false);
    Repo.set(null);
  },
  //this function checks if there have been any changes to the current file since the last save
  //the Doc.setModified() function will call this evertime the modified state gets set.
  confirm: function(){
    var confirmed;
    console.log("Doc.modifed in confirm function", Doc.modified);
    if (Doc.modified){
      if (confirm("This current document as been modified since it last save. Do you want to proceed? Unsaved changes will be lost.")){
        confirmed = true;
      }
      else{
        confirmed = false;
      }
    }
    else{
      confirmed = true;
    }
    return confirmed;
  },
  // this function sets browser behavior for when there are saved and unsaved changes
  // it needs to be recalled whenever
  browserNavCheck(changes){
    console.log("test", changes);
    window.onbeforeunload = function() {
      if (changes)
      return Util.confirm();
    }

  },
  loadText: function(url){
    if (Util.confirm()){
      var _this = this;
      _this.retrieveAPIData(url).done(function(data){
        var content = Util.parseXMLContent(data);
        _this.addXMLContent(content);
        _this.createPreviewContent(content);
        _this.setSaveParameters(data);
      });
    }
  },
  loadTemplateText: function(confirm){
    var _this = this;
    var content = [
      '<?xml version="1.0" encoding="UTF-8"?>\n',
      '<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_lite.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?\n',
      '<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_lite.rng" type="application/xml" schematypens="http://purl.oclc.org/dsdl/schematron"?>\n',
      '<TEI xmlns="http://www.tei-c.org/ns/1.0">\n',
      '  <teiHeader>\n',
      '    <fileDesc>\n',
      '      <titleStmt>\n',
      '        <title>Title</title>\n',
      '      </titleStmt>\n',
      '      <publicationStmt>\n',
      '        <p>Publication information</p>\n',
      '      </publicationStmt>\n',
      '      <sourceDesc>\n',
      '        <p>Information about the source</p>\n',
      '      </sourceDesc>\n',
      '    </fileDesc>\n',
      '  </teiHeader>\n',
      '  <text>\n',
      '    <body>\n',
      '      <p>Some text here.</p>\n',
      '    </body>\n',
      '  </text>\n',
      '</TEI>'].join('');

      if (confirm || Util.confirm()){
        //order matters here; addXMLcontent will trigger and change in the editor
        //which will toggle Doc.modified to true clearSaveParamters will return Doc.modified to false
        _this.addXMLContent(content);
        _this.createPreviewContent(content);
        Util.clearSaveParameters();

    }
  },
  encode_utf8: function(s){
    return unescape(encodeURIComponent(s));
  },
  decode_utf8: function(s) {
    return decodeURIComponent(escape(s));
  }
}

export default Util;
