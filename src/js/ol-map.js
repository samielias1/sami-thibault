import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {transform} from 'ol/proj';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';


const geojsonObject = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          1490441.08,
          6894157.75
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          1500441.08,
          6894157.75
        ]
      }
    }
  ]
};

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject),
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
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
        vectorLayer,
      ],
    });
  }
};