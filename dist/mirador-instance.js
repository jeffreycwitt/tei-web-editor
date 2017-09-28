
$(document).ready(function(){
var mir = Mirador({
          "id": "mirador-viewer",
          "layout": "1x1",
          'mainMenuSettings': {
            'show': false
          },
          'openManifestsPage' : true,
          "buildPath": "mirador-2.4/",
          "data" : [
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/B1"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/B2"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/D"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/G"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/K1"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/K2"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/N"},
              {"manifestUri": "http://digital-editing.fas.harvard.edu/manifests/S"},
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
