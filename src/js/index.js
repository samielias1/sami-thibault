import 'ol/ol.css';
import css from '../css/app.scss';

// import {OlMap} from './ol-map';
import {DummyClass} from './dummy-class';
import {OlMap} from './ol-map_geojsonFile';


// alert();

new OlMap();


const dummyElement = new DummyClass();
dummyElement.changeText('Hallo wieder!')