// global
var svgGemeinden = null;
var g;


function initGemeinden(map, collection) {
    svgGemeinden = d3.select(map.getPanes().overlayPane).append("svg");
    g = svgGemeinden.append("g").attr("class", "leaflet-zoom-hide");

    //d3.json("data/gemeinden.json", function(collection) {
        var transform = d3.geo.transform({point: projectPoint});
        var path = d3.geo.path().projection(transform);
        var bounds = path.bounds(collection);

        var feature = g.selectAll("path")
            .data(collection.features)
            .enter().append("path");

        map.on("viewreset", resetGemeinden);
        resetGemeinden();


        function resetGemeinden() {
            var topLeft = bounds[0];
            var bottomRight = bounds[1];

            svgGemeinden.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        }

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
   // });
}
