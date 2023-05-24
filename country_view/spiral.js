// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#mySprial")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

function ConvertTemperature2Radious(date) {

    return r
}

function ConvertTDate2location(strDate) {
    tstamp = Date.parse(strDate)
    return {x:x, y:y}
}

//Read the data
d3.csv("https://raw.githubusercontent.com/lsps9150125/MIS588_Data_Visualize/main/GlobalLandTemperaturesByMajorCity.csv").then(function(data){

    // filter by country
    var Country = "Turkey";
    data = data.filter(function(d) {
        return d.Country == Country;
    })
    var sYear = 1800;
    var eYear = 1820;
    data = data.filter(function(d) {
        y = parseInt(d.dt) ;
        return (y > sYear && y < eYear);
    })

    var pointCount = data.length;
    var i, r;

    var x = [];
    var y = [];
    var z = [];
    var c = [];

    for(i = 0; i < pointCount; i++)
    {
        // things encode with temperature
        r = data[i].AverageTemperature + 1;
        if(r === '')
            continue;
        c.push(r);

        mon = parseInt(data[i].dt.split('-')[1])
        year = parseInt(data[i].dt.split('-')[0])
        // things endeo with date
        x.push(r * Math.cos(mon/6 * Math.PI) );
        y.push(r * Math.sin(mon/6 * Math.PI) );
        z.push((year-1755 + mon/12)/2);
    }
    var layout = {
        title: {
            text: Country,
            font: {
                family: 'Courier New, monospace',
                size: 70
            },
            yref: 'paper',
            automargin: true,
        },
        showlegend: false
    };

    Plotly.newPlot('mySprial', [{
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 0.7,
        line: {
            width: 10,
            color: c,
            colorscale: 'Inferno'} //color scale
    }],layout);
});