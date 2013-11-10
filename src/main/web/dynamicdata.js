var points = new Array();


function geoPoint(txt, lng, lat, noga, von, bis) {
    this.txt = txt;
    this.lng = lng;
    this.lat = lat;
    this.noga = noga;
    this.von = von;
    this.bis = bis;
    this.circle = L.circle([lng, lat], 15, {
	color: getColor(noga),
	fillColor: getColor(noga),
	fillOpacity: 0.8
    });
    this.circle.bindPopup(txt);
}

var lines = new Array();

function geoLine(txt, lngFrom, latFrom, lngTo, latTo, noga, date) {
    this.txt = txt;
    this.lngFrom = lngFrom;
    this.latFrom = latFrom;
    this.lngTo = lngTo;
    this.latTo = latTo;
    this.noga = noga;
    this.date = date;
    this.circleFrom = L.circle([lngFrom, latFrom], 15, {
	color: 'red',
	fillColor: 'red',
	fillOpacity: 0.8
    });
    this.circleFrom.bindPopup(txt);
    this.circleTo = L.circle([lngTo, latTo], 15, {
	color: 'green',
	fillColor: 'green',
	fillOpacity: 0.8
    });
    this.circleTo.bindPopup(txt);
    this.line = L.polyline([new L.LatLng(lngFrom, latFrom), new L.LatLng(lngTo, latTo)], { weight: 1, });
    this.line.bindPopup(txt);
}


var serviceAddresses = "addresses";

function changeFirmenSelection(firmenevent) {
    switch (firmenevent) {
    case 1: serviceAddresses = "foundingAddresses"; break;
    case 2: serviceAddresses = "dissolvingAddresses"; break;
    case 3: serviceAddresses = "movingAddresses"; break;
    case 0:
    default:
	serviceAddresses = "addresses"; break;
    }
    loadAddressesYear(document.getElementById("yearValue").innerHTML);
}



var serviceNoga="";

function changeNogaSelection(nogayn) {
    if (nogayn) {
	serviceNoga = "Noga";
    } else {
	serviceNoga = "";
    }
    loadAddressesYear(document.getElementById("yearValue").innerHTML);
}


function nogaDisplay() {
    this.values = new Array();
    this.alphabet = "ABCDEFGHIJKLMNOPQRSTU";

    this.setAll = setAll;
    function setAll(b) {
	for (var c = 0; c < this.alphabet.length; c++) {
	    this.values[this.alphabet[c]] = b;
	}
    }

    this.set = set;
    function set(noga, b) {
	this.values[noga] = b;
    }

    this.toggle = toggle;
    function toggle(selNoga) {
	nogaId = selNoga.id;
	noga = nogaId.substr(nogaId.length - 1);
	this.values[noga] = !this.values[noga];
	if (this.values[noga]) {
	    selNoga.bgColor = getColor(noga);
	} else {
	    selNoga.bgColor = 'grey';
	}
	showAllPoints();
	showAllLines();
    }

    this.check = check;
    function check(noga) {
	return ((serviceNoga == "") || (this.values[noga.substring(0, 1)]));
    }
}
var nogaDisp = new nogaDisplay();
nogaDisp.setAll(true);






// used for synchronising asynchronous calls
var loadingYear = 0;

function getLoadingYear() {
    return loadingYear;
}

function loadAddressesYear(year) {
   //  if (loadingYear == 0) {
// 	loadingYear = year;
// 	var xmlhttp;
// 	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
// 	    xmlhttp=new XMLHttpRequest();
// 	} else {// code for IE6, IE5
// 	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
// 	}
// 	xmlhttp.onreadystatechange=function() {
// 	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
// 		removeAllPoints();
// 		removeAllLines();
// 		points.length = 0;
// 		lines.length = 0;
// //		alert(xmlhttp.responseText);
// 		array = xmlhttp.responseText.split('::');
// 		for (a = 0; a < array.length; a++) {
// 		    p = array[a].split(';;');
// 		    var txt = p[1];
// 		    var von = p[2];
// 		    var bis = p[3];
// 		    var noga = p[10];
// 		    var lng = p[8];
// 		    var lat = p[9];
// 		    if (p.length <= 11) {
// 			// single point
// 			if ((lng > 0) && (lat > 0)) {
// 			    points.push(new geoPoint(txt, lng, lat, noga, von, bis));
// 			}
// 		    } else {
// 			// line
// 			var lngTo = p[8 + 9];
// 			var latTo = p[9 + 9];
// 			if ((lng > 0) && (lat > 0) && (lngTo > 0) && (latTo > 0)) {
// 			    lines.push(new geoLine(txt, lng, lat, lngTo, latTo, noga, bis));
// 			}
// 		    }
// 		}
// 		showAllPoints();
// 		showAllLines();
// //		document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
// 		loadingYear = 0;
// 	    }
// 	}
// 	url = "http://" + window.location.host + "/biz/_readbiz_csv.php?" + serviceAddresses + serviceNoga + "="+year;
// 	xmlhttp.open("GET", url, true);
// 	xmlhttp.send();
//     }
}
