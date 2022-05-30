import 'ol/ol.css';
import css from '../css/app.scss';

// import {OlMap} from './ol-map';
import { DummyClass } from './dummy-class';
import { OlMap } from './ol-map_geojsonFile';
import {arrBezirke, arrUhr, arrJahr} from './list_filters';


// alert();

new OlMap();

//Radio button mit Bezirken : im Moment sind Bezirken durch random erstellt und daher falsch!
var txtBezirk = ['<p>Bezirk</p>'];
for (let i = 0; i < arrBezirke.length; i++) {
    let txt1 = '<input type="radio" id="' + arrBezirke[i] + '" name="txtbezirk" value="' + i + '"><br>';
    let txt2 = '<for"' + arrBezirke[i] + '">' + arrBezirke[i] + '</label><br>';
    txtBezirk += txt1 + txt2;
};
$('#divBezirk').html(txtBezirk);

//Radio button mit Uhrzeiten
var txtUhr = ['<p>Uhrzeiten</p>'];
for (let i = 0; i < arrUhr.length; i++) {
    let txt3 = '<input type="radio" id="' + arrUhr[i] + '" name="txtUhr" value="' + i + '"><br>';
    let txt4 = '<for"' + arrUhr[i] + '">' + arrUhr[i] + '</label><br>';
    txtUhr += txt3 + txt4;
};
$('#divUhrzeit').html(txtUhr);

//Radio button mit Jahren
var txtJahr = ['<p>Jahresgang</p>'];
for (let i = 0; i < arrJahr.length; i++) {
    let txt5 = '<input type="radio" id="' + arrJahr[i] + '" name="txtJahr" value="' + arrJahr[i] + '"><br>';
    let txt6 = '<for"' + arrJahr[i] + '">' + arrJahr[i] + '</label><br>';
    txtJahr += txt5 + txt6;
};
$('#divJahr').html(txtJahr);


const dummyElement = new DummyClass();
dummyElement.changeText('Hallo wieder!')