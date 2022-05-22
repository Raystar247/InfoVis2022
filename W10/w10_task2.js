d3.csv("https://raystar247.github.io/InfoVis2022/W06/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 400,
            margin: {top:30, right:30, bottom:30, left:30},
            title: "旅券取得者数と最低賃金の相関",
            xlabel: "旅券取得者数",
            ylabel: "最低賃金",
            font_size: 11.5
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();

        scatter_plot.circles
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                  .style('opacity', 1)
                  .html(`<div class="tooltip-label">${d.pref}</div>(${d.x}, ${d.y})`);
            } );
        scatter_plot.circles
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                  .style('left', (e.pageX + padding) + 'px')
                  .style('top', (e.pageY + padding) + 'px');              
            });
        scatter_plot.circles
            .on('mouseleave', () => {
                d3.select('#tooltip')
                  .style('opacity', 0);
            });
    })
    .catch( error => {
        console.log( error );
    });