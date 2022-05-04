var elem = document.getElementById("drawing_region");
elem.style.border = "solid 1px blue";

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 420,
            height: 420,
            margin: {top:30, right:30, bottom:30, left:30},
            xlabel: "平均高度",
            ylabel: "緯度"
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:30, bottom:30, left:30},
            xlabel: config.xlabel || "sample x",
            ylabel: config.ylabel || "sample y"
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height + 40);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + 25}, ${self.config.margin.top})`);

        self.inner = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .attr('id', "inner");

        self.xlabel = self.svg.append('text')
            .attr('transform', `translate(25, ${self.config.height / 2}) rotate(-90)`)
            .attr('text-anchor', "middle")
            .attr('fill', "black")
            .attr('font-size', "12pt")
            .style('display', "inline-block")
            .style('width', "100px")
            .text(self.config.ylabel);

        self.xlabel = self.svg.append('text')
            .attr('transform', `translate(${self.config.margin.top + self.config.width / 2}, ${self.config.height + 10})`)
            .attr('text-anchor', "middle")
            .attr('fill', "black")
            .attr('font-size', "12pt")
            .text(self.config.xlabel);

        console.log(document.getElementById("xlabel"));

        self.inner_width = self.config.width - (self.config.margin.left + self.config.margin.right) * 2;
        self.inner_height = self.config.height - (self.config.margin.top + self.config.margin.bottom) * 2;
                
        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );
            

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.inner_height + self.config.margin.top + self.config.margin.bottom})`);
        
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.config.margin.top})`); // install this 更新する
    }

    update() {
        let self = this; 

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymax, ymin] );

        self.render();
    }

    render() {
        let self = this;

        self.inner.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}
