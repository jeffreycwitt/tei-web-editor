//style import
import './styles/style.scss';

global.jQuery = require('jQuery');
var $ = global.jQuery;

import App from "./components/Main.js";

$(document).ready(function(){
  var appInstance = App.init();
});
