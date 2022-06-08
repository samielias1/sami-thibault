import 'ol/ol.css';
import css from '../css/app.scss';
import 'bootstrap';


// import {OlMap} from './ol-map';
import { DummyClass } from './dummy-class';
import { OlMap } from './ol-map_geojsonFile_heatmap';
import {arrBezirke, arrUhr, arrJahr, arrDelikt} from './list_filters';


// alert();

new OlMap();

//Radio button mit Bezirken : im Moment sind Bezirken durch random erstellt und daher falsch!
var txtBezirk = ['<p><b>Bezirk</b></p>'];
for (let i=0;i<arrBezirke.length;i++)  {
    let txt1 = '<input type="radio" id="'+arrBezirke[i]+'" name="txtbezirk" value="'+i+'">' ; 
    let txt2  = '<for"'+arrBezirke[i]+'">'+arrBezirke[i]+'</label><br>' ;
    txtBezirk += txt1+txt2;
    };    
$('#contentBezirk').html(txtBezirk);

//Radio button mit Uhrzeiten
var txtUhr = ['<p><b>Uhrzeiten</b></p>'];
for (let i=0;i<arrUhr.length;i++)  {
    var j=i+1;
    let txt3 = '<input type="radio" id="'+arrUhr[i]+'" name="txtUhr" value="'+j+'">' ;
    let txt4  = '<for"'+arrUhr[i]+'">'+arrUhr[i]+'</label><br>' ;
    txtUhr += txt3+txt4;
    };    
$('#divUhrzeit').html(txtUhr);

//Radio button mit Jahren
var txtJahr = ['<p><b>Jahr</b></p>'];
for (let i=0;i<arrJahr.length;i++)  {
    var j=i+1;
    let txt5 = '<input type="radio" id="'+arrJahr[i]+'" name="txtJahr" value="'+j+'">' ;
    let txt6  = '<for"'+arrJahr[i]+'">'+arrJahr[i]+'</label><br>' ;
    txtJahr += txt5+txt6;
    };    
$('#divJahr').html(txtJahr);

//Drop down menu für Deliktformen 
var txtDelikt = ['<label for="deliktListe"><b>Deliktformen:</b></label><select id="deliktListe" name="deliktListe">'];
for (let i=0;i<arrDelikt.length;i++)  {
    let txt7 = '<option value="'+i+'">'+arrDelikt[i]+'</option>' ; 
    txtDelikt += txt7;
    };    
$('#divDelikt').html(txtDelikt);

// const dummyElement = new DummyClass();
// dummyElement.changeText('Hallo wieder!')
