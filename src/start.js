//style import
import './styles/style.scss';

global.jQuery = require('jQuery');
var $ = global.jQuery;

import App from "./components/Main.js";

var customSettings = {
  recommendedRepos: [
    {
      name: "Simple TEI Edition",
      description: "A simple repository with a template index.xml file connected CETEI.js to allow for an easy web rendering. Using a 'gh-pages' branch to immediately publish your index.xml file on the web at http://[yourusername>].github.io/simple-tei-edition",
      url: "https://api.github.com/repos/scta/simple-tei-edition"
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
  ]
}


$(document).ready(function(){
  var appInstance = App.init(customSettings);
});
