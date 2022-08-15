function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var PANEL = d3.select("#sample-samples");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids =[];
    var otu_id = []
    var otu_labels=[];
    var sample_values =[];

    Object.entries(result.otu_ids).forEach(([key, value]) => {
    otu_ids.push(`${value}`);
    });
    

    Object.entries(result.otu_ids).forEach(([key, value]) => {
      otu_id.push(`${value}`);
    });
  

    Object.entries(result.otu_labels).forEach(([key, value]) => {
    otu_labels.push(`${value}`);
    otu_labels_top = otu_labels.slice(0,10);
    
    });
    Object.entries(result.sample_values).forEach(([key, value]) => {
    sample_values.push(`${value}`);
    sample_values_bar = sample_values.slice(0,10).reverse();
    });
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var otu_ids_top = (otu_ids.map(id =>`OTU ${id}`).slice(0,10).reverse());
    var yticks = otu_ids_top;
    console.log(otu_ids)
    var trace = {
      x: sample_values_bar,
      y: yticks,
      type: "bar",
      orientation: 'h',
      hovertext: otu_labels_top,
    };
    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text:"Top 10 Bacteria Cultures Found"},
      yaxis: yticks,
      width: 500,
      height: 500
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot",barData, barLayout);
    //Deliverable 2
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    };
    var bubbleData = [trace2];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      shadowlegend: false
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultMetaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultMeta = resultMetaArray[0];
    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(resultMeta.wfreq)
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text:"Belly Button Washing Frequency<br><span style='font-size:0.8em;color:black'>Scrubs per Week</span>"},
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "teal" },
          { range: [8, 10], color: "green" }],
          bar: { color: "black" }
      },
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 500, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
})};

