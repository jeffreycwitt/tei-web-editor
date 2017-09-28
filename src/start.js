//style import
import './styles/style.scss';

global.jQuery = require('jQuery');
var resizable = require("jquery-resizable");
var $ = global.jQuery;

import App from "./components/Main.js";


var customSettings = {
  recommendedRepos: [
    {
      name: "Simple TEI Edition",
      description: "A simple repository with a template index.xml file connected CETEI.js to allow for an easy web rendering. Using a 'gh-pages' branch to immediately publish your index.xml file on the web at http://[yourusername>].github.io/simple-tei-edition",
      url: "https://api.github.com/repos/scta/simple-tei-edition"
    },
    {
      name: "Mary Magdalene",
      description: "The goal of this project is of a twofold nature: in terms of research results, it will create an interactive online edition of a medieval Mary Magdalene legend transmitted in the Lower Rhine area; in terms of teaching practice, it will train graduate and undergraduate students in palaeography, editing, and coding.",
      url: "https://code.harvard.edu/rak772/MaryMagdalene"
    }
  ],
  previewStyles:[
    {
      description: "default preview styling",
      name: "default"
    },
    {
      name: "lbp-1.0.0-critical",
      description: "A customized styling for xml docs created to comply with the LombardPress-1.0.0-Critical customized TEI Schema"
    }
  ],
  apiBaseUrl : "https://code.harvard.edu/api/v3/",
  baseUrl: "https://code.harvard.edu/",
  helpUrls:[
    {
      name: "Test Help File",
      description:"",
      url: "repos/rak772/MaryMagdalene/contents/test-help.md",
      display: "md"
    },
    {
      name: "The LombardPress Schema",
      description: "",
      url: "http://lombardpress.org/schema/docs/",
      display: "iframe"
    }
  ],
  hidePreviewStyles: true,
  hideSuggestedRepos: false,
  hideForkAnotherRepo: true,
  hidePR: true
}

//preview styles currently have to select from supported options of which there are currently tei-keywords
// default and lbp-1.0.0-critical
// supported styles can be added by adding a css style sheet in dist/xmlstyles where the file named after the style name.
// and corresponding <link> element needs to be added to the index.html file
// required js event bindings for a given style currently need to be added to the Preview.js file.




$(document).ready(function(){
  var appInstance = App.init(customSettings);
});
