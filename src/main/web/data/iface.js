function Loader() {

}

Loader.json = function(file, cb) {
    $.getJSON(file, cb);
};

Loader.gemeinden = function(cb) {
    Loader.json("data/gemeinden.json", cb);
}

Loader.firmen = function(cb) {
    Loader.json("data/firmen.json", cb);
}

Loader.noga = function(cb) {
    Loader.json("data/noga.json", cb);
}

Loader.all = function(cb) {
    Loader.firmen(function(f) {
        Loader.gemeinden(function(g) {
            var data = new Array();
            data['firmen'] = f;
            data['gemeinden'] = g;
            cb(data);
        });
    });
}

function Gemeinden(data) {
    var data = data;

    this.getData = function() {
        return data;
    }
}

function Firmen(data) {
    var data = data;

    this.getData = function() {
        return data;
    }

    this.filter = function(fn) {
        return data.filter(fn);
    }

    this.noga = function(code) {
        return filter(function(elem) {
            return elem.noga.indexOf(code) > -1;
        });
    }
}
