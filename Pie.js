function drawPie(data){
// Initialise SVG properties
    let width = 750,
        height = 300,
        radius = Math.min(width, height) / 2;

    // Define color ranges
    let color =  d3.scaleOrdinal().domain(data).range(["MediumSeaGreen", "YellowGreen", "DarkOrange"]);
    let keys = ["Vaccinated", "Fullly Vaccinated","Unvaccinated"];
    let keycolor =  d3.scaleOrdinal().domain(keys).range(["MediumSeaGreen", "YellowGreen", "DarkOrange"]);


    // Initialise pie let#iable
    let pie = d3.pie()
    .sort(null);

    // Initialise arc varible
    let arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 50);

    // Append SVG
    let svg = d3.select("body")
    .append("div")
    .attr("class","pie_container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
            .attr("cx", 75)
            .attr("cy", function(d,i){ return 90 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return keycolor(d)})

    svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", 95)
        .attr("y", function(d,i){ return 90 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")


    // Append path to the SVG using pie data
    function draw(dataset){

        let path = svg.selectAll("path")
        .data(pie(dataset))
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
        let i = d3.interpolate(d.endAngle, d.startAngle);
        return function (t) {
        d.startAngle = i(t);
        return arc(d);
        }
        });
    }

    // Update function called on button press
    function updatePie(dataset){

        // Create a new path
    let path = svg.selectAll("path")
        .data(pie(dataset));

        // Merge old path to the new path
        path.enter()
        .append("path")
        .merge(path)
        .transition()
        .duration(1000)
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc); 
    }

    draw(data)
}