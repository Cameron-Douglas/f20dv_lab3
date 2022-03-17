// Declare global Variables

const xSizeScat = 700; const ySizeScat = 350;
const marginScat = 150;
const xMaxScat = xSizeScat - marginScat*2;
const yMaxScat = ySizeScat - marginScat;

const tSpeed = 1000;

/* Get the 'limits' of the data - the full extent (mins and max)
so the plotted data fits perfectly */

let xExtentScat;
let yExtentScat;


//X Axis
let xScat = d3.scaleLinear();

//Y Axis
let yScat = d3.scaleLinear();

let ScatterCounter = 0;

// Append a scatter container to the div
const scatSvg = d3.select("body")
    .append("div")
    .attr("class","scatter_container")
    .append("svg")
    .attr('width', 840 )
    .attr('height', ySizeScat )
    .append("g")
    .attr("transform","translate(" + (marginScat+150) + "," + 75 + ")");

// Setup the axes, the axes do not need to be updated for this plot so this is run once on init 
function setupScatterAxes(data){

    /* Get the 'limits' of the data - the full extent (mins and max)
    so the plotted data fits perfectly */

    xExtentScat = d3.extent( data, d=>{ return d.x } );
    yExtentScat = d3.extent( data, d=>{ return d.y } );

    //X Axis
    xScat.domain([ xExtentScat[0], xExtentScat[1] ])
        .range([0, xMaxScat]);

    //Y Axis
    yScat.domain([ yExtentScat[0], yExtentScat[1] ])
        .range([ yMaxScat, 0]);

    //bottom
    scatSvg.append("g")
        .attr("transform", "translate(0," + yMaxScat + ")")
        .attr("class","ScatterXaxis")
        .transition()
        .duration(tSpeed)
        .call(d3.axisBottom(xScat))

    //top
    scatSvg.append("g")
        .attr("class","ScatterTopaxis")
        .transition()
        .duration(tSpeed)
        .call(d3.axisTop(xScat));

    //left y axis
    scatSvg.append("g")
        .attr("class","ScatterYaxis")
        .transition()
        .duration(tSpeed)
        .call(d3.axisLeft(yScat));

    //right y axis
    scatSvg.append("g")
        .attr("class","ScatterRightaxis")
        .attr("transform", `translate(${xMaxScat},0)`)
            .transition()
        .duration(tSpeed)
        .call(d3.axisRight(yScat));

}

// Update the points on the chart
function updateScatterChart(data,color){
    
    // Remove old labels and scatter points
    let arr = [];
    
    scatSvg.selectAll(".chartLabel")
        .data(arr)
        .exit()
        .remove();
    
    scatSvg.selectAll(".scatterPoint")
        .data(arr)
        .exit()
        .remove()

    
    // Append new points
    scatSvg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","scatterPoint")
        .attr("cx", function (d) { return xScat(d.x) } ) // Set x and y values using the data
        .attr("cy", function (d) { return yScat(d.y) } )
        .attr("r", 7.5)
        .attr("fill", function(d) { return color(d.y) } ) // Set the color using the color scale passed in
        .attr("opacity","0.8")
        .attr("stroke","black")
        .on("mouseover",function(event,d,i){

            // Append a label with the country to the top corner of the chart

            let arr = []

            console.log(d.x)

            scatSvg.selectAll(".countryLabel")
                .data(arr)
                .exit()
                .remove()
           
            scatSvg.append("text")
                .attr("class","countryLabel")
                .attr("x", 20)
                .attr("y", 20)
                .style("font-weight","bold")
                .style("fill","steelblue")
                .text(d.z)
        })
        .on("mouseout",function(event,d,i){

            // Remove country lables when mouse is not on dots
            let arr = []

            scatSvg.selectAll(".countryLabel")
                .data(arr)
                .exit()
                .remove()
            
        });
    

    // Append chart title and axis labels

    scatSvg.append("text")
        .attr("x", xMaxScat/2 - 50)
        .attr("y", yMaxScat + 50)
        .attr("class","chartLabel")
        .text("GDP Per Capita")

    scatSvg.append("text")
        .attr("x", "-137.5")
        .attr("y", yMaxScat/2)
        .attr("class","chartLabel")
        .text("Excess Mortality")

    scatSvg.append("text")
        .attr("x", 0)
        .attr("y",-50)
        .attr("class","chartLabel")
        .text("Excess Mortalitay Against GDP Per Capita")
        .style("font-size","19px")
}