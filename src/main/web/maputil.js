// map needed global
var map = null;


function initMap() {

    var wmsUrl = 'http://wms.zh.ch/upwms', wmsLayers = 'upwms';
//  var wmsUrl = 'http://wms.zh.ch/waldUPZH',
//  wmsLayers = 'dtm,wald,baeche,seen,bodenbedeckung,upcat';

    var epsg21781 = new L.Proj.CRS('EPSG:21781', Proj4js.defs['EPSG:21781'],
            {
                resolutions: [1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1, 0.05, 0.02],
                origin: [420000, 350000]
            });

    var tilelayer = L.tileLayer.wms(wmsUrl, {
        layers: wmsLayers,
        format: 'image/jpeg',
        version: '1.3.0',
        attribution: "<a href='http://gis.zh.ch' target='_blank'>GISZH</a>"
    });

    map = new L.Map('map', {
        crs: epsg21781
    });

    map.addLayer(tilelayer);
    map.setView([47.37688, 8.53668], 9);
    map.setZoom(10);

    var osmGeocoder = new L.Control.OSMGeocoder();
    map.addControl(osmGeocoder);
}


var geoCodeUrlAdress = "http://nominatim.openstreetmap.org/search?q=";
var geoCodeUrlAddon = "&format=json&addressdetails=1";

function geoCode(address) {
    var url = geoCodeUrlAdress + encodeURI(address) + geoCodeUrlAddon;
    $.ajax({
	url: url
    }).done(function(result) {
	if (result.length > 0) {
	    var lon = result[0]["lon"];
	    var lat = result[0]["lat"];
	    var url = this.url;
	    var start = geoCodeUrlAdress.length;
	    var numChar = url.length - start - geoCodeUrlAddon.length;
	    var orgtxt = decodeURI(url.substr(start, numChar));
	    var geoloc = L.circle([lon, lat], 10, {color: "red", fillColor: "red", fillOpacity: 1});
	    var obj = setGeoCoding(orgtxt, lon, lat, geoloc);
	    geoloc.addTo(map);
	}
    }).fail(function(result) {
    });
}    


function getColor(noga) {
    if (noga === undefined) {
	return 'black';
    } else {
	var n = noga.charAt(0);
	switch (n) {
	case "A": return '#33CC33';
	case "B": return '#CC6600';
	case "C": return '#FFC04D';
	case "D": return '#FFFF00';
	case "E": return '#66FFFF';
	case "F": return '#FF9900';
	case "G": return '#D99CD6';
	case "H": return '#0000FF';
	case "I": return '#FF33CC';
	case "J": return '#43BFBF';
	case "K": return '#00FF99';
	case "L": return '#C7CB77';
	case "M": return '#8F8FFF';
	case "N": return '#FFFF8F';
	case "O": return '#CCFFCC';
	case "P": return '#99FF33';
	case "Q": return '#FF0000';
	case "R": return '#FF99CC';
	case "S": return '#DB8D73';
	case "T": return '#00FF00';
	case "U": return '#FF00FF';
	default: return 'black';
	}
    }
}

function initNogaColors() {
    alphabet = "ABCDEFGHIJKLMNOPQRSTU";
    for (var c = 0; c < alphabet.length; c++) {
	ch = alphabet[c];
	document.getElementById("nogaSel" + ch).bgColor = getColor(ch);
    }
}




function showPoints(date) {
    for (p = 0; p < points.length; p++) {
	if ((points[p].von <= date) && (points[p].bis >= date)) {
	    points[p].circle.addTo(map);
	} else {
	    map.removeLayer(points[p].circle);
	}
    }
}
function showAllPoints() {
    for (p = 0; p < points.length; p++) {
	if (window.nogaDisp.check(points[p].noga)) {
	    points[p].circle.addTo(map);
	} else {
	    map.removeLayer(points[p].circle);
	}
    }
}
function removeAllPoints() {
    for (p = 0; p < points.length; p++) {
	map.removeLayer(points[p].circle);
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
