import './style.scss';

import Octokat from "octokat";



var base64 = require('base-64');
var ace = require('brace');
require('brace/mode/xml');
require('brace/theme/kuroir');


global.jQuery = require('jQuery');
var $ = global.jQuery;

require('bootstrap-loader');
var access_token = window.location.hash.substring(7);


var aceEditor;

$(document).ready(function(){
  console.log(access_token)
  aceEditor = ace.edit("editor");
  aceEditor.setTheme("ace/theme/kuroir");
  aceEditor.session.setMode("ace/mode/xml");
  aceEditor.session.setOptions({
    tabSize: 2,
    useSoftTabs: true
  });
  aceEditor.setShowInvisibles(true);



  // load empty template onload
  //Util.loadTemplateText();

  aceEditor.on('change', function() {
    var newText = Rendering.tei_conversion(aceEditor.getValue(), function(data){
    });
    //console.log(newText);
    $("#preview").html(newText);
  });

  //load empty template
  $(document).on("click","#file-new", function(){
    //Util.loadTemplateText();
  });




//===============BINDING ENVENTS =========================//
  //toggle window events
  $(document).on("click", "#toggle-mirador", function(){
    $('#mirador-viewer').slideToggle();
  });
  $(document).on("click", "#toggle-preview", function(){
    if ($('#preview').is(':visible')){
      $("#editor").animate({"width": "100%"})
      $('#preview').slideToggle();
      if (!$('#editor').is(':visible')){
        //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
        $("#mirador-viewer").animate({"height": "100%"})
      }
    }
    else{
      $("#editor").animate({"width": "50%"})
      //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
      $("#mirador-viewer").animate({"height": "40%"})
      $('#preview').slideToggle();
    }
  });
  $(document).on("click", "#toggle-editor", function(){
    if ($('#editor').is(':visible')){
      $("#preview").animate({"width": "100%"})
      $('#editor').slideToggle();
      if (!$('#preview').is(':visible')){
        //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
        $("#mirador-viewer").animate({"height": "100%"})
      }
    }
    else{
      $("#preview").animate({"width": "50%"})
      //mirador toggle is buggy because the styling doesn't adjust until the window is adjusted
      $("#mirador-viewer").animate({"height": "40%"})
      $('#editor').slideToggle();
    }
  });
  // open pr review dialogue box
  $(document).on("click", "#file-pr", function(){
    $('#editor').addClass("darkened");
    $('#preview').addClass("darkened");
    //Util.darken();
    $('.file-window').removeClass("visible")
    $('#pull-request-viewer').addClass("visible")
    Pr.displayPullRequestInfo();
  });
  $(document).on("click", "#submit-pull-request", function(){
    var currentRepo = $("#current").attr("data-repo");
    var currentBranch = $("#current").attr("data-branch");
    var targetRepo = $("#target").attr("data-repo");
    var targetBranch = $("#target").attr("data-branch");
    Pr.submitPullRequest(currentRepo, currentBranch, targetRepo, targetBranch);
  });
//open repository list
  $(document).on("click",".file-open-dir", function(){
    $('#editor').addClass("darkened");
    $('#preview').addClass("darkened");
    //Util.darken();
    $('.file-window').removeClass("visible")
    $('#breadcrumbs').empty();
    $("#repositories").empty();
    $('#dir').addClass("visible");
    var url = "https://api.github.com/user/repos"
    console.log(access_token);
    Open.displayOpenRepoList(url, access_token);
  });
//open save dialogue box
  $(document).on("click","#file-open-save", function(){
    $('.file-window').removeClass("visible");
    var url = "https://api.github.com/user/repos";
    SaveAs.displaySaveAsRepoList(url, access_token);
    $('#editor').addClass("darkened");
    $('#preview').addClass("darkened");
    //Util.darken();
    $('#save').addClass("visible");

  });
  //opens list of branches in save as window
  $(document).on("click", ".file-open-save-as-repo", function(){
    var url = $(this).attr("data-url");
    var repo = url.split("https://api.github.com/repos/")[1];
    Util.clearSaveParamters();
    $("#repo").val(repo);
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
    SaveAs.displaySaveAsRepoBranchList(url, access_token);
  });
  //opens top level tree in saveAs window for a given repo branch
  $(document).on("click", ".file-open-save-as-branch", function(){
    var url = $(this).attr("data-url");
    var branch = $(this).attr("data-branch");
    var branchSha = $(this).attr("data-branch-sha");
    $("#branch").val(branch);
    $("#sha").val(branchSha);
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
    //retrieveDirectoryCommits(url, access_token)
    //retrieveRepoTree(url, access_token, branch, branchSha);
    SaveAs.displaySaveAsTree(url, branch, branchSha, access_token);
  });
  $(document).on("click", ".file-open-save-as-path", function(){
    var url = $(this).attr("data-url");
    var branch = $(this).attr("data-branch");
    var branchSha = $(this).attr("data-branch-sha");
    var path = $(this).attr("data-path");
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());

    //retrieveDirectoryCommits(url, access_token)
    //retrieveRepoTree(url, access_token, branch, branchSha);
    SaveAs.displaySaveAsTree(url, branch, branchSha, access_token);
  });
  $(document).on("input", "#repo", function(e){
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
  });
  $(document).on("input", "#path", function(e){
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
  });
  $(document).on("input", "#file-name", function(e){
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
  });
  $(document).on("input", "#branch", function(e){
    var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
    $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
  });
  // open file events
  //open file from direct url list
  $(document).on("click",".file-open-file", function(){
    var url = $(this).attr("data-url");
    $('.file-window').removeClass("visible");
    //Util.undarken();
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
    Util.loadText(url, access_token)
  });
// open file from input url
  $("#file-manual").submit(function(e){
    e.preventDefault();
    $('.file-window').removeClass("visible");
    //Util.undarken();
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
    var url = $(this).find("#manual-url").val();
    Util.loadText(url, access_token)
  });
  //open file from directory list
  $(document).on("click",".file-open-file-list", function(){
    var path = $(this).attr("data-path");
    var branch = $(this).attr("data-branch");
    var branchSha = $(this).attr("data-branch");
    var repo = $(this).attr("data-repo");
    var url = "https://api.github.com/repos/" + repo + "/contents" + path + "?ref=" + branch;
    $('.file-window').removeClass("visible");
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
    //Util.undarken();
    Recent.set(url);
    Util.loadText(url, access_token)
  });
  //directory or repo opening events
  //open respository from branch and display top level tree contents
  $(document).on("click", ".file-open-branch", function(){
    var url = $(this).attr("data-url");
    var branch = $(this).attr("data-branch");
    var branchSha = $(this).attr("data-branch-sha");
    var repo = url.split("https://api.github.com/repos/")[1];
    //retrieveDirectoryCommits(url, access_token)
    Open.displayOpenTree(url, access_token, branch, branchSha, "", repo);
  // select repo and liste available branches
  });
  $(document).on("click", ".file-open-repo", function(){
    var url = $(this).attr("data-url");
    var branch = $(this).attr("data-branch");
    Open.displayOpenRepoBranchList(url, access_token);

  });
  $(document).on("click", ".create-fork", function(){
    var url = $(this).attr("data-url");
    var repo = url.split("https://api.github.com/repos/")[1];
    Open.createOpenFork(repo, access_token);
  });
  //display contents of a git tree
  $(document).on("click",".file-open-tree", function(){
    var url = $(this).attr("data-url");
    var path = $(this).attr("data-path");
    var branch = $(this).attr("data-branch");
    var branchSha = $(this).attr("data-branch-sha");
    var repo = $(this).attr("data-repo");
    Open.displayOpenTree(url, access_token, branch, branchSha, path, repo);
  });
  $(document).on("submit", "#create-new-branch", function(e){
    e.preventDefault();
    var branchName = $(e.target).find("#branch").val();
    var repo = $(e.target).find("#repo").val();
    var branchSourceSha = $(e.target).find("#branch-source-sha").val();
    Open.createNewOpenBranch(repo, branchName, branchSourceSha, access_token);
  });
  $(document).on("submit", "#create-new-save-as-branch", function(e){
    e.preventDefault();
    var branchName = $(e.target).find("#branch").val();
    var repo = $(e.target).find("#repo").val();
    var branchSourceSha = $(e.target).find("#branch-source-sha").val();
    //displaySaveAsTree(url, branch, branchSha, access_token);
    SaveAs.createNewSaveAsBranch(repo, branchName, branchSourceSha, access_token);
  });
  $(document).on("submit", "#create-new-repo", function(e){
    e.preventDefault();
    var name = $(e.target).find("#new-repo-name").val();
    SaveAs.createNewRepo(name);
  });

  $("#editor-wrapper").on("click", function(){
    $(".file-window").removeClass("visible");
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
    //Util.undarken();
  });

  $("#save-form").submit(function(e){
    e.preventDefault();
    var textContent = aceEditor.getValue();
    var content = base64.encode(textContent);

    var url = $(this).find("#save-url").text();
    var branch = $(this).find("#branch").val();
    var sha = $(this).find("#sha").val();
    var message = $(this).find("#message").val();

    var commit_data = {
      "path": url,
      "message": message,
      "content": content,
      "sha": sha,
      "branch": branch
    }

    SaveAs.saveFile(url, commit_data, access_token);
  });
});

var Util = {
  // no idea why these are not working
  undarken: function(){
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
  },
  // no idea why these are not working
  darken: function(){
    console.log($("#preview"));
    $('#editor').removeClass("darkened");
    $('#preview').removeClass("darkened");
  },
  access_token: access_token,
  retrieveAPIData: function(url, access_token){
    var url_with_access = url.includes("?") ? url + "&access_token=" + access_token : url + "?access_token=" + access_token;
    return $.get(url_with_access);
  },
  parseXMLContent: function(data){
    var content = base64.decode(data.content);
    return content;
  },
  addXMLContent: function(content){
    aceEditor.setValue(content);
    aceEditor.clearSelection();
    aceEditor.gotoLine(0);
    aceEditor.scrollToLine(0);
  },
  createPreviewContent: function(content){
    var newText = Rendering.tei_conversion(content, function(data){});
    $("#preview").html(newText);
  },
  setSaveParameters: function(data){
    var branch = data.url.split("?ref=")[1]
    var repo = data.repo ? data.repo : data.url.split("https://api.github.com/repos/")[1].split("/contents/")[0];
    var path = data.path.split("/" + data.name)[0] === data.name ? "" : data.path.split("/" + data.name)[0];
    $("#sha").val(data.sha);
    $("#save-url").html(data.url);
    $("#repo").val(repo);
    $("#path").val(path);
    $("#file-name").val(data.name);
    $("#branch").val(branch);
    $('#message').val("");

    Doc.set(data)
    Repo.retrieveAndSetRepoState("https://api.github.com/repos/" + repo, Util.access_token)
  },
  clearSaveParamters: function(){
    $("#sha").val("");
    $("#save-url").html("");
    $("#repo").val("");
    $("#path").val("");
    $("#file-name").val("");
    $("#branch").val("");
    $('#message').val("");

    Doc.set(null);
    Repo.set(null);
  },
  loadText: function(url, access_token){
    var _this = this;
    _this.retrieveAPIData(url, access_token).done(function(data){
      var content = Util.parseXMLContent(data);
      _this.addXMLContent(content);
      _this.createPreviewContent(content);
      _this.setSaveParameters(data);
    });
  },
  // TODO: this function still relies on a sinatra route, but should be any easy fix.
  loadTemplateText: function(){
    var _this = this;
    $.get("/doc", function(data){
      Util.clearSaveParamters();
      _this.addXMLContent(data);
      _this.createPreviewContent(data);
    });
  }
}

// note: after a file is saved, if you immediately navigate away and then come back to that file
//github is sometimes still serviing the file, because it hasn't updated yet.
//This could cause some real headaches for users.

//===========SAVE AS COMPONENT
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
  displaySaveAsRepoList: function(url, access_token){
    url = url + "?per_page=100";
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

//File Open COMPONENT

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
    var url = "https://api.github.com/repos/" + targetRepo + "/pulls"
    var currentUsername = currentRepo.split("/")[0];
    pr = {
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

var Doc = {
  state: null,
  set: function(data){
    this.state = data;
  }
}

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

var Recent = {
  files: [],
  set: function(file){
    this.files.push(file);
  }
}

// note: after a file is saved, if you immediately navigate away and then come back to that file
//github is sometimes still serviing the file, because it hasn't updated yet.
//This could cause some real headaches for users.

// TEI rendering

// custom tei conversion that doesn't repeat registering elements
// code pulled from CETEI library; registering elemeents fucntions is then cut-out
var Rendering = {
  tei_conversion: function(TEI, callback, perElementFn){

  var TEI_dom = ( new DOMParser() ).parseFromString(TEI, "text/xml");
  let convertEl = (el) => {
          // Create new element. TEI elements get prefixed with 'tei-',
          // TEI example elements with 'teieg-'. All others keep
          // their namespaces and are copied as-is.
          let newElement;
          let copy = false;
          switch (el.namespaceURI) {
            case "http://www.tei-c.org/ns/1.0":
              newElement = document.createElement("tei-" + el.tagName);
              break;
            case "http://www.tei-c.org/ns/Examples":
              if (el.tagName == "egXML") {
                newElement = document.createElement("teieg-" + el.tagName);
                break;
              }
            case "http://relaxng.org/ns/structure/1.0":
              newElement = document.createElement("rng-" + el.tagName);
              break;
            default:
              newElement = document.importNode(el, false);
              copy = true;
          }
          // Copy attributes; @xmlns, @xml:id, @xml:lang, and
          // @rendition get special handling.
          for (let att of Array.from(el.attributes)) {
              if (!att.name.startsWith("xmlns") || copy) {
                newElement.setAttribute(att.name, att.value);
              } else {
                if (att.name == "xmlns")
                newElement.setAttribute("data-xmlns", att.value); //Strip default namespaces, but hang on to the values
              }
              if (att.name == "xml:id" && !copy) {
                newElement.setAttribute("id", att.value);
              }
              if (att.name == "xml:lang" && !copy) {
                newElement.setAttribute("lang", att.value);
              }
              if (att.name == "rendition") {
                newElement.setAttribute("class", att.value.replace(/#/g, ""));
              }
          }
          // Preserve element name so we can use it later
          newElement.setAttribute("data-teiname", el.localName);
          // If element is empty, flag it
          if (el.childNodes.length == 0) {
            newElement.setAttribute("data-empty", "");
          }
          // Turn <rendition scheme="css"> elements into HTML styles
          if (el.localName == "tagsDecl") {
            let style = document.createElement("style");
            for (let node of Array.from(el.childNodes)){
              if (node.nodeType == Node.ELEMENT_NODE && node.localName == "rendition" && node.getAttribute("scheme") == "css") {
                let rule = "";
                if (node.hasAttribute("selector")) {
                  //rewrite element names in selectors
                  rule += node.getAttribute("selector").replace(/([^#, >]+\w*)/g, "tei-$1").replace(/#tei-/g, "#") + "{\n";
                  rule += node.textContent;
                } else {
                  rule += "." + node.getAttribute("xml:id") + "{\n";
                  rule += node.textContent;
                }
                rule += "\n}\n";
                style.appendChild(document.createTextNode(rule));
              }
            }
            if (style.childNodes.length > 0) {
              newElement.appendChild(style);
              this.hasStyle = true;
            }
          }
          // Get prefix definitions
          if (el.localName == "prefixDef") {
            this.prefixes.push(el.getAttribute("ident"));
            this.prefixes[el.getAttribute("ident")] =
              {"matchPattern": el.getAttribute("matchPattern"),
              "replacementPattern": el.getAttribute("replacementPattern")};
          }
          for (let node of Array.from(el.childNodes)){
              if (node.nodeType == Node.ELEMENT_NODE) {
                  newElement.appendChild(  convertEl(node)  );
              }
              else {
                  newElement.appendChild(node.cloneNode());
              }
          }
          if (perElementFn) {
            perElementFn(newElement);
          }
          return newElement;
      }

      var html = convertEl(TEI_dom.documentElement);
      //console.log(html);
      return html;
}
}
