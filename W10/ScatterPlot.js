class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:30, bottom:30, left:30},
            title: config.title || "no title",
            xlabel: config.xlabel || "sample x",
            ylabel: config.ylabel || "sample y",
            font_size: config.font_size || 12
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
            .attr('transform', `translate(${self.config.margin.left + 30}, ${self.config.margin.top})`);

        self.title = self.svg.append('text')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.margin.top / 2})`)
            .attr('fill', "black")
            .attr('text-anchor', "middle")
            .text(self.config.title);


        self.inner = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)
            .attr('id', "inner");

        self.ylabel = self.svg.append('text')
            .attr('transform', `translate(25, ${self.config.height / 2}) rotate(-90)`)
            .attr('text-anchor', "middle")
            .attr('fill', "black")
            .attr('font-size', `${self.config.font_size}`)
            .attr('font-weigh', "650")
            .style('display', "inline-block")
            .style('width', "100px")
            .text(self.config.ylabel);

        self.xlabel = self.svg.append('text')
            .attr('transform', `translate(${self.config.margin.top + self.config.width / 2 + 10}, ${self.config.height + 10})`)
            .attr('text-anchor', "middle")
            .attr('fill', "black")
            .attr('font-size', `${self.config.font_size}`)
            .attr('font-weight', "650")
            .text(self.config.xlabel);

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

        self.circles = self.inner.selectAll("circle")
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
};