//画面の幅と高さ
var w = 420;
var h = 800;
var scale = 1200; //地図のスケール

var c = "";
 
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
            d.income = +d.income;
         } );

         var config_bar = {
            parent: '#bar_chart',
            width: 500,
            height: 725,
            margin: {top:25, right:10, bottom:50, left:100},
            title: '都道府県別の税収',
            xlabel: '全国平均を100とする税収の指数',
            ylabel: '都道府県'
        };

        const bar_chart = new BarChart( config_bar, data );
        bar_chart.update();

        var config_pie = {
         parent: '#pie_chart',
         width: 450,
         height: 500,
         inner_radius: 100,
         margin: {top:50, right:10, bottom:10, left:10},
         title: '地方別のスターバックス店舗数'
        };

        const pie_chart = new PieChart( config_pie, data );
        pie_chart.update();


         var xmin = d3.min( data, d => d.n_starbucks );
         var xmax = d3.max( data, d => d.n_starbucks );
         var map_color_scale = d3.scaleLinear()
            .domain([ xmin, xmax - 50 ])
            .range( ["white", "blue"] )
            .interpolate( d3.interpolateLab );

         d3.json("https://raystar247.github.io/InfoVis2022/Geometry/japan.geojson").then(function(json) {
            // console.log( json.features.properties );   
            const title_space = 20;
            svg.append('text')
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .attr('x', w / 2)
                .attr('y', 30)
                .text( "日本におけるSTARBUCKSの店舗分布" );
            svg.append('text')
               .style('font-size', '10px')
               .attr('x', 0)
               .attr('y', 50)
               .text('※ 青色が濃い都道府県ほど多くの店舗があることを意味する');
            var maps = svg.selectAll("path")   //都道府県の領域データをpathで描画
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
                  var pref = data.find( (v) => v.pref == d.toElement.__data__.properties.pref_j );
                  console.log(d.toElement.__data__.properties.pref_j);
                  bar_chart.highlighter = d.toElement.__data__.properties.pref_j;
                  d3.select('#tooltip')
                  .style('opacity', 1)
                  .html(`<div class="tooltip-label">${pref.pref}</div>STARBUCKS ${pref.n_starbucks}店舗`);
               } else {
                  bar_chart.highlighter = "";
               }
               console.log( bar_chart.highlighter );
               bar_chart.re_render( c );

            });
            svg.on('mousemove', (e) => {
               if (e.toElement.__data__ != undefined ){
               const padding = 10;
               d3.select('#tooltip')
                   .style('left', (e.pageX + padding) + 'px')
                   .style('top', (e.pageY + padding) + 'px');
               } else {
                  d3.select('#tooltip').style('opacity', 0);
               }
           });
           

            pie_chart.parts.on( 'click', (e) => {
               if ( c == e.toElement.__data__.data.name_country ) {
                  c = "";
               } else {
                  c = e.toElement.__data__.data.name_country;
               }
               pie_chart.parts.style( 'stroke', (d) => {
                  if ( d.data.name_country == c ) {
                     return 'gray';
                  }
                  return 'white';
               } );
               maps.style('stroke', (d) => {
                  var str = d.properties.pref_j;
                  if ( data.find( (v) => v.pref == str ).country == c ) {
                     return "black";
                  } else {
                  return "gray";
                  }
               } );
               bar_chart.rect.attr( 'fill', (d) => {
                  console.log( d );
                  if ( d.country == c ) {
                     return "url(#grad_orange)";
                  }
                  return "url(#grad)";
               } );
            } );

            
         });
      })
      .catch( error => {
         console.log( error );
      });
