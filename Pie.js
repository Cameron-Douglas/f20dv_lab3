
// Initialise SVG properties
    let pieWidth = 750,
        pieHeight = 300,
        radius = Math.min(pieWidth, pieHeight) / 2;

    let counter = 0;


    let fullData = [];

    let vaccinated = [];
    let fullVax = [];
    let unVax = [];

    // Initialise pie let#iable
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

    // Append path to the SVG using pie data
    function draw(dataset,country,iso,day){
            // Define color ranges
        let color =  d3.scaleOrdinal().domain(dataset).range(["YellowGreen", "MediumSeaGreen", "DarkOrange"]);
        let keys = ["Partially Vaccinated", "Fullly Vaccinated","Unvaccinated"];
        let keycolor =  d3.scaleOrdinal().domain(keys).range(["YellowGreen", "MediumSeaGreen", "DarkOrange"]);

        let path = pieSvg.selectAll("path")
        .data(pie(dataset))
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .on("mouseover",function(event,d,i){

            d3.select(this)
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('d',function(d){return d3.arc().innerRadius(50)
                     .outerRadius(110)(d)})
                .attr("stroke","#ffff")
                .attr("stroke-width","2px");

            pieSvg.append("text")
                .attr("x", 95)
                .attr("y", -70)
                .attr("class","pie_label")
                .text(d.data)
                .style("font-size", 18)
                .style("font-weight","bold")
                .style("text-decoration","underline")
            
         })
        .on("mouseleave",function(event,d,i){
            let arr = [];
           
            d3.selectAll(".pie_label")
                .data(arr)
                .exit()
                .remove()
            
            d3.select(this)
                .transition()
                .ease(d3.easeBounce)
                .duration(500)
                .attr('d',function(d){return d3.arc().innerRadius(50)
                    .outerRadius(100)(d)})
                    .attr("stroke","none");
        })
        .on("click",function(event,d,i){
            let index = d3.select(this)._groups[0][0].__data__.index
            
            if(index === 0){
                for(let i = 0; i<fullData.length; i++){
                    
                    vaccinated.push({x:i, y:fullData[i].x})
                    
                }
                updateChart(vaccinated, country, iso, "Partialy Vaccinated");
                vaccinated = [];
       
            }
            if(index === 1){
                for(let i = 0; i<fullData.length; i++){
                    
                    fullVax.push({x:i, y:fullData[i].y})
                    
                }
                updateChart(fullVax, country, iso, "Fully Vaccinated");
                fullVax = [];
            }
            if(index === 2){
                for(let i = 0; i<fullData.length; i++){
                    
                    unVax.push({x:i, y:fullData[i].z})
                    
                }
                updateChart(unVax, country, iso, "Un-Vaccinated");
                unVax = [];
            }
          
        })
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            let i = d3.interpolate(d.endAngle, d.startAngle);
            return function (t) {
            d.startAngle = i(t);
            return arc(d);
            }
        });

        pieSvg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
            .attr("cx", 75)
            .attr("cy", function(d,i){ return 90 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return keycolor(d)})

        pieSvg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", 95)
            .attr("y", function(d,i){ return 90 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

      
    }

    // Update function called on button press
    function updatePie(fullDataset,dataset,country,iso,day){

        fullData = fullDataset
    
        if(counter == 0){
            draw(dataset,country,day)
            let tmp = [];

            let v = pieSvg.selectAll(".pie_header")
                .data(tmp)
                .exit()
                .remove()

            pieSvg.append("text")
                .attr("x",-275)
                .attr("y",-120)
                .text("Vaccination proportion in " + country + " on day # " + day)
                .attr("class","pie_header")
                .style("font-size","19px");
        }
            // Create a new path
        if(counter>0){
            
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

            let tmp = [];

            let v = pieSvg.selectAll(".pie_header")
                .data(tmp)
                .exit()
                .remove()

            pieSvg.append("text")
                .attr("x",-275)
                .attr("y",-120)
                .text("Vaccination proportion in " + country + " on day # " + day)
                .attr("class","pie_header")
                .style("font-size","19px");
            }
            counter++;
    }


    
