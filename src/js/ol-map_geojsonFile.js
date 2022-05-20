import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {transform} from 'ol/proj';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
// import Wochenmarkt from '../data/wochenmaerkte.geojson';
import Overlay from 'ol/Overlay';
import $ from 'jquery';
import Select from 'ol/interaction/Select';
import {Fill, Stroke, Style} from 'ol/style';
// import Style from 'ol/style/Style';


// const defaultStyle = new Style({
//     fill: new Fill({
//       color: '#8A2BE2',
//     }),
//     stroke: new Stroke({
//         color: '#8A2BE2',
//         width: 2,
//       }),
//   });

const vectorSource = new VectorSource({
    url: '../data/wochenmaerkte.geojson',
    format: new GeoJSON()
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
//   style: defaultStyle
});


// const popup = new Overlay({
//     element: $('#popup')       // das Div "popup" wird selektiert und als overlay positioniert
// });

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
    this.vectorLayer.on('click', function() {
    
            alert('Hallo');
            
            });
  }
  // evtl muss Mausklick hier rein, also Methode der Klasse map
};

// const selectSingleClick = new Select({
//     layers:[vectorLayer],
//     style: [selected]
// });

// von Isabelle (Ihr könnt dabei auch auf Variablen zugreifen, die imselben Skript, aber außerhalb der Klasse definiert wurden)
// export class OlMap {
//     constructor() {
//     this.map = new Map({
//     target: 'map',
//     view: new View({
//     center: transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'),
//     zoom: 11
//     }),
//     layers: [
//     new TileLayer({
//     source: new OSM()
//     }),
//     //vectorLayer
//     ],
//     //overlays: [popup]
//     });
    
//     this.map.on('click', function() {
    
//     alert('Hallo');
    
//     });
//     }
//     };