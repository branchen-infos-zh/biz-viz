function FirmenAdapter() {
}

/**
 * Return company's noga code (the first entry in the noga array) or
 * a default value '_0' if it was not populated.
 */
FirmenAdapter.noga = function(obj) {
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
FirmenAdapter.curAddressCoord = function(obj) {
    if(obj.addresses != null && obj.addresses.length > 0) {
        var address = obj.addresses[obj.addresses.length - 1];
        if(address.coordinate != null) {
            var c =  address.coordinate;
            return c; //{"lat" : parseInt(c.lat), "lng" : parseInt(c.lng)};
        }
    }
    return {"lat" : 47.367347, "lng" : 8.5500025};
}

/**
 * Operations on the firmen data.
 */
function FirmenApi(data) {
    var _data = data;

    this.data = function() {
        return _data;
    }

    this.reduce = function(fn) {
        return _data.filter(fn);
    }

    /**
     * Retrieves all the buissness from the underlying that match
     * the noga code. The code is matched against the start of the string.
     */
    this.getForNoga = function(code) {
        return _data.filter(function(elem) {
            var c = code.toUpperCase();
            if(elem.noga != null) {
                for (var i = 0; i < elem.noga.length; i++) {
                    if (elem.noga[i].substring(0, c.length) == c) {
                        return true;
                    }
                }
            }
            return false;
        });
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

    var getInception = function(year) {
        return _data.filter(function(elem) {
            if(elem['inscription-date'] == null) {
                return false;
            }

            var y = parseInt(elem['inscription-date'].substr(0, 5));
            return y == year;
        });
    }

    var getEnd = function(year) {
        return _data.filter(function(elem) {
            if(elem['deletion-date'] == null) {
                return false;
            }

            var y = parseInt(elem['deletion-date'].substr(0, 5));
            return y == year;
        });
    }

    var getAll = function(year) {
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

    this.forYear = function(spec) {
        var year = spec.year;
        var type = spec.type;
        if(type == 'inception') {
            return getInception(year);
        } else if(type == 'end') {
            return getEnd(year);
        } else if(type == 'all') {
            return getAll(year);
        }
    }
}
