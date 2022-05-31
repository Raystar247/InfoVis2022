d3.csv("https://raystar247.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.month_wage; d.y = +d.n_starbucks; d.r = 2; });
        let config = {
            parent: "#drawing_region_scatter_plot",
            width: 360,
            height: 360
        };
        let scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });