// --------------------------------------------------------------------------//

//********************************* DOM LOC VARIABLES *********************************// 

// --------------------------------------------------------------------------//

const $pgIntro = document.getElementById(`pg-intro`)                                    //page intro
const $bikeInfo = document.getElementById(`bike-info`)                                  //form with user bike info
const $btnSubmitUserData = document.getElementById(`btn-submit-user-data`)              // submit user data btn
const $selectedBikeLoc = document.getElementById(`selected-bike-loc`)                   //selected bike location
const $selectedBikePrice = document.getElementById(`selected-bike-price`)               //selected bike price
const $pgResults = document.getElementById(`pg-results`)                                //page results
const $topBar = document.getElementById(`top-bar`)                                      //top bar container
const $riskFactorsUl = document.getElementById(`risk-factors-ul`)                       //ul with risk factors



// --------------------------------------------------------------------------//

//********************************* GLOBAL VARIABLES *********************************// 

// --------------------------------------------------------------------------//

//**** Date ****// 
let currDate = ``;
let currMonth = ``;
let currMonthName = ``;

//**** Dataset ****// 
let bikeTheftData = ``;

//**** Count arrays ****// 
let bikeLocCountsArr = [];
let bikeMonthCountsArr = [];

////**** Selected indices from the count arrays ****// 
let bikeLocSelectedIndex = -1;
let bikeMonthSelectedIndex = -1;

//**** Colors ****// 
let highlightColor = `#e8595f`;



// --------------------------------------------------------------------------//

//********************************* DATA: USER *********************************// 

// --------------------------------------------------------------------------//

//create an array that will hold data obtained from all users; each user's dataset is represented by an object;
const userDataAr = [
    {
        id: 1,
        bikeLoc: ``,
        bikePrice: ``,
        time: {
            date: ``,
            month: ``,
            monthName: ``,
        },
    }
]



// --------------------------------------------------------------------------//

//********************************* DATA: MAPS *********************************// 

// --------------------------------------------------------------------------//

//maps user input to data labels in raw data set
const bikeLocDataMap = 
    {   
        [`Apartment`]:          [`Apartment (Rooming House, Condo)`],
        [`Corporate Building`]: [`Other Commercial / Corporate Places (For Profit, Warehouse, Corp. Bldg`],
        [`Parking`]:            [`Parking Lots (Apt., Commercial Or Non-Commercial)`],
        [`House / Garage / Yard`]:  [`Single Home, House (Attach Garage, Cottage, Mobile)`, `Private Property (Pool, Shed, Detached Garage)`],
        [`Streets`]:            [`Streets, Roads, Highways (Bicycle Path, Private Road)`],
        [`Other`]:              [`Ttc Subway Station`, `Universities / Colleges`, `Open Areas (Lakes, Parks, Rivers)`, `Convenience Stores`, `Bank And Other Financial Institutions (Money Mart, Tsx)`, `Other Non Commercial / Corporate Places (Non-Profit, Gov'T, Firehall)`],
    }

//maps month name to month number 
const bikeMonthDataMap = 
    {   
        [`Jan`]:   [`1`],
        [`Feb`]:   [`2`],
        [`Mar`]:   [`3`],
        [`Apr`]:   [`4`],
        [`May`]:   [`5`],
        [`Jun`]:   [`6`],
        [`Jul`]:   [`7`],
        [`Aug`]:   [`8`],
        [`Sep`]:   [`9`],
        [`Oct`]:   [`10`],
        [`Nov`]:   [`11`],
        [`Dec`]:   [`12`],
    }




// --------------------------------------------------------------------------//

//********************************* HELPER FUNCTIONS: DATE *********************************// 

// --------------------------------------------------------------------------//

//function gets current date
const getCurrDate = () => {
    currDate = new Date();
    return currDate; 
}

//function gets current month
const getCurrMonth = () => {
    currMonth = getCurrDate().getMonth();
    return currMonth;
}

//function gets current month name
const getCurrMonthName = () => {
    currMonthName = Object.keys(bikeMonthDataMap)[currMonth];
    return currMonthName;
}



// --------------------------------------------------------------------------//

//********************************* HELPER FUNCTIONS: RISK FACTORS DATA UPDATE *********************************// 

// --------------------------------------------------------------------------//

//function fetches crime data
d3.csv(`data/bike-theft.csv`).then(function(data) {
    bikeTheftData = data;
    console.log(bikeTheftData)
  });


//function filters through a data array to return all instances that match the values of a desired property
const getFilteredArr = (arr, property, values) => {
    return arr.filter(obj => {            
        return values.includes(obj[property]);  //returns true if an array of values includes the value of a property from this array's object
    });
}

//function returns an arrays with the counts of all instances of the values of a given property
const getCounts = (dataMapObj, property) => {         // take an object containing a data map and a property name
    dataMapArr = Object.keys(dataMapObj);             //turn data map object into a data map array
    const propertyCountsArr = [];                     //create an array to hold the number of times each property value appears

    //for each property value in the data map array, function gets a count and finally returns an array with all counts
    dataMapArr.forEach ((value) => {
        
        //filter through the bikeTheftData array
        //from bikeLocDataMap get the values of a desired property
        //check if those values include the value of a bike theft object's property
        //if they do, add to a new array
        //when done, take the length of the new array;     
        let count = getFilteredArr(bikeTheftData, property, dataMapObj[value]).length; 

        //method pushes a new object into the count array containing the name of the property value and its associated count in the bikeTheftData array
        propertyCountsArr.push({key: value, count:count});
    }); 
    return propertyCountsArr;
}


//function takes an array of user data and generates risk factors for a user with a specific index
const generateRiskFactors = (arr, i) => { 
    //create variables to hold theft risk percentages
    let percTheftPerBikeLoc = 0;
    let percTheftPerBikeMonth = 0;

    //functions calculates the percentage of thefts with a specific property value out of all thefts
    const getPercentage = (property, values) => {
        return Math.round(getFilteredArr(bikeTheftData, property, values).length/bikeTheftData.length*100);
    }

    //update the risk percentage variables with the calculated risk values
    percTheftPerBikeLoc = getPercentage ('Location_Type', bikeLocDataMap[arr[i].bikeLoc]);
    percTheftPerBikeMonth = getPercentage (`Occurrence_Month`, bikeMonthDataMap[arr[i].time.monthName]);

    //add a new array with risk factors to the user data object
    arr[i].riskFactors = [
        {
            id: 1,
            title: `month`,                                 
            value: arr[i].time.monthName,                 
            percBikeThefts: `${percTheftPerBikeMonth}%`,
            graphic: getChartMonthSvg (),
        },
        {
            id: 2,
            title: `Parking Type`,
            value: arr[i].bikeLoc,
            percBikeThefts: `${percTheftPerBikeLoc}%`,
            graphic: getChartParkLocSvg (),
        }
    ]
}



// --------------------------------------------------------------------------//

//********************************* HELPER FUNCTIONS: USER DATA UPDATE *********************************// 

// --------------------------------------------------------------------------//

//function updates time with user's time
const updateUserTime = () => {
    userDataAr[0].time.date         = getCurrDate ();
    userDataAr[0].time.month        = getCurrMonth ();
    userDataAr[0].time.monthName    = getCurrMonthName ();
}

//function updates user's bike data with user's input
const updateUserBikeInfo = () => {
    userDataAr[0].bikeLoc = $selectedBikeLoc.value;
    userDataAr[0].bikePrice = $selectedBikePrice.value;
}

//function updates all user data at once
const updateUserData = () => {
    updateUserTime ();
    updateUserBikeInfo ();
    generateRiskFactors (userDataAr, 0);

}



// --------------------------------------------------------------------------//

//*********************************  HELPER FUNCTIONS: CONTENT GENERATION: RISK FACTORS *********************************// 

// --------------------------------------------------------------------------//

//function prints top bar
const printTopBar = (arr, i) => {
    console.log(arr[i]);
    $topBar.innerHTML = `
        <h1>Risks of Bike Theft in Toronto</h1>
        <span class="current-date-time">${arr[i].time.date}</span>
    `
}

//function takes a risk factor and returns a string of formatted HTML
const getSingleRiskFactor = (riskFactor) => {
    return `
        <li class="single-tile">
        <div class="tab" id="tab">
            <span>${riskFactor.title}</span>
            <button class="icon expand-collapse">
                <img src="img/SVG/expand-collapse.svg" class="rotate-90d">
            </button>
        </div>
        <figure class="infographic">
            <figcaption class="text">
                <h2>${riskFactor.value}</h2>
                <svg class="underscore" width="100%" height="4">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="#043752" stroke-width="4"/>
                </svg>
                <div class="emphasis">${riskFactor.percBikeThefts}</div>
                <fiv class="description">of bike thefts</div>
            </figcaption>
            ${riskFactor.graphic}
        </figure>
        </li>
    `
};


//function takes an array and prints all elements in the array as HTML
const printRiskFactors = () => {
    $riskFactorsUl.innerHTML = userDataAr[0].riskFactors.map((riskFactor) => getSingleRiskFactor(riskFactor)).join(``);
}



// --------------------------------------------------------------------------//

//*********************************  HELPER FUNCTIONS: CONTENT GENERATION: SVG *********************************// 

// --------------------------------------------------------------------------//

//function returns a string of formatted HTML containing an svg for the graph barChartBikeMonth
const getChartMonthSvg = () => {
    return `
        <svg class="bar-chart" id="barChartBikeMonth"> </svg>
    `
}


//function returns a string of formatted HTML containing an svg for the graph pie-chart-bike-loc
const getChartParkLocSvg = () => {
    return `
        <svg class="pie-chart" id="pie-chart-bike-loc"> </svg>
    `
}

// function generates bar chart for bike theft month data
const generateBarChartBikeMonth = () => {
    const width = 600,
          height = 300;

    const num = bikeMonthCountsArr.length;
    // Get the maximum value of the data to use as a scale
    const max = d3.max(bikeMonthCountsArr, d => d.count);

    // create the bar containers and position them
    const svgBar = d3.select(`#barChartBikeMonth`)
      .attr(`width`, width)          
      .attr(`height`, height)       // Select the container
      .selectAll(`rect`)            // Bind the upcoming date to <rect> elements
      .data(bikeMonthCountsArr)     // Select dataset 
      .enter()
      .append(`svg`)
      .attr(`y`, (obj) => height - obj.count * height / max  )  // set the top position for each of the bars to extend to the bottom (scaled by max)
      .attr(`x`, (obj, index) => index * width / num )          // set the left position for each of the bars
      .attr(`width`, (obj, index) => width / num )              // how wide each bar+padding to be
      .attr(`height`, (obj) => obj.count*height/max);           // how tall each of the bar is (scaled by the max)
  
    const svgG =  svgBar.append(`g`);
    // create the bars
    svgG.append(`rect`)
      .attr(`fill`, (obj, index) => {if (index == bikeMonthSelectedIndex) return highlightColor; else return  `#043752`}) // use the highlight color if it is the correct index, otherwise use the same color
      .attr(`width`, (obj, index) => (width* 0.9) / num ) // make the bar width to be a bit smaller than the parent
      .attr(`height`, (obj) => obj.count*height/max -32); // make the height to extend to the bottom - some space for the text
      
    // add the labels at the bottom of each of the bars
    svgG.append(`text`)
      .html((obj) => `${obj.key}`)
      .attr(`x`, (obj, index) => width / num / 2 ) // x position (middle of each bar)
      .attr(`y`, (obj) => obj.count*height/max - 16) // y position bottom - 16px
      .classed(`barChartLabel`, true); // add a class for each of the labels
  }


//function generate all svg charts
const printSvgs = () => {
    generatePieChartBikeLoc ();
    generateBarChartBikeMonth ();
}

//function generates pie chart for bike theft location data
const generatePieChartBikeLoc = () => {
    const width = 600,
        height = 300,
        radius = Math.min(width, height) / 2;

    // Define the colors for the pie chart without the higlighted one
    let colorsArray = [`rgba(4,55,82,0.1)`, `rgba(4,55,82,0.3)`,`rgba(4,55,82,0.5`, `rgba(4,55,82,0.7`, `rgba(4,55,82,0.9`];
    
    // Insert the higlight color at the index of the selected element
    colorsArray.splice(bikeLocSelectedIndex,0,highlightColor);
    
    // Sets up the color map to use for the pie chart and labels
    const color = d3.scaleOrdinal(colorsArray);
   
    // Generate the pie
    const pie = d3.pie()
                .value(function(d) { return d.count; });

    // Generate the arcs
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Generate labels
    const labelArc = d3.arc()
        .outerRadius(radius- 40)
        .innerRadius(radius- 40);

    // Generate svg
    const svg = d3.select(`#pie-chart-bike-loc`)
    .attr(`width`, width)          
    .attr(`height`, height)
    .append(`g`)
    .attr("transform", "translate(" + radius + "," + radius +")")

    //Generate groups for the arcs
    const arcs = svg.selectAll(`arc`)
        .data(pie(bikeLocCountsArr))
        .enter()
        .append('g')
        .attr('class','arc');
        // .append(arc)


    //Draw arc paths inside the groups
    arcs.append(`path`)
        .attr(`d`, arc)    
        .style(`fill`, function(d, i) {
            //get a color for each element by using its key
            return color(d.data.key);
        });
    

    // legend variables
    let legendRectSize = 25; //size of the legend squares
    let legendSpacing = 5; //spacing between squares
    let legendXOffset = radius + 50; // offset from the left

    // Create a legend structure and position it
    const legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        let height = legendRectSize + legendSpacing; //height of color square + space
        let offset = height * color.domain().length / 2; // vertical offset of the entire legend = height of one element + .05 the total number of elements
        let x = legendXOffset; //legend is shifted to the left to leave room for text
        let y = i * height - offset; // top of element is shifted up/down from center based on the offset and index above
        return `translate(${x},${y})` //return the translation
    });

    // Create the color squares
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);
    
    // Create the color labels
    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d;}); // return label

}

// function takes an array and a selected key, and returns the index of the element containing the key 
const getSelectedElementIndex = (arr, selectedKey) =>{
    //Get the selected element based on the key
    let selectedElement = arr.filter(el => el.key == selectedKey)[0];
    
    //Get the index of the selected element
    let selectedIndex = arr.indexOf(selectedElement);

    return selectedIndex;
}


// --------------------------------------------------------------------------//

//*********************************  HELPER FUNCTIONS: CONTENT GENERATION: PAGE *********************************// 

// --------------------------------------------------------------------------//

//function generates page with risk factors for the specific user
const generatePgRiskFactors = () => {
    //methods hides previous intro page html
    $pgIntro.classList.add(`hidden`);

    //methods shows new risk factors page html
    $pgResults.classList.remove(`hidden`);

    //functions print content for new risk factors page
    printRiskFactors ();
    printTopBar (userDataAr, 0);
    printSvgs (); 
}



// --------------------------------------------------------------------------//

//********************************* BUTTONS *********************************// 

// --------------------------------------------------------------------------//

//when clicked, button generates the risk factors page, based on the user's bike and time information
$btnSubmitUserData.addEventListener (`click`, (event) => {

    //function checks if user had provided their bike information, and if they haven't, displays an error msg
    if ($selectedBikeLoc.value == '' || $selectedBikePrice == '') {
        $bikeInfo.innerHTML += `
            <p class="warning"> Please refresh the page and fill out your bike information to continue </p>
    `
    } else {
        updateUserData (); //update user data with the new information

        //update count arrays
        bikeLocCountsArr = getCounts (bikeLocDataMap, 'Location_Type'); 
        bikeMonthCountsArr = getCounts (bikeMonthDataMap, 'Occurrence_Month');

        // get the selected index from count arrays
        bikeLocSelectedIndex = getSelectedElementIndex(bikeLocCountsArr, userDataAr[0].riskFactors[1].value);
        bikeMonthSelectedIndex = getSelectedElementIndex(bikeMonthCountsArr, userDataAr[0].riskFactors[0].value);

        // put the selected type for the parking first to color it red
        generatePgRiskFactors(); //generate page content
    }
})

//when clicked, button toggles the display of the risk factor
addEventListener (`click`, (event) => {

    //search for a button in the parent (body) and when one is found assign it to a variable
    const btn = event.target.closest(`button`);

    //if the button doesn't match the right class, do nothing; if it does, proceed
    if(!btn || !btn.matches(`.expand-collapse`))
    {
        return; 
    }
    //rotate the expand button
    btn.classList.toggle(`rotate-180d`);

    //go up the DOM tree to the parent, find the section to be hidden and add a toggle for a hiding class;
    event.target.closest(`li`).querySelector(`.infographic`).classList.toggle(`hidden`);
});


