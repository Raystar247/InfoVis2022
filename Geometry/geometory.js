var width = 600,
height = 600;
var scale = 1600;
d3.json("./japan.geojson", createMap);

function createMap(japan) {
var aProjection = d3.geoMercator()
  .center([ 136.0, 35.6 ])
  .translate([width/2, height/2])
  .scale(scale);
var geoPath = d3.geoPath().projection(aProjection);
var svg = d3.select("svg").attr("width",width).attr("height",height);

//マップ描画
svg.selectAll("path").data(japan.features)
.enter()
.append("path")
  .attr("d", geoPath)
  .style("stroke", "#ffffff")
  .style("stroke-width", 0.1)
  .style("fill", "#5EAFC6");
}