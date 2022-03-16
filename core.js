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

let prevValue = 0;
let prevValuePV = 0;
let prevValuePFV = 0;
let prevValueUV = 0;

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

function multiCountry(list, category){

    if(list.length !== 0){
      
        listCountries = list;
    }

    totalVaccinated = [];
    totalTests = [];
    totalHospitalisations = [];
    totalDeaths = [];
    vaxData = [];
    
    prevValuePV = 0;
    prevValuePFV = 0;
    prevValueUV = 0; 

    prevValue = 0;


    if(category === "Vaccinations"){

        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildVaxData(listCountries[i])
            }
        // console.log(totalVaccinated)
        }
        updateChart(totalVaccinated,"Selection","iso",category)
    }
    if(category === "Tests"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildTestData(listCountries[i])
            }
       
        }
        updateChart(totalTests,"Selection","iso",category)
    }
    console.log(category)
    if(category === "Hospitalisations"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildHospitalData(listCountries[i])
            }
         
        }
        updateChart(totalHospitalisations,"Selection","iso",category)
    }
    if(category === "Deaths"){
        
        for(let i = 0; i<listCountries.length;i++){
            if(worldData.get(listCountries[i])!==undefined){
                buildDeathData(listCountries[i])
            }
         
        }
        updateChart(totalDeaths,"Selection","iso",category)
    }
}

function buildVaxData(iso){

   if(totalVaccinated.length === 0){
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
        
    } else{
        prevValuePV = 0;
        prevValuePFV = 0;
        prevValueUV = 0; 
        for(let j = 0; j<totalVaccinated.length;j++){
            //console.log(worldData.get(iso) == undefined)
            if(worldData.get(iso)[j] === undefined){
                totalvax = prevValuePV;
                totalVaccinated[j].y += totalvax;
            } else{
            let totalvax = parseInt(worldData.get(iso)[j].people_vaccinated);
            let fullvax = parseInt(worldData.get(iso)[j].people_fully_vaccinated)
            
            if(isNaN(totalvax)){
                totalvax = prevValuePV;
            }  
            if(isNaN(fullvax)){
                fullvax = prevValuePFV;
            } 
    
            let unvax = parseInt(worldData.get(iso)[j].population) - totalvax
    
            if(isNaN(unvax)){
                unvax = prevValueUV;
            }  
            //  console.log(totalVaccinated[j].y, totalvax)
            

            totalVaccinated[j].y += totalvax;
            vaxData[j].x += totalvax;
            vaxData[j].y += fullvax;
            vaxData[j].y += unvax;

            prevValuePV = totalvax;
            prevValuePFV = fullvax;
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
                //console.log(worldData.get(iso) == undefined)
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
                //console.log(worldData.get(iso) == undefined)
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





