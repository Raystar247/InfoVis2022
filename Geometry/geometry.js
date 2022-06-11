//画面の幅と高さ
var w = 400;
var h = 800;
var scale = 1200; //地図のスケール
 
var projection = d3.geoMercator()
   .center([ 136.0, 35.6 ])
   .translate([w/2, h/2])
   .scale(scale);


var path = d3.geoPath().projection(projection);

var svg = d3.select("#map_japan")
         .attr("width", w)
         .attr("height", h);

d3.csv("https://raystar247.github.io/InfoVis2022/data/data.csv")
      .then( data => {

         data.forEach( d => {
            d.n_starbucks = +d.n_starbucks;
            d.min_wage = +d.min_wage;
            d.month_wage = +d.month_wage;
         } );

         var config = {
            parent: '#bar_chart',
            width: 500,
            height: 725,
            margin: {top:25, right:10, bottom:50, left:100},
            title: 'Sample Data',
            xlabel: 'Value',
            ylabel: 'Label'
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();  


         var xmin = d3.min( data, d => d.n_starbucks );
         var xmax = d3.max( data, d => d.n_starbucks );
         var map_color_scale = d3.scaleLinear()
            .domain([ xmin, xmax ])
            .range( ["white", "blue"] )
            .interpolate( d3.interpolateLab );

         d3.json("https://raystar247.github.io/InfoVis2022/Geometry/japan.geojson").then(function(json) {
            // console.log( json.features.properties );   
            svg.selectAll("path")   //都道府県の領域データをpathで描画
                  .data(json.features)
                  .enter()
                  .append("path")
                  .attr("d", path)
                  .style("stroke", "gray")
                  .style("stroke-width", 0.5)
                  .style("fill", ( (d) => {
                     console.log( d.properties.pref_j )
                     var value = data.find( (v) => v.pref == d.properties.pref_j ).n_starbucks;
                     console.log( value );
                     return map_color_scale( value );
                  } ));

            

            svg.on( 'mouseover', (d) => {
               if (d.toElement.__data__ != undefined ){
                  console.log(d.toElement.__data__.properties.pref_j);
                  bar_chart.highlighter = d.toElement.__data__.properties.pref_j;
               } else {
                  bar_chart.highlighter = "";
               }
               console.log( bar_chart.highlighter );
               bar_chart.re_render();
            });

            
         });
      })
      .catch( error => {
         console.log( error );
      });