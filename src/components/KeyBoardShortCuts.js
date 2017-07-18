global.jQuery = require('jQuery');
var $ = global.jQuery;
var Mousetrap = require('mousetrap');

import SaveAs from "./SaveAs.js";
import Open from "./Open.js";
import Util from "./Util.js";

var KeyBoardShortCuts = {

  addBindings: function(){
    //this commands aren't working when a user is inside the editor
    //ace might have  a way to write custom key bindings so maybe these should be used instead
    Mousetrap.bind('command t s', function() {
      SaveAs.displayRepoList();
      return false;
    });
    Mousetrap.bind('esc', function(){
      Util.hideFileWindow();
      return false;
    });
    Mousetrap.bind('command t o', function(){
      Open.displayRepoList();
      return false;
    });
    Mousetrap.bind('command t n', function(){
      Util.fileNew();
      return false;
    });
    Mousetrap.bind('command t m', function(){
      Util.toggleMirador();
      return false;
    });
    Mousetrap.bind('command t p', function(){
      Util.togglePreview();
      return false;
    });
    Mousetrap.bind('command t e', function(){
      Util.toggleEditor();
      return false;
    });

  }
}
export default KeyBoardShortCuts;
