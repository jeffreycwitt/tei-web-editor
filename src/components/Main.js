//vendor imports
import Octokat from "octokat";
var base64 = require('base-64');
var ace = require('brace');
require('brace/mode/xml');
require('brace/theme/kuroir');
require('brace/ext/searchbox');
require('brace/ext/settings_menu');


global.jQuery = require('jQuery');
var $ = global.jQuery;
require('bootstrap-loader');

//component imports
import Renderer from "./Renderer.js";
import Doc from "./Doc.js";
import Recent from "./Recent.js";
import Util from "./Util.js";
import Repo from "./Repo.js";
import SaveAs from "./SaveAs.js";
import Open from "./Open.js";
import Pr from "./Pr.js";
import KeyBoardShortCuts from "./KeyBoardShortCuts.js";
import Preview from "./Preview.js";
import User from "./User.js";


var access_token = window.location.hash.substring(7);
var aceEditor;


var Main = {
  init: function(customSettings){
    console.log(access_token)
    Util.setAccessToken(access_token);
    aceEditor = ace.edit("editor");
    aceEditor.setTheme("ace/theme/kuroir");
    aceEditor.session.setMode("ace/mode/xml");
    aceEditor.session.setOptions({
      tabSize: 2,
      useSoftTabs: true,
    });
    aceEditor.setShowInvisibles(true);

    KeyBoardShortCuts.addBindings();

    this.bindEventHandlers();
    if (access_token){
      User.retrieveAndSetUserState()
    }
    Open.recommendedRepos = customSettings.recommendedRepos;
    Preview.createPreviewStylesList(customSettings.previewStyles)
    Util.loadTemplateText(true);
  },
  bindEventHandlers: function(){
    var _this = this;

  // BEGIN MAIN NAV BAR EVENTS (in order from left to right) //
  //======================================================== //
    //load new file with empty template
    $(document).on("click","#file-new", function(){
      Util.fileNew();
    });

    //open Open dialogue box with repository list
    $(document).on("click",".display-repo-list", function(){
      Open.displayRepoList();
    });

    //open saveAs dialogue box with repository list
    $(document).on("click",".display-saveAs-repo-list", function(){
      SaveAs.displayRepoList();
    });

    // open pr review dialogue box
    $(document).on("click", "#display-pr", function(){
      Util.darken();
      $('.file-window').removeClass("visible")
      $('#pull-request-viewer').addClass("visible")
      Pr.displayPullRequestInfo();
    });

    // Toggle Mirador Window
    $(document).on("click", "#toggle-mirador", function(){
      Util.toggleMirador();
    });

    // Toggle Preview Window
    $(document).on("click", "#toggle-preview", function(){
      Util.togglePreview();

    });
    // Toggle Editor Window
    $(document).on("click", "#toggle-editor", function(){
      Util.toggleEditor();
    });

  //======================================================== //
  // END MAIN NAV BAR EVENTS//

  //BEGIN OPEN DIALOGUE BOX EVENTS
  //======================================================== //

    //open respository from branch and display top level tree contents
    $(document).on("click", ".display-open-top-level-tree", function(){
      var url = $(this).attr("data-url");
      var branch = $(this).attr("data-branch");
      var branchSha = $(this).attr("data-branch-sha");
      var repo = url.split("https://api.github.com/repos/")[1];
      Open.displayOpenTree(url, branch, branchSha, "", repo);

    });

    //open directory tree in repo and get its contents contents (very similar to display-open-top-level-tree)
    $(document).on("click",".display-open-tree", function(){
      var url = $(this).attr("data-url");
      var path = $(this).attr("data-path");
      var branch = $(this).attr("data-branch");
      var branchSha = $(this).attr("data-branch-sha");
      var repo = $(this).attr("data-repo");
      Open.displayOpenTree(url, branch, branchSha, path, repo);
    });

    // select repo and list available branches
    $(document).on("click", ".display-open-repo-branch-list", function(){
      var url = $(this).attr("data-url");
      var branch = $(this).attr("data-branch");
      Open.displayOpenRepoBranchList(url);

    });

    // create new branch within open dilaogue box //
    $(document).on("submit", "#create-new-branch", function(e){
      e.preventDefault();
      var branchName = $(e.target).find("#branch").val();
      var repo = $(e.target).find("#repo").val();
      var branchSourceSha = $(e.target).find("#branch-source-sha").val();
      Open.createNewOpenBranch(repo, branchName, branchSourceSha);
    });

    //==BEGIN CREATE FORK EVENTS ====//
    $(document).on("click", ".create-fork", function(){
      var url = $(this).attr("data-url");
      Open.createFork(url);
    });
    $("#fork-manual").submit(function(e){
      e.preventDefault();
      var url = $(this).find("#fork-url").val();
      Open.createFork(url);
    });
    //== END CREATE FORK EVENTS ====//

    //=== BEGIN OPEN FILE EVENTS ===//

    // open file from manual input url
    $("#open-file-manually").submit(function(e){
      e.preventDefault();
      var url = $(this).find("#manual-url").val();
      Open.openFile(url)
    });
      //open file from recent files list
    $(document).on("click",".open-file-from-recent", function(){
      var url = $(this).attr("data-url");
      Open.openFile(url)
    });
      //open file from directory list
    $(document).on("click",".open-file-from-list", function(){
      var path = $(this).attr("data-path");
      var branch = $(this).attr("data-branch");
      var branchSha = $(this).attr("data-branch");
      var repo = $(this).attr("data-repo");
      var url = "https://api.github.com/repos/" + repo + "/contents" + path + "?ref=" + branch;
      Open.openFile(url)
    });
    //=== END OPEN FILE EVENTS ===//

  //======================================================== //
  //END OPEN DIALOGUE BOX EVENTS //


  //BEGIN SAVE AS DIALOGUE BOX EVENTS //
  //======================================================== //

    $(document).on("submit", "#create-new-save-as-branch", function(e){
      e.preventDefault();
      var branchName = $(e.target).find("#branch").val();
      var repo = $(e.target).find("#repo").val();
      var branchSourceSha = $(e.target).find("#branch-source-sha").val();
      SaveAs.createNewSaveAsBranch(repo, branchName, branchSourceSha);
    });
    $(document).on("submit", "#create-new-repo", function(e){
      e.preventDefault();
      var name = $(e.target).find("#new-repo-name").val();
      SaveAs.createNewRepo(name);
    });

    //opens list of branches in save as window
    $(document).on("click", ".file-open-save-as-repo", function(){
      var url = $(this).attr("data-url");
      var repo = url.split("https://api.github.com/repos/")[1];
      Util.clearSaveParameters();
      $("#repo").val(repo);
      var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
      $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
      SaveAs.displaySaveAsRepoBranchList(url);
    });
    //opens top level tree in saveAs window for a given repo branch
    $(document).on("click", ".file-open-save-as-branch", function(){
      var url = $(this).attr("data-url");
      var branch = $(this).attr("data-branch");
      var branchSha = $(this).attr("data-branch-sha");
      var repo = $(this).attr("data-repo");
      var path = $(this).attr("data-path");
      $("#branch").val(branch);
      $("#sha").val(branchSha);
      //var path = $("#path").val().length > 0 ? $("#path").val() + "/" : "";
      $("#path").val(path);
      $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path + $("#file-name").val() + "?ref=" + $("#branch").val());
      SaveAs.displaySaveAsTree(url, branch, branchSha, repo, path);
    });
    $(document).on("click", ".file-open-save-as-path", function(){
      var url = $(this).attr("data-url");
      var branch = $(this).attr("data-branch");
      var branchSha = $(this).attr("data-branch-sha");
      var path = $(this).attr("data-path");
      var repo = $(this).attr("data-repo");
      var path_segment = path.length > 0 ? path + "/" : "";
      $("#path").val(path);
      $("#save-url").html("https://api.github.com/repos/" + $("#repo").val() + "/contents/" + path_segment + $("#file-name").val() + "?ref=" + $("#branch").val());
      SaveAs.displaySaveAsTree(url, branch, branchSha, repo, path);
    });

    // BEGIN events keep saveAs form input values in sync with directory browsing
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
    // END events keep saveAs form input values in sync with directory browsing

    $("#save-form").submit(function(e){
      e.preventDefault();
      var textContent = aceEditor.getValue();
      var content = base64.encode(textContent);

      var url = $("#save-url").text();
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
      SaveAs.saveFile(url, commit_data);
      });

  //======================================================== //
  //END SAVE AS DIALOGUE BOX EVENTS //

  //BEGIN PULL REQUEST DIALOGUE BOX EVENTS //
  //======================================================== //
    $(document).on("click", "#submit-pull-request", function(){
      var currentRepo = $("#current").attr("data-repo");
      var currentBranch = $("#current").attr("data-branch");
      var targetRepo = $("#target").attr("data-repo");
      var targetBranch = $("#target").attr("data-branch");
      Pr.submitPullRequest(currentRepo, currentBranch, targetRepo, targetBranch);
    });

  //END PULL REQUEST DIALOGUE BOX EVENTS //
  //======================================================== //

  // MISCELLANEOUS EVENTS
  //======================================================== //


    aceEditor.on('change', function() {
      var newText = Renderer.tei_conversion(aceEditor.getValue(), function(data){
      });
      //change Doc state to modified
      Doc.modified = true;
      $("#preview").html(newText);
    });

    $(document).on("click", ".close", function(){
      Util.hideFileWindow();
    });

    $("#editor-wrapper").on("click", function(){
      Util.hideFileWindow()
    });

    $(document).on("click", ".select-preview-style", function(){
      var styleName = $(this).attr("data-style-name");
      Preview.selectPreviewStyle(styleName);
    });
  //======================================================== //
  // END MISCELLANEOUS EVENTS
  //end of event handling functions
  }

}
export default Main;
