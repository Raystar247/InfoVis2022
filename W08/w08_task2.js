class LineAreaChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            margin: config.margin || {top:10, right:10, bottom:50, left:50},
            width: config.width || 256,
            height: config.height || 256,
            xlabel: config.xlabel || "",
            ylabel: config.ylabel || ""
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.svg = d3.select( self.config.parent )
            .attr( 'width', self.config.width )
            .attr( 'height', self.config.height )
        self.chart = self.svg.append('g')
            .attr( 'transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        
        self.inner_width = self.config.width - ( self.config.margin.left + self.config.margin.right );
        self.inner_height = self.config.height - ( self.config.margin.top + self.config.margin.bottom );

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );
        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );
        
        self.xaxis = d3.axisBottom( self.xscale ).ticks( 10 );
        self.yaxis = d3.axisLeft( self.yscale ).ticks( 10 );
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,${self.inner_height})`);
        self.yaxis_group = self.chart.append('g');        
    }

    update() {
        let self = this;

        const space = 10;
        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain([xmin - space, xmax + space]);
        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain([ymax + space, ymin - space]);

        self.render();
    }

    render() {
        let self = this;
        const line = d3.line()
            .x( d => self.xscale( d.x ) )
            .y( d => self.yscale( d.y ) );

        const xlabel_space = 10;
        self.svg.append( 'text' )
            .attr("x", self.config.width / 2)
            .attr("y", self.config.height + self.config.margin.top - xlabel_space)
            .text( self.config.xlabel);
        
        const ylabel_space = 50;
        self.svg.append( 'text' )
            .attr("transform", `rotate(-90)`)
            .attr("y", self.config.margin.left - ylabel_space)
            .attr("text-anchor", "middle")
            .attr("x", -self.config.height / 2)
            .attr("dy", "1em")
            .text( self.config.ylabel);
        
        self.chart.append( 'path' )
            .attr( 'd', line(self.data) )
            .attr( 'stroke', 'black' )
            .attr( 'fill', 'none');

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", 2.5 );

        self.xaxis_group.call( self.xaxis );
        self.yaxis_group.call( self.yaxis );
    }
}

var data = [
    {x:0, y:100},
    {x:40, y:5},
    {x:120, y:80},
    {x:150, y:30},
    {x:200, y:50}
];

var config = {
    parent: '#drawing_region',
    width: 320,
    height: 320,
    xlabel: "Xlabel",
    ylabel: "Ylabel"
}

const lineChart = new LineAreaChart( config, data );
lineChart.update();
