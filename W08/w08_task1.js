class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:30, right:30, bottom:10, left:10},
            font_size: config.font_size || 12,
            title: config.title || 'title'
        };
        this.data = data;
        
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
                    .attr( 'width', self.config.width+70 )
                    .attr( 'height', self.config.height+20 );

        self.chart = self.svg.append('g')
                    .attr('transform', `translate(${self.config.margin.left + 70}, ${self.config.margin.top})`);
    
        const inner_width = self.config.width - self.config.margin.left - self.config.margin.right - 10;
        const inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range([0, inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, inner_height])
            .paddingInner(0.2);

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale )
        .ticks(5)
        .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
        .tickSizeOuter(0);

        // Prepare the axes
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${inner_height})`)

        self.yaxis_group = self.chart.append('g')
    }

    update() {
        let self = this;

        self.xscale.domain([0, d3.max(self.data, d => d.value)]);
        self.yscale.domain(self.data.map(d => d.label));



        this.render();
    }

    render() {
        let self = this;

        self.svg.append('text')
            .attr('transform', `translate(${self.config.margin.left + self.config.width / 3.5}, 20)`)
            .attr('font-size', 15)
            .text( self.config.title );
        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());
        
        self.xaxis_group.call( self.xaxis );
        self.yaxis_group.call( self.yaxis );
    }


};

d3.csv("https://raystar247.github.io/InfoVis2022/W08/value_data.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });
        // console.log( data );
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:30, right:40, bottom:10, left:10},
            font_size: 12,
            title: "??????22???????????????????????????????????????(100??????)"
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
