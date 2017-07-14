global.jQuery = require('jQuery');
var $ = global.jQuery;
var Mousetrap = require('mousetrap');

import SaveAs from "./SaveAs.js";
import Open from "./Open.js";
import Util from "./Util.js";

var KeyBoardShortCuts = {
  addBindings: function(){
    Mousetrap.bind('command t s', function() {
      SaveAs.displaySaveAsRepoList();
      return false;
    });
    Mousetrap.bind('esc', function(){
      Util.hideFileWindow();
      return false;
    });
    Mousetrap.bind('command t o', function(){
      Open.displayOpenRepoList();
      return false;
    });
    Mousetrap.bind('command t n', function(){
      Util.fileNew();
      return false;
    });
  }
}
export default KeyBoardShortCuts;
