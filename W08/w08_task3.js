class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            inner_radius: config.inner_radius || 0
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
            .attr( 'transform', `translate(${self.config.margin.left + self.config.width / 2}, ${self.config.margin.top + self.config.height / 2})`);
        



    }

    update() {
        let self = this;

        const inner_width = self.config.width - ( self.config.margin.left + self.config.margin.right);
        const inner_height = self.config.height - ( self.config.margin.top + self.config.margin.bottom);
        var radius = Math.min( inner_width, inner_height ) / 2;
        self.pie = d3.pie().value( d => d.value );
        self.arc = d3.arc()
            .innerRadius( 0 )
            .outerRadius( radius );
        self.text = d3.arc()
            .innerRadius( radius - 30 )
            .outerRadius( radius - 30 );
        this.render()      
    }

    render() {
        let self = this;
        self.chart.selectAll('pie')
            .data( self.pie(self.data) )
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', 'blue')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
        self.chart.selectAll('pie')
            .data( self.pie(self.data) )
            .enter().append('text')
            .attr('transform', d => `translate(${self.text.centroid(d)})`)
            .attr('fill', "black")
            .attr('dy', "0.35px")
            .attr('font', "10px")
            .attr('text-anchor', "middle")
            .text( function(d){ return d.data.label; } );
    }
}

d3.csv("https://raystar247.github.io/InfoVis2022/W08/value_data.csv")
    .then( data => {
        var config = {
            parent: '#drawing_region',
            inner_radius: 0
        };
        const pieChart = new PieChart( config, data );
        pieChart.update();
    })
    .catch( error => {
        console.log( error );
    });        