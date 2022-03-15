// Modified from code example: https://www.d3indepth.com/geographic/

const width = 750;
const height = 475;

const radioOptions = ["Vaccinations","Tests","Hospitalisations","Deaths"];

const j = 0;

let selected = "United Kingdom";
let selectedISO = "GBR";

d3.select("body")
    .append("div")
    .attr("class","map_container")
    
    .append("svg")
    .attr("width", width)
    .style("background-color","lightblue")
    .style("border-radius","24px")
    .attr("height",height)
        .append("g")
        .attr("class","map");


let projection = d3.geoMercator()
	.scale(110)
	.translate([375, 325])
	

let geoGenerator = d3.geoPath()
	.projection(projection);


function update(geojson) {
	let u = d3.select('.map')
		.selectAll('path')
		.data(geojson.features);

   
	u.enter()
		.append('path')
		.attr('d', geoGenerator)
        .attr("class",d=>{return d.properties.iso_a3})
        .on('click', function(event,d,i){
            // https://stackoverflow.com/questions/18005600/setting-a-color-for-click-event-on-a-d3-map
            d3.select("#selected")  
                .attr("id","unselected");

            d3.select(this)
                .attr("id","selected");
            
            

            selected = d.properties.name_long 
            selectedISO = d.properties.iso_a3
            console.log("Selected: " + selected + ", " + selectedISO)
            initialise(selectedISO,"max","Vaccinations");

            d3.select(".shape")
            .property("checked", function(d, i) { 
                return (i===j); 
            });
          
        })
		.on('mouseover', function(event,d,i){
            let centroid = geoGenerator.centroid(d);
            let tmp = [];
            console.log(d.properties.iso_a3)
            d3.select(".country_label")
                .data(tmp)
                .exit()
                .remove()

            if(d.properties.ISO_A3==="PRK"){
                d3.select("svg").append("text")
                    .attr("class","country_label")
                    .text(d.properties.name_long  + ": No Data")
                    .attr("x",width/2)
                    .attr("y",25)
                    .style("font-size","19px")
                    .style("text-decoration","underline")
            } else{
                d3.select("svg").append("text")
                .attr("class","country_label")
                .text(d.properties.name_long)
                .attr("x",width/2)
                .attr("y",25)
                .style("font-size","19px")
                .style("text-decoration","underline")
            }
                // .attr('transform', 'translate(' + centroid + ')');
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
       
}

// REQUEST DATA
d3.json('https://raw.githubusercontent.com/cd94/f20dv_lab3/master/custom.geo.json')
	.then(function(json) {
		update(json)
	});