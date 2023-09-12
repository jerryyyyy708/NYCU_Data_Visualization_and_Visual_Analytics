//可改良: 自動把所有str轉float(不用一個一個自己改) innerWidthHeight 自動依class分顏色(讓他可以應用到各個資料集)

//https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
const filter = document.getElementById('filter') //get button

// initialize svg
const svg = d3.select("svg");
const width = parseFloat(svg.attr("width")); // str to float
const height = +svg.attr("height"); // short parseFloat

const title = `Please Select Two Attributes`
const margin = { top:60, right:120, bottom:80, left:80}

//設定X、Y軸的數值範圍
const xScale = d3.scaleLinear()
    .domain([0.0,7.0])
    .range([0,width-margin.left-margin.right])
    .nice()

const yScale = d3.scaleLinear()
    .domain([5.0,0.0])
    .range([0,height-margin.top-margin.bottom])
    .nice()

//svg裡的各種東西的群組
const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

//標題
g.append('text')
    .text(title)
    .attr('y','-20')
    .attr('x',`${(width-margin.left-margin.right)/2}`)
    .attr('text-anchor', 'middle')
    .attr('font-size','2em')
    .attr('font-weight','bold')

//setting axis
const xAxis = d3.axisBottom(xScale)
    .tickSize(-(height-margin.top-margin.bottom))
    .tickPadding(15)
const yAxis = d3.axisLeft(yScale)
    .tickSize(-(width-margin.left - margin.right))
    .tickPadding(15)

//put axis into group
const xAxisG = g.append('g').call(xAxis)
    .attr("transform", `translate(0,${height-margin.top-margin.bottom})`)
    .style("font-size","1.2em")
    
    
const yAxisG = g.append('g').call(yAxis)
    .style("font-size","1.2em")
    //.selectAll(".tick line").remove();

xAxisG.select('.domain').remove()
yAxisG.select('.domain').remove()

xAxisG.selectAll('.tick line')
    .style('color',"#8E8883")
yAxisG.selectAll('.tick line')
    .style('color',"#8E8883")

filter.onclick = () => {
    //get x y axis label
    const xLabel = document.getElementById('x-axis').value
    const yLabel = document.getElementById('y-axis').value
    console.log(xLabel, yLabel)
    if(xLabel === '' || yLabel === ''){
        alert('please select attribute for both axises')
        return false
    }
    else if(xLabel === yLabel){
        alert('please choose different attributes')
        return false
    }
    
    //clear all things in svg
    svg.selectAll("*").remove();

    const render = (data,xLabel,yLabel) => {
        const title = `Iris Visualize: ${xLabel} v.s. ${yLabel}`
        const xValue = data => data[xLabel]
        const yValue = data => data[yLabel]
        const margin = { top:60, right:120, bottom:80, left:80}
        
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data,xValue))
            .range([0,width-margin.left-margin.right])
            .nice()
            
        
        const yScale = d3.scaleLinear()
            .domain([d3.max(data,yValue),d3.min(data,yValue)])
            .range([0,height-margin.top-margin.bottom])
            .nice()
        
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
        
        g.append('text')
            .text(title)
            .attr('y','-20')
            .attr('x',`${(width-margin.left-margin.right)/2}`)
            .attr('text-anchor', 'middle')
            .attr('font-size','2em')
            .attr('font-weight','bold')
        
        //用scale 來設定axis
        const xAxis = d3.axisBottom(xScale)
            .tickSize(-(height-margin.top-margin.bottom))
            .tickPadding(15)
        const yAxis = d3.axisLeft(yScale)
            .tickSize(-(width-margin.left - margin.right))
            .tickPadding(15)

        //把axis加到scale
        const xAxisG = g.append('g').call(xAxis)
            .attr("transform", `translate(0,${height-margin.top-margin.bottom})`)
            .style("font-size","1.2em")
            
            
        const yAxisG = g.append('g').call(yAxis)
            .style("font-size","1.2em")
            //.selectAll(".tick line").remove();
        
        xAxisG.select('.domain').remove()
        yAxisG.select('.domain').remove()
        
        xAxisG.selectAll('.tick line')
            .style('color',"#8E8883")
        yAxisG.selectAll('.tick line')
            .style('color',"#8E8883")
        
        //x,y axis title
        xAxisG.append('text')
            .attr('y',50)
            .attr('x',(width - margin.left - margin.right)/2)
            .attr('fill','black')
            .text(xLabel)

        yAxisG.append('text')
        .attr('x',-(height - margin.top - margin.bottom)/2)
        .attr('y',-50)
        .attr('text-anchor','middle')
        .attr('fill','black')
        .text(yLabel)
        .attr('transform','rotate(270)')
        
        //data points
        console.log(data)
        g.selectAll('circle').data(data)
            .enter().append("circle")
            .attr('cx',data => xScale(data[xLabel]))
            .attr('cy',data => yScale(data[yLabel]))
            .attr('r',7)
            .attr('opacity', 0.5)
            .attr('fill',d => {
                return d.class === 'Iris-setosa' ? 'blue' : d.class === 'Iris-versicolor' ? 'red' : 'green'
            })
        
        //legend
        svg.append("circle").attr("cx",width-margin.right + 15).attr("cy",65).attr("r", 6).style("fill", "blue")
        svg.append("circle").attr("cx",width-margin.right + 15).attr("cy",95).attr("r", 6).style("fill", "red")
        svg.append("circle").attr("cx",width-margin.right + 15).attr("cy",125).attr("r", 6).style("fill", "green")
        svg.append("text").attr("x", width-margin.right+25).attr("y", 65).text("Iris-setosa").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-margin.right+25).attr("y", 95).text("Iris-versicolor").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-margin.right+25).attr("y", 125).text("Iris-virginica").style("font-size", "15px").attr("alignment-baseline","middle")
    }

    d3.csv("iris.csv").then(data => {
        data.forEach(d=>{
            //transform into float
            d['petal length'] = +d['petal length'];
            d['petal width'] = +d['petal width'];
            d['sepal length'] = +d['sepal length'];
            d['sepal width'] = +d['sepal width'];
        })
        //https://stackoverflow.com/questions/12922236/removing-rows-when-reading-data-d3
        data = data.filter(function(d) {
            //clear weird 0,0 point
            if(d['petal length']===0) return false;
            return true
        })
        render(data,xLabel, yLabel)
    });
}






