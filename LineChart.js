function drawChart(data, country){

    const xSize = 900; const ySize = 600;
    const margin = 150;
    const xMax = xSize - margin*2;
    const yMax = ySize - margin*2;

    const svg = d3.select("body")
    .append("svg")
    .attr("class","chart")
    .attr('width', xSize )
    .attr('height', ySize )
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")");

   
    /* Get the 'limits' of the data - the full extent (mins and max)
    so the plotted data fits perfectly */

    const xExtent = d3.extent( data, d=>{ return d.x } );
    const yExtent = d3.extent( data, d=>{ return d.y } );

    //X Axis

    const x = d3.scaleLinear()
    .domain([ xExtent[0], xExtent[1] ])
    .range([0, xMax]);

    //bottom

    svg.append("g")
    .attr("transform", "translate(0," + yMax + ")")
    .call(d3.axisBottom(x))

    //top

    svg.append("g")
    .call(d3.axisTop(x));

    //Y Axis

    const y = d3.scaleLinear()
    .domain([ yExtent[0], yExtent[1] ])
    .range([ yMax, 0]);

    //left y axis

    svg.append("g")
    .call(d3.axisLeft(y));

    //right y axis

    svg.append("g")
    .attr("transform", `translate(${xMax},0)`)
    .call(d3.axisRight(y));

    svg.append("text")
        .attr("x", xMax/2 - 50)
        .attr("y", yMax + 50)
        .text("Day Number")

    svg.append("text")
        .attr("x", "-137.5")
        .attr("y", yMax/2)
        .text("# of Cases")


    svg.append("text")
        .attr("x", 0)
        .attr("y",-50)
        .text(country + " Covid Vaccinations")
        .style("font-size","22px")
    //Add the line

    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.25)
    .attr("d", d3.line()
    .x(function(d) { return x(d.x) })
    .y(function(d) { return y(d.y) })
    );

    svg.append("text")
        .attr("x",5)
        .attr("y",15)
        .text("Cases: ")

    svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x) } )
    .attr("cy", function (d) { return y(d.y) } )
    .attr("r", 7.5)
    .style("opacity", 0)
    .on("mouseover",function(event,d,i){
        let tmp = [];

        svg.selectAll(".label")
            .data(tmp)
            .exit()
            .remove();

        d3.select(this)
            .style("fill","orange")
            .style("opacity",1.0)
        
        svg.append("text")
            .attr("x", 50) 
            .attr("y", 15)
            .attr("class","label")
            .text(d.y)
    })
    .on("mouseout",function(event,d,i){
        d3.select(this)
            .style("opacity",0)
    });
}


function updateChart(data, country){
    
    let arr = [1];
    let tmp = [];
    
    d3.select(".chart").remove()


    drawChart(data, country);
}