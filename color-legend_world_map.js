var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geoNaturalEarth1()
    .translate([width / 2, height / 2])
    .scale(width / 6.5);

var svg = d3.select("body").select("#map-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g");

// Define the color scale
var colorScale = d3.scaleLinear()
    .domain([0, 30])
    .range(["blue", "red"]);

// load and display the World
d3.json("https://raw.githubusercontent.com/sajdoann/HeatMapocalypse/main/data/world-110m2.json")
    .then(function (topology) {
        var slider = d3.select("#mySlider");
        var textbox = d3.select("#textbox");

        // load and display the cities
        d3.csv("AverageTemperatures30cities.csv")
            .then(function (data) {
                var circles;

                slider.on("input", function () {
                    var value = +this.value;
                    var year = Math.floor(value / 12) + 1743;
                    var month = (value % 12) + 1;
                    var monthString = ("0" + month).slice(-2);
                    var selectedYearMonth = year + "-" + monthString;
                    textbox.text("Year: " + year + ", Month: " + month).style("color", "black");

                    // Filter the data based on the selected year and month
                    var filteredData = data.filter(function (d) {
                        var dataYear = parseInt(d.yearmonth.substr(0, 4));
                        var dataMonth = parseInt(d.yearmonth.substr(5, 2));
                        return dataYear === year && dataMonth === month;
                    });

                    // Update the data binding for the circles
                    circles = g.selectAll("circle").data(filteredData);

                    circles.enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            return projection([+d.lon, +d.lat])[0];
                        })
                        .attr("cy", function (d) {
                            return projection([+d.lon, +d.lat])[1];
                        })
                        .attr("r", 5)
                        .style("opacity", 1)
                        .style("fill", function (d) {
                            return colorScale(+d.AverageTemperature);
                        });

                    circles.exit().remove();
                });

                // Update the existing circles' positions
                slider.on("change", function () {
                    circles
                        .attr("cx", function(d) {
                            return projection([+d.lon, +d.lat])[0];
                        })
                        .attr("cy", function(d) {
                            return projection([+d.lon, +d.lat])[1];
                        })
                        .style("fill", function(d) {
                            return colorScale(+d.AverageTemperature);
                        });
                });

                // Initialize with the default values
                slider.dispatch("input");
            });

        g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.countries).features)
            .join("path")
            .attr("d", path)
            .on("click", function(event, d) {
                console.log(d.id)
                // Change the page to the country view
                routie('/country?name=' + encodeURIComponent(d.id)); //srcElement.__data__.id)); comment id depricated version
            })
            .on("mouseover", function() {
                // Show the country name on hover
                d3.select(this).classed("hovered", true);
            })
            .on("mouseout", function() {
                // Hide the country name on mouseout
                d3.select(this).classed("hovered", false);
                svg.select(".country-label").remove();

            });

        // Define the color legend
        var legendData = d3.range(0, 31, 5); // Adjust the range and intervals as needed

        // Define the color legend
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20, " + (height - 250) + ")")
            .style("position", "fixed")
            .style("bottom", "20px")
            .style("left", "20px")
            .style("pointer-events", "none")
            .style("z-index", "9999");


        // Add color rectangles to the legend
        legend.selectAll("rect")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * 20;
            })
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", function(d) {
                return colorScale(d);
            });

        // Add text labels to the legend
        legend.selectAll("text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", 30)
            .attr("y", function(d, i) {
                return i * 20 + 10;
            })
            .style("font-size", "12px")
            .style("text-anchor", "start")
            .style("dominant-baseline", "middle")
            .text(function(d) {
                return d;
            });
    });
