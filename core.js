// DECLARING GLOBAL VARIABLES

let locations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

let geoJSON;

let worldData = new Map();

let totalVaccinated = [];
let vaxData = [];

let listCountries = [];

let initDay = "max";

let currColoring;

var color;
var scatterColor;

let initCounter = 0;

let prevValue = 0;
let prevValuePV = 0;
let prevValuePFV = 0;
let prevValueUV = 0;
let prevValueW = 0;
let prevValueE = 0;

let totalTests = [];
let totalHospitalisations = [];
let totalDeaths = [];

let scatterData = [];
let fullScatterData = [];


console.log("Building Data...")

d3.select("body")
    .append("div")
    .attr("class","loading")
    .text("Loading Visualisation...")

// Load in COVID data from git hub
d3.csv(locations, function(data) {
	return data;

}).then(function(data){

    //Loading data and creating relevant data structures

    let countryData = [];
    let totalData = [];

    // Set an inital ISO code
    let isoCode = "AFG";

    // Populating worldData Map
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

    let cases = [];
    let excessMort = [];
  
    // For each key value pair in the map, build cases data for color scale and scatter data for scatter plot axes  
    worldData.forEach(function(value,key){
        cases.push(value[value.length-1].total_cases_per_million)
        buildScatterData(key,"full")
    })

    for(let i=0;i<fullScatterData.length;i++){
        excessMort.push(fullScatterData[i].y);
    }

    // Create color scales for the inital map and for the scatter plot
    color = d3.scaleLinear().domain([d3.min(cases),d3.max(cases)]).range(["green", "orange"]);
    scatterColor = d3.scaleLinear().domain([d3.min(excessMort),d3.max(excessMort)]).range(["yellowGreen", "orange"]);


    console.log("Ready...")

    
    // Load GEOJSON data for the map
    d3.json('https://raw.githubusercontent.com/cd94/f20dv_lab3/master/custom.geo.json')
    .then(function(json) {
        geoJSON = json
        
        // Call update to draw the map with the GEOJSON data
        update(geoJSON,color,worldData,"cpm","max")

        // Add button to reset the colors of the map
        d3.select(".map_container")
            .append("div")
            .attr("class","color_container") 
            .style("border-style","solid")
            .style("border-radius","12px")
            .style("border-color","steelblue")
            .style("padding","10px 10px 10px 10px")  
            .style("margin-top","10px")
            .style("margin-bottom","10px")
        
        d3.select(".color_container")
            .append("input")
            .attr("type","button")
            .attr("class","resetButton")
            .attr("value","Reset Color")
            .attr("onclick","update(\"none\",color,worldData,\"cpm\",\"max\")")

        d3.select(".color_container")
            .append("text")
            .style("font-size","18px")
            .text("   Colored By: Cases Per Million") 
        
        currColoring = "cpm"

    });
    
    d3.select(".loading")
        .style("opacity",1)
        .transition()
        .duration(250)
        .style("opacity",0)
        .style("margin-top","0px")
        .style("margin-left","0px")
        .style("margin-bottom","0px")
    
    
    // Initialise the graphs and datasets 
    multiCountry(['GBR','IRL'],"Vaccinations", "max", true)
});

// Initialise the pie chart with a day
function initialisePie(day){
    let currDay = day
    if(day === "max"){
       currDay = vaxData.length-1
    }
    
    let pieData = [];
    pieData.push(vaxData[currDay].x,vaxData[currDay].y);

    // Transition the pie chart with new data
    updatePie(worldData,vaxData,pieData,"Selected Region",currDay);
}

// Build data
function multiCountry(list, category, day, update, color){


    if(list.length !== 0){
        listCountries = list;
    }
    if(day != null){
        initDay = day
    }

    // Set varaibles to be 0 or empty, ready for values to be added

    totalVaccinated = [];
    totalTests = [];
    totalHospitalisations = [];
    totalDeaths = [];
    scatterData = [];
    vaxData = [];
    
    prevValuePV = 0;
    prevValuePFV = 0;
    prevValueUV = 0; 

    prevValue = 0;

    var countries = d3.select(".map_container")

    // If initialising, setup the axes for the plots and the div for the list of countries selected 
    if(initCounter === 0){

        setupAxes(totalVaccinated);
        setupScatterAxes(fullScatterData)

        countries
            .append("div")
            .attr("class","countryContainer")
            .style("border-style","solid")
            .style("border-radius","12px")
            .style("border-color","steelblue")
            .style("padding","10px 10px 10px 10px")
            .append("text")
            .text("Selected Countries: ")
            .style("font-size","18px")
        initCounter++;
    }

    // If an update to the list of countries has occured, update the displayed list 
    if(update){
        let arr = [1]
        countries.selectAll("text")
            .data(arr)
            .exit()
            .remove()

        for(let i = 0; i<list.length; i++){
            if(worldData.get(listCountries[i])!==undefined){
                let country = worldData.get(list[i])[0].location
                if(i == list.length - 1){
                    d3.select(".countryContainer")
                    .append("text")
                    .text(country)
                } else{
                    d3.select(".countryContainer")
                    .append("text")
                    .text(country+ ", ")
                }
        }
            
        }
    }

    // Display how the map is currently being colored

    if(currColoring === "cpm"){
        d3.select(".color_container")
                        .selectAll("text")
                        .remove()

        d3.select(".color_container")
                .append("text")
                .style("font-size","18px")
                .text("   Colored By: Cases Per Million") 
    }

    if(currColoring === "vax"){
        d3.select(".color_container")
        .select("text")
        .remove()
        
        d3.select(".color_container")
            .append("text")
            .style("font-size","18px")
            .text("   Colored By: Vaccinated per Hundred People") 
    }
    
    /*BUILD THE APPROPRIATE DATASETS FROM THE LIST OF COUNTRIES USING THE HELPER FUNCTIONS DEFINED BELOW */

    if(category === "Vaccinations"){

        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
            }
        // console.log(totalVaccinated)
        }
        updateChart(totalVaccinated,"Selected Region",category,color,worldData)
        initialisePie(initDay)
    }

    if(category === "Un-Vaccinated"){
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
            }
        // console.log(totalVaccinated)
        }
        initialisePie(initDay)
    }
    
    if(category === "Tests"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
                buildTestData(listCountries[i])
            }
       
        }
        updateChart(totalTests,"Selected Region",category)
        initialisePie(initDay)
    }
    console.log(category)
    if(category === "Hospitalisations"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
                buildHospitalData(listCountries[i])
            }
         
        }
        updateChart(totalHospitalisations,"Selected Region",category)
        initialisePie(initDay)
    }
    if(category === "Deaths"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
                buildDeathData(listCountries[i])
            }
         
        }
        updateChart(totalDeaths,"Selected Region",category)
        initialisePie(initDay)
    }

    // Build the scatter data and call scatter
    for(let i = 0; i<listCountries.length;i++){
        if(worldData.get(listCountries[i])!==undefined){
            buildScatterData(listCountries[i],"part")
            //console.log(scatterData)
            
        }
     
    }
    updateScatterChart(scatterData,scatterColor)

    
}

/*
 HELPER FUNCTIONS TO BUILD THE DATA.

 Functions take in one iso at a time, if it is the first call, append all of the values to the appropriate dataset
 else, loop over and add the values from the worldData map to the values already in the dataset to return a 
 dataset with a running total.
*/


function buildVaxData(iso){

   if(totalVaccinated.length === 0){
    // Building dataset for number of people vaccinated for line chart
        for(let i = 0; i<worldData.get(iso).length;i++){

            let totalvax = parseInt(worldData.get(iso)[i].people_vaccinated);
            //let fullvax = parseInt(worldData.get(iso)[i].people_fully_vaccinated)

            
            
            if(isNaN(totalvax)){
                totalvax = prevValuePV;
            }  
            // if(isNaN(fullvax)){
            //     fullvax = prevValuePFV;
            // } 


            let unvax = parseInt(worldData.get(iso)[i].population) - totalvax

            if(isNaN(unvax)){
                unvax = prevValueUV;
            }  

            totalVaccinated.push({x:i,y:totalvax});
            vaxData.push({x:totalvax,y:unvax});            

            prevValuePV = totalvax;
           // prevValuePFV = fullvax;
            prevValueUV = unvax;
        }
        
    } else{
        prevValuePV = 0;
        prevValuePFV = 0;
        prevValueUV = 0; 

        for(let j = 0; j<totalVaccinated.length;j++){

            if(worldData.get(iso)[j] === undefined){
                totalvax = prevValuePV;
                unvax = prevValueUV;

                totalVaccinated[j].y += totalvax;

                vaxData[j].x += totalvax;
                vaxData[j].y += unvax;

            } else{
            let totalvax = parseInt(worldData.get(iso)[j].people_vaccinated);
            
            if(isNaN(totalvax)){
                totalvax = prevValuePV;
            }  
           
            let unvax = parseInt(worldData.get(iso)[j].population) - totalvax
    
            if(isNaN(unvax)){
                unvax = prevValueUV;
            }           

            totalVaccinated[j].y += totalvax;

            vaxData[j].x += totalvax;
            vaxData[j].y += unvax;

            prevValuePV = totalvax;
            prevValueUV = unvax;
            } 
        }
    }
}

function buildTestData(iso){

    if(totalTests.length === 0){
        // Building dataset for number of people vaccinated for line chart
            for(let i = 0; i<worldData.get(iso).length;i++){
    
                let totaltest = parseInt(worldData.get(iso)[i].total_tests);
                
                if(isNaN(totaltest)){
                    totaltest = prevValue;
                }  
                totalTests.push({x:i,y:totaltest});
    
                prevValue = totaltest;
            } 
        } else{
            prevValue = 0; 
            for(let j = 0; j<totalTests.length;j++){
                //console.log(worldData.get(iso) == undefined)
                if(worldData.get(iso)[j] === undefined){
                    totaltest = prevValue;
                    totalTests[j].y += totaltest;
                } else{
                let totaltest = parseInt(worldData.get(iso)[j].total_tests);
                
                if(isNaN(totaltest)){
                    totaltest = prevValue;
                } 
                
                totalTests[j].y += totaltest;
    
                prevValue = totaltest;
                } 
            }
        }
    } 
 


function buildHospitalData(iso){

    if(totalHospitalisations.length === 0){
        // Building dataset for number of people vaccinated for line chart
            for(let i = 0; i<worldData.get(iso).length;i++){
    
                let totalhosp = parseInt(worldData.get(iso)[i].hosp_patients);
                
                if(isNaN(totalhosp)){
                    totalhosp = prevValue;
                }  
                totalHospitalisations.push({x:i,y:totalhosp});
    
                prevValue = totalhosp;
            } 
        } else{
            prevValue = 0; 
            for(let j = 0; j<totalHospitalisations.length;j++){
                if(worldData.get(iso)[j] === undefined){
                    totalhosp = prevValue;
                    totalHospitalisations[j].y += totalhosp;
                } else{
                let totalhosp = parseInt(worldData.get(iso)[j].hosp_patients);
                
                if(isNaN(totalhosp)){
                    totalhosp = prevValue;
                } 
                
                totalHospitalisations[j].y += totalhosp;
    
                prevValue = totalhosp;
                } 
            }
        }
}

function buildDeathData(iso){

    if(totalDeaths.length === 0){
        // Building dataset for number of people vaccinated for line chart
            for(let i = 0; i<worldData.get(iso).length;i++){
    
                let totaldeath = parseInt(worldData.get(iso)[i].total_deaths);
                
                if(isNaN(totaldeath)){
                    totaldeath = prevValue;
                }  
                totalDeaths.push({x:i,y:totaldeath});
    
                prevValue = totaldeath;
            } 
        } else{
            prevValue = 0; 
            for(let j = 0; j<totalDeaths.length;j++){
                if(worldData.get(iso)[j] === undefined){
                    totaldeath = prevValue;
                    totalDeaths[j].y += totaldeath;
                } else{
                let totaldeath = parseInt(worldData.get(iso)[j].total_deaths);
                
                if(isNaN(totaldeath)){
                    totaldeath = prevValue;
                } 
                
                totalDeaths[j].y += totaldeath;
    
                prevValue = totaldeath;
                } 
            }
        }
    }

function buildScatterData(iso,dataset){
        
            // Building dataset for number of people vaccinated for line chart
            let index = worldData.get(iso).length - 1
                for(let i = 0; i<worldData.get(iso).length;i++){
        
                    var wealth = parseInt(worldData.get(iso)[i].gdp_per_capita);
                    var excess = parseInt(worldData.get(iso)[i].excess_mortality);
                    
                    if(isNaN(wealth)){
                        wealth = prevValueW;
                    }  
                    if(isNaN(excess)){
                        excess = prevValueE;
                    } 
        
                    prevValueW = wealth;
                    prevValueE = excess;
                } 
            if(dataset === "part"){
                scatterData.push({x:wealth,y:excess,z:worldData.get(iso)[0].location});
            }
            if(dataset === "full"){
                fullScatterData.push({x:wealth,y:excess});
            }

            
}
