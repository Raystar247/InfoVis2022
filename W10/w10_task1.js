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
            title: "平成22年度の近畿地方の府県の歳入(100万円)"
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();

        d3.select("#reverse")
            .on('click', d => {
                bar_chart.reverse();
            });

        d3.select("#descend")
            .on('click', d => {
                bar_chart.descend();
            });
        d3.select("#ascend")
            .on('click', d => {
                bar_chart.ascend();
            })
        d3.select("#original")
            .on('click', d => {
                bar_chart.original();
        });
    })
    .catch( error => {
        console.log( error );
    });

