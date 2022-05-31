var OpenPopup = function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
    function (feature, layer) {
        if (feature) {
            var coord = map.getCoordinateFromPixel(evt.pixel);
            if (typeof feature.get('features') === 'undefined') {
                popup_content.innerHTML = '<h5><b>' + feature.get('name') + '</b></h5><i>this is an <b>unclustered</b> feature</i>';
            } else {
                var cfeatures = feature.get('features');
                if (cfeatures.length > 1) {
                    popup_content.innerHTML = '<h5><strong>all "Sub-Features"</strong></h5>';
                    for (var i = 0; i < cfeatures.length; i++) {
                        $(popup_content).append('<article><strong>' + cfeatures[i].get('name') + '</article>');
                    }
                }
                if (cfeatures.length == 1) {
                    popup_content.innerHTML = '<h5><strong>' + cfeatures[0].get('name') + '</strong></h5><i>this is a single, but <b>clustered</b> feature</i>';
                }
            }
            olpopup.setPosition(coord);
        } else {
            olpopup.setPosition(undefined);
        }
    });
};
map.on('click', OpenPopup);

 // var OpenPopup = (evt)=> {
        //     const feature = this.map.forEachFeatureAtPixel(evt.pixel,
        //      (feature, layer) => {
        //         if (feature) {
        //             var coord = this.map.getCoordinateFromPixel(evt.pixel);
        //             if (typeof feature.get('features') === 'undefined') {
        //                 document.getElementById('popup-content').innerHTML = '';
        //                 popup.setPosition(undefined);
        //             } else {
        //                 var cfeatures = feature.get('features');
        //                 if (cfeatures.length > 1) {
        //                     document.getElementById('popup-content').innerHTML = 'Anzahl Clusterelemente';
        //                     for (var i = 0; i < cfeatures.length; i++) {
        //                         document.getElementById('popup-content').append(cfeatures[i].values_.deliktform);
        //                     }
        //                 }
        //                 if (cfeatures.length == 1) {
        //                     document.getElementById('popup-content').innerHTML = cfeatures[i].values_.tatort;
        //                 }
        //             }
        //             popup.setPosition(coord);
        //         } else {
        //             popup.setPosition(undefined);
        //         }
        //     });
        // };
        // this.map.on('click', OpenPopup);