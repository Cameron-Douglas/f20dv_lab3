
// Initialise SVG properties
    let pieWidth = 662,
        pieHeight = 275,
        radius = Math.min(pieWidth, pieHeight) / 2;

    let counter = 0;

    let population = 0;

    let fullData = [];

    let vaccinated = [];
    let fullVax = [];
    let unVax = [];

    let currCountry;

    let colorPart = d3.scaleLinear();
    let colorFull = d3.scaleLinear(); 
    let colorUn = d3.scaleLinear();

    let updateJSON;

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

    function updateCountry(country){
        currCountry = country;
    }

    // Append path to the SVG using pie data
    function draw(dataset,country,iso,day){

        updateCountry(country)
            // Define color ranges
        let color =  d3.scaleOrdinal().domain(dataset).range(["YellowGreen","Orange"]);
        let keys = ["Vaccinated","Unvaccinated"];
        let keycolor =  d3.scaleOrdinal().domain(keys).range(["YellowGreen" , "Orange"]);

        let path = pieSvg.selectAll("path")
        .data(pie(dataset))
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .on("mouseover",function(event,d,i){

            console.log(d.index)

            d3.select(this)
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('d',function(d){return d3.arc().innerRadius(50)
                     .outerRadius(110)(d)})
                .attr("stroke","#ffff")
                .attr("stroke-width","2px");

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

            setupOptions()
            
            if(index === 0){
                for(let i = 0; i<fullData.length; i++){
                    
                    vaccinated.push({x:i, y:fullData[i].x})
                    
                }
                updateChart(vaccinated, currCountry, iso, "Vaccinations");
                // update(updateJSON,colorPart,fullData,"part",day);
                vaccinated = [];
       
            }
            if(index === 1){
                for(let i = 0; i<fullData.length; i++){
                    
                    unVax.push({x:i, y:fullData[i].y})
                    
                }
                updateChart(unVax, currCountry, iso, "Un-Vaccinated");
                // update(updateJSON,colorUn,fullData,"un",day);
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
    function updatePie(worldData,fullDataset,dataset,country,iso,day,json){

        updateJSON = json

        updateCountry(country);
        population = 0;

        population += dataset[0];
        population += dataset[1];

        fullData = fullDataset

        let part = []
        let full = []
        let un = []

        // worldData.forEach(function(value){
        //     console.log(value)
        //     part.push(value[value.length-1].people_vaccinated)
        //     full.push(value[value.length-1].people_fully_vaccinated)
        //     un.push(value[value.length-1].population - value[value.length-1].people_vaccinated)
        // })
        // colorPart = d3.scaleLinear().domain([d3.min(part),d3.max(part)]).range(["green", "orange"]);
        // colorFull = d3.scaleLinear().domain([d3.min(full),d3.max(full)]).range(["green", "orange"]);
        // colorUn = d3.scaleLinear().domain([d3.min(un),d3.max(un)]).range(["green", "orange"]);
    
        if(counter == 0){
            draw(dataset,currCountry,day)
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
                .text("Vaccination proportion in " + currCountry + " on day # " + day)
                .attr("class","pie_header")
                .style("font-size","19px");
            }
            counter++;
    }


    
