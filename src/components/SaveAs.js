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
  displaySaveAsTree: function(url, branch, branchSha, access_token, repo, path){
    var tree_url = url;
    if ( url.includes("/git/trees/")){
      var tree_url = url;
    }
    else{
      var tree_url = url + "/git/trees/" + branch;
    }

    $("#save-as-file-browser-list-wrapper > tbody").empty();
    $("#save-as-new-repo-or-directory").empty();
    $("#save-as-file-browser > p" ).remove();
    Util.retrieveAPIData(tree_url, access_token).done(function(data){
      var tree = data.tree;
      var repoUrl = "https://api.github.com/repos/" + repo;
      $("#save-as-file-browser").prepend('<p><a href="#" class="display-repo-list" title="Back to repo list">Repo</a>: ' + repo + ' | <a href="#" class="file-open-repo" data-url="' + repoUrl + '" title="Back to branch list">Branch</a>: ' + branch + ' | Path: ' + path + ' | <a href="#"><span class="glyphicon glyphicon-level-up"></span></a></p>');
      for (var i = 0, len = data.tree.length; i < len; i++) {
        if (tree[i].type === 'blob' && tree[i].path.includes('.xml')){
          $("#save-as-file-browser-list-wrapper > tbody").append('<tr><td style="color: gray">' + tree[i].path +'</a></td></tr>');
        }
        else if (tree[i].type === 'blob' && !tree[i].path.includes('.xml')){
          $("#save-as-file-browser-list-wrapper > tbody").append('<tr><td style="color: gray">' + tree[i].path +'</td></tr>');
        }
        else if (tree[i].type === 'tree'){
          $("#save-as-file-browser-list-wrapper > tbody").append('<tr><td><a href="#" class="file-open-save-as-path" data-repo="' + repo + '" data-branch="' + branch + '" data-branch-sha="' + branchSha + '" data-url="'+ tree[i].url + '" data-path="' + tree[i].path + '">' + tree[i].path +'</a></td></tr>');
        }
      }
      $("#save-as-new-repo-or-directory").append('<p>Create new directory</p><form id="create-new-directory"><input type="text" name="new-dir-name" id="new-dir-name" placeholder="new-dir-name"/><input type="submit"/></form>');
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
      $("#save-as-file-browser-list-wrapper > tbody").empty();
      $("#save-as-new-repo-or-directory").empty();
      $("#save-as-file-browser > p" ).remove();
      for (var i = 0, len = data.length; i < len; i++) {
        $("#save-as-file-browser-list-wrapper > tbody").append('<tr><td><a href="#" class="file-open-save-as-repo" data-url="'+ data[i].url + '">' + data[i].url +'</a></td></tr>');
      }
      $("#save-as-new-repo-or-directory").append('<p>Create new repository</p><form id="create-new-repo"><input type="text" name="new-repo-name" id="new-repo-name" placeholder="new-repo-name"/><input type="submit"/></form>');
    });
  },
  displaySaveAsRepoBranchList: function(repo_base, access_token){
    var url = repo_base + "/branches";
    var repo = repo_base.split("https://api.github.com/repos/")[1];
    $("#repo-browser-branch").empty();
    $("#save-as-file-browser-list-wrapper > tbody").empty();
    $("#save-as-new-repo-or-directory").empty();
    $("#save-as-file-browser > p" ).remove();
    Util.retrieveAPIData(url, access_token).done(function(data){
      //$("#save-as-file-browser-list-wrapper").empty();
      for (var i = 0, len = data.length; i < len; i++) {
        $("#save-as-file-browser-list-wrapper > tbody").append('<tr><td><a href="#" class="file-open-save-as-branch" data-branch-sha="' + data[i].commit.sha + '" data-url="'+ repo_base + '" data-branch="' + data[i].name + '" data-repo="' + repo + '" data-path="">' + data[i].name +'</a></td><td><form id="create-new-save-as-branch" class="form-inline"><input id="branch" class="form-control" name="branch" placeholder="new-branch-name"></input><input type="hidden" id="repo" name="repo" value="' + repo + '"/><input type="hidden" id="branch-source-sha" name="branch-source-sha" value="' + data[i].commit.sha + '"/><button class="btn btn-default" type="submit">Create</button></form></form></li>');
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
    var access_token = Util.access_token;
    var url = "https://api.github.com/user/repos"
    var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
    var content = {
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
        var repo = res.responseJSON.full_name;
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
