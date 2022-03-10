const xSize = 750; const ySize = 600;
const margin = 150;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

/* Get the 'limits' of the data - the full extent (mins and max)
so the plotted data fits perfectly */

let xExtent;
let yExtent;

//X Axis
let x;

//Y Axis
let y;

const svg = d3.select("body")
.append("div")
.attr("class","chart_container")
.append("svg")
.attr('width', xSize )
.attr('height', ySize )
.append("g")
.attr("transform","translate(" + margin + "," + 75 + ")");


function setupAxes(data, country){

    /* Get the 'limits' of the data - the full extent (mins and max)
    so the plotted data fits perfectly */

    xExtent = d3.extent( data, d=>{ return d.x } );
    yExtent = d3.extent( data, d=>{ return d.y } );

    //X Axis
    x = d3.scaleLinear()
        .domain([ xExtent[0], xExtent[1] ])
        .range([0, xMax]);

     //Y Axis
    y = d3.scaleLinear()
        .domain([ yExtent[0], yExtent[1] ])
        .range([ yMax, 0]);

    //bottom
    svg.append("g")
        .attr("transform", "translate(0," + yMax + ")")
        .attr("class","axis")
        .call(d3.axisBottom(x))

    //top
    svg.append("g")
        .attr("class","axis")
        .call(d3.axisTop(x));

    //left y axis
    svg.append("g")
        .attr("class","axis")
        .call(d3.axisLeft(y));

    //right y axis
    svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${xMax},0)`)
        .call(d3.axisRight(y));

    svg.append("text")
        .attr("x", xMax/2 - 50)
        .attr("y", yMax + 50)
        .attr("class","chartLabel")
        .text("Day Number")

    svg.append("text")
        .attr("x", "-137.5")
        .attr("y", yMax/2)
        .attr("class","chartLabel")
        .text("Vaccinated")

    svg.append("text")
        .attr("x", 0)
        .attr("y",-50)
        .attr("class","chartLabel")
        .text(country + " Covid Vaccinations Over Time")
        .style("font-size","19px")

    svg.append("text")
        .attr("x",5)
        .attr("y",15)
        .attr("class","chartLabel")
        .text("People Vaccinated: ")
}

function updateChart(data, country){
     
    let tmp = [];

    let u = svg.selectAll(".chartPath")
        .data(tmp)
        .exit()
        .remove()
    
    let v = svg.selectAll(".axis")
        .data(tmp)
        .exit()
        .remove()
    
    let t = svg.selectAll(".marker")
        .data(tmp)
        .exit()
        .remove()
    
    let w = svg.selectAll(".chartLabel")
        .data(tmp)
        .exit()
        .remove()

    setupAxes(data, country);
    
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.25)
        .attr("class","chartPath")
        .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        );

    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","marker")
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
                .attr("x", 135) 
                .attr("y", 15)
                .attr("class","label")
                .text(d.y)
        })
        .on("mouseout",function(event,d,i){
            d3.select(this)
                .style("opacity",0)
        });
}