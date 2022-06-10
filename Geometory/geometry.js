//画面の幅と高さ
var w = 500;
var h = 500;
var scale = 1005; //地図のスケール
 
var projection = d3.geoMercator()
   .center([ 136.0, 35.6 ])
   .translate([w/2, h/2])
   .scale(scale);

var path = d3.geoPath().projection(projection);

var svg = d3.select("body")
         .append("svg")
         .attr("width", w)
         .attr("height", h);

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/FinalTask/data.csv")
      .then( data => {
         d3.json("https://raystar247.github.io/InfoVis2022/Geometry/japan.geojson").then(function(json) {
            // console.log( json.features.properties );   
         svg.selectAll("path")   //都道府県の領域データをpathで描画
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .style("stroke", "gray")
               .style("stroke-width", 0.5)
               .style("fill", "white");
            
            svg.on( 'mouseover', (d) => {
               console.log(d);
               if (d.toElement.__data__ != undefined ){
               console.log(d.toElement.__data__.properties.pref_j);
               }
            });
         });
      })
      .catch( error => {
         console.log( error );
      });