function FirmenRenderer(config) {
    var init = function(config) {
        var n = {};
        for(var i = 0; i < config.noga.length; i++) {
            var noga = config.noga[i];
              n[noga.code.substring(0,1)] = noga.colour;
        }
        return {'noga' : n};
    }
    var _config = init(config);

    var popupText = function(obj) {
        var noga = "";
        if(obj.noga != null && obj.noga.length > 0) {
            for(var i = 0; i < obj.noga.length; i++) {
                noga = noga + ", " + obj.noga[i];
            }
        }

        var name = obj.name;
        if(obj.name == null) {
            name = "Unbekannt";
        }
        return name + " [" + noga.substring(2) + "]";
    }

    this.points = function(map, objs, spec) {
        var l = map.getFirmenLayer();
        l.clearLayers();
        for(var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            // noga
            var colour = "#000000";
            if(spec.use_noga) {
                var noga = FirmenApi.noga(obj);
                colour = _config.noga[noga.substring(0,1)];
            }

            // Coordinate
            var coord = FirmenApi.curAddressCoord(obj);
            var circle = L.circle([coord.lat, coord.lng], 100, {
                color: colour,
                fillColor: colour,
                fillOpacity: 0.8
            });

            circle.bindPopup(popupText(objs[i]));

            l.addLayer(circle);
        }
    }

    this.centerOfMass = function(map, objs, spec) {
        var l = map.getFirmenLayer();
        l.clearLayers();

        for(var i = 0; i < objs.length; i++) {
            var obj = objs[i];

            if(obj.lat == null || obj.lng == null) {
                console.info("Rendering for center of mass for category '" + obj.noga + "' failed due to missing data.");
                continue;
            }

            var colour = _config.noga[obj.noga];
            var circle = L.circle([obj.lat, obj.lng], 800, {
                color: colour,
                fillColor: colour,
                fillOpacity: 0.8
            });

            circle.bindPopup(obj.quality.considered +
                             " of " +
                             obj.quality.total +
                             " data points considered (" +
                             obj.quality.in_percentage +
                             ")"
                            );

            l.addLayer(circle);
        }
    }
}
