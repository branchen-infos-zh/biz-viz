/**
 * The biz panel.
 */
function Panel(config) {
    var _this = this;

    var playTimeoutFn = null;
    var loadingYear = 2013;

    var config = config;

    var elems = {
        'year' : document.getElementById("panel_yearRange"),
        'play' : document.getElementById("panel_playButton"),
        'yearValue' : document.getElementById("panel_yearValue")
    };

    var generateNogaControl = function() {
        for(var i = 0; i < config.noga.length; i++) {
            var n = config.noga[i];
            $(".panel_container > .controls > .noga ul").append(
                '<li style="background-color:' + n.colour + ';">' +
                    '<input type="checkbox" value="' + n.code + '/>' +
                    //'<span style="background-color:' + n.colour + ';">' +
                    '<img src="img/' + n.icon + '"/> ' +
                    n.code + ': ' + n.title +
                    //'</span>' +
                '</li>'
            );
        }
    }

    var bindEventHandlers = function() {
        // bind event handlers
        $(".panel_container > .controls > .noga ul li input").each(function(i, elem) {
            console.info(elem);
            $(elem).click(function(elem) {
                console.info(elem.id);
            });
        });
    }

    this.initialize = function() {
        console.debug("Panel:initialize...");
        var _self = this;

        $('.panel_container').hover(function(){
            $('.panel_container > .controls').delay(500).show();
        }, function() {
            $('.panel_container > .controls').hide();
        });

        $('#panel_yearRange').change(_self.updateYearValue);
        $('#panel_playButton').click(_self.play);
        elems.year.value = loadingYear;

        generateNogaControl();

        bindEventHandlers();
    }

    this.updateYearValue = function() {
        elems.yearValue.innerHTML = elems.year.value;
    }

    this.incrementYearValue = function() {
        var year = elems.year;
        var val = parseInt(year.value) + 1;
        if(val > year.max) {
            val = year.min;
        }
        year.value = val;
        _this.updateYearValue();
    }

    this.play = function() {
        if (playTimeoutFn == null) {
            playTimeoutFn = setInterval(function() {
                _this.incrementYearValue();
            }, 500);
            elems.play.value = "Stop";
        } else {
            window.clearInterval(playTimeoutFn);
            playTimeoutFn = null;
            elems.play.value = "Start";
        }
    }

}

/**
 * Interface to load the data from a resource.
 */
function Loader() {

}

Loader.json = function(file, cb) {
    $.getJSON(file, cb);
}

/**
 * This will the firm data.
 */
Loader.withFirmen = function(cb) {
    Loader.json("data/firmen.json", cb);
}

Loader.withNoga = function(cb) {
    Loader.json("data/noga-style.json", cb);
}
