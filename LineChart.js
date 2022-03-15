const xSize = 750; const ySize = 600;
const margin = 150;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

const transitionSpeed = 1000;

/* Get the 'limits' of the data - the full extent (mins and max)
so the plotted data fits perfectly */

let xExtent;
let yExtent;

//X Axis
let x;

//Y Axis
let y;

let ChartCounter = 0;

const svg = d3.select("body")
.append("div")
.attr("class","chart_container")
.append("svg")
.attr('width', xSize )
.attr('height', ySize )
.append("g")
.attr("transform","translate(" + margin + "," + 75 + ")");

var form = d3.select(".chart_container").append("form");

inputs = form.selectAll("label")
    .data(radioOptions)
    .enter()
    .append("div")
        .attr("class","radio")
        .append("text")
        .text(function(d) {return d;})
        .append("input")
        .attr("type","radio")
        .attr("class","shape")
        .attr("name","mode")
        .property("checked", function(d, i) { 
            return (i===j); 
        })
        .attr("value", function(d, i) {return i;})


        let formSelection = d3.select("form");
        formSelection.on("change",function(event){
            change(event.target.__data__)});
        
        function change(d){
            initialise(selectedISO,"max",d)
        }

function setupAxes(data, country, category){

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
        .transition()
        .duration(transitionSpeed)
        .call(d3.axisBottom(x))

    //top
    svg.append("g")
        .attr("class","axis")
        .transition()
        .duration(transitionSpeed)
        .call(d3.axisTop(x));

    //left y axis
    svg.append("g")
        .attr("class","axis")
        .transition()
        .duration(transitionSpeed)
        .call(d3.axisLeft(y));

    //right y axis
    svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${xMax},0)`)
         .transition()
        .duration(transitionSpeed)
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
        .text(country + " Covid " + category + " Over Time")
        .style("font-size","19px")

    svg.append("text")
        .attr("x",5)
        .attr("y",15)
        .attr("class","chartLabel")
        .text(category+":")
        .attr("font-weight","bold")

    svg.append("text")
        .attr("x",5)
        .attr("y",45)
        .attr("class","chartLabel")
        .text("Day: ")
        .attr("font-weight","bold")
}

function updateChart(data, country, iso, category){
     
    let tmp = [];

    let u = svg.selectAll(".line")
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
    
    svg.selectAll(".label")
        .data(tmp)
        .exit()
        .remove();

    setupAxes(data, country, category);
    
    let arr = [1];

    var l = svg.selectAll(".line")
        .data([data],d=>d.x)

    l.enter()
        .append("path")
        .attr("class","line")
        .merge(u)
        .transition()
        .duration(transitionSpeed)
        .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("stroke-width", 2.25);


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
                .attr("x", 5) 
                .attr("y", 30)
                .attr("class","label")
                .text(d.y)

            svg.append("text")
                .attr("x", 5) 
                .attr("y", 60)
                .attr("class","label")
                .text(d.x)
        })
        .on("mouseout",function(event,d,i){
            d3.select(this)
                .style("opacity",0)
        })
        .on("click",function(event,d,i){
            initialisePie(iso,d.x); // TODO -- Potential Change Category?
        });

}
