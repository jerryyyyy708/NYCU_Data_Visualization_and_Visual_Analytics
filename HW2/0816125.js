//source: https://d3-graph-gallery.com/graph/parallel_basic.html

//initialize
axis1 = "axis1";
axis2 = "axis2";
axis3 = "axis3";
axis4 = "axis4";
title = "Please Select the Attributes";

const svg = d3.select("svg");
const margin = { top: 60, right: 30, bottom: 80, left: 0 };
const width = parseFloat(svg.attr("width")) - margin.left - margin.right; // str to float
const height = +svg.attr("height") - margin.top - margin.bottom; // short parseFloat
var g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

g.append("text")
  .text(title)
  .attr("y", "-30")
  .attr("x", `${(width - margin.left - margin.right) / 2}`)
  .attr("text-anchor", "middle")
  .attr("font-size", "2em")
  .attr("font-weight", "bold");


attributes = [axis1, axis2, axis3, axis4];

var y = {};
for (i in attributes) {
  scale = attributes[i];
  y[scale] = d3.scaleLinear().range([height, 0]);
}

// create the X scale
x = d3.scalePoint().range([0, width]).padding(1).domain(attributes);

//xAxis
g.selectAll("xAxis")
  .data(attributes)
  .enter()
  .append("g")
  .attr("transform", d=>{ 
    return `translate(${x(d)})`
  })
  .each(function (d) {
    d3.select(this).call(d3.axisLeft().scale(y[d]));
  })
  .append("text")
  .style("text-anchor", "middle")
  .attr("y", -9)
  .text(d=>d)
  .style("fill", "black");


const filter = document.getElementById("filter");
filter.onclick = () => {
  //get x y axis label
  admin = false//backdoor for debug
  axis1 = document.getElementById("axis-1").value;
  axis2 = document.getElementById("axis-2").value;
  axis3 = document.getElementById("axis-3").value;
  axis4 = document.getElementById("axis-4").value;
  if (axis1 === "" || axis2 === "" || axis3 === "" || axis4 === "") {

    if(admin){// for debug
      axis1 = "petal length";
      axis2 = "petal width";
      axis3 = "sepal length";
      axis4 = "sepal width";
    }
    else{
      alert("please select attribute for all axis");
      return false;
    }
  }
  const axises = new Set();
  axises.add(axis1);
  axises.add(axis2);
  axises.add(axis3);
  axises.add(axis4);

  if (axises.size < 4) {
    alert("please choose different attributes for each axis");
    return false;
  }

  //clear all things in svg
  svg.selectAll("*").remove();

  title = "Parallel Coordinate Plots";

  var g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("text")
    .text(title)
    .attr("y", "-30")
    .attr("x", `${(width - margin.left - margin.right) / 2}`)
    .attr("text-anchor", "middle")
    .attr("font-size", "2em")
    .attr("font-weight", "bold");

  d3.csv("iris.csv").then((data) => {
    data.forEach((d) => {
      d["petal length"] = +d["petal length"];
      d["petal width"] = +d["petal width"];
      d["sepal length"] = +d["sepal length"];
      d["sepal width"] = +d["sepal width"];
    });
    data = data.filter(function (d) {
      //clear weird 0,0 point
      if (d["petal length"] === 0) return false;
      return true;
    });
    

    attributes = [axis1, axis2, axis3, axis4]; 
    var y = {};
    //y scales
    for (i in attributes) {
      scale = attributes[i];
      y[scale] = d3.scaleLinear().domain(d3.extent(data, d=>d[scale]))
        .range([height, 0]);
    }

    //x scale
    x = d3.scalePoint().range([0, width]).padding(1).domain(attributes);
    
    //lines
    g.selectAll("lines")
      .data(data)
      .enter()
      .append("path")
      .attr("d", d => d3.line()(
        attributes.map( p => {return [x(p), y[p](d[p])]})
        )
      )
      .style("fill", "none")
      .style("stroke", (d) => {
        return d.class === "Iris-setosa"
          ? "blue"
          : d.class === "Iris-versicolor"
          ? "red"
          : "green";
      })
      .style("opacity", 0.35);

    //x axis
    g.selectAll("xAxis")
      .data(attributes)
      .enter()
      .append("g")
      .attr("transform", d=>{ 
        return `translate(${x(d)})`
      })
      .each(function (d) {
        d3.select(this).call(d3.axisLeft().scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(d => d)
      .style("fill", "black");


    svg
      .append("line")
      .attr("x1", width - margin.right - 125)
      .attr("x2", width - margin.right - 100)
      .attr("y1", 65)
      .attr("y2", 65)
      .style("stroke", "blue");
    svg
      .append("line")
      .attr("x1", width - margin.right - 125)
      .attr("x2", width - margin.right - 100)
      .attr("y1", 95)
      .attr("y2", 95)
      .style("stroke", "red");
    svg
      .append("line")
      .attr("x1", width - margin.right - 125)
      .attr("x2", width - margin.right - 100)
      .attr("y1", 125)
      .attr("y2", 125)
      .style("stroke", "green");
    svg
      .append("text")
      .attr("x", width - margin.right - 90)
      .attr("y", 65)
      .text("Iris-setosa")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", width - margin.right - 90)
      .attr("y", 95)
      .text("Iris-versicolor")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", width - margin.right - 90)
      .attr("y", 125)
      .text("Iris-virginica")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  });
};
