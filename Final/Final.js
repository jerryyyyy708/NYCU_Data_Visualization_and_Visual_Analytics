const plot = document.getElementById('Figure')
webroot = document.body
button = document.getElementById("buttons")
const margin = {top: 60, right:30, bottom:80, left: 100};
bc = d3.select("#chart");
const width = +bc.attr("width") - margin.left - margin.right;
const height = +bc.attr("height") - margin.top - margin.bottom;
admin = false

d3.svg("coverpage.svg").then(function(xml) {
  d3.select("#chart").node().appendChild(xml.documentElement);
});

const svg = d3.select("#chart");
title = '<======= Please Select a Figure'
var g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

function removeAllChild(parent){
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
}

plot.onchange = () => {
    d3.csv("YT_Revenue.csv",d3.autoType).then((rawdata) => {
        removeAllChild(button)
        chart = d3.select("#chart")
        chart.selectAll("*").remove()
        if(plot.value === "scatter"){
            create_scatter(chart, rawdata)
        }
        else if(plot.value === "histo"){
            create_histo(chart, rawdata)
        }
        else if(plot.value === "template"){
          template_plot(chart, rawdata)
        }
        else if(plot.value === "coorv1"){
          coor_plotv1(chart,rawdata)
        }
    })
}

function filter_data(rawdata){
    data = rawdata.filter(function(d){
        if(d[attributes[17]] == 0) return false;
        if(d['Views']>50000) return false;
        if(d['Comments added']>200) return false;
        return true
    })
    
    for(i=0;i<data.length;i++){
      //console.log(data[i]['Average view duration'])
      nums = data[i]['Average view duration (min)'].split(':')
      hr = parseInt(nums[0])
      mn = parseInt(nums[1])
      sc = parseInt(nums[2])
      //console.log(hr,mn,sc)
      data[i]['Average view duration (min)'] = mn + sc/60
    }
    return data
}

function template_plot(tmp, rawdata){
  //tmp 是那個 svg
  attributes = rawdata.columns //取得各個column欄位(content, title, upload date記得不要用)
  data = filter_data(rawdata) //取得處理好的資料集
  //建立各種按鈕、選單， 可以用button.appendChild()加到下面那排
  //剩下的
}

function coor_plotv1(lc,rawdata){
  attributes = rawdata.columns
  data = filter_data(rawdata)
  lctitle = 'Parallel Coordinate Plots'
  var g = lc.append("g").attr("transform",`translate(${margin.left},${margin.top})`);
  
  g.append("text")
      .text(lctitle)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");

  select_lc1 = document.createElement('select')
  select_lc1.id = 'lcattr1';//select_attr.style.textAlign = ''
  button.appendChild(select_lc1)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc1.appendChild(option)

  for (i=0;i<attributes.length;i++){//need delete genre
    if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
      continue
    }
    let option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    if(i === 0){
      option.selected = true
    }
    select_lc1.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  button.appendChild(space)

  select_lc2 = document.createElement('select')
  select_lc2.id = 'lcattr2';//select_attr.style.textAlign = ''
  button.appendChild(select_lc2)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc2.appendChild(option)

  for (i=0;i<attributes.length;i++){//need delete genre
    if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
      continue
    }
    let option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    if(i === 8){
      option.selected = true
    }
    select_lc2.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  button.appendChild(space)

  select_lc3 = document.createElement('select')
  select_lc3.id = 'lcattr3';//select_attr.style.textAlign = ''
  button.appendChild(select_lc3)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc3.appendChild(option)

  for (i=0;i<attributes.length;i++){//need delete genre
    if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
      continue
    }
    let option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    if(i === 9){
      option.selected = true
    }
    select_lc3.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  button.appendChild(space)

  select_lc4 = document.createElement('select')
  select_lc4.id = 'lcattr4';//select_attr.style.textAlign = ''
  button.appendChild(select_lc4)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc4.appendChild(option)

  for (i=0;i<attributes.length;i++){//need delete genre
    if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
      continue
    }
    let option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    if(i === 10){
      option.selected = true
    }
    select_lc4.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  button.appendChild(space)

  select_lc5 = document.createElement('select')
  select_lc5.id = 'lcattr5';//select genre
  button.appendChild(select_lc5)
  
  option = document.createElement('option')
  option.text = '10%'
  option.selected = true
  option.value = 10 
  select_lc5.appendChild(option)
  //options of select box
  //set default
  for (i=2;i<11;i++){//need delete genre
    option = document.createElement('option')
    option.value = i*10
    option.text = `${i*10}%`
    select_lc5.appendChild(option)
  }

  space = document.createTextNode(" ")
  button.appendChild(space)

  select_lc6 = document.createElement('select')
  select_lc6.id = 'lcattr6';//select genre
  button.appendChild(select_lc6)
  
  option = document.createElement('option')
  option.text = '--mode--'
  option.selected = true
  option.disabled = true 
  select_lc6.appendChild(option)
  //options of select box
  //set default
  modes = ['top','all']
  for (i=0;i<modes.length;i++) {
    option = document.createElement('option')
    option.value = modes[i]
    option.text = modes[i]
    option.selected = true
    select_lc6.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  button.appendChild(space)

  lsbutton = document.createElement('button')
  lsbutton.innerHTML = 'filter'
  lsbutton.id = 'scabutton'
  button.appendChild(lsbutton)
  lsbutton.onclick = function() {
    selectedlc1 = select_lc1.value
    selectedlc2 = select_lc2.value
    selectedlc3 = select_lc3.value
    selectedlc4 = select_lc4.value
    selectedlc5 = select_lc5.value
    selectedlc6 = select_lc6.value
    const axises1 = new Set()
    axises1.add(selectedlc1)
    axises1.add(selectedlc2)
    axises1.add(selectedlc3)
    axises1.add(selectedlc4)
    if (axises1.size < 4) {
      alert("please choose 4 different attributes");
      return false;
    }

    if(selectedlc6 != 'all' && selectedlc6 !='top'){
      if(admin)
        selectedlc6 = 'top'
      else{
        alert("please choose a ranking mode")
        return
      }
    }

    pops = d3.map(data,function(d){
      return d['YouTube ad revenue (TWD)']
    })
    pops.sort(function(a,b){return a-b});
    pl = pops.length-1
    pind = Math.round(pl-(selectedlc5/100)*pl)
    pval = pops[pind]
    datan = data.filter(function(d){return d['YouTube ad revenue (TWD)']>=pval})
    if(selectedlc6 === 'all')
      color = 'blue'
    else
      color = 'transparent'
      lc.selectAll("*").remove();
      title = "Parallel Coordinate Plots";
  
    var g = lc
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    g.append("text")
      .text(title)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");
    lcas = [selectedlc1, selectedlc2, selectedlc3, selectedlc4]
    console.log(lcas)
      var y = {};
      //y scales
      for (i in lcas) {
        scale = lcas[i];
        y[scale] = d3.scaleLinear().domain(d3.extent(data, d=>d[scale]))
          .range([height, 0]);
      }
  
      //x scale
      x = d3.scalePoint().range([0, width]).padding(1).domain(lcas);
      
      //lines
      g.selectAll("lines")
        .data(data)
        .enter()
        .append("path")
        .attr("d", d => d3.line()(
          lcas.map( p => {return [x(p), y[p](d[p])]})
          )
        )
        .style("fill", "none")
        .style("stroke", (d) => {
          if(d['YouTube ad revenue (TWD)'] >= pval)
            return "red"
          else
            return color
        })
        .style("opacity", (d)=>{
          if(d['YouTube ad revenue (TWD)'] >= pval)
            return 0.5
          else
            return 0.15
        });
  
        g.selectAll("xAxis")
        .data(lcas)
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
    
    //datan2 = data.filter(function(d){return d['YouTube ad revenue (TWD)'] < pval})
  }
  lsbutton.click()
  
}

function create_histo(hs, rawdata){
  attributes = rawdata.columns
  data = filter_data(rawdata)
  hstitle = 'Histogram'
  var g = hs.append("g").attr("transform",`translate(${margin.left},${margin.top})`);
  
  g.append("text")
      .text(hstitle)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");

  select_hs1 = document.createElement('select')
  select_hs1.id = 'hsattr1';//select_attr.style.textAlign = ''
  button.appendChild(select_hs1)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_hs1.appendChild(option)

  for (i=0;i<attributes.length;i++){//need delete genre
    if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
      continue
    }
    let option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    if(i === 0){
      option.selected = true
    }
    select_hs1.appendChild(option)
  }
  
  space = document.createTextNode(" ")
  button.appendChild(space)

  //button for bar chart
  hsbutton = document.createElement('button')
  hsbutton.innerHTML = 'filter'
  hsbutton.id = 'hsbutton'
  button.appendChild(hsbutton)
  
  hsbutton.onclick = function(){
    hsel1 = select_hs1.value
    if(hsel1 === '--select attribute--'){
      if(admin)
        hsel1 = 'Views'
        else{
          alert('Please select attribute for histogram')
          return
        }
    }
    hdata2 = data
    
    hs.selectAll("*").remove()
    hstitle = `Histogram: ${hsel1}`
    //xaxis
    xValue = hdata2 => hdata2[hsel1]
    const g = hs.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
    
    g.append('text')
        .text(hstitle)
        .attr('y','-20')
        .attr('x',`${(width)/2}`)
        .attr('text-anchor', 'middle')
        .attr('font-size','2em')
        .attr('font-weight','bold')
    
    xpend = (d3.max(data,xValue)-d3.min(data,xValue))/20
    xScale = d3.scaleLinear()
            .domain([d3.min(data,xValue)-xpend,d3.max(data,xValue)+xpend])
            .range([0,width])

    
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-(height))
        .tickPadding(15)
    
    const xAxisG = g.append('g').call(xAxis)
        .attr("transform", `translate(0,${height})`)
        .style("font-size","1.2em")

    var histogram = d3.histogram()
        .value(function(d) { return d[hsel1]; })   // I need to give the vector of value
        .domain(xScale.domain())  // then the domain of the graphic
        .thresholds(xScale.ticks(20))
    var bins = histogram(hdata2)
    

    yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(bins, function(d) { return d.length; })])
  
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-(width))
      .tickPadding(15)

    const yAxisG = g.append('g').call(yAxis)
      .style("font-size","1.2em")

    g.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 0)//change to 0 and add line
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0)  ; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .style('fill', "#69b3a2")
        .style('stroke','black')
  }
  hsbutton.click()
}

function create_scatter(sc, rawdata){
    attributes = rawdata.columns
    data = filter_data(rawdata)
    sctitle = 'Scatter Plot'
    
    //console.log(attributes)
    var g = sc.append("g").attr("transform",`translate(${margin.left},${margin.top})`);
    g.append("text")
      .text(sctitle)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");

    select_scattr1 = document.createElement('select')
    select_scattr1.id = 'c2attr1';//select_attr.style.textAlign = ''
    button.appendChild(select_scattr1)
    
    //options of select box
    //set default
    option = document.createElement('option')
    option.text = '--select attribute--'
    option.selected = true
    option.disabled = true
    select_scattr1.appendChild(option)

    for (i=0;i<attributes.length;i++){//need delete genre
        if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
            continue
        }
        option = document.createElement('option')
        option.value = attributes[i]
        option.text = attributes[i]
        if(i === 15) option.selected = true
        select_scattr1.appendChild(option)
    }

    //padding between selectbox and button
    space = document.createTextNode(" ")
    button.appendChild(space)

    select_scattr2 = document.createElement('select')
    select_scattr2.id = 'c2attr2';//select_attr.style.textAlign = ''
    button.appendChild(select_scattr2)
    
    //options of select box
    //set default
    option = document.createElement('option')
    option.text = '--select attribute--'
    option.selected = true
    option.disabled = true
    select_scattr2.appendChild(option)

    for (i=0;i<attributes.length;i++){//need delete genre
        if(attributes[i] === "Video publish time" || attributes[i] === "Content" || attributes[i] === "Video title"){
            continue
        }
        option = document.createElement('option')
        option.value = attributes[i]
        option.text = attributes[i]
        if(i === 7) option.selected = true
        select_scattr2.appendChild(option)
    }

    //padding between selectbox and button
    space = document.createTextNode(" ")
    button.appendChild(space)
        
    //create select box for %shoo
    select_scattr3 = document.createElement('select')
    select_scattr3.id = 'c2attr3';//select_attr.style.textAlign = ''
    button.appendChild(select_scattr3)

    //options of select box
    //set default
    for (i=1;i<11;i++){//need delete genre
    option = document.createElement('option')
    option.value = i*10
    option.text = `${i*10}%`
    select_scattr3.appendChild(option)
    }

    space = document.createTextNode(" ")
    button.appendChild(space)

    //mode
    select_scattr4 = document.createElement('select')
    select_scattr4.id = 'c2attr4';//select genre
    button.appendChild(select_scattr4)

    option = document.createElement('option')
    option.text = '--mode--'
    option.selected = true
    option.disabled = true 
    select_scattr4.appendChild(option)
    //options of select box
    //set default
    modes = ['all','top']
    for (i=0;i<modes.length;i++) {
    option = document.createElement('option')
    option.value = modes[i]
    option.text = modes[i]
    if(i===0) option.selected = true
    select_scattr4.appendChild(option)
    }
    //padding between selectbox and button
    space = document.createTextNode(" ")
    button.appendChild(space)

    //button for bar chart
    scabutton = document.createElement('button')
    scabutton.innerHTML = 'filter'
    scabutton.id = 'scabutton'
    button.appendChild(scabutton)
    scabutton.onclick = function() {//add filter class or all
        selected1 = select_scattr1.value
        selected2 = select_scattr2.value
        selected3 = select_scattr3.value
        selected4 = select_scattr4.value
        
        if(selected1 === '--select attribute--' || selected2 === '--select attribute--'){
          if(admin){
            selected1 = 'Views'
            selected2 = 'Dislikes'
          }
          else{
            alert('Please select attribute for every axis.')
            return
          }
        }
        else if(selected1 === selected2){
          alert('Please select different attribute for every axis.')
          return
        }
        data2 = data
        pops = d3.map(data2,function(d){
          return d['YouTube ad revenue (TWD)']
        })
        pops.sort(function(a,b){return a-b});
        pl = pops.length-1
        pind = Math.round(pl-(selected3/100)*pl)
        pval = pops[pind]
    
        if(selected4 != 'all' && selected4 != 'top'){
          if(admin) selected4 = 'top'
          else{
            alert('Please select a display mode')
            return
          }
        }
        if(selected4 == 'all')
          color = 'blue'
        else
          color = 'transparent'
        
        xValue = data2 => data2[selected1]
        yValue = data2 => data2[selected2]
    
        sc.selectAll("*").remove()
        sctitle = `${selected1} vs ${selected2} (column vs row)`
        
        const g = sc.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
        
        g.append('text')
            .text(sctitle)
            .attr('y','-20')
            .attr('x',`${(width)/2}`)
            .attr('text-anchor', 'middle')
            .attr('font-size','2em')
            .attr('font-weight','bold')
        xpend = (d3.max(data,xValue)-d3.min(data,xValue))/20
        ypend = (d3.max(data,yValue)-d3.min(data,yValue))/20
        const xScale = d3.scaleLinear()
            .domain([d3.min(data,xValue)-xpend,d3.max(data,xValue)+xpend])
            .range([0,width])
            
                
        
        const yScale = d3.scaleLinear()
            .domain([d3.max(data,yValue)+ypend,d3.min(data,yValue)-ypend])
            .range([0,height])
            
    
        //用scale 來設定axis
        const xAxis = d3.axisBottom(xScale)
            .tickSize(-(height))
            .tickPadding(15)
        const yAxis = d3.axisLeft(yScale)
            .tickSize(-(width))
            .tickPadding(15)
    
        //把axis加到scale
        const xAxisG = g.append('g').call(xAxis)
            .attr("transform", `translate(0,${height})`)
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
        /*
        xAxisG.append('text')
            .attr('y',50)
            .attr('x',(width)/2)
            .attr('fill','black')
            .text(selected1)
        */
        
        
        if(selected4 == 'all'){
        g.selectAll('circle').data(data2)
          .enter().append("circle")
          .attr('cx',data2 => xScale(data2[selected1]))
          .attr('cy',data2 => yScale(data2[selected2]))
          .attr('r',4)
          .attr('opacity', d => {
            return d['YouTube ad revenue (TWD)']>=pval ? 0.6:0.3
          })
          .attr('fill',d => {
            return d['YouTube ad revenue (TWD)']>=pval ? 'red' : 'blue'
          })
        }
        else{
          data3 = data2.filter(function(d){
            if(d['YouTube ad revenue (TWD)']>=pval) return true;
            return false
          })
          g.selectAll('circle').data(data3)
          .enter().append("circle")
          .attr('cx',data2 => xScale(data2[selected1]))
          .attr('cy',data2 => yScale(data2[selected2]))
          .attr('r',4)
          .attr('opacity', 0.5)
          .attr('fill','red')
        }
        /*
        yAxisG.append('text')
        .attr('x',-(height)/2)
        .attr('y',-50)
        .attr('text-anchor','middle')
        .attr('fill','black')
        .text(selected2)
        .attr('transform','rotate(270)')
        */
    }
    scabutton.click()
}



