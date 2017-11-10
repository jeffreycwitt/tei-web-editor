
$(document).ready(function(){
var mir = Mirador({
          "id": "mirador-viewer",
          "layout": "1x1",
          'mainMenuSettings': {
            'show': false
          },
          //'openManifestsPage' : false,
          "buildPath": "mirador/",
          "data" : [
              {"manifestUri": "https://scta.info/iiif/plaoulcommentary/sorb/manifest"}
          ],
          "sidePanelOptions" : {
           "tocTabAvailable": true,
           "searchTabAvailable": true,
           "annotations" : true
         },
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
