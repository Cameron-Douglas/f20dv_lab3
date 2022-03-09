let locations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';
let vaccinations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/';

const dropdownContainer = d3.select("body")
    .append("div")
    .attr("id","dropdown-container")

const xSize = 1200; const ySize = 600;
const margin = 150;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

//Append SVG Object to the Page

const svg = d3.select("body")
    .append("svg")
    .attr('width', xSize )
    .attr('height', ySize )
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")");


console.log("Building Data...")

d3.csv(locations, function(data) {
	return data;

}).then(function(data){

    //Loading data and creating relevant data structures

    let countryData = [];
    let totalData = [];

    let worldData = new Map();
    let isoCode = "AFG";

    for(let i = 0; i<data.length; i++){
        countryData = data[i];
        if(data[i].iso_code == isoCode){
            totalData.push(countryData);
        } else{
            worldData.set(isoCode,totalData)
            isoCode = data[i].iso_code
            totalData = []
            totalData.push(countryData)
        }
        
    }

    let locs = [];

    worldData.forEach((value,key)=>locs.push(key))

    console.log("Ready...")

   // Displaying data

    var dropdown = d3.select("#dropdown-container")
        .append("select")
        .attr("class","selection")
        .attr("id","dropdown")
        .attr("name","country-list");

    var options = dropdown.selectAll("option")
        .data(locs)
        .enter()
        .append("option")

    options.text(d=>{return worldData.get(d)[1].location;})
            .attr("value",d=>{return d;});


    d3.select("select")
        .on("change",d=>{ var selected = d3.select("#dropdown").node().value; onSelection(selected,worldData);})

    console.log(typeof isoCode);
    totalCases = [];
    let prevValue = 0;

    for(let i = 0; i<worldData.get("AFG").length;i++){
        let totalVacc = parseInt(worldData.get("AFG")[i].total_vaccinations);
        if(isNaN(totalVacc)){
            totalVacc = prevValue;
        }   
        totalCases.push({x:i,y:totalVacc});
        prevValue = totalVacc;
}   
    
    drawChart(totalCases)
});

function onSelection(iso,data){
    console.log(iso)
    console.log(data.get(iso));

    totalCases = [];
    //totalCasesStacked = [];
    prevValue = 0;

    for(let i = 0; i<data.get(iso).length;i++){

        let totalVacc = parseInt(data.get(iso)[i].total_vaccinations);
       
        if(isNaN(totalVacc)){
            totalVacc = prevValue;
        }

        totalCases.push({x:i,y:totalVacc});

        prevValue = totalVacc;
    }
   
    updateChart(totalCases);
    
}

function drawChart(data){
    
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
        .attr("x", xMax/2)
        .attr("y", yMax + 50)
        .text("Day Number")

    svg.append("text")
        .attr("x", "-137.5")
        .attr("y", yMax/2)
        .text("# of Cases")
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
            .attr("x", 25) 
            .attr("y", 25)
            .attr("class","label")
            .text(d.y)
    })
    .on("mouseout",function(event,d,i){
        d3.select(this)
            .style("opacity",0)
    });
}


function updateChart(data){
    let arr = [1];
    let tmp = [];
    
    //Add the line
    var u = svg.selectAll("path")
        .data(tmp)
        .exit()
        .remove();

    d3.selectAll("g")
        .data(arr)
        .exit()
        .remove()

    drawChart(data);
}

