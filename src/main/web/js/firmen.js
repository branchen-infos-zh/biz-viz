/**
 * Operations on the firmen data.
 */
function FirmenApi(data) {
    var _this = this;
    var _data = data;

    this.data = function() {
        return _data;
    }

    this.reduce = function(fn) {
        return _data.filter(fn);
    }

    /**
     * Determine whether or not address is valid for that year.
     */
    var addressInYear = function(year, adr) {
        if(adr.date == null || adr.date.from == null) {
            return false;
        }

        var from = parseInt(adr.date.from.substr(0, 5));
        if(adr.date.to == null) {
            return from <= year;
        }

        var to = parseInt(adr.date.to.substr(0, 5));
        return from <= year && year <= to;
    }

    var yearFns = {
        'inception' : function(year) {
            return _data.filter(function(elem) {
                if(elem['inscription-date'] == null) {
                    return false;
                }

                var y = parseInt(elem['inscription-date'].substr(0, 5));
                return y == year;
            });
        },
        'end' : function(year) {
            return _data.filter(function(elem) {
                if(elem['deletion-date'] == null) {
                    return false;
                }

                var y = parseInt(elem['deletion-date'].substr(0, 5));
                return y == year;
            });
        },
        'all' : function(year) {
            return _data.filter(function(elem) {
                var as = elem.addresses;
                if(as != null && as.length > 0) {
                    for(var i = 0; i < as.length; i++) {
                        if(addressInYear(year, as[i])) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }
    };

    var filterNoga = function(data, codes) {
        return data.filter(function(elem) {
            if(elem.noga == null) {
                return false;
            }

            for (var i = 0; i < elem.noga.length; i++) {
                var eCode = elem.noga[i].substring(0, 1);
                for(var j = 0; j < codes.length; j++) {
                    if (eCode == codes[j]) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    var filterYearAndOrNoga = function(spec) {
        var data = yearFns[spec.type](spec.year);
        if(spec.use_noga) {
            data = filterNoga(data, spec.active_noga);
        }
        return data;
    }

    this.pointsForYear = function(spec) {
        return filterYearAndOrNoga(spec);
    }

    /**
     * Bin companies into noga bins.
     */
    var nogaBinning = function(data, categories) {
        var indexOfBin = function(obj) {
            // TODO: we expect only one noga per company
            var noga = obj.noga[0];
            for(var i = 0; i < categories.length; i++) {
                if(noga.substr(0, 1) === categories[i]) {
                    return i;
                }
            }
            return -1;
        };

        // Add data member
        var bins = [];
        for(var i = 0; i < categories.length; i++) {
            bins.push({"noga" : categories[i],
                       "biz" : []});
        }

        for(var i = 0; i < data.length; i++) {
            var index = indexOfBin(data[i]);
            if(index > -1) {
                bins[index].biz.push(data[i]);
            }
        }
        return bins;
    }

    /**
     * Compute the center of mass for a list of businesses.
     */
    var computeCenterOfMass = function(data, year) {
        var cnt = 0;
        var sumLat = 0;
        var sumLng = 0;
        for(var i=0; i<data.length; i++) {
            var coord = FirmenApi.addressCoordYear(data[i], year);
            if(coord == null) {
                continue;
            }

            cnt++;
            sumLat += parseFloat(coord.lat);
            sumLng += parseFloat(coord.lng);
        }

        return {
            "lat" : cnt > 0 ? sumLat/cnt : null,
            "lng" : cnt > 0 ? sumLng/cnt : null,
            "quality" : {
                'total' : data.length,
                'considered' : cnt,
                'in_percentage' : Math.round((cnt / data.length) * 100) / 100
            }
        };
    }

    this.centerOfMassForYear = function(spec) {
        var data = yearFns[spec.type](spec.year);
        if(!spec.use_noga) {
            data = [{'noga' : '_',
                     'biz' : data}];
        } else {
            data = nogaBinning(data, spec.active_noga);
        }

        var out = [];
        for(var i = 0; i < data.length; i++) {
            var com = computeCenterOfMass(data[i].biz, spec.year);
            com.noga = data[i].noga;
            out.push(com);
        }

        return out;
    }
}

/**
 * Return company's noga code (the first entry in the noga array) or
 * a default value '_0' if it was not populated.
 */
FirmenApi.noga = function(obj) {
    if(obj.noga != null && obj.noga.length > 0) {
        return obj.noga[0];
    }
    return "_0";
}

/**
 * Return a company's geo location (if available). Defaults to
 * lat: 47.367347, lng: 8.5500025. We assume the last address noted
 * is the current one.
 */
FirmenApi.curAddressCoord = function(obj) {
    if(obj.addresses != null && obj.addresses.length > 0) {
        var address = obj.addresses[obj.addresses.length - 1];
        if(address.coordinate != null) {
            var c =  address.coordinate;
            return c; //{"lat" : parseInt(c.lat), "lng" : parseInt(c.lng)};
        }

    }
    return {"lat" : 47.345569, "lng" : 8.549667};
}


function y(v) {
    if(v != null) {
        return parseInt(v.substring(0, 5));
    }
    return null;
}

/**
 * Returns the coordinate of the address in the given year.
 * This may return null if no coordinate was provided for
 * the address in the given year.
 */
FirmenApi.addressCoordYear = function(obj, year) {
    if(obj.addresses != null && obj.addresses.length > 0) {
        for(var i = 0; i < obj.addresses.length; i++) {
            var a = obj.addresses[i];
            if(a.coordinate != null) {
                var from = y(a.date.from);
                var to = y(a.date.to);
                if(from != null && from <= year) {
                    if(to != null && year <= to) {
                        return a.coordinate;
                    }
                    return a.coordinate;
                }
            }
        }
    }
    return null;
}
