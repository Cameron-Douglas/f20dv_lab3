let locations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/locations.csv';
let vaccinations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/';

d3.csv(locations, function(data) {
	return data;

}).then(function(data){

    let locs = [];
    

    for(let i=0; i<data.length; i++){
        locs.push(data[i].location);
        console.log(locs[i]);
    }

    var dropdown = d3.select("#dropdown-container")
        .append("select")
        .attr("class","selection")
        .attr("id","dropdown")
        .attr("name","country-list");

    var options = dropdown.selectAll("option")
        .data(data)
        .enter()
        .append("option")
    
    options.text(d=>{return d.location;})
            .attr("value",d=>{return d.location});
    
    
    d3.select("select")
        .on("change",d=>{ var selected = d3.select("#dropdown").node().value; update(selected);})
    
});

function update(selection){

    var url = vaccinations + selection +".csv"

    console.log(url);

    d3.csv(url, function(data) {
        return data;
    
    }).then(function(data){
        
        var vaccinations = [];
        var dates = [];

        for(let i = 0; i<data.length; i++){
            vaccinations.push(data[i].total_vaccinations);
            dates.push(data[i].date)
            console.log(vaccinations[i]);
        }
        
    });
}
