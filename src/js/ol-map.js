import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import Select from 'ol/interaction/Select';
import { Fill, Circle, Stroke, Style, Text, Icon } from 'ol/style';
// imports fuer Cluster Layer und Heatmap
import { Cluster } from 'ol/source';
import { boundingExtent } from 'ol/extent';
import { Heatmap as HeatmapLayer } from 'ol/layer';
// imports fuer Layerswitcher
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
// imports fuer jquery und Filterlisten
import $ from 'jquery';
import { deliktform, selbstbezeichnung, tatort, bezirkZentroide, arrBezirke } from './list_filters';



// Wir definieren einen Default und Select Styles
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

const osmMap = new TileLayer({
    source: new OSM()
});

const osmMap2 = new TileLayer({
    source: new OSM()
});

const heatmap = new HeatmapLayer({
    source: vectorSource,
});


// das Div "popup" wird selektiert und als overlay positioniert
const popup = new Overlay({
    element: document.getElementById('popup')
});

// Definition des Clusterobjekts/-layers
const clusterSource = new Cluster({
    distance: 75,
    source: vectorSource,
});

// Clusterobjekt/-layers bekommt anderes Styling ab bestimmter Aufl??sung
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

let geojsonAllFeatures = {};

export class OlMap {
    constructor() {
        this.map = new Map({
            target: 'map',
            view: view,
            layers: [
                // Layer Group
                new LayerGroup({
                    title: 'Heatmap',
                    type: 'base',
                    combine: true,
                    visible: false,
                    layers: [
                        osmMap2,
                        heatmap]
                }),
                new LayerGroup({
                    title: 'Cluster',
                    type: 'base',
                    combine: true,
                    visible: true,
                    layers: [
                        osmMap,
                        vectorLayer,
                        clusters]
                })
            ],
            overlays: [popup]
        });

        //Layerswitcher
        const layerSwitcher = new LayerSwitcher({
            tipLabel: 'L??gende', // Optional label for button
            groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
        });
        this.map.addControl(layerSwitcher);

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
                    if (!features[i].values_.deliktform) {      // hier wird popup f??r cluster unterbunden (return wenn keine deliktform im allFeaturesjson)
                        console.log(this.map.getView().getZoom());

                        clusters.getFeatures(pixel).then((clickedFeatures) => {
                            if (clickedFeatures.length) {
                                // Get clustered Coordinates
                                const features = clickedFeatures[0].get('features');
                                if (features.length > 1) {
                                    const extent = boundingExtent(
                                        features.map((r) => r.getGeometry().getCoordinates())
                                    );
                                    this.map.getView().fit(extent, { duration: 2000, padding: [50, 50, 50, 50] });
                                }
                                else {view.setZoom(14);
                                     view.setCenter(coordinate);}
                            }
                        });
                        return;
                    }

                    info.push('Deliktform: ' + deliktform[features[i].values_.deliktform]);
                    info.push('Datum: ' + features[i].values_.datum);
                    info.push('Uhrzeit: ' + features[i].values_.uhrzeit);
                    info.push('Tatort: ' + tatort[features[i].values_.tatort]);
                    info.push('Selbstbezeichnung: ' + selbstbezeichnung[features[i].values_.selbstbezeichnung]);
                }
                
                $('#popup-content').html('<ul><li>' + info.join("</li><li>") + '</li></ul>');
                popup.setPosition(coordinate);

                this.map.getView().on('change:resolution', (event) => {
                    if (this.map.getView().getZoom() < 14) {
                        popup.setPosition(undefined);
                        selectSingleClick.getFeatures().clear();
                    }
                });
            }
            else {
                $('#popup-content').html('');
                popup.setPosition(undefined); // hier wird popup bei klick auf map geschlossen
            }
        };

        this.map.on('singleclick', (evt) => {
            const pixel = evt.pixel;
            const coordinate = evt.coordinate;
            displayFeatureInfo(pixel, coordinate);
        });

        // Maus-Cursor ??ndert sich wenn ??ber Feature gehovert (inkl. Clusterfeature)
        this.map.on('pointermove', (e) => {
            const pixel = this.map.getEventPixel(e.originalEvent);
            const hit = this.map.hasFeatureAtPixel(pixel);
            this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''; // kurze IF Bedingung : tern??rer Operator
                                                                        7// if xxx.cursor = hit then 'pointer'; else ''
        });

       $('#popup-closer').on("click" , () => {
            popup.setPosition(undefined);
            document.getElementById('popup-closer').blur();            
            selectSingleClick.getFeatures().clear();
            return false;
        });

        // Datenbankabfrage ??ber php und Umwandlung in geojson
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '../php/pdo.php',
            success: (data) => {
                geojsonAllFeatures = data;
                var format = new GeoJSON();
                var features = format.readFeatures(geojsonAllFeatures, {
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
            // Neues GeoJSON Objekt anlegen und bef??llen wo Bezirk == Bezirk
            var geojsonBezirk = {
                "type": "FeatureCollection",
                "features": []
            };
            for (var i = 0; i < geojsonAllFeatures.features.length; i++) {
                var geoBezirk = geojsonAllFeatures.features[i].properties.bezirk - 1; // die Kodierung startet bei 0 in der DB
                if (geoBezirk == bezirk) {
                    geojsonBezirk.features.push(geojsonAllFeatures.features[i]);
                }
            }
            // Umwandlung in Openlayers GeoJSON Objekt
            var formatBez = new GeoJSON();
            var featuresBez = formatBez.readFeatures(geojsonBezirk, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            // Punkte auf Karte l??schen und neue Auswahl hinzuf??gen
            vectorSource.clear();
            vectorSource.addFeatures(featuresBez);

            // Zentrierung und Zoom der Karte auf das Zentrum des Bezrikes
            view.setZoom(13);
            var bezirkLang = arrBezirke[bezirk];
            view.setCenter(transform([bezirkZentroide[bezirkLang][0], bezirkZentroide[bezirkLang][1]], 'EPSG:4326', 'EPSG:3857'));

            //wir heben die Selektierung f??r die Filtern auf
            $("[name='txtUhr']").prop("checked", false);
            $("[name='txtJahr']").prop("checked", false);
            $("#deliktListe").val(0);
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
                        abfrage.push(key + "==" + queries[key]);
                    }
                }
                var abfrageJ = abfrage.join(' && '); // z.B. abfrageJ = 'jahr == 1 && uhr == 2 && delikt == 10'

                // Neues GeoJSON Objekt anlegen mit Variablen der Abfrage/Nutzereingabe
                let geoJahr = 0;
                let geoDelikt = 0;
                let geoUhr = 0;
                var geojsonSelect = {
                    "type": "FeatureCollection",
                    "features": []
                };
                // Schleife auf jedes Feature der PHP GeoJSON (Basis aus Datenbank)
                for (let i = 0; i < geojsonAllFeatures.features.length; i++) {
                    //Umwandlung der Daten aus Datenbank-GeoJSON in unsere keys
                    geoJahr = geojsonAllFeatures.features[i].properties.datum.substr(0, 4) - 2019;
                    geoDelikt = geojsonAllFeatures.features[i].properties.deliktform;
                    let uhrSubst = parseInt(geojsonAllFeatures.features[i].properties.uhrzeit.substr(0, 2));
                    if (uhrSubst <= 22 && uhrSubst >= 7) {
                        geoUhr = 1;
                    }
                    else if (uhrSubst > 22 || uhrSubst < 7) {
                        geoUhr = 2;
                    }
                    // Pr??fung ob jedes Feature der Datenbank-geojsonAllFeatures der Bedingung/Abfrage des Nutzers entspricht, 
                    // d.h. mit eval wird string abfrageJ wird als key:value Paar verstanden & abgeglichen
                    // if true, bef??lle neue GeoJSON mit Daten
                    if (eval(abfrageJ)) {
                        geojsonSelect.features.push(geojsonAllFeatures.features[i]);
                    }
                }

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

            // wir heben die Selektion f??r die Bezirke auf
            $("[name='txtbezirk']").prop("checked", false);

        })

        // Zur??cksetzen des Filters
        $("#bttnAlle").on("click", () => {
            vectorSource.clear();
            var formatAll = new GeoJSON();
            var featuresAll = formatAll.readFeatures(geojsonAllFeatures, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            vectorSource.addFeatures(featuresAll);
            view.setZoom(11);
            view.setCenter(transform([13.3833, 52.5167], 'EPSG:4326', 'EPSG:3857'));

            //wir heben die Selektion f??r alle radio buttons auf
            $("[type=radio]").prop("checked", false);
            $("#deliktListe").val(0);

        });
    }
};
