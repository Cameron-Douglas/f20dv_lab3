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

const scatSvg = d3.select("body")
    .append("div")
    .attr("class","scatter_container")
    .append("svg")
    .attr('width', xSizeScat )
    .attr('height', ySizeScat )
    .append("g")
    .attr("transform","translate(" + marginScat + "," + 75 + ")");

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

function updateScatterChart(data,color){
    
    let tmp = [];
    
    scatSvg.selectAll(".marker")
        .data(tmp)
        .exit()
        .remove()
    
    scatSvg.selectAll(".chartLabel")
        .data(tmp)
        .exit()
        .remove()
    
    scatSvg.selectAll(".label")
        .data(tmp)
        .exit()
        .remove();

    //updateScatterAxes(data)
    
    let arr = [0];

    scatSvg.selectAll(".scatterPoint")
        .data(arr)
        .exit()
        .remove()
    
    scatSvg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","scatterPoint")
        .attr("cx", function (d) { return xScat(d.x) } )
        .attr("cy", function (d) { return yScat(d.y) } )
        .attr("r", 7.5)
        .attr("fill", function(d) { return color(d.y) })
        .attr("stroke","black")
        .on("mouseover",function(event,d,i){

            let arr = []

            console.log(d.x)

            scatSvg.selectAll(".countryLabel")
                .data(arr)
                .exit()
                .remove()
           
            scatSvg.append("text")
                .attr("class","countryLabel")
                .attr("x",xScat(d.x) + 15)
                .attr("y",yScat(d.y) + 2)
                .style("font-weight","bold")
                .text(d.z)
        })
        .on("mouseout",function(event,d,i){

            let arr = []

            scatSvg.selectAll(".countryLabel")
                .data(arr)
                .exit()
                .remove()
            
        })
        .on("click",function(event,d,i){
            
        });

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
        .text("Excess mortalitay against GDP Per Capita")
        .style("font-size","19px")
}