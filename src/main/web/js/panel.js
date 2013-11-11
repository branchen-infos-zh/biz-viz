/**
 * The biz panel.
 */
function Panel(config) {
    var _this = this;

    var config = config;
    var map = config.map;

    // The timeout callback
    var playTimeoutFn = null;

     // This is just to make the access to elements easier
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
                    '<input type="checkbox" value="' + n.code + '"/>&nbsp' +
                    //'<span style="background-color:' + n.colour + ';">' +
                    '<img src="img/' + n.icon + '"/> ' +
                    n.code +
                    //'</span>' +
                '</li>'
            );
        }
    }

    var bindEventHandlers = function() {
        // Show & hide panel
        $('.panel_container').hover(function(){
            $('.panel_container > .controls').delay(500).show();
        }, function() {
            $('.panel_container > .controls').hide();
        });

        // Play button & year range
        $('#panel_yearRange').change(_this.updateYearValue);
        $('#panel_playButton').click(_this.play);

        // Click on all/none toggles checkbox
        $("#noga_all").click(function() {
            $(".panel_container > .controls > .noga input").each(function(i, elem) {
                if(!$(elem).is(':checked')) {
                    $(elem).click();
                }
            });
        });
        $("#noga_all").click();
        $("#noga_none").click(function() {
            $(".panel_container > .controls > .noga input").each(function(i, elem) {
                if($(elem).is(':checked')) {
                    $(elem).click();
                }
            });
        });

        // Click toggles list element's checkbox
        $(".panel_container > .controls > .noga ul li").each(function(i, elem) {
            $(elem).click(function(e) {
                $("#firm_noga").click();
                $(e.target).find("input").click();
            });
        });

        // Handle click event...
        $(".panel_container > .controls > .noga ul li input").each(function(i, elem) {
            $(elem).change(function(e) {
                if ($(this).is(':checked')) {
                    // do something
                } else {
                    // don't do
                }
            });
        });
        $("#firm_no_noga").click();

        // Now the handlers that will update the data
        $(".panel_container > .controls > .defaults > .data input").each(function(i, elem) {
            $(elem).click(function() {
                _this.prepareAndRender();
            });
        });
    }

    this.prepareAndRender = function() {
        // The type of data to render
        var dataType = $(".panel_container > .controls > .defaults .data :checked").val();
        // How to render the data
        var renderType = $(".panel_container > .controls > .defaults .render :checked").val();
        // Render only enabled noga codes?
        var useNoga = $(".panel_container > .controls > .noga > .nogatype :checked").val() == "true" ? true : false;
        var activeNoga = useNoga ? getSelectedNogaCodes() : null;

        var conf = {
            "year" : elems.year.value,
            "type" : dataType,
            "use_noga" : useNoga,
            "active_noga" : activeNoga
        };

        // Retrieve & render data
        var data = config.firmenApi.forYear(conf);
        if(renderType == "points") {
            config.firmenRenderer.points(map, data, conf);
        } else if(renderType == "com") {
            config.firmenRenderer.centerOfMass(map, data, conf);
        }
    }

    this.initialize = function() {
        elems.year.value = config.loadingYear;
        generateNogaControl();

        bindEventHandlers();
        _this.prepareAndRender();
    }

    /**
     * Get the noga codes selected by the user
     */
    var getSelectedNogaCodes = function() {
        var selected = new Array();
        $(".panel_container > .controls > .noga > ul :checked").each(function(i, elem) {
            selected.push($(elem).val().substr(0, 1));
        });
        return selected;
    }

    this.updateYearValue = function() {
        var year = elems.year.value;
        elems.yearValue.innerHTML = year;
        _this.prepareAndRender();
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
