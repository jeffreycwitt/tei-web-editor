global.jQuery = require('jQuery');
var $ = global.jQuery;

import Util from "./Util.js";


var User = {
  state: null,
  set: function(data){
    this.state = data
  },
  retrieveAndSetUserState: function(){
    var _this = this;
    var url = "https://api.github.com/user";
    Util.retrieveAPIData(url).done(function(data){
      _this.set(data);
      _this.displayUserName(data);
    });
  },
  displayUserName: function(data){
    console.log(data);
    $("#user-login-display").html('<a href="/login">' + data.login + '</a>');
  }
}

export default User;
