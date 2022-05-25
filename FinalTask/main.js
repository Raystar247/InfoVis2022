d3.csv("data.csv")
    .then( data => {
        data.ForEach( d => { d.x = +d.month_wage; d.y = +d.n_starbucks; })
    })
    .catch( error => {
        console.log( error );
    });