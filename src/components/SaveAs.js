global.jQuery = require('jQuery');
var $ = global.jQuery;

import Util from "./Util.js";

var SaveAs = {
  saveFile: function(url, commitData, access_token){
    var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token
    $.ajax({
      url: url_with_access, // your api url
      type: 'put', // type is any HTTP method
      contentType: "application/json",
      //JSON.stringify seems required; it's the only way I could get it to work
      data: JSON.stringify(commitData),

      success: function(data, status, res) {
        //updates save parameters; specifically it resets save form with newest shaw
        Util.setSaveParameters(res.responseJSON.content)
        $('#save').removeClass("visible");
        //Util.undarken();
        $('#editor').removeClass("darkened");
        $('#preview').removeClass("darkened");
      },
      error: function(res, status, error){
        console.log(res, status, error)
      }
    });
  },
  displaySaveAsTree: function(url, branch, branchSha, access_token){
    var tree_url = url;
    if ( url.includes("/git/trees/")){
      var tree_url = url;
    }
    else{
      var tree_url = url + "/git/trees/" + branch;
    }

    $("#save-as-file-browser-list-wrapper").empty();
    Util.retrieveAPIData(tree_url, access_token).done(function(data){
      var tree = data.tree;
      for (var i = 0, len = data.tree.length; i < len; i++) {
        if (tree[i].type === 'blob' && tree[i].path.includes('.xml')){
          $("#save-as-file-browser-list-wrapper").append('<li style="color: gray">' + tree[i].path +'</a></li>');
        }
        else if (tree[i].type === 'blob' && !tree[i].path.includes('.xml')){
          $("#save-as-file-browser-list-wrapper").append('<li style="color: gray">' + tree[i].path +'</li>');
        }
        else if (tree[i].type === 'tree'){
          $("#save-as-file-browser-list-wrapper").append('<li><a href="#" class="file-open-save-as-path" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + tree[i].path + '">' + tree[i].path +'</a></li>');
        }
      }
    });

  },
  displayRepoList: function(){
    $('.file-window').removeClass("visible");
    Util.darken();
    $('#save').addClass("visible");
    var url = "https://api.github.com/user/repos";
    url = url + "?per_page=100";
    var access_token = Util.access_token;
    Util.retrieveAPIData(url, access_token).done(function(data){
      $("#repo-browser-branch").empty();
      $("#save-as-file-browser-list-wrapper").empty();
      for (var i = 0, len = data.length; i < len; i++) {
        $("#save-as-file-browser-list-wrapper").append('<li><a href="#" class="file-open-save-as-repo" data-url="'+ data[i].url + '">' + data[i].url +'</a></li>');
      }
    });
  },
  displaySaveAsRepoBranchList: function(repo_base, access_token){
    var url = repo_base + "/branches";
    var repo = repo_base.split("https://api.github.com/repos/")[1];
    $("#repo-browser-branch").empty();
    $("#save-as-file-browser-list-wrapper").empty();
    Util.retrieveAPIData(url, access_token).done(function(data){
      $("#save-as-file-browser-list-wrapper").empty();
      for (var i = 0, len = data.length; i < len; i++) {
        $("#save-as-file-browser-list-wrapper").append('<li><a href="#" class="file-open-save-as-branch" data-branch-sha="' + data[i].commit.sha + '" data-url="'+ repo_base + '" data-branch="' + data[i].name + '">' + data[i].name +'</a> --> create new branch --> <form id="create-new-save-as-branch"><input id="branch" name="branch" placeholder="gh-pages"></input><input type="hidden" id="repo" name="repo" value="' + repo + '"/><input type="hidden" id="branch-source-sha" name="branch-source-sha" value="' + data[i].commit.sha + '"/><input type="submit"/></form></li>');
      }
    });
  },
  createNewSaveAsBranch: function(repo, branchName, branchSourceSha, access_token){
    var _this = this;
    new_branch_data = {
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

        repo_base = "https://api.github.com/repos/" + repo;
        $("#branch").val(branchName);
        $("#sha").val(branchSourceSha);
        _this.displaySaveAsTree(repo_base, branchName, branchSourceSha, access_token);
      },
      error: function(res, status, error){
        console.log(res, status, error)
      }
    });
  },
  createNewRepo: function(name){
    var _this = this;
    access_token = Util.access_token;
    var url = "https://api.github.com/user/repos"
    var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
    content = {
      "name": name,
      "auto_init": true
    }
    $.ajax({
      url: url_with_access, // your api url
      type: 'post', // type is any HTTP method
      contentType: "application/json",
      //JSON.stringify seems required; it's the only way I could get it to work
      data: JSON.stringify(content),

      success: function(data, status, res) {
        repo = res.responseJSON.full_name
        $("#repo").val(repo);
        var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
        $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
        _this.displaySaveAsRepoBranchList(res.responseJSON.url, access_token)
      },
      error: function(res, status, error){
        console.log(res, status, error)
      }
    });
  }

}

export default SaveAs;
