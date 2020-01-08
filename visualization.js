

function downloadJSON( items, fileName) {
 

const jsonObject = JSON.stringify(items);

const exportName = fileName + ".json" || "export.json";

const blob = new Blob([jsonObject], { type: "text/json;charset=utf-8;" });
 if (navigator.msSaveBlob) {
  navigator.msSaveBlob(blob, exportName);
 } else {
  const link = document.createElement("a");
  if (link.download !== undefined) {
   const url = URL.createObjectURL(blob);
   link.setAttribute("href", url);
   link.setAttribute("download", exportName);
   link.style.visibility = "hidden";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
  }
 }
}


//Función que parsea los datos calculando el recuento de acuerdos por país (Con)
function getAgreementsCountByCon(filteredData)
{
    var agreementsCountByCon = d3.nest()
    .key(function(d) { return d.Con; })
    .rollup(function(v) { return v.length; })
    .entries(filteredData);

    console.log(agreementsCountByCon);

    return agreementsCountByCon;
}

//Función que parsea los datos calculando el recuento de acuerdos por año (Year)
function getAgreementsCountByYear(filteredData)
{
    var agreementsCountByYear = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return v.length; })
    .entries(filteredData);

    console.log(agreementsCountByYear);

    return agreementsCountByYear;
}

//Función para devolver valores únicos:
function unique(x) {
    return x.reverse().filter(function (e, i, x) {return x.indexOf(e, i+1) === -1;}).reverse();
}

//Función que abre otra pestaña con la información del país seleccionado
function openNewTab(country)
{
    window.open("country_linechart.html?country="+country+"&type="+globalSelectedType, '_blank');
}

function selectOption(val, s)
{
    var sel = document.getElementById(s);

    var opts = sel.options;
    for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == val) {
        sel.selectedIndex = j;
        break;
        }
    }

}

function dateToYear(){
     //Primero de todo formatear la fecha para coger solo el AÑO:
    globalData.forEach(function(d) {
    d.Year = d.Dat.split("-")[0];
    });
}
function loadYears(sel){

    var years = unique(globalData.map(function(d){return d.Year}))
    //Ordenar los años en orden descendiente
    years.sort((a, b) => b - a);
    //Mostrar años en el desplegable:
    var selYear = document.getElementById(sel);

    //Se añade manualmente la opción "All"
    var option = document.createElement("option");
    option.value = "All";
    option.text = "All";
    selYear.appendChild(option);

    for (var i = 0; i < years.length; i++) {
        var option = document.createElement("option");
        option.value = years[i];
        option.text = years[i];
        selYear.appendChild(option);
    }
}
function loadRegions(sel){
    var regions = unique(globalData.map(function(d){return d.Reg}))
    //Mostrar regiones en el desplegable:
    var selRegion = document.getElementById(sel);

    //Se añade manualmente la opción "All"
    var option = document.createElement("option");
    option.value = "All";
    option.text = "All";
    selRegion.appendChild(option);

    for (var i = 0; i < regions.length; i++) {
        var option = document.createElement("option");
        option.value = regions[i];
        option.text = regions[i];
        selRegion.appendChild(option);
    }
}

function loadCountries(sel){

    var countries = unique(globalData.map(function(d){return d.Con}))
    //Mostrar años en el desplegable:
    var selCountry = document.getElementById(sel);

    //Se añade manualmente la opción "All"
    var option = document.createElement("option");
    option.value = "All";
    option.text = "All";
    selCountry.appendChild(option);

    for (var i = 0; i < countries.length; i++) {
        var option = document.createElement("option");
        option.value = countries[i];
        option.text = countries[i];
        selCountry.appendChild(option);
    }
}

function showPieChartContp(fdata, cont)
{
    
    
    var agreementsCountType = d3.nest()
    .key(function(d) { return d.Contp; })
    .rollup(function(v) { return v.length; })
    .entries(fdata);
    

    var container = document.getElementById(cont);
    container.innerHTML = "";
    var textnode = document.createTextNode("Conflict Type");         // Create a text node
    container.append(textnode); 

    
    pieChart('#'+cont, agreementsCountType);
    
 

}


//PIE CHART:
function showPieChartStage(fdata,cont)
{  
   
       var agreementsCountType = d3.nest()
    .key(function(d) { return d.Stage; })
    .rollup(function(v) { return v.length; })
    .entries(fdata); 

    var container = document.getElementById(cont);
    container.innerHTML = "";

    var textnode = document.createTextNode("Stage");         // Create a text node
    container.append(textnode); 
    pieChart('#'+cont, agreementsCountType);
 

}


const pieChart = (selector, data) => {
  const size = 200;
  const fourth = size / 4;
  const half = size / 2;
  const labelOffset = fourth * 1.4;
  const total = data.reduce((acc, cur) => acc + cur.values, 0);
  const container = d3.select(selector);
  const statuses = unique(data.map(function(d){return d.key}))
  
  
  const chart = container.append('svg')
    .style('width', '100%')
    .attr('viewBox', `0 0 ${size} ${size}`);
  
  const plotArea = chart.append('g')
    .attr('transform', `translate(${half}, ${half})`);
  
  const color = d3.scale.ordinal()
    .domain(statuses)
    .range(["#FDFD96", "#D36E70", "#BDECB6", "#3B83BD", "#FF8000","#EA899A",  "#6C4675"]);

    const pie = d3.layout.pie()
    .sort(null)
    .value(d => d.values);
  
  const arcs = pie(data);
  
  const arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(fourth);
  
  const arcLabel = d3.svg.arc()
    .innerRadius(labelOffset)
    .outerRadius(labelOffset);
  
  plotArea.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('fill', d => color(d.data.key))
    .attr('stroke', 'white')
    .attr('d', arc);
  
  const labels = plotArea.selectAll('text')
    .data(arcs)
    .enter()
    .append('text')
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'middle')
    .style('font-size', '5px')
    .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
    
  labels.append('tspan')
    .attr('y', '-0.6em')
    .attr('x', 0)
    .style('font-weight', 'bold')
    .text(d => `${d.data.key}`);
  
  labels.append('tspan')
    .attr('y', '0.6em')
    .attr('x', 0)
    .text(d => `${d.data.values} (${Math.round(d.data.values / total * 100)}%)`);
};

//HORIZONTAL BAR CHART:

function showHorizontalBars(agreementsCountByCon)
{

var container =document.getElementById("dataviz");
container.innerHTML = ""

    var div = d3.select("#dataviz").append("div").attr("class", "toolTip");
    

    var axisMargin = 20,
            margin = 40,
            valueMargin = 4,
            width = parseInt(d3.select('body').style('width'), 10),
            height = parseInt(d3.select('body').style('height'), 10),
            barHeight = (height-axisMargin-margin*2)* 0.4/agreementsCountByCon.length,
            barPadding = (height-axisMargin-margin*2)*0.6/agreementsCountByCon.length,
            agreementsCountByCon, bar, svg, scale, xAxis, labelWidth = 0;

    max = d3.max(agreementsCountByCon, function(d) { return d.values; });

    svg = d3.select("#dataviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


    bar = svg.selectAll("g")
            .data(agreementsCountByCon)
            .enter()
            .append("g");

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.key.substring(0,25)+(d.key.length>25?'...':''); //recortar el texto.
            }).each(function() {
        labelWidth = Math.ceil(150);
    });

    scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2*margin + axisMargin)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .attr("height", barHeight)
            .attr("width", function(d){
                return scale(d.values);
            });

    bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.values);
            })
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.values));
            });

    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.key)+"<br>"+(d.values));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });
    bar
            .on("click", function(d){
                openNewTab(d.key);
            });

    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);

}


//LINEAR CHART:

function showLineChart(data)
{

    var container =document.getElementById("dataviz");
container.innerHTML = ""


            // Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
 
var bisectDate = d3.bisector(function(d) { return d.key; }).left;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
 
// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(data.length);
 
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
 
// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.values); });
    
// Adds the svg canvas
var svg = d3.select("#dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.values; })]);
 

    svg.append("path")  
        .attr("class", "line")
        .attr("d", valueline(data));
 
 
    svg.append("g")     
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
 
  
    svg.append("g")     
        .attr("class", "y axis")
        .call(yAxis);
 
    var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .text("Count: ");

        focus.append("text")
            .attr("class", "tooltip-likes")
            .attr("x", 60)
            .attr("y", 18);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        //Al mover el ratón por encima, muestra el año-valor:
         function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
                console.log(i);
            focus.attr("transform", "translate(" + x(d.key) + "," + y(d.values) + ")");
            focus.select(".tooltip-date").text(d.key);
            focus.select(".tooltip-likes").text(d.values);
        }

}


