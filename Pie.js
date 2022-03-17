
// Initialise SVG properties
    let pieWidth = 650,
        pieHeight = 275,
        radius = Math.min(pieWidth, pieHeight) / 2;

// Declare global varibales

    let counter = 0;

    let population = 0;

    let fullData = [];

    let worlddata;

    let vaccinated = [];
    let fullVax = [];
    let unVax = [];

    let currCountry;

    let currDay;

    let colorPart = d3.scaleLinear();
    

    // Initialise pie variable
    let pie = d3.pie()
        .sort(null);

    // Initialise arc varible
    let arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 50);

    // Append SVG
    let pieSvg = d3.select("body")
    .append("div")
    .attr("class","pie_container")
    .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

    // Update the global instance of country
    function updateCountry(country){
        currCountry = country;
    }

    // Append path to the SVG using pie data
    function draw(dataset,country){

        updateCountry(country)

        // Define color ranges
        let color =  d3.scaleOrdinal().domain(dataset).range(["YellowGreen","Orange"]);
        let keys = ["Vaccinated","Unvaccinated"];
        let keycolor =  d3.scaleOrdinal().domain(keys).range(["YellowGreen" , "Orange"]);

        // Append pie paths
        let path = pieSvg.selectAll("path")
            .data(pie(dataset))
            .enter().append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc)
            .on("mouseover",function(event,d,i){

                // Grow the segment on mouseover
                d3.select(this)
                    .transition()
                    .ease(d3.easeBounce)
                    .duration(1000)
                    .attr('d',function(d){return d3.arc().innerRadius(radius - 100)
                        .outerRadius((radius - 50) + 10)(d)})
                    .attr("stroke","#ffff")
                    .attr("stroke-width","2px");
                
                // Append label showing the percentage for that segment
                pieSvg
                    .append("text")
                    .attr("x", 95)
                    .attr("y", -70)
                    .attr("class","pie_label")
                    .text(function(){
                        //console.log(population)
                        let percentage = Math.round(d.data/population*100);
                        return percentage+"%"})
                    .style("font-size", 18)
                    .style("font-weight","bold")
                    .attr("fill",function(){
                        let thisColor = "#aaa"
                        if(d.index === 0){
                            thisColor = "YellowGreen"
                        }
                        if(d.index === 1){
                            thisColor = "Orange"
                        }
                        return thisColor
                    })
                
            })
            .on("mouseleave",function(event,d,i){

                // Remove lables
                let arr = [];
            
                d3.selectAll(".pie_label")
                    .data(arr)
                    .exit()
                    .remove()
                
                // Re-set the size of the segment
                d3.select(this)
                    .transition()
                    .ease(d3.easeBounce)
                    .duration(500)
                    .attr('d',function(d){return d3.arc().innerRadius(radius - 100)
                        .outerRadius(radius - 50)(d)})
                        .attr("stroke","none");
            })
            .on("click",function(event,d,i){

                // Get the index of the segment selected
                let index = d3.select(this)._groups[0][0].__data__.index

                setupOptions()
                
                // Index 0 is for the Vaccinated portion, if this is clicked...
                if(index === 0){
                    for(let i = 0; i<fullData.length; i++){

                        //... Build dataset ... 
                        vaccinated.push({x:i, y:fullData[i].x})
                        
                    }
                    //... Update the line chart and the coloring of the map ...
                    updateChart(vaccinated, currCountry, "Vaccinations",colorPart,worlddata);
                    update("none",colorPart,worlddata,"part",currDay);

                    //... and update the coloring label displayed under the map
                    d3.select(".color_container")
                        .selectAll("text")
                        .remove()

                    d3.select(".color_container")
                        .append("text")
                        .style("font-size","18px")
                        .text("   Colored By: Vaccinations Per Hundred People")
                    vaccinated = [];
        
                }
                // Repeat the same as above but for unvaccinated
                if(index === 1){
                    for(let i = 0; i<fullData.length; i++){
                        
                        unVax.push({x:i, y:fullData[i].y})
                        
                    }
                    updateChart(unVax, currCountry, "Un-Vaccinated",colorPart,worlddata);

                    /*
                    ... Note the color scale can be the same as having a high proportion of vaccinated
                    is the same as having a low proportion of unvaccinated. i.e. vax and unvax are inverses of each other
                    */

                    update("none",colorPart,worlddata,"un",currDay);

                    d3.select(".color_container")
                        .selectAll("text")
                        .remove()

                    d3.select(".color_container")
                        .append("text")
                        .style("font-size","18px")
                        .text("   Colored By: Vaccinations Per Hundred People")
                    unVax = [];
                }
            
            })

            // Smoothly interpolate between the old angle and the new angle
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                let i = d3.interpolate(d.endAngle, d.startAngle);
                return function (t) {
                d.startAngle = i(t);
                return arc(d);
                }
            });

        // Append a legend to the Pie container 
        // Found from: https://www.d3-graph-gallery.com/graph/custom_legend.html 

        pieSvg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
            .attr("cx", 90)
            .attr("cy", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return keycolor(d)})

        pieSvg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", 115)
            .attr("y", function(d,i){ return 60 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
      
    }

    // Update function called on region change from the map, or date change from the line chart
    function updatePie(worldData,fullDataset,dataset,country,day){

        // Keep track of the day, country and population
        currDay = day;
        updateCountry(country);
        population = 0;
        population += dataset[0];
        population += dataset[1];

        // Give values to datasets
        fullData = fullDataset

        worlddata = worldData


        // Create the color scale to pass to the map in the onclick defined above
        let part = []

        worldData.forEach(function(value){
            part.push(value[value.length-1].people_vaccinated_per_hundred)
            
        })
        colorPart = d3.scaleLinear().domain([d3.min(part),d3.max(part)]).range(["orange", "green"]);
        
        // If this is the first build, call draw to initialise the pie chart and add headers... 
        if(counter == 0){
            draw(dataset,currCountry)
            let tmp = [];

            let v = pieSvg.selectAll(".pie_header")
                .data(tmp)
                .exit()
                .remove()

            pieSvg.append("text")
                .attr("x",-275)
                .attr("y",-120)
                .text("Vaccination proportion in " + currCountry + " on day # " + day)
                .attr("class","pie_header")
                .style("font-size","19px");
        }
        //...Else, update the pie chart and transition the new data in 
        if(counter>0){
            
            // Use attrTween to transition between the old and new paths
            let path = pieSvg.selectAll("path")
                .data(pie(dataset))
                .transition()
                .duration(1000)
                .attrTween("d", function(d){

                    //https://bl.ocks.org/jonsadka/fa05f8d53d4e8b5f262e

                    var i = d3.interpolate(this._current, d);
                    this._current = i(0);
                    return function(t) {
                        return arc(i(t));
                    };
                });
            
            // remove old artifacts
            let tmp = [];

            let v = pieSvg.selectAll(".pie_header")
                .data(tmp)
                .exit()
                .remove()

            // Update the pie chart header
            pieSvg.append("text")
                .attr("x",-275)
                .attr("y",-120)
                .text("Vaccination proportion in " + currCountry + " on day # " + day)
                .attr("class","pie_header")
                .style("font-size","19px");
            }
            counter++;
    }
