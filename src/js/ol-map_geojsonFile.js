import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import $ from 'jquery';
import Select from 'ol/interaction/Select';
import { Fill, Circle, Stroke, Style } from 'ol/style';
import {Cluster} from 'ol/source';
import {deliktform, selbstbezeichnung, tatort} from './list_filters';




const defaultStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: '#e3ec17'
        }),
        stroke: new Stroke({
            color: '#ec174a',
            width: 1
        }),
        radius: 7
    })
});

const selectStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: '#F0F8FF'
        }),
        stroke: new Stroke({
            color: '#ec174a',
            width: 1
        }),
        radius: 7
    })
});

const vectorSource = new VectorSource({
        // url: '../data/wochenmaerkte.geojson',        // wir bauen einen leeren Vektorlayer, der unten mit Ajax befüllt wird
        format: new GeoJSON()
    });

const vectorLayer = new VectorLayer({
        maxResolution:20,
        source: vectorSource,
        style: defaultStyle
    });


const popup = new Overlay({
        element: document.getElementById('popup')       // das Div "popup" wird selektiert und als overlay positioniert
    });

const clusterSource = new Cluster({
    //    distance: parseInt(distanceInput.value, 10),
    //    minDistance: parseInt(minDistanceInput.value, 10),
       source: vectorSource,
      });

      const styleCache = {};
const clusters = new VectorLayer({
    minResolution:20,
  source: clusterSource,
  style: function (feature) {
    const size = feature.get('features').length;
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new Circle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: '#3399CC',
          }),
        }),
      });
      styleCache[size] = style;
    }
    return style;
  },
});
const view = new View({
    center: transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'),
    zoom: 11   
})

    export class OlMap {
    constructor() {
        this.map = new Map({
            target: 'map',
            view: view,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer,
                clusters
            ],
            overlays: [popup]
        });
        // this.map.on('click', function() {

        //         alert('Hallo');
        //         });


        const selectSingleClick = new Select({
            // condition: singleClick,
            layers: [vectorLayer],
            style: selectStyle
                });
        
        this.map.addInteraction(selectSingleClick);
        // this.map.addOverlay(popup);

        const displayFeatureInfo = (pixel, coordinate) => {
            var features = [];
            this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                features.push(feature);
            });

            if (features.length > 0) {
                var info = [];
                // var infoTitle = ['deliktform','datum','uhrzeit','tatort','selbstbezeichnung'];
                for (var i = 0; i < features.length; i++) {
                    // info.push(features[i].get('deliktform','datum','uhrzeit')); //(funktioniert nicht)
                    // info.push((features[i].values_.title));     // funktioniert, auf wochenmaerkte angewendet
                    // infoTitle.forEach(element => {
                    //     info.push(element + features[i].values_.element);  
                    // });
                    info.push('Deliktform: '+features[i].values_.deliktform+'. '+ deliktform[features[i].values_.deliktform]);
                    info.push('Datum: '+features[i].values_.datum);
                    info.push('Uhrzeit: '+features[i].values_.uhrzeit);
                    info.push('Tatort: '+features[i].values_.tatort +'. '+ tatort[features[i].values_.tatort]);
                    info.push('Selbstbezeichnung: '+features[i].values_.selbstbezeichnung+'. '+ selbstbezeichnung[features[i].values_.selbstbezeichnung]);
                    
                }
                // document.getElementById('popup-content').innerHTML = info.join('\r\n') || '(unknown)';
                document.getElementById('popup-content').innerHTML = '<ul><li>' + info.join("</li><li>") + '</li></ul>';
                popup.setPosition(coordinate);
            } else {
                document.getElementById('popup-content').innerHTML = '';
                popup.setPosition(undefined);
            }
        };

        this.map.on('singleclick', function(evt) {
            const pixel = evt.pixel;
            const coordinate = evt.coordinate;
            displayFeatureInfo(pixel, coordinate);
        });

        document.getElementById('popup-closer').onclick = function() {
            popup.setPosition(undefined);
            document.getElementById('popup-closer').blur();
            selectSingleClick.getFeatures().clear();
            return false;
        };

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '../php/pdo.php',
            success: (data) => {
                var geojson = data;
                var format = new GeoJSON();
                var features = format.readFeatures(geojson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                vectorSource.addFeatures(features);
            }
        })

        $("#bttnBezirk").on("click", () => {
            // Nutzereingaben holen
            var bezirk = $("input[name='txtbezirk']:checked").val();
            console.log('bezirk :'+bezirk);
            
            //Serveranfragen
            $.post("../php/pdo_geojson_bezirk.php", { //"../php/pdo_geojson_filter.php"
            Bezirk: bezirk,
            
            }, (response) =>{ // x ist hier die Antwort des Servers - hier ist es html
            //$("#divBezirk").html('baba');
            var geojsonFilt = response;
            vectorSource.clear();
            var formatFilt = new GeoJSON();
            var featuresFilt = formatFilt.readFeatures(geojsonFilt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresFilt);
            const feature = vectorSource.getFeatures()[0];
            console.log(feature);
            const point = feature.getGeometry();
            console.log('point');
            console.log(point.getCoordinates());
            const size = this.map.getSize();
            console.log('size');
            console.log(size); // hier [800 800]
            //view.centerOn(point.getCoordinates(), size, [400, 400]); // last Parameter = position = pixel on the view to center on.
            //this.map.view.setCenter(centerNew);
            view.setZoom(13);
            view.setCenter(point.getCoordinates());
            
            });
            })
            $("#bttnSelect").on("click", () => {
            // Nutzereingaben holen
            var jahr = $("input[name='txtJahr']:checked").val();
            
            var uhr = $("input[name='txtUhr']:checked").val();
            
            
            //Serveranfragen
            $.post("../php/pdo_filter.php", { //"../php/pdo_geojson_filter.php"
            Jahr: jahr,
            Uhr: uhr
            
            }, (response) =>{ // x ist hier die Antwort des Servers - hier ist es html
            //$("#divBezirk").html('baba');
            var geojsonFilt = response;
            vectorSource.clear();
            var formatFilt = new GeoJSON();
            var featuresFilt = formatFilt.readFeatures(geojsonFilt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresFilt);
            
            });
            })
            $("#bttnAlle").on("click", () => {
            //Serveranfragen
            $.post("../php/pdo.php", {
            // Bezirk: bezirk,
            
            }, (response) =>{ // x ist hier die Antwort des Servers - hier ist es html
            var geojsonAll = response;
            vectorSource.clear();
            var formatAll = new GeoJSON();
            var featuresAll = formatAll.readFeatures(geojsonAll, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresAll);
            view.setZoom(11);
            view.setCenter(transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'));
            
            
            });
            })


    }
};

 // erste funktionierende Lösung Sami
        // $.getJSON("../php/pdo.php",

        // (data) => {
        // vectorSource.addFeatures(new GeoJSON().readFeatures(data));
        
        // });

        //Loesung Tibo
        // $.getJSON('../php/pdo.php',function(data){
        //     // console.log('before');
        //     var geojson = data;; /*jQuery.JSONparse(data);*/
        //     // console.log('ajax2'+geojson.type + ' typ:'+ geojson.features[1].type); //obj.employees[1].firstName
        //     // console.log('coordinates'+ geojson.features[1].geometry.coordinates);
        //     var format = new GeoJSON();
        //     var features = format.readFeatures(geojson, {
        //     dataProjection: 'EPSG:4326',
        //     featureProjection: 'EPSG:3857'
        //     });
        //     vectorSource.addFeatures(features);
        //     }
        //     );


// $.ajax({
//     type: 'POST',
//     dataType: 'json',
//     url: '../php/pdo.php',
//     success: function(data) {
//         var geojson = jQuery.parseJSON(data);
//         var format = new ol.format.GeoJSON();
//         var features = format.readFeatures(geojson, {
//             dataProjection: 'EPSG:4326',
//             featureProjection: 'EPSG:3857'
//         });
//         vectorSource.addFeatures(features);
//     }
// })





// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import { transform } from 'ol/proj';
// import { Vector as VectorSource } from 'ol/source';
// import { Vector as VectorLayer } from 'ol/layer';
// import GeoJSON from 'ol/format/GeoJSON';
// import Overlay from 'ol/overlay';
// import $ from 'jquery';
// import { Fill, Circle, Stroke, Style } from 'ol/style';

// // geojson
// const vectorSource = new VectorSource({
//   url: './data/bezirke.geojson',
//   format: new GeoJSON()
// });

// const myPolStyle = new Style({
//   stroke: new Stroke({
//     color: 'blue',
//     lineDash: [4],
//     width: 3,
//   }),
//   fill: new Fill({
//     color: 'rgba(0, 0, 255, 0.1)',
//   }),
// });

// const vectorLayer = new VectorLayer({
//   source: vectorSource,
//   style: myPolStyle
// });

// const popup = new Overlay({
//   element: document.getElementById('popup')       // das Div "popup" wird selektiert und als overlay positioniert
// });


// export class OlMap {
//   constructor() {
//     this.map = new Map({
//       target: 'map',
//       view: new View({
//         center: transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'),
//         zoom: 11
//       }),
//       layers: [
//         new TileLayer({
//           source: new OSM()
//         }), 
//       vectorLayer],
//       overlays: [popup]
//     });

//     const displayFeatureInfo = (pixel, coordinate) => {
//       let features = [];
//       this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
//           features.push(feature);
//       });

//       if (features.length > 0) {
//           var info = [];
//           for (var i = 0; i < features.length; i++) {
//               //info.push(features[i].properties.get('Name'));
//               info.push((features[i].values_.Name));
//             } 
//           document.getElementById('popup').innerHTML = info.join(', ') || '(unknown)';
//           popup.setPosition(coordinate);
//       } else {
//           document.getElementById('popup').innerHTML = '';
//           popup.setPosition(undefined);
//       }
//     };

//     this.map.on('singleclick', function(evt) {
//       const pixel = evt.pixel;
//       const coordinate = evt.coordinate;
//       displayFeatureInfo(pixel, coordinate);
//   });

//   }  

// };

