
$(document).ready(function(){
var mir = Mirador({
          "id": "mirador-viewer",
          "layout": "1x1",
          'mainMenuSettings': {
            'show': false
          },
          'openManifestsPage' : false,
          "buildPath": "mirador-2.4/",
          "data" : [
            {"manifestUri": "https://scta.info/iiif/plaoulcommentary/sorb/manifest"}
          ],
          // "windowObjects":[{
          //   //loadedManifest: "http://scta.info/iiif/summahalensis/quaracchi1924/manifest",
          //   //canvasID: "http://scta.info/iiif/quaracchi1924/canvas/40",
          //   //viewType: "ListView",
          //   bottomPanelVisible: "false",
          //   sidePanel: "true",
          //   sidePanelVisible: "false"
          // }],
          // "annotationEndpoint": { "name":"Local Storage", "module": "LocalStorageEndpoint" }
        });
});
