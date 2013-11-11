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

    this.getForYear = function(year) {
        return _data.filter(function(elem) {
            console.info(elem)
            return true;
        });
    }
}
