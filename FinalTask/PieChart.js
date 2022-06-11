class PieChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            inner_radius: config.inner_radius || 0,
            outer_radius: config.outer_radius || (config.width - config.margin.left - config.margin.right)/2,
            title: config.title || ''
        };
        console.log( this.config.title )
        this.original_data = data;
        this.format_data();
        this.init();
    }

    format_data() {
        let self = this;

        self.countries = ['東北', '関東', '中部', '近畿', '中国', '四国', '九州'];
        self.data = [];
        self.countries.forEach( country => {
            self.data.push( {
                name_country: country,
                value: 0
            } );
        } );
        self.original_data.forEach( d => {
            self.data.find( (v) => v.name_country == d.country ).value += d.n_starbucks;
        });
        console.log( self.data );
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        const center_x = self.config.margin.left + self.inner_width/2;
        const center_y = self.config.margin.top + self.inner_height/2;
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${center_x},${center_y})`);

        self.arc = d3.arc()
            .innerRadius(self.config.inner_radius)
            .outerRadius(self.config.outer_radius);

        self.radius = Math.min(self.inner_width, self.inner_height) / 2;

        const title_space = 20;
        self.svg.append('text')
            .style('font-size', '20x')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        self.color_palette = d3.scaleOrdinal(d3.schemeSet1);
    }

    update() {
        let self = this;

        self.pie = d3.pie()
            .value( d => d.value );

        self.text_arc = d3.arc()
            .innerRadius( self.config.outer_radius - 50 )
            .outerRadius( self.config.outer_radius - 50 );

        self.render();
    }

    render() {
        let self = this;

         self.parts = self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', d => self.color_palette(d.index))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.chart.selectAll('text')
            .data(self.pie(self.data))
            .enter()
            .append('text')
            .attr('fill', 'black')
            .attr('transform', d => `translate(${self.text_arc.centroid(d) })`)
            .style('font-size', '11px')
            .attr('text-anchor', 'middle')
            .html(d => `${d.data.name_country}${d.data.value}`);

        
    }
}