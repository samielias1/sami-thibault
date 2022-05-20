import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
// import Wochenmarkt from '../data/wochenmaerkte.geojson';
import Overlay from 'ol/Overlay';
import $ from 'jquery';
import Select from 'ol/interaction/Select';
import { Fill, Circle, Stroke, Style } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';



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
        url: '../data/wochenmaerkte.geojson',
        format: new GeoJSON()
    });

const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: defaultStyle
    });


const popup = new Overlay({
        element: document.getElementById('popup')       // das Div "popup" wird selektiert und als overlay positioniert
    });

    export class OlMap {
    constructor() {
        this.map = new Map({
            target: 'map',
            view: new View({
                center: transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'),
                zoom: 11
            }),
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
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
                for (var i = 0; i < features.length; i++) {
                    // info.push(features[i].properties.get('title')); (funktioniert nicht)
                    info.push((features[i].values_.title));
                }
                document.getElementById('popup').innerHTML = info.join(', ') || '(unknown)';
                popup.setPosition(coordinate);
            } else {
                document.getElementById('popup').innerHTML = '';
                popup.setPosition(undefined);
            }
        };

        this.map.on('singleclick', function(evt) {
            const pixel = evt.pixel;
            const coordinate = evt.coordinate;
            displayFeatureInfo(pixel, coordinate);
        });





    }
};


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

