// $(function() {
//     $(document).tooltip();
// });


function showYearValue(newValue) {
    document.getElementById("yearValue").innerHTML = newValue;
    loadAddressesYear(newValue);
}

function increaseYearValue() {
}

var rangeInterval = null;

function changeInterval() {
    if (rangeInterval == null) {
	rangeInterval = setInterval(function() {
	    if (getLoadingYear() == 0) {
		var rangeMin = document.getElementById("yearRange").min;
		var rangeMax = document.getElementById("yearRange").max;
		var value = document.getElementById("yearValue").innerHTML;
		value++;
		if (value > rangeMax) value = rangeMin;
		showYearValue(value);
		document.getElementById("yearRange").value = value;
	    }
	}, 100);
	document.getElementById("rangeButton").value = "Stop";
    } else {
	window.clearInterval(rangeInterval);
	rangeInterval = null;
	document.getElementById("rangeButton").value = "Start";
    }
}
