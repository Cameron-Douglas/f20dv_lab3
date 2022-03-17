// Modified from code example: https://www.d3indepth.com/geographic/

const width = 650;
const height = 400;

const Data = getWorldData();

const radioOptions = ["Vaccinations","Tests","Hospitalisations","Deaths"];

const j = 0;

let callCount = 0;

let geo;

let selected = "United Kingdom";
let selectedISO = "GBR";

let countryList = [];


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


let projection = d3.geoMercator()
	.scale(95)
	.translate([320, 283])
	

let geoGenerator = d3.geoPath()
	.projection(projection);

function update(geojson,color,data,category,day) {

    if(geojson != "none"){
        geo = geojson
    }

    let arr = [];

    d3.select(".map_svg")
        .selectAll("path")
        .remove()

	var u = d3.select('.map')
		.selectAll('path')
		.data(geo.features);
    
    console.log(data)

	u.enter()
		.append('path')
		.attr('d', geoGenerator)
        .attr("id", d=>d.properties.iso_a3)
        .attr("class","unselected")
        .attr("fill",function(d){
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

                    if(thisColor === "rgb(0, 0, 0)"){
                        thisColor = "#aaa"
                    }
                }
               
                
                
            }
            return thisColor
            })
        .attr("stroke","steelblue");
        if(callCount === 0){
            d3.select("#GBR")
                .attr("class","selected");
            d3.select("#IRL")
                .attr("class","selected");
            callCount ++;
        }
    
        
    var brush = d3.select(".map_svg")
    .call(d3.brush()
    .extent([[0,0],[width,height]])
    .on("end",function(event){
        //console.log(event.selection)
        extent = event.selection
        //console.log(extent)
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

function isBrushed(brushArea,centroid,iso){
    var x0 = brushArea[0][0],
        x1 = brushArea[1][0],
        y0 = brushArea[0][1],
        y1 = brushArea[1][1]
    
    var x2 = centroid[0],
        y2 = centroid[1]
    
    var toClass = "unselected";


    if(x0 <= x2 && x2 <= x1 && y0 <= y2 && y2 <= y1){
        toClass = "selected";
        countryList.push(iso)
        
    } else{
        toClass = "unselected";
    }
   
    //countryList = []
    return toClass;
}
