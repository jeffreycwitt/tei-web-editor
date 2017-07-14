import Util from "./Util.js";

var Repo = {
  state: null,
  set: function(data){
    this.state = data
  },
  retrieveAndSetRepoState: function(url, access_token){
    var _this = this;
    Util.retrieveAPIData(url, access_token).done(function(data){
      _this.set(data);
    });
  }
}

export default Repo;
