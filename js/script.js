
//**** HELPER FUNCTIONS: Generate Data ARRAY ****// 

// Function calculates days spent commuting for one year based one user's vacation days and daily commute in min
const commuteInDaysForOneYear = (dailyCommuteInMin, vacationDaysForOneYear) => {
    return (dailyCommuteInMin/60)*(365-52*2-vacationDaysForOneYear)/24
}; 

console.log(commuteInDaysForOneYear(120, 14))

// Function calculates days spent working for one year based one user's vacation days 
const workInDaysForOneYear = (vacationDaysForOneYear) => {
   return 8*(365-52*2 - vacationDaysForOneYear)/24
} 

console.log(workInDaysForOneYear (14))

// Function calculates sleeping days during one year
const sleepingDaysForOneYear = () => {
    return (8*365)/24
 } 

 // Function calculates household/eating time during one year
const choresDaysForOneYear = () => {
    return (3*365)/24
 } 
 

// Function calculates days spent on other activities during one year
const otherActivitiesInDaysForOneYear = 365 - workInDaysForOneYear(14) - commuteInDaysForOneYear(120, 14) - sleepingDaysForOneYear () - choresDaysForOneYear ()



//**** DATA ****// 
const myDaysForOneYear = [{'value':commuteInDaysForOneYear(120, 14), 'label': 'c'}, {'value': workInDaysForOneYear(14), 'label': 'w'}, {'value':otherActivitiesInDaysForOneYear, 'label':'o'}, {'value':sleepingDaysForOneYear (), 'label':'s'}, {'value': choresDaysForOneYear (), 'label': 'h'}];

console.log(myDaysForOneYear)

const width = 300,
      height = 300,
      radius = Math.min(width, height) / 2;

const color = d3.scaleOrdinal([`#2C93E8`,`#838690`,`#F56C4E`, `darkgreen`, `darkgrey`])

// Generate the pie
const pie = d3.pie()
            .value(function(d) { return d.value; });

// Generate the arcs
const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// Generate labels
const labelArc = d3.arc()
	.outerRadius(radius- 40)
	.innerRadius(radius- 40);

//Generate groups for the arcs
const arcs = d3.select(`#pie-chart`)
    .attr(`width`, width)          
    .attr(`height`, height)
    .append(`g`)
    .attr("transform", "translate(" + width/2 + "," + height/2 +")")
    .selectAll(`arc`)
    .data(pie(myDaysForOneYear))
    .enter()
    .append('g')
    .attr('class','arc');
    // .append(arc)


//Draw arc paths inside the groups
arcs.append(`path`)
    .attr(`d`, arc)    
    .style(`fill`, function(d, i) {
        return color(i);
    });
    
arcs.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .text(function(d) { return d.data.label;})
    .style("fill", "#fff");
