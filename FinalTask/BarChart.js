class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        };
        this.data = data;
        this.highlighter = "";
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        var defs = self.svg.append('defs')
        var grad = defs.append('linearGradient')
            .attr( 'id', "grad");
        grad.append('stop')
            .attr('offset', "0%")
            .attr('stop-color', "lightcyan");
        grad.append('stop')
            .attr('offset', "40%")
            .attr('stop-color', "lightskyblue");   
        grad.append('stop')
            .attr('offset', "100%")
            .attr('stop-color', "royalblue");   
        
        var grad_red = defs.append('linearGradient')
            .attr('id', 'grad_red');
        grad_red.append('stop')
            .attr('offset', "0%")
            .attr('stop-color', "gold");  
        grad_red.append('stop')
            .attr('offset', "100%")
            .attr('stop-color', "red");  

        var grad_orange = defs.append('linearGradient')
            .attr('id', 'grad_orange');
        grad_orange.append('stop')
            .attr('offset', "0%")
            .attr('stop-color', "yellow");  
        grad_orange.append('stop')
            .attr('offset', "100%")
            .attr('stop-color', "darkorange");  


        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const title_space = 10;
        self.svg.append('text')
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2.75 )
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 90;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        const space = 10;
        const xmin = 0;
        const xmax = d3.max(self.data, d => d.income) + space;
        self.xscale.domain([xmin, xmax]);
        self.data.sort( self.descend_order );
        const items = self.data.map(d => d.pref);
        self.yscale.domain(items);
        console.log("b");
        self.render();
    }

    render() {
        let self = this;


        console.log( self.data );
        const base_color = 'steelblue';
        console.log(  "e");
        self.rect = self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.pref))
            .attr("width", d => self.xscale(d.income) )
            .attr("height", self.yscale.bandwidth() )
            .attr("fill", "url(#grad)" );
        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }

    re_render() {
        let self = this;
        const base_color = 'steelblue';
        self.rect.attr("fill", d => { 
                console.log( "d.pref" );
                if ( d.pref == self.highlighter ) {
                    return "url(#grad_red)";
                } else if (d.country == c ) {
                    return "url(#grad_orange)";
                }
                return "url(#grad)";
            } );
    }

    descend_order( a, b ) {
        var order = 0;
        if ( a.income < b.income ) { order = 1; }
        else if ( a.income > b.income ) { order = -1; }
        return order;
    }
    
    descend() {
        let self = this;
        console.log( "aa" );
        // self.data.sort(  self.compare );
        self.render();
    }
}