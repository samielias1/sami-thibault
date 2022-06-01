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
import { Fill, Circle, Stroke, Style, Text, Icon } from 'ol/style';
import { Cluster } from 'ol/source';
import { deliktform, selbstbezeichnung, tatort } from './list_filters';





// Wir definieren einen Default Styles

const defaultStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: '#FFFFFF'
        }),
        stroke: new Stroke({
            color: '#2E2E2E',
            width: 2
        }),
        radius: 7
    })
});

// Wir definieren einen Style für selektierte Features
// const selectStyle = new Style({
//     image: new Circle({
//         fill: new Fill({
//             color: '#F0F8FF'
//         }),
//         stroke: new Stroke({
//             color: '#ec174a',
//             width: 2
//         }),
//         radius: 7
//     })
// });
const selectStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/dislike2.png',
      }),
    });

const vectorSource = new VectorSource({
    format: new GeoJSON()
});

const vectorLayer = new VectorLayer({
    maxResolution: 10,
    source: vectorSource,
    style: defaultStyle
});

// das Div "popup" wird selektiert und als overlay positioniert
const popup = new Overlay({
    element: document.getElementById('popup')
});

// Definition des Clusterobjekts/-layers
const clusterSource = new Cluster({
       distance: 75,
    //    minDistance: 75,
    source: vectorSource,
});

// Clusterobjekt/-layers bekommt anderes Styling ab bestimmter Auflösung
const styleCache = {};
const clusters = new VectorLayer({
    minResolution: 10,
    source: clusterSource,
    style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
            style = [new Style({
                image: new Circle({
                    radius: 10,
                    stroke: new Stroke({
                        color: '#fff',
                    }),
                    fill: new Fill({
                        color: '#696969',
                    }),
                }),
                text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                        color: '#fff'
                    })
                })
            })];
            styleCache[size] = style;
        }
        return style;
    },
});

// Default view als const
const view = new View({
    center: transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'),
    zoom: 11
});

let geojson = {};

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
                clusters],
            overlays: [popup]
        });

        const selectSingleClick = new Select({
            layers: [vectorLayer],
            style: selectStyle
        });

        this.map.addInteraction(selectSingleClick);
        this.map.addOverlay(popup);

        const displayFeatureInfo = (pixel, coordinate) => {
            let features = [];
            this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                features.push(feature);
            });

            if (features.length > 0) {
                var info = [];
                for (var i = 0; i < features.length; i++) {
                    if (!features[i].values_.deliktform) {
                        return;
                    }
                    info.push('Deliktform: ' + deliktform[features[i].values_.deliktform]);
                    info.push('Datum: ' + features[i].values_.datum);
                    info.push('Uhrzeit: ' + features[i].values_.uhrzeit);
                    info.push('Tatort: ' + tatort[features[i].values_.tatort]);
                    info.push('Selbstbezeichnung: ' + selbstbezeichnung[features[i].values_.selbstbezeichnung]);
                }
                document.getElementById('popup-content').innerHTML = '<ul><li>' + info.join("</li><li>") + '</li></ul>';
                popup.setPosition(coordinate);
            }
            // else if (features.length > 1) {                // funktioniert nicht - woanders einbauen
            //     info.push('Zoom in');
            //             }   
            else {
                document.getElementById('popup-content').innerHTML = '';
                popup.setPosition(undefined);
            }
        };

        this.map.on('singleclick', function (evt) {
            const pixel = evt.pixel;
            const coordinate = evt.coordinate;
            displayFeatureInfo(pixel, coordinate);
        });

        // // evlt. einbauen: change mouse cursor when over marker
        // this.map.on('pointermove', (e) => {
        //     const pixel = this.map.getEventPixel(e.originalEvent);
        //     const hit = this.map.hasFeatureAtPixel(pixel);
        //     this.map.getTarget().style.cursor = hit ? 'pointer' : '';
        //   });

        document.getElementById('popup-closer').onclick = () => {
            popup.setPosition(undefined);
            document.getElementById('popup-closer').blur();
            selectSingleClick.getFeatures().clear();
            // if (this.map.getView().getZoom() < 12) document.getElementById('popup-closer').blur();
            return false;
        };

        // Datenbankabfrage über php und Umwandlung in geojson
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '../php/pdo.php',
            success: (data) => {
                geojson = data;
                var format = new GeoJSON();
                var features = format.readFeatures(geojson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                vectorSource.addFeatures(features);
            }
        })
        // Button Bezirk
        $("#bttnBezirk").on("click", () => {
            // Nutzereingabe bzgl. Bezirk einholen
            var bezirk = $("input[name='txtbezirk']:checked").val();
            // Neues GeoJSON Objekt anlegen und befüllen wo Bezirk == Bezirk
            var geojsonBezirk = {
                "type": "FeatureCollection",
                "features": []
            };
            for (var i = 0; i < geojson.features.length; i++) {
                var geoBezirk = geojson.features[i].properties.bezirk - 1; // die Kodierung startet bei 0 in der DB
                if (geoBezirk == bezirk) {
                    geojsonBezirk.features.push(geojson.features[i]);
                }
            }
            // Umwandlung in Openlayers GeoJSON Objekt
            var formatBez = new GeoJSON();
            var featuresBez = formatBez.readFeatures(geojsonBezirk, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            // Punkte auf Karte löschen und neue Auswahl hinzufügen
            vectorSource.clear();
            vectorSource.addFeatures(featuresBez);

            // Zentrierung und Zoom der Karte auf den ersten Punkt der GeoJSON
            const feature = vectorSource.getFeatures()[0];
            const point = feature.getGeometry();
            const size = this.map.getSize();
            view.setZoom(13);
            view.setCenter(point.getCoordinates());

            //wir heben die Selektierung für die Filtern auf
            $("[name='txtUhr']").prop("checked", false);
            $("[name='txtJahr']").prop("checked", false);
            $("[name='txtBezirk']").prop("checked", false);
        });

       $("#bttnSelect").on("click", () => {
            // Nutzereingaben holen
            var jahr = $("input[name='txtJahr']:checked").val();
            var uhr = $("input[name='txtUhr']:checked").val();
            var delikt = $("#deliktListe").val();

            if (!jahr) { jahr = 0; }
            if (!uhr) { uhr = 0; }

            var queries = { geoJahr: jahr, geoDelikt: delikt, geoUhr: uhr };

            var abfrage = [];
            if (jahr + delikt + uhr > 0) {

                for (const key in queries) {
                    if (queries[key] != 0) {
                        console.log('key ' + key + ' queries.key ' + queries[key]);
                        abfrage.push(key + "==" + queries[key]);
                    }
                }

                var abfrageJ = abfrage.join(' && ');
                console.log(abfrageJ);
                // Neues GeoJSON Objekt anlegen und mit Nutzereingabe füllen
                var geoJahr = 0;
                var geoDelikt = 0;
                var geoUhr = 0;
                var geojsonSelect = {
                    "type": "FeatureCollection",
                    "features": []
                };
                for (var i = 0; i < geojson.features.length; i++) {
                    geoJahr = geojson.features[i].properties.datum.substr(0, 4) - 2019;
                    geoDelikt = geojson.features[i].properties.deliktform;
                    var uhrSubst = parseInt(geojson.features[i].properties.uhrzeit.substr(0, 2));
                    if (uhrSubst <= 22 && uhrSubst >= 7) {
                        geoUhr = 1;
                    }
                    else if (uhrSubst > 22 || uhrSubst < 7) {
                        geoUhr = 2;
                    }
                    if (eval(abfrageJ)) {
                        console.log('added');

                        geojsonSelect.features.push(geojson.features[i]);
                    }
                }
                console.log(queries);
                            
            // Umwandlung in Openlayers GeoJSON Objekt
            vectorSource.clear();
            var formatSelect = new GeoJSON();
            var featuresSelect = formatSelect.readFeatures(geojsonSelect, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresSelect);            
        }

        //wir holen den Zoom level. Wenn > 11 -> Zoom ist auf Bezirksniveau
        if (view.getZoom() > 11) {
            view.setZoom(11);
            view.setCenter(transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'));
        }

            // wir heben die Selektion für die Bezirke auf
            $("[name='txtbezirk']").prop("checked", false);

        })

        // Zurücksetzen des Filters
        $("#bttnAlle").on("click", () => {
            vectorSource.clear();
            var formatAll = new GeoJSON();
            var featuresAll = formatAll.readFeatures(geojson, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresAll);
            view.setZoom(11);
            view.setCenter(transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'));
            
            //wir heben die Selektion für alle radio buttons auf
            $("[type=radio]").prop("checked", false);

        });
    }
};

// $( function() {
//     $( "#menu" ).menu();
//   } );
