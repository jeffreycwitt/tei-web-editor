import Util from "./Util.js";

var Repo = {
  state: null,
  set: function(data){
    this.state = data
  },
  retrieveAndSetRepoState: function(url){
    var _this = this;
    Util.retrieveAPIData(url).done(function(data){
      _this.set(data);
    });
  }
}

export default Repo;
