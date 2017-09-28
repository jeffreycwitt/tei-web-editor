import Util from "./Util.js";
import Doc from "./Doc.js";
import Recent from "./Recent.js";
import Repo from "./Repo.js";

var Pr = {
  displayPullRequestInfo: function(current, target){
    if (Repo.state){
      if (Repo.state.parent){
        var branch = Doc.state.url.split("?ref=")[1];
        $("#current-repo").html("<p id='current' data-repo='" + Repo.state.full_name + "' data-branch='" + branch + "'>Current Repo: " + Repo.state.url + ": Branch: " + branch + "</p>");
        $("#target-repo").html("<p id='target' data-repo='" + Repo.state.parent.full_name + "' data-branch='" + Repo.state.parent.default_branch + "'>Target Repo: " + Repo.state.parent.url + ": Branch: " + Repo.state.parent.default_branch + "</p>");
        $("#pull-request-viewer").append('<button type="button" id="submit-pull-request" class="btn btn-primary">Submit for Reivew</button>');
      }
      else{
        $("#current-repo").html("<p>This repo was not forked from a parent repo.</p>");
      }
    }
    else {
      $("#current-repo").html("<p>No document open for submission</p>");
    }
  },
  submitPullRequest: function(currentRepo, currentBranch, targetRepo, targetBranch){
    var url = Util.apiBaseUrl + "repos/" + targetRepo + "/pulls"
    var currentUsername = currentRepo.split("/")[0];
    var pr = {
    "title": "Pull request sumbitted from TEI Web Editor",
    "body": "Please pull this in!",
    "head": currentUsername + ":" + currentBranch,
    "base": targetBranch
    }
    var url_with_access = url.includes("?") ? url + "&access_token=" + Util.access_token : url + "?access_token=" + Util.access_token;
    $.ajax({
      url: url_with_access, // your api url
      type: 'post', // type is any HTTP method
      contentType: "application/json",
      //JSON.stringify seems required; it's the only way I could get it to work
      data: JSON.stringify(pr),
      success: function(data, status, res) {
        $("#current-repo").html("pull request succcessfully submitted")
        $("#target-repo").empty()
        $("#submit-pull-request").remove();
      },
      error: function(res, status, error){
        console.log("res", res);
        console.log("status", status);
        console.log("error", error);
        $("#current-repo").html("Github response: " + res.responseJSON.errors[0].message);
        $("#target-repo").empty()
        $("#submit-pull-request").remove();
      }
    });
  }
}

export default Pr;
