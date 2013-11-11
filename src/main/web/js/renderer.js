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

    this.toLeaflet = function(objs, api) {
        var lobjs = new Array();

        for(var i = 0; i < objs.length; i++) {

            var obj = objs[i];

            // noga
            var noga = FirmenAdapter.noga(obj);
            var colour = _config.noga[noga.substring(0,1)];
            var coord = FirmenAdapter.curAddressCoord(obj);

            var circle = L.circle([coord.lat, coord.lng], 200, {
                color: colour,
                fillColor: colour,
                fillOpacity: 0.8
            });
            lobjs.push(circle);
        }
        return lobjs;
    }
}
