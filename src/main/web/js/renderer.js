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

    this.points = function(map, objs, spec) {
        var l = map.getFirmenLayer();
        l.clearLayers();
        for(var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            // noga
            var colour = "#000000";
            if(spec.use_noga) {
                var noga = FirmenAdapter.noga(obj);
                colour = _config.noga[noga.substring(0,1)];
            }

            // Coordinate
            var coord = FirmenAdapter.curAddressCoord(obj);
            var circle = L.circle([coord.lat, coord.lng], 200, {
                color: colour,
                fillColor: colour,
                fillOpacity: 0.8
            });

            l.addLayer(circle);
        }
    }

    this.centerOfMass = function(map, obs, spce) {

    }
}
