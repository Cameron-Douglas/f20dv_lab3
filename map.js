// Modified from code example: https://www.d3indepth.com/geographic/


// Declaring global variables

const width = 650;
const height = 400;


let callCount = 0;

let geo;

let selected = "United Kingdom";
let selectedISO = "GBR";

let countryList = [];


// Append a div which is a container for the map
d3.select("body")
    .append("div")
    .attr("class","map_container")
    
    .append("svg")
    .attr("class","map_svg")
    .attr("width", width)
    .attr("height",height)
    .style("background-color","lightblue")
    .style("border-radius","24px")
        .append("g")
        .attr("class","map");


// Create a projection variable which defines which 2D projection of the earth to use, positions and scales the map
let projection = d3.geoMercator()
	.scale(95)
	.translate([320, 283])
	
// Create a generator which will be used to draw the paths with a given projection
let geoGenerator = d3.geoPath()
	.projection(projection);

// FUNCTION TO DRAW THE MAP
function update(geojson,color,data,category,day) {

    if(geojson != "none"){
        geo = geojson
    }

    // Enter and append new paths from the geoJSON data

	var u = d3.select('.map')
		.selectAll('path')
		.data(geo.features);

	u.enter()
		.append('path')
        .merge(u)
        .transition()
        .duration(500)
		.attr('d', geoGenerator)
        .attr("id", d=>d.properties.iso_a3)
        .attr("class","unselected")
        .attr("fill",function(d){

            // Based on the category and color sclae passed to the update function, color the paths on the map.

            let iso = d.properties.iso_a3;
            let thisColor;
            if(iso === undefined || data.get(iso) === undefined){
                thisColor = "#aaa"
            
            } else{
                let index;
                if(day === "max" || day > data.get(iso).length - 1){
                    index = data.get(iso).length - 1;
                } else{
                    index = day
                }
                if(category === "cpm"){
                    let tdpm = data.get(iso)[index].total_cases_per_million;
                    thisColor = color(tdpm);
                }
                if(category === "part"){
                    let vax = data.get(iso)[index].people_vaccinated_per_hundred;
                    thisColor = color(vax);
                }
                if(category === "un"){
                    
                    let un = data.get(iso)[index].people_vaccinated_per_hundred;
                    thisColor = color(un);

                    // If values are missing, this will cause the color scale to return black,
                    // for aesthetics I make it return grey insted.

                    if(thisColor === "rgb(0, 0, 0)"){
                        thisColor = "#aaa"
                    }
                }
            }
            return thisColor
            })
        .attr("stroke","steelblue");

        // Initialise the selected countries to be the UK and Ireland

        if(callCount === 0){
            d3.select("#GBR")
                .attr("class","selected");
            d3.select("#IRL")
                .attr("class","selected");
            callCount ++;
        }
    
    // Define the brush which will be used to select paths 
    // Modified from example found at: https://www.d3-graph-gallery.com/graph/interactivity_brush.html

    var brush = d3.select(".map_svg")
        .call(d3.brush()
        .extent([[0,0],[width,height]])
        .on("end",function(event){
            extent = event.selection
            if(extent != null){
                d3.select(".map")
                    .selectAll("path")
                    .attr("class", function(d){return isBrushed(extent,geoGenerator.centroid(d),d.properties.iso_a3)})
                
                multiCountry(countryList,"Vaccinations","max",true)
                setupOptions()
                countryList = [];
            }
        }));
} 

// Function to determine if a given centroid is contained within the brushing area

function isBrushed(brushArea,centroid,iso){

    // Four corners of the brush area
    var x0 = brushArea[0][0],
        x1 = brushArea[1][0],
        y0 = brushArea[0][1],
        y1 = brushArea[1][1]
    
    // Country centroid
    var x2 = centroid[0],
        y2 = centroid[1]
    
    var toClass = "unselected";

    // If the centroid lies within the brush area, set it's class to selected
    if(x0 <= x2 && x2 <= x1 && y0 <= y2 && y2 <= y1){
        toClass = "selected";
        countryList.push(iso)
        
    } else{
        toClass = "unselected";
    }
    return toClass;
}
