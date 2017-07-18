global.jQuery = require('jQuery');
var $ = global.jQuery;

import Util from "./Util.js";
import Recent from "./Recent.js";

var Open = {
  recommendedRepos: {},
  displayOpenTree: function(repo_base, access_token, branch, branchSha, path, repo){
  //function displayTree(tree, path, branch, branchSha, repo, parent_tree_url){
  //function retrieveRepoTree(repo_base, access_token, branch, branchSha){
    $("#repo-browser-list > tbody").empty();
    $("#repo-browser-list > h3").remove();
    $("#repo-browser-list > thead").empty();

    $("#repo-browser-branch").empty();
    $("#repo-browser").addClass("visible");

    var parent_tree_url = repo_base;
    var branch = (typeof branch !== 'undefined') ?  branch : "master";

    if (repo_base.includes("/git/trees/")){
      var url = repo_base
    }
    else{
      var url = repo_base + "/git/trees/" + branch;
    }

    Util.retrieveAPIData(url, access_token).done(function(data){

      var tree = data.tree

      var repoUrl = "https://api.github.com/repos/" + repo;
      $("#repo-browser-branch").html('<p><a href="#" class="display-repo-list" title="Back to repo list">Repo</a>: ' + repo + ' | <a href="#" class="display-open-repo-branch-list" data-url="' + repoUrl + '" title="Back to branch list">Branch</a>: ' + branch + ' | Path: ' + path + ' | <a href="#"><span class="glyphicon glyphicon-level-up"></span></a></p>');

      for (var i = 0, len = tree.length; i < len; i++) {
        if (tree[i].type === 'blob' && tree[i].path.includes('.xml')){
          $("#repo-browser-list > tbody").append('<tr><td><a href="#" class="open-file-from-list" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + path + "/" + tree[i].path + '">' + tree[i].path +'</a></td></tr>');
        }
        else if (tree[i].type === 'blob' && !tree[i].path.includes('.xml')){
          $("#repo-browser-list > tbody").append('<tr><td class="disabled">' + tree[i].path +'</td></tr>');
        }
        else if (tree[i].type === 'tree'){
          $("#repo-browser-list > tbody").append('<tr><td><a href="#" class="display-open-tree" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + path + "/" + tree[i].path + '">' + tree[i].path +'</a></td></tr>');
        }
      }
    });
  },
  createNewOpenBranch: function(repo, branchName, branchSourceSha, access_token){
    var _this = this;
    var new_branch_data = {
        "ref": "refs/heads/" + branchName,
        "sha": branchSourceSha
      }
      var url = "https://api.github.com/repos/" + repo + "/" + "git/refs"
      var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
      $.ajax({
        url: url_with_access, // your api url
        type: 'post', // type is any HTTP method
        contentType: "application/json",
        //JSON.stringify seems required; it's the only way I could get it to work
        data: JSON.stringify(new_branch_data),

        success: function(data, status, res) {
          var repo_base = "https://api.github.com/repos/" + repo;
          _this.displayOpenTree(repo_base, access_token, branchName, branchSourceSha, "", repo)
        },
        error: function(res, status, error){
          console.log(res, status, error)
        }
      });

  },
  displayOpenRepoBranchList: function(repo_base, access_token){
    var url = repo_base + "/branches";
    Util.retrieveAPIData(url, access_token).done(function(data){

      var repo = repo_base.split("https://api.github.com/repos/")[1];
      //TODO Needs to refactor in to one "clear" function; this is repeated below in the display tree function
      $("#repo-browser-list > tbody").empty();
      $("#repo-browser-list > h3").remove();
      $("#repo-browser-list > thead").empty();
      $("#repo-browser").addClass("visible");

      $("#repo-browser-list > thead").append('<tr><th>Branch</th><th>Create New Branch</th></tr>');
      for (var i = 0, len = data.length; i < len; i++) {
        $("#repo-browser-list > tbody").append('<tr><td><a href="#" class="display-open-top-level-tree" data-branch-sha="' + data[i].commit.sha + '" data-url="'+ repo_base + '" data-branch="' + data[i].name + '">' + data[i].name +'</a></td><td><form id="create-new-branch" class="form-inline"><input id="branch" class="form-control" name="branch" placeholder="new-branch-name"></input><input type="hidden" id="repo" name="repo" value="' + repo + '"/><input type="hidden" id="branch-source-sha" name="branch-source-sha" value="' + data[i].commit.sha + '"/><button class="btn btn-default" type="submit">Create</button></form></td></tr>');
      }
    });
  },
  displayRepoList: function(){
    var _this = this;

    Util.darken();
    $('.file-window').removeClass("visible")
    $('#dir').addClass("visible");
    $("#repo-browser-branch").empty();
    $("#recentfiles > tbody").empty();
    $("#repositories > tbody").empty();
    $("#suggested-repositories > tbody").empty();

    var access_token = Util.access_token
    var url = "https://api.github.com/user/repos"
    url = url + "?per_page=100";
    Util.retrieveAPIData(url, access_token).done(function(data){
      if (Recent.files.length === 0) {
        $("#recentfiles").append('<tr><td>No recent files available</td></tr>');
      }
      else {
        for (var i = 0, len = Recent.files.length; i < len; i++) {
          $("#recentfiles > tbody").append('<tr><td><a href="#" class="open-file-from-recent" data-url="'+ Recent.files[i] + '">' + Recent.files[i] +'</a></td></tr>');
        }
      }
      for (var i = 0, len = data.length; i < len; i++) {
        $("#repositories > tbody").append('<tr><td><a href="#" class="display-open-repo-branch-list" data-url="'+ data[i].url + '">' + data[i].url +'</a></td></tr>');
      }
      if (_this.recommendedRepos.length > 0){
        for (var i = 0, len = _this.recommendedRepos.length; i < len; i++) {
          $("#suggested-repositories > tbody").append("<tr><td>Create a copy of: <a href='#' class='create-fork' data-url='" + Open.recommendedRepos[i].url +"'> " + Open.recommendedRepos[i].name + "</a>: " + Open.recommendedRepos[i].description + "</td></tr>");
        }
      }

    });
  },
  createFork: function(url){
    //this conditionally allows a user to just past the normal html address of the reop to be forked.
    if (url.includes("https://github.com/")){
      var repo = url.split("https://github.com/")[1];
      var url = "https://api.github.com/repos/" + repo;
    }
      var url = url + "/forks";
      var access_token = Util.access_token
      var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
      $.ajax({
        url: url_with_access, // your api url
        type: 'post', // type is any HTTP method
        success: function(data, status, res) {

          var forkedRepoBase = res.responseJSON.url;
          Open.displayOpenRepoBranchList(forkedRepoBase, access_token);
          //getRepoBranches(forkedRepoBase, access_token);

        },
        error: function(res, status, error){
          console.log(res, status, error)
        }
      });

  },
  openFile: function(url){
    $('.file-window').removeClass("visible");
    Util.undarken();
    Recent.set(url);
    Util.loadText(url, Util.access_token)
  }
}

export default Open;
