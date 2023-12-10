import axios from 'axios';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';



const MonthlyExpenses = ({userData}) => {
  // State to store dropdown values
  const [dropdownValues, setDropdownValues] = useState([]);
  // State to store selected value
  const [selectedValue, setSelectedValue] = useState('');

  const [fetchedData, setFetchedData] = useState(null);

  const [uniqueDatesArray, setUniqueDatesValue] = useState([]);

  const [showCharts, setShowCharts] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesResponse, monthlyExpensesResponse] = await Promise.all([
          axios.get('http://159.203.113.177:3001/expenses', {
            headers: {
              'X-User-ID': userData.user._id,
            },
          }),
          axios.get('http://159.203.113.177:3001/montlyExpenses', {
            headers: {
              'X-User-ID': userData.user._id,
            },
          }),
        ]);
  
        const expensesData = await expensesResponse;
        const monthlyExpensesData = await monthlyExpensesResponse;
  
        // Handle expensesData and monthlyExpensesData as needed
        // console.log('Expenses Data:', expensesData.data);
        // console.log('Monthly Expenses Data:', monthlyExpensesData.data);
  
        // Example: Extract unique dates from monthly expenses
        const uniqueDatesSet = new Set(monthlyExpensesData.data.map(option => option.date));
        setUniqueDatesValue(Array.from(uniqueDatesSet));
        setFetchedData(expensesData.data);
        //console.log(expensesData.data);
  
        // Example: Set dropdown values
        setDropdownValues(monthlyExpensesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Call the fetchData function
  
  }, []); // Empty dependency array ensures the effect runs only once after initial render
  

  const handleDropdownChange = (event) => {
    // Update selected value when the dropdown changes
    setSelectedValue(event.target.value);
  };
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const handleSubmit = async (event) => {
    const idToDescriptionMap = new Map();
    setShowCharts(true);
    fetchedData.forEach(item => {
    idToDescriptionMap.set(item._id, item.description);
    });

    const filteredValues = dropdownValues.filter(p => p.date == selectedValue);

    // Map the description in the second array based on the expense field
    const resultArray = filteredValues.map(item => ({
    ...item,
    description: idToDescriptionMap.get(item.expense),
    }));

    console.log(resultArray);
    let data_p = {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#000080',
          '#800080',
          '#808080',
          '#a52a2a',
        ],
        labels: [],
      };
    
    function Chart_create(data, chartId) {
        if (chartRef.current) {
          d3.select(chartRef.current).select('svg').remove();
        }
        var width = 400;
        var height = 400;
        var radius = Math.min(width, height) / 2;
    
        var svg = d3.select(`#${chartId}`)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
        var color = d3.scaleOrdinal()
          .range(data_p.backgroundColor);
  
        var pie = d3.pie()
          .value(function (d) { return d.amount; });
  
        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
  
        var arcs = svg.selectAll("arc")
          .data(pie(data))
          .enter()
          .append("g");
  
        arcs.append("path")
          .attr("d", arc)
          .attr("fill", function (d) { return color(d.data.description); });
  
        arcs.append("text")
          .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("text-anchor", "middle")
          .text(function (d) { return d.data.description; });
  
      }
      function Chart_create_month(data, chartId) {
        if (chartRef2.current) {
          d3.select(chartRef2.current).select('svg').remove();
        }
        var width = 400;
        var height = 400;
        var radius = Math.min(width, height) / 2;

        var svg = d3.select(`#${chartId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
        var color = d3.scaleOrdinal()
          .range(data_p.backgroundColor);
  
        var pie = d3.pie()
          .value(function (d) { return d.amount; });
  
        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
  
        var arcs = svg.selectAll("arc")
          .data(pie(data))
          .enter()
          .append("g");
  
        arcs.append("path")
          .attr("d", arc)
          .attr("fill", function (d) { return color(d.data.description); });
  
        arcs.append("text")
          .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("text-anchor", "middle")
          .text(function (d) { return d.data.description; });
  
      }
      Chart_create(fetchedData, 'chart');
      Chart_create_month(resultArray, 'chart2');
    event.preventDefault();
  };

  return (
    <div>
        <div className="SignInContainer">
        <h2>Choose month to view the analysis</h2>
        <form className="SignInForm" onSubmit={handleSubmit}>
            <label>
            Select an option:
            <select value={selectedValue} onChange={handleDropdownChange}>
                <option value="">Select...</option>
                {uniqueDatesArray.map(option => (
                <option key={option} value={option}>
                    {formatDate(option)}
                </option>
                ))}
            </select>
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        
        </div>
        {showCharts && (
        <>
        <div className="ChartsContainer">

           
          <h2>This is the anticipated expenditure</h2>
          <div  id="chart" ref={chartRef}></div>
          <h2>This is the actual expenditure</h2>
          <div id="chart2" ref={chartRef2}></div>

         </div>
        
        </>
      )}
    </div>
  );
};

export default MonthlyExpenses;
