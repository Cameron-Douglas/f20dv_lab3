let locations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';
let vaccinations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/';


console.log("Building Data...")

d3.csv(locations, function(data) {
	return data;

}).then(function(data){

    //Loading data and creating relevant data structures

    const mapData = new Map();
    
    for(let i = 0; i<data.length; i++){
        mapData.set(data[i].iso_code,data[i].location)
    }

    let locs = [];

    mapData.forEach(value=>locs.push(value))

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
        
        //countryData.push(data[i]);
    }

    console.log("Ready...")

    console.log(worldData)
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

    options.text(d=>{return d;})
            .attr("value",d=>{return d;});


    d3.select("select")
        .on("change",d=>{ var selected = d3.select("#dropdown").node().value; console.log(selected);})
    
});

