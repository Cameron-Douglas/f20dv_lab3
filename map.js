// Modified from code example: https://www.d3indepth.com/geographic/

const width = 750;
const height = 475;

const Data = getWorldData();

const radioOptions = ["Vaccinations","Tests","Hospitalisations","Deaths"];

const j = 0;


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
	.scale(110)
	.translate([375, 325])
	

let geoGenerator = d3.geoPath()
	.projection(projection);

// let checkbox = ["Single","Area"];

// let inputForm = d3.select(".map_container")
//     .append("form")

// inputs = inputForm.selectAll("label")
//     .data(checkbox)
//     .enter()
//     .append("div")
//         .attr("class","selectionType")
//         .append("text")
//         .text(function(d) {return d;})
//         .append("input")
//         .attr("type","radio")
//         .attr("class","shape")
//         .attr("name","mode")
//         .property("checked", function(d, i) { 
//             return (i===j); 
//         })
//         .attr("value", function(d, i) {return i;})
    
// let checkSelection = d3.select(".selectionType");

// checkSelection.on("change",function(event){
//     //change(event.target.__data__)
//     area();
//     console.log("change")
// });




function update(geojson,color,data) {
   
	var u = d3.select('.map')
		.selectAll('path')
		.data(geojson.features);

   
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
                let index = data.get(iso).length-1
                let tdpm = data.get(iso)[index].total_cases_per_million;
                thisColor = color(tdpm)
            }
            return thisColor
            })
        .attr("stroke","steelblue")
        .on('click', function(event,d,i){

            // https://stackoverflow.com/questions/18005600/setting-a-color-for-click-event-on-a-d3-map

            d3.select(".selected")  
                .attr("class","unselected");

            d3.select(this)
                .attr("class","selected");
            
            if(d.properties.iso_a3 === undefined || data.get(d.properties.iso_a3) === undefined){

            } else{
                selected = d.properties.name_long 
                selectedISO = d.properties.iso_a3
                initialise(selectedISO,"max","Vaccinations");

                d3.select(".shape")
                .property("checked", function(d, i) { 
                    return (i===j); 
                });
            }
        })
		.on('mouseover', function(event,d,i){
            let centroid = geoGenerator.centroid(d);
            let tmp = [];
        
            d3.select(".country_label")
                .data(tmp)
                .exit()
                .remove()


            if(d.properties.iso_a3 === undefined || data.get(d.properties.iso_a3) === undefined){
                d3.select("svg").append("text")
                    .attr("class","country_label")
                    .text(d.properties.name_long + ": No Data")
            } else{
                d3.select("svg").append("text")
                .attr("class","country_label")
                .text(d.properties.name_long)
            }

            d3.selectAll(".country_label")
            .attr("x",width/2)
                .attr("y",25)
                .style("font-size","19px")
                .style("text-decoration","underline")
        })
        .on('mouseleave', function(event,d,i){
            
            let tmp = [];
            
            d3.select(".country_label")
                .data(tmp)
                .exit()
                .remove()
        })
        ;
        d3.select(".GBR")
            .attr("id","selected");
    
        
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
            
            multiCountry(countryList,"Vaccinations")
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
