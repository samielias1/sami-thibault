import 'ol/ol.css';
import css from '../css/app.scss';
import 'bootstrap';


// import {OlMap} from './ol-map';
import { DummyClass } from './dummy-class';
import { OlMap } from './ol-map_geojsonFile';
import {arrBezirke, arrUhr, arrJahr, arrDelikt} from './list_filters';


// alert();

new OlMap();

//Radio button mit Bezirken : im Moment sind Bezirken durch random erstellt und daher falsch!
var txtBezirk = ['<p>Bezirk</p>'];
for (let i=0;i<arrBezirke.length;i++)  {
    let txt1;
    if (i==0){ txt1=  '<input type="radio" id="'+arrBezirke[i]+'" name="txtbezirk" value="'+i+'" checked="checked">';}
    else {txt1 = '<input type="radio" id="'+arrBezirke[i]+'" name="txtbezirk" value="'+i+'">' ; }
    let txt2  = '<for"'+arrBezirke[i]+'">'+arrBezirke[i]+'</label><br>' ;
    txtBezirk += txt1+txt2;
    };    
$('#contentBezirk').html(txtBezirk);

//Radio button mit Uhrzeiten
var txtUhr = ['<p>Uhrzeiten</p>'];
for (let i=0;i<arrUhr.length;i++)  {
    let txt3;
    if (i==0){ txt3=  '<input type="radio" id="'+arrUhr[i]+'" name="txtUhr" value="'+i+'" checked="checked">';}
    else {txt3 = '<input type="radio" id="'+arrUhr[i]+'" name="txtUhr" value="'+i+'">' ;}
    let txt4  = '<for"'+arrUhr[i]+'">'+arrUhr[i]+'</label><br>' ;
    txtUhr += txt3+txt4;
    };    
$('#divUhrzeit').html(txtUhr);

//Radio button mit Jahren
var txtJahr = ['<p>Jahr</p>'];
for (let i=0;i<arrJahr.length;i++)  {
    let txt5;
    if (i == 0) {txt5 = '<input type="radio" id="'+arrJahr[i]+'" name="txtJahr" value="'+i+'" checked="checked">' ;}
    else  {txt5 = '<input type="radio" id="'+arrJahr[i]+'" name="txtJahr" value="'+i+'">' ;}
    let txt6  = '<for"'+arrJahr[i]+'">'+arrJahr[i]+'</label><br>' ;
    txtJahr += txt5+txt6;
    };    
$('#divJahr').html(txtJahr);

//Radio button mit Deliktformen
var txtDelikt = ['<p>Deliktformen</p>'];
for (let i=0;i<arrDelikt.length;i++)  {
    let txt7;
    if (i == 0) {txt7 = '<input type="radio" id="'+arrDelikt[i]+'" name="txtDelikt" value="'+i+'" checked="checked">' ;}
    else { txt7 = '<input type="radio" id="'+arrDelikt[i]+'" name="txtDelikt" value="'+i+'">' ;}
    let txt8  = '<for"'+arrDelikt[i]+'">'+arrDelikt[i]+'</label><br>' ;
    txtDelikt += txt7+txt8;
    };    
$('#divDelikt').html(txtDelikt);

const dummyElement = new DummyClass();
dummyElement.changeText('Hallo wieder!')
