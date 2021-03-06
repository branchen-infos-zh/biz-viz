// map needed global
var map = null;


function Map() {

    var _this = this;

    var _map = null;

//  var wmsUrl = 'http://wms.zh.ch/waldUPZH',
//  wmsLayers = 'dtm,wald,baeche,seen,bodenbedeckung,upcat';

    var _firmenLayer = L.layerGroup();

    this.initialize = function() {
        var wmsUrl = 'http://wms.zh.ch/upwms', wmsLayers = 'upwms';
        var epsg21781 = new L.Proj.CRS(
            'EPSG:21781', Proj4js.defs['EPSG:21781'],
            {
                resolutions: [1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1, 0.05, 0.02],
                origin: [420000, 350000]
            });

        var map = new L.Map('map', {
            crs: epsg21781
        });

        var tilelayer = L.tileLayer.wms(wmsUrl, {
            layers: wmsLayers,
            format: 'image/jpeg',
            version: '1.3.0',
            attribution: "<a href='http://gis.zh.ch' target='_blank'>GISZH</a>"
        });
        map.addLayer(tilelayer);
        map.setView([47.37688, 8.53668], 9);
        map.setZoom(10);

        var overlays = {
            "Firmen": _firmenLayer
        };
        map.addControl(L.control.layers(overlays));
        map.addLayer(_firmenLayer);

        var osmGeocoder = new L.Control.OSMGeocoder();
        map.addControl(osmGeocoder);

        _map = map;
    }

    this.getMap = function() {
        return _map;
    }

    this.getFirmenLayer = function() {
        return _firmenLayer;
    }
}

function showLines(date) {
    for (p = 0; p < lines.length; p++) {
        if ((lines[p].von <= date) && (lines[p].bis >= date)) {
            lines[p].circleFrom.addTo(map);
            lines[p].circleTo.addTo(map);
            lines[p].line.addTo(map);
        } else {
            map.removeLayer(lines[p].circleFrom);
            map.removeLayer(lines[p].circleTo);
            map.removeLayer(lines[p].line);
        }
    }
}
function showAllLines() {
    for (p = 0; p < lines.length; p++) {
        if (window.nogaDisp.check(lines[p].noga)) {
            lines[p].circleFrom.addTo(map);
            lines[p].circleTo.addTo(map);
            lines[p].line.addTo(map);
        } else {
            map.removeLayer(lines[p].circleFrom);
            map.removeLayer(lines[p].circleTo);
            map.removeLayer(lines[p].line);
        }
    }
}
function removeAllLines() {
    for (p = 0; p < lines.length; p++) {
        map.removeLayer(lines[p].circleFrom);
        map.removeLayer(lines[p].circleTo);
        map.removeLayer(lines[p].line);
    }
}
