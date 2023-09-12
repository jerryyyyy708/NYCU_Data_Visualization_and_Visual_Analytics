

d3.csv("dataset.csv",d3.autoType).then((rawdata) => {  
  admin = false
  //get attributes
  attributes = rawdata.columns;
  column_nums = attributes.length;
  //'', 'track_id', 'artists', 'album_name', 'track_name', 'popularity', 'duration_ms', 'explicit', 'danceability','energy', 'key',
  //'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature', 'track_genre'
  
  //can add pingun line
  //filter bad elements
  data = rawdata.filter(function(d){
    if(d[attributes[column_nums-1]] == "") return false;
    return true
  })
  //node of charts
  c1 = document.getElementById("c1")
  c2 = document.getElementById("c2")
  c3 = document.getElementById("c3")
  c4 = document.getElementById("c4")
  c5 = document.getElementById("c5")
  //track genre classes
  genres =new Set(data.map(d => d[attributes[column_nums-1]]))
  genres = Array.from(genres)
  //web body
  webroot = document.body
  //create select box for bar char
  select_attr = document.createElement('select')
  select_attr.id = 'attr1';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_attr,c2)
  
  //options of select box
  //set default
  let option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_attr.appendChild(option)
  
  barattrs = ['explicit','key','mode','time_signature']

  for (i=0;i<4;i++){//need delete genre
    let option = document.createElement('option')
    option.value = barattrs[i]
    option.text = barattrs[i]
    select_attr.appendChild(option)
  }
  
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c2)

  //create select box for %shoo
  select_attr2 = document.createElement('select')
  select_attr2.id = 'attr2';//select genre
  webroot.insertBefore(select_attr2,c2)
  option = document.createElement('option')
  option.text = 'all genres'
  option.selected = true
  option.value = 'all'
  select_attr2.appendChild(option)
  
  //options of select box
  //set default
  
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    select_attr2.appendChild(option)
  }
  
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c2)

  //button for bar chart
  barbutton = document.createElement('button')
  barbutton.innerHTML = 'filter'
  barbutton.id = 'barbutton'
  webroot.insertBefore(barbutton,c2)
  
  //need initial bar chart
  bctitle = 'Bar Chart'
  const margin = {top: 60, right:30, bottom:80, left: 100};
  bc = d3.select("#barchart");
  const width = +bc.attr("width") - margin.left - margin.right;
  const height = +bc.attr("height") - margin.top - margin.bottom;
  var g = bc.append("g").attr("transform",`translate(${margin.left},${margin.top})`);
  g.append("text")
      .text(bctitle)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");
  
  //plot barchart
  barbutton.onclick = () => {
    //values categories
    selected = select_attr.value
    selected2 = select_attr2.value
    if(selected === '--select attribute--'){
      if(admin){
        selected = 'loudness'
      }
      else{
        alert('Please select attribute for barchart')
        return
      }
    }
    if(selected2 != 'all'){
      data2 = data.filter(function(d) {
        //clear weird 0,0 point
        if(d['track_genre']!=selected2) return false;
        return true
      })
    }
    else{data2 = data}
    bctitle = 'Bar Chart: '+selected
    values =new Set(data.map(d => d[selected]))
    //svg settings
    
    bc = d3.select("#barchart");
    bc.selectAll("*").remove()
    var g = bc.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    //x axis
    g.append("text")
      .text(bctitle)
      .attr("y", "-30")
      .attr("x", `${(width) / 2}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .attr("font-weight", "bold");

    countobj = {}
    //if and else both have a text
    if(values.size<50){//add x y label
      //bar chart with categories
      value_arr = Array.from(values)
      if(typeof value_arr[0]!== "string"){
        //value_arr = Array.from(value_arr.map(str => {return +str}));
        value_arr.sort(function(a,b){return a-b});
      }
      
      //counts
      data2.forEach(function(d){
        if(countobj[d[selected]]===undefined){
          countobj[d[selected]] = 1
        }
        else{
          countobj[d[selected]] += 1
        }
      })
      add_text = "Counts: "
    }
    else{
      //plot a max value
      //plot each bar value,maybe down use range
      value_arr = Array.from(values)
      value_arr.sort(function(a,b){return a-b});
      minval = value_arr[0];
      maxval = value_arr[value_arr.length - 1];
      if(selected === 'duration_ms')
        maxval = 527329
      console.log(minval, maxval)
      console.log(value_arr)
      valrange = maxval - minval
      xs = [];
      for(i=0;i<10;i++){
        val = minval+i*valrange/10
        val = Math.round(val*100)/100
        xs.push(val)
      }
      console.log(xs)
      data2.forEach(function(d){
        d[selected] = +d[selected]
        gp = Math.floor((d[selected]-minval)/(valrange/10));
        if(gp >= 10)
          gp = 9;
        if(countobj[xs[gp]]===undefined){
          countobj[xs[gp]] = 1
        }  
        else{
          countobj[xs[gp]]+=1
        }
      })
      value_arr = xs
      add_text = "MaxValue: Minvalue: Counts:"
    }
    maxk = Object.keys(countobj).reduce(function(a, b){ return countobj[a] > countobj[b] ? a : b })
      console.log(countobj)
      //x axis
      var x = d3.scaleBand().range([0, width]).domain(value_arr).padding(1)
      g.append("g").attr("transform",`translate(0,${height})`).call(d3.axisBottom(x))

      //y axis
      var y = d3.scaleLinear().domain([0,countobj[maxk]]).range([ height, 0]);
      g.append("g").call(d3.axisLeft(y));
      dictarr = []
      //bars
      for (const [key, value] of Object.entries(countobj)) {
        temp = {}
        temp[key]=value
        dictarr.push(temp);//modify this to achieve the correct structure
      }
      console.log(dictarr)
      //turn to d3 form, change count to each genre for stack(hopefully)
      if(typeof value_arr[0]!== "string"){
        var mapped = dictarr.map(d => {//https://stackoverflow.com/questions/60276232/using-a-dictionary-to-plot-graph-in-d3-js
          return {
            index: +Object.keys(d)[0],
            count: d[Object.keys(d)[0]]
          }
        })
      }
      else{
        var mapped = dictarr.map(d => {
          return {
            index: Object.keys(d)[0],
            count: d[Object.keys(d)[0]]
          }
        })
      }
      console.log(mapped)
      g.selectAll("bars").data(mapped).enter().append("rect")
      .attr("x", function(d){return x(d.index)-20}).attr("y", function(d){return y(d.count)})
      .attr("width", 40)
      .attr("height", function(d) { return height - y(d.count); })
      .attr("fill", "#69b3a2")
    //https://stackoverflow.com/questions/30867241/enable-a-disabled-select-when-choose-a-value-in-another-select-tag onchange
  }
  
  scclass = ['popularity', 'duration_ms', 'danceability','energy','loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
  //scatter-------------------------------------------------------------------------------
  sc = d3.select("#scatter")
  sctitle = 'Scatter Plot'
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
  webroot.insertBefore(select_scattr1,c3)
  
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_scattr1.appendChild(option)

  for (i=0;i<scclass.length;i++){//need delete genre
    option = document.createElement('option')
    option.value = scclass[i]
    option.text = scclass[i]
    select_scattr1.appendChild(option)
  }

  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c3)

  //create select box for bar char
  select_scattr2 = document.createElement('select')
  select_scattr2.id = 'c2attr2';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_scattr2,c3)
  
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_scattr2.appendChild(option)

  for (i=0;i<scclass.length;i++){//need delete genre
    option = document.createElement('option')
    option.value = scclass[i]
    option.text = scclass[i]
    select_scattr2.appendChild(option)
  }

  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c3)

  //create select box for %shoo
  select_scattr3 = document.createElement('select')
  select_scattr3.id = 'c2attr3';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_scattr3,c3)
  
  //options of select box
  //set default
  for (i=1;i<11;i++){//need delete genre
    option = document.createElement('option')
    option.value = i*10
    option.text = `${i*10}%`
    select_scattr3.appendChild(option)
  }

  space = document.createTextNode(" ")
  webroot.insertBefore(space,c3)

  //mode
  select_scattr5 = document.createElement('select')
  select_scattr5.id = 'c2attr5';//select genre
  webroot.insertBefore(select_scattr5,c3)
  
  option = document.createElement('option')
  option.text = '--mode--'
  option.selected = true
  option.disabled = true 
  select_scattr5.appendChild(option)
  //options of select box
  //set default
  modes = ['all','top']
  for (i=0;i<modes.length;i++) {
    option = document.createElement('option')
    option.value = modes[i]
    option.text = modes[i]
    select_scattr5.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c3)

  //create select box for %shoo
  select_scattr4 = document.createElement('select')
  select_scattr4.id = 'c2attr4';//select genre
  webroot.insertBefore(select_scattr4,c3)
  option = document.createElement('option')
  option.text = 'all genre'
  option.selected = true
  option.value = 'all'
  select_scattr4.appendChild(option)
  //options of select box
  //set default
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    select_scattr4.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c3)
  //button for bar chart
  scabutton = document.createElement('button')
  scabutton.innerHTML = 'filter'
  scabutton.id = 'scabutton'
  webroot.insertBefore(scabutton,c3)

  scabutton.onclick = function() {//add filter class or all
    selected1 = select_scattr1.value
    selected2 = select_scattr2.value
    selected3 = select_scattr3.value
    selected4 = select_scattr4.value
    selected5 = select_scattr5.value
    data.forEach(function(d){
      if(d['duration_ms']>527329)
        d['duration_ms'] = 527329
    })
    
    
    if(selected1 === '--select attribute--' || selected2 === '--select attribute--'){
      if(admin){
        selected1 = 'valence'
        selected2 = 'danceability'
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

    if(selected4 != 'all'){
      data2 = data.filter(function(d) {
        //clear weird 0,0 point
        if(d['track_genre']!=selected4) return false;
        return true
      })
    }
    else{data2 = data}
    pops = d3.map(data2,function(d){
      return d.popularity
    })
    pops.sort(function(a,b){return a-b});
    pl = pops.length-1
    pind = Math.round(pl-(selected3/100)*pl)
    pval = pops[pind]

    if(selected5 != 'all' && selected5!= 'top'){
      if(admin) selected5 = 'top'
      else{
        alert('Please select a display mode')
        return
      }
    }
    if(selected5 == 'all')
      color = 'blue'
    else
      color = 'transparent'
    
    xValue = data2 => data2[selected1]
    yValue = data2 => data2[selected2]

    sc.selectAll("*").remove()
    sctitle = `${selected1} vs ${selected2}`
    
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
    xAxisG.append('text')
        .attr('y',50)
        .attr('x',(width)/2)
        .attr('fill','black')
        .text(selected1)
    
    
    if(selected5 == 'all'){
    g.selectAll('circle').data(data2)
      .enter().append("circle")
      .attr('cx',data2 => xScale(data2[selected1]))
      .attr('cy',data2 => yScale(data2[selected2]))
      .attr('r',4)
      .attr('opacity', d => {
        return d.popularity>pval ? 0.6:0.3
      })
      .attr('fill',d => {
        return d.popularity>pval ? 'red' : 'blue'
      })
    }
    else{
      data3 = data2.filter(function(d){
        if(d.popularity>pval) return true;
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
    if(selected2 === "duration_ms")
      selected2 = " "
    yAxisG.append('text')
    .attr('x',-(height)/2)
    .attr('y',-50)
    .attr('text-anchor','middle')
    .attr('fill','black')
    .text(selected2)
    .attr('transform','rotate(270)')
  }
//histo=================================================
  hs = d3.select("#histo")
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
  webroot.insertBefore(select_hs1,c4)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_hs1.appendChild(option)

  hisattr = ['popularity','duration_ms','danceability','energy','loudness','speechiness','acousticness','instrumentalness','liveness', 'valence', 'tempo']

  for (i=1;i<hisattr.length;i++){//need delete genre
    let option = document.createElement('option')
    option.value = hisattr[i]
    option.text = hisattr[i]
    select_hs1.appendChild(option)
  }
  
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c4)

  //create select box for %shoo
  select_hs2 = document.createElement('select')
  select_hs2.id = 'hsattr2';//select genre
  webroot.insertBefore(select_hs2,c4)
  option = document.createElement('option')
  option.text = 'all genres'
  option.selected = true
  option.value = 'all'
  select_hs2.appendChild(option)
  
  //options of select box
  //set default
  
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    select_hs2.appendChild(option)
  }
  
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c4)

  //button for bar chart
  hsbutton = document.createElement('button')
  hsbutton.innerHTML = 'filter'
  hsbutton.id = 'hsbutton'
  webroot.insertBefore(hsbutton,c4)

  hsbutton.onclick = function(){
    data.forEach(function(d){
      if(d['duration_ms']>527329)
        d['duration_ms'] = 527329
    })
    hsel1 = select_hs1.value
    hsel2 = select_hs2.value
    if(hsel1 === '--select attribute--'){
      if(admin)
        hsel1 = 'instrumentalness'
        else{
          alert('Please select attribute for histogram')
          return
        }
    }

    if(hsel2 != 'all'){
      hdata2 = data.filter(function(d) {
        //clear weird 0,0 point
        if(d['track_genre']!=hsel2) return false;
        return true
      })
    }
    else{hdata2 = data}
    
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

  //LINE CHART
  lc = d3.select("#linechart")
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
  webroot.insertBefore(select_lc1,c5)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc1.appendChild(option)

  for(i = 5;i<column_nums-1;i++){
    option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    select_lc1.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc2 = document.createElement('select')
  select_lc2.id = 'lcattr2';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_lc2,c5)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc2.appendChild(option)

  for(i = 5;i<column_nums-1;i++){
    option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    select_lc2.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc3 = document.createElement('select')
  select_lc3.id = 'lcattr3';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_lc3,c5)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc3.appendChild(option)

  for(i = 5;i<column_nums-1;i++){
    option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    select_lc3.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc4 = document.createElement('select')
  select_lc4.id = 'lcattr4';//select_attr.style.textAlign = ''
  webroot.insertBefore(select_lc4,c5)
  //options of select box
  //set default
  option = document.createElement('option')
  option.text = '--select attribute--'
  option.selected = true
  option.disabled = true
  select_lc4.appendChild(option)

  for(i = 5;i<column_nums-1;i++){
    option = document.createElement('option')
    option.value = attributes[i]
    option.text = attributes[i]
    select_lc4.appendChild(option)
  }
  //padding between selectbox and button
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc5 = document.createElement('select')
  select_lc5.id = 'lcattr5';//select genre
  webroot.insertBefore(select_lc5,c5)
  
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
  webroot.insertBefore(space,c5)

  lsbutton = document.createElement('button')
  lsbutton.innerHTML = 'filter'
  lsbutton.id = 'scabutton'
  webroot.insertBefore(lsbutton,c5)

  space = document.createElement("br")
  webroot.insertBefore(space,c5)
  
  space = document.createElement("br")
  //webroot.insertBefore(space,c5)
  // create
  select_lc6 = document.createElement('select')
  select_lc6.id = 'lcattr6';//select genre
  webroot.insertBefore(select_lc6,c5)
  
  option = document.createElement('option')
  option.text = '--None--'
  option.value = 'Genre1: None'
  select_lc6.appendChild(option)
  cct = 0
  //options of select box
  //set default
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    if(i===cct)
      option.selected = true
    select_lc6.appendChild(option)
  }
  cct+=1
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc7 = document.createElement('select')
  select_lc7.id = 'lcattr7';//select genre
  webroot.insertBefore(select_lc7,c5)
  option = document.createElement('option')
  option.text = '--None--'
  option.value = 'Genre2: None'
  select_lc7.appendChild(option)
  //options of select box
  //set default
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    if(i===cct)
      option.selected = true
    select_lc7.appendChild(option)
  }
  cct+=1
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc8 = document.createElement('select')
  select_lc8.id = 'lcattr8';//select genre
  webroot.insertBefore(select_lc8,c5)
  option = document.createElement('option')
  option.text = '--None--'
  option.value = 'Genre3: None'
  select_lc8.appendChild(option)

  //options of select box
  //set default
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    if(i===cct)
      option.selected = true
    select_lc8.appendChild(option)
  }
  cct+=1
  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc9 = document.createElement('select')
  select_lc9.id = 'lcattr9';//select genre
  webroot.insertBefore(select_lc9,c5)
  option = document.createElement('option')
  option.text = '--None--'
  option.value = 'Genre4: None'
  select_lc9.appendChild(option)

  //options of select box
  //set default
  for (i=0;i<genres.length;i++) {
    option = document.createElement('option')
    option.value = genres[i]
    option.text = genres[i]
    if(i===cct)
      option.selected = true
    select_lc9.appendChild(option)
  }

  space = document.createTextNode(" ")
  webroot.insertBefore(space,c5)

  select_lc10 = document.createElement('select')
  select_lc10.id = 'lcattr10';//select genre
  webroot.insertBefore(select_lc10,c5)

  option = document.createElement('option')
  option.text = '--mode--'
  option.selected = true
  option.disabled = true 
  select_lc10.appendChild(option)
  //options of select box
  //set default
  modes = ['rank all','rank each']
  mode2 = ['all','each']
  for (i=0;i<modes.length;i++) {
    option = document.createElement('option')
    option.value = mode2[i]
    option.text = modes[i]
    select_lc10.appendChild(option)
  }
  //padding between selectbox and button
  

  lsbutton.onclick = function() {
    data.forEach(function(d){
      if(d['duration_ms']>527329)
        d['duration_ms'] = 527329
    })
    selectedlc1 = select_lc1.value
    selectedlc2 = select_lc2.value
    selectedlc3 = select_lc3.value
    selectedlc4 = select_lc4.value
    selectedlc5 = select_lc5.value
    selectedlc6 = select_lc6.value
    selectedlc7 = select_lc7.value
    selectedlc8 = select_lc8.value
    selectedlc9 = select_lc9.value
    selectedlc10 = select_lc10.value
    if(selectedlc1 === '--select attribute--' || selectedlc2 === '--select attribute--' || selectedlc3 === '--select attribute--' || selectedlc4 === '--select attribute--'){
      if(admin){
        selectedlc1 = attributes[5]
        selectedlc2 = attributes[6]
        selectedlc3 = attributes[7]
        selectedlc4 = attributes[8]
        console.log(selectedlc1,selectedlc2,selectedlc3)
      }
      else{
        alert('Please select 4 attributes')
        return
      }
    }
    const axises1 = new Set()
    axises1.add(selectedlc1)
    axises1.add(selectedlc2)
    axises1.add(selectedlc3)
    axises1.add(selectedlc4)
    if (axises1.size < 4) {
      alert("please choose 4 different attributes");
      return false;
    }
    const axises = new Set()
    axises.add(selectedlc6)
    axises.add(selectedlc7)
    axises.add(selectedlc8)
    axises.add(selectedlc9)
    if (axises.size < 4) {
      alert("please choose 4 different genres(except None)");
      return false;
    }

    if(selectedlc10 != 'all' && selectedlc10 !='each'){
      if(admin)
        selectedlc10 = 'each'
      else{
        alert("please choose a ranking mode")
        return
      }
    }
    datan = 0
    if(selectedlc10 === 'all'){
      datan = data.filter(function(d){
        if(axises.has(d['track_genre']))
          return true
        else
          return false
      })
      pops = d3.map(datan,function(d){
        return d.popularity
      })
      pops.sort(function(a,b){return a-b});
      console.log(pops)
      pl = pops.length-1
      pind = Math.round(pl-(selectedlc5/100)*pl)
      pval = pops[pind]
      datan = datan.filter(function(d){return d.popularity>=pval})
    }
    else{
      p1 = 1000 * selectedlc5 / 100
      pl = {}
      pl[selectedlc6] = p1
      pl[selectedlc7] = p1
      pl[selectedlc8] = p1
      pl[selectedlc9] = p1
      console.log(pl)
      datan = data.filter(function(d){
        if(axises.has(d['track_genre']))
          return true
        else
          return false
      })
      datan.sort(function(a,b){return b.popularity-a.popularity})
      ct = 0
      datan = datan.filter(function(d){
        //console.log(pl[d['track_genre']])
        if(pl[d['track_genre']]>0){
          pl[d['track_genre']]-=1
          return true
        }
        return false
      })
      //console.log(datan)
    }
    datan.forEach(function(d){
      if(d.explicit==='true')
        d.explicit = 1
      else
        d.explicit = 0
    })
    console.log(datan)
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
      y[scale] = d3.scaleLinear().domain(d3.extent(datan, d=>d[scale]))
        .range([height, 0]);
    }

    //x scale
    x = d3.scalePoint().range([0, width]).padding(1).domain(lcas);
    
    //lines
    g.selectAll("lines")
      .data(datan)
      .enter()
      .append("path")
      .attr("d", d => d3.line()(
        lcas.map( p => {return [x(p), y[p](d[p])]})
        )
      )
      .style("fill", "none")
      .style("stroke", (d) => {
        if(d.track_genre === selectedlc6)
          return "blue"
        else if(d.track_genre === selectedlc7)
          return "green"
        else if(d.track_genre === selectedlc8)
          return "gold"
        else if(d.track_genre === selectedlc9)
          return "red"
        else
          return "transparent"
      })
      .style("opacity", 0.2);

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

    lc
      .append("line")
      .attr("x1", width - 125)
      .attr("x2", width - 100)
      .attr("y1", 65)
      .attr("y2", 65)
      .style("stroke", "blue");
    lc
      .append("line")
      .attr("x1", width - 125)
      .attr("x2", width  - 100)
      .attr("y1", 95)
      .attr("y2", 95)
      .style("stroke", "green");
    lc
      .append("line")
      .attr("x1", width  - 125)
      .attr("x2", width - 100)
      .attr("y1", 125)
      .attr("y2", 125)
      .style("stroke", "gold");
    lc
      .append("line")
      .attr("x1", width - 125)
      .attr("x2", width - 100)
      .attr("y1", 155)
      .attr("y2", 155)
      .style("stroke", "red");
    lc
      .append("line")
      .attr("x1", width  - 125)
      .attr("x2", width  - 100)
      .attr("y1", 95)
      .attr("y2", 95)
      .style("stroke", "green");
    lc
      .append("line")
      .attr("x1", width  - 125)
      .attr("x2", width  - 100)
      .attr("y1", 125)
      .attr("y2", 125)
      .style("stroke", "gold");

    lc
      .append("text")
      .attr("x", width  - 90)
      .attr("y", 65)
      .text(`${selectedlc6}`)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    lc
      .append("text")
      .attr("x", width - 90)
      .attr("y", 95)
      .text(`${selectedlc7}`)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    lc
      .append("text")
      .attr("x", width - 90)
      .attr("y", 125)
      .text(`${selectedlc8}`)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    lc
      .append("text")
      .attr("x", width - 90)
      .attr("y", 155)
      .text(`${selectedlc9}`)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

  }

  
  
  //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically
  //color: https://d3-graph-gallery.com/graph/custom_color.html
});