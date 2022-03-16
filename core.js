let locations = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

const dropdownContainer = d3.select("body")
    .append("div")
    .attr("id","dropdown-container")

let worldData = new Map();

let totalVaccinated = [];
let vaxData = [];

let listCountries = [];

var color;

let initCounter = 0;

let totalTests = [];
let totalHospitalisations = [];
let totalDeaths = [];


console.log("Building Data...")

d3.csv(locations, function(data) {
	return data;

}).then(function(data){

    //Loading data and creating relevant data structures

    let countryData = [];
    let totalData = [];

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

    let deaths = [];
  
    // worldData.forEach((value,key)=>locs.push(key));
    
    worldData.forEach(function(value){
        deaths.push(value[value.length-1].total_cases_per_million)
    })

    color = d3.scaleLinear().domain([d3.min(deaths),d3.max(deaths)]).range(["green", "orange"]);

    console.log("Ready...")

    let iso = "GBR";
    
    // REQUEST DATA
    d3.json('https://raw.githubusercontent.com/cd94/f20dv_lab3/master/custom.geo.json')
    .then(function(json) {
        update(json,color,worldData)
    });

    initialise(iso,768,"Vaccinations")
    
});

function getWorldData(){
    return worldData
}

function getColorScale(){
    return color
}


function initialise(iso, day, category){

    buildVaxData(iso);

    if(initCounter === 0){
        setupAxes(totalVaccinated, worldData.get(iso)[0].location, category);
        initCounter++;
    }

    if(category === "Vaccinations"){

        updateChart(totalVaccinated, worldData.get(iso)[0].location, iso, category);
    }
    if(category === "Tests"){
        buildTestData(iso);
        updateChart(totalTests, worldData.get(iso)[0].location, iso, category);
    }
    if(category === "Hospitalisations"){
        buildHospitalData(iso);
        updateChart(totalHospitalisations, worldData.get(iso)[0].location, iso, category);
    }
    if(category === "Deaths"){
        buildDeathData(iso);
        updateChart(totalDeaths, worldData.get(iso)[0].location, iso, category);
    }

    initialisePie(iso,day)

}

function initialisePie(iso,day){
    if(day === "max"){
        day = vaxData.length-1
    }
    
  
    let pieData = []
    pieData.push(vaxData[day].x,vaxData[day].y,vaxData[day].z);
     

    updatePie(vaxData,pieData,worldData.get(iso)[0].location,iso,day);
}

function multiCountry(list){
    listCountries.push(list)
    console.log(listCountries[0])
}

function buildMultiData(list){
    
}

function buildVaxData(iso){

    totalVaccinated = [];
    vaxData = [];

    let prevValuePV = 0;
    let prevValuePFV = 0;
    let prevValueUV = 0;

    // Building dataset for number of people vaccinated for line chart
    for(let i = 0; i<worldData.get(iso).length;i++){

        let totalvax = parseInt(worldData.get(iso)[i].people_vaccinated);
        let fullvax = parseInt(worldData.get(iso)[i].people_fully_vaccinated)
        
        if(isNaN(totalvax)){
            totalvax = prevValuePV;
        }  
        if(isNaN(fullvax)){
            fullvax = prevValuePFV;
        } 

        let unvax = parseInt(worldData.get(iso)[i].population) - totalvax

        if(isNaN(unvax)){
            unvax = prevValueUV;
        }  

        totalVaccinated.push({x:i,y:totalvax});
        vaxData.push({x:totalvax,y:fullvax,z:unvax});
        

        prevValuePV = totalvax;
        prevValuePFV = fullvax;
        prevValueUV = unvax;
    
    } 
}

function buildTestData(iso){
    totalTests = [];
    let prevValue = 0;
    // Building dataset for number of people vaccinated for line chart
    for(let i = 0; i<worldData.get(iso).length;i++){

        let totaltest = parseInt(worldData.get(iso)[i].total_tests);
        
        if(isNaN(totaltest)){
            totaltest = prevValue;
        }  
        totalTests.push({x:i,y:totaltest});
        prevValue = totaltest;
      
    } 
}

function buildHospitalData(iso){
    totalHospitalisations = [];
    let prevValue = 0;
    // Building dataset for number of people vaccinated for line chart
    for(let i = 0; i<worldData.get(iso).length;i++){

        let totalhosp = parseInt(worldData.get(iso)[i].hosp_patients);
        
        if(isNaN(totalhosp)){
            totalhosp = prevValue;
        }  
        totalHospitalisations.push({x:i,y:totalhosp});
        prevValue = totalhosp;
      
    } 
}

function buildDeathData(iso){
    totalDeaths = [];
    let prevValue = 0;
    // Building dataset for number of people vaccinated for line chart
    for(let i = 0; i<worldData.get(iso).length;i++){

        let totaldeath = parseInt(worldData.get(iso)[i].total_deaths);
        
        if(isNaN(totaldeath)){
            totaldeath = prevValue;
        }  
        totalDeaths.push({x:i,y:totaldeath});
        prevValue = totaldeath;
      
    } 
}





