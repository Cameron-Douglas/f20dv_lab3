// Modified from code example: https://www.d3indepth.com/geographic/

const width = 900;
const height = 650;

let selected = "Afghanistan";
let selectedISO = "AFG";

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
	.scale(140)
	.translate([450, 450])
	

let geoGenerator = d3.geoPath()
	.projection(projection);


function update(geojson) {
	let u = d3.select('.map')
		.selectAll('path')
		.data(geojson.features);

   
	u.enter()
		.append('path')
		.attr('d', geoGenerator)
        .attr("class",d=>{return d.properties.ISO_A3})
        .on('click', function(event,d,i){
            d3.select("#selected")  
                .attr("id","unselected");

            d3.select(this)
                .attr("id","selected");

            selected = d.properties.ADMIN 
            selectedISO = d.properties.ISO_A3
            console.log("Selected: " + selected + ", " + selectedISO)
            onSelection(selectedISO);
            changeSelected(selectedISO);
          
        })
		.on('mouseover', function(event,d,i){
            let centroid = geoGenerator.centroid(d);
            let tmp = [];

            d3.select(".country_label")
                .data(tmp)
                .exit()
                .remove()

            d3.select("svg").append("text")
                .attr("class","country_label")
                .text(d.properties.ADMIN)
                .attr("x",centroid[0])
                .attr("y",centroid[1])
                
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
d3.json('https://raw.githubusercontent.com/cd94/f20dv_lab3/master/countries.geo.json')
	.then(function(json) {
		update(json)
	});