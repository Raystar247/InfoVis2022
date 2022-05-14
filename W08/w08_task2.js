var data = [
    {x:0, y:100},
    {x:40, y:5},
    {x:120, y:80},
    {x:150, y:30},
    {x:200, y:50}
];

var width = 256;
var height = 128;

var svg = d3.select('#drawing_region')
    .attr('width', width)
    .attr('height', height);

const line = d3.line()
      .x( d => d.x )
      .y( d => d.y );

svg.append('path')
    .attr('d', line(data))
    .attr('stroke', 'black')
    .attr('fill', 'black');

class LineAreaChart {

    constructer( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom: 10, left:10},
            style: config.style || "line"
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
                    .attr( 'width', self.config.width )
                    .attr( 'height', self.config.height );
        
        self.chart = self.svg.append('g')
                        .attr( 'transform', `translate(${self.margin.left}, ${self.config.margin.top})`);
        
    }
};
