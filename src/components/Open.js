global.jQuery = require('jQuery');
var $ = global.jQuery;

import Util from "./Util.js";
import Recent from "./Recent.js";

var Open = {
  displayOpenTree: function(repo_base, access_token, branch, branchSha, path, repo){
  //function displayTree(tree, path, branch, branchSha, repo, parent_tree_url){
  //function retrieveRepoTree(repo_base, access_token, branch, branchSha){
    $("#repo-browser-list").empty();
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
      if (branch === "gh-pages"){
        $("#repo-browser-branch").html('<p>' + branch + '</p><p><a href="http://' + repo.split('/')[0] +'.github.io/' + repo.split('/')[1] + '" target="_blank">View on gh-pages</a></p>');
      }
      else{
        $("#repo-browser-branch").html('<p>' + branch + '</p>');
      }
      if (path){
        //bug, this keeps appending even when you are moving back up the tree
        $("#breadcrumbs").append(' / <a href="#" class="file-open-tree" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ parent_tree_url + '" data-path="' + path + '">' + path.split("/").pop() +'</a>');
      }
      for (var i = 0, len = tree.length; i < len; i++) {
        if (tree[i].type === 'blob' && tree[i].path.includes('.xml')){
          $("#repo-browser-list").append('<li><a href="#" class="file-open-file-list" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + path + "/" + tree[i].path + '">' + tree[i].path +'</a></li>');
        }
        else if (tree[i].type === 'blob' && !tree[i].path.includes('.xml')){
          $("#repo-browser-list").append('<li style="color: gray">' + tree[i].path +'</li>');
        }
        else if (tree[i].type === 'tree'){
          $("#repo-browser-list").append('<li><a href="#" class="file-open-tree" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + path + "/" + tree[i].path + '">' + tree[i].path +'</a></li>');
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
          _this.displayOpenTree(repo_base, access_token, branchName, branchSourceSha, repo)
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
      $("#repo-browser-list").empty();
      $("#repo-browser").addClass("visible");
      $("#repo-browser-list").append('<h1>Available Branches</h1>');
      //$("#repo-browser-list").append('<p><a href="#" class="file-open-dir">' + "Back to Repo List" +'</a></li>');
      for (var i = 0, len = data.length; i < len; i++) {
        $("#repo-browser-list").append('<li><a href="#" class="file-open-branch" data-branch-sha="' + data[i].commit.sha + '" data-url="'+ repo_base + '" data-branch="' + data[i].name + '">' + data[i].name +'</a> --> create new branch --> <form id="create-new-branch"><input id="branch" name="branch" placeholder="gh-pages"></input><input type="hidden" id="repo" name="repo" value="' + repo + '"/><input type="hidden" id="branch-source-sha" name="branch-source-sha" value="' + data[i].commit.sha + '"/><input type="submit"/></form></li>');
      }
    });
  },
  displayOpenRepoList: function(url, access_token){
    url = url + "?per_page=100";
    Util.retrieveAPIData(url, access_token).done(function(data){
      $("#repo-browser-branch").empty();
      $("#recentfiles").empty();
      if (Recent.files.length === 0) {
        $("#recentfiles").append('<li>No recent files available</li>');
      } else {
        for (var i = 0, len = Recent.files.length; i < len; i++) {
          $("#recentfiles").append('<li><a href="#" class="file-open-file" data-url="'+ Recent.files[i] + '">' + Recent.files[i] +'</a></li>');
        }
      }
      for (var i = 0, len = data.length; i < len; i++) {
        $("#repositories").append('<li><a href="#" class="file-open-repo" data-url="'+ data[i].url + '">' + data[i].url +'</a></li>');
      }
    });
  },
  createOpenFork: function(repo, access_token){
      var url = "https://api.github.com/repos/" + repo + "/forks";
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

  }
}

export default Open;
