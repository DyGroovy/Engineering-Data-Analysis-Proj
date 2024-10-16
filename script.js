function generatePlot() {
    const dataInput = document.getElementById('dataInput').value.trim(); 

    if (!/^[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?(?:\s*,\s*[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)*$/.test(dataInput)) {
        const errorMessages = document.getElementById('errorMessages');
        errorMessages.textContent = "Error: Please enter only numeric values separated by commas.";
        
        const errorTable = document.getElementById('errorTable');
        errorTable.style.display = 'table'; 
        document.getElementById('app').style.border = '2px solid red';

        document.getElementById('stemAndLeafPlot').innerHTML = '';
        document.getElementById('statistics').innerHTML = '';
        document.getElementById('frequencyDataBody').innerHTML = '';

        document.getElementById('statisticsTable').style.display = 'none';
        document.getElementById('frequencyDataTable').style.display = 'none';

        return;
    }

    const data = dataInput.split(',').map(item => parseFloat(item.trim()));
    
    const errorTable = document.getElementById('errorTable');
    errorTable.style.display = 'none'; 

    document.getElementById('app').style.border = '2px solid black';

    const stemAndLeafData = calculateStemAndLeaf(data);
    displayStemAndLeafPlot(stemAndLeafData);
    
    const statistics = calculateStatistics(data);
    displayStatistics(statistics);

    const frequencyData = calculateFrequency(data);
    displayFrequencyTable(frequencyData); 
    generateFrequencyChart(frequencyData)
}


function calculateGeometricMean(data) {
    const product = data.reduce((acc, val) => acc * val, 1);
    return Math.pow(product, 1 / data.length).toFixed(2);
}

function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return (sum / data.length).toFixed(2);
}

function calculateMedian(data) {
    const sortedData = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
        return ((sortedData[middle - 1] + sortedData[middle]) / 2).toFixed(2);
    } else {
        return sortedData[middle].toFixed(2);
    }
}

function calculateMode(data) {
    const counts = {};
    data.forEach(num => counts[num] = (counts[num] || 0) + 1);
    const maxCount = Math.max(...Object.values(counts));
    const modes = Object.entries(counts)
                         .filter(([num, count]) => count === maxCount)
                         .map(([num, count]) => ({ num, count }));
    return modes;
}

function calculateRange(data) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return max - min;
}

function calculateStemAndLeaf(data) {
    const result = {};
    data.forEach(num => {
        const stem = Math.floor(num / 10);
        const leaf = num % 10;
        if (!result[stem]) {
            result[stem] = [];
        }
        result[stem].push(leaf);
    });
    return result;
}

function displayStemAndLeafPlot(data) {
    const plotDiv = document.getElementById('stemAndLeafPlot');
    plotDiv.innerHTML = '';
    Object.entries(data).forEach(([stem, leaves]) => {
        const stemLeafString = `${stem} | ${leaves.sort((a, b) => a - b).join(' ')}<br>`;
        plotDiv.innerHTML += stemLeafString;
    });
}

function displayStatisticsTable(visible) {
    const statisticsDiv = document.getElementById('statistics');
    statisticsDiv.style.display = visible ? 'block' : 'none';
}

function calculateStatistics(data) {
    const count = data.length;
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const mode = calculateMode(data);
    const range = calculateRange(data);
    const geometricMean = calculateGeometricMean(data);
    const largest = Math.max(...data);
    const smallest = Math.min(...data);
    const sum = data.reduce((acc, val) => acc + val, 0);

    return { count, mean, median, mode, range, geometricMean, largest, smallest, sum };
}

function displayStatistics(statistics) {
    const statisticsDiv = document.getElementById('statistics');
    statisticsDiv.innerHTML = `
        <h2>Statistics Table</h2>
        <div id="statisticsTable">
            <table>
                <thead>
                    <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Count:</td><td>${statistics.count}</td></tr>
                    <tr><td>Mean:</td><td>${statistics.mean}</td></tr>
                    <tr><td>Median:</td><td>${statistics.median}</td></tr>
                    <tr><td>Mode:</td><td>${formatMode(statistics.mode)}</td></tr>
                    <tr><td>Range:</td><td>${statistics.range}</td></tr>
                    <tr><td>Geometric Mean:</td><td>${statistics.geometricMean}</td></tr>
                    <tr><td>Largest:</td><td>${statistics.largest}</td></tr>
                    <tr><td>Smallest:</td><td>${statistics.smallest}</td></tr>
                    <tr><td>Sum:</td><td>${statistics.sum}</td></tr>
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('statisticsTable').style.display = 'block';
}
function formatMode(mode) {
    return mode.map(({ num, count }) => `${num} (${count} times)`).join(', ');
}

function displayStemAndLeafPlot(data) {
    const plotDiv = document.getElementById('stemAndLeafPlot');
    plotDiv.innerHTML = `
        <h2>Stem and Leaf Plot</h2>
        ${generateStemAndLeafTable(data)}
    `;
}

function generateStemAndLeafTable(data) {
    let tableHTML = '<table>';
    for (const [stem, leaves] of Object.entries(data)) {
        const leavesString = leaves.sort((a, b) => a - b).join(' ');
        tableHTML += `<tr><td>${stem} |</td><td>${leavesString}</td></tr>`;
    }
    tableHTML += '</table>';
    return tableHTML;
}
function calculateFrequency(data) {
    const frequencyMap = {};

    const uniqueData = [...new Set(data)]; 
    uniqueData.forEach(num => {
        const frequency = data.filter(item => item === num).length; 
        frequencyMap[num] = frequency;
    });
    
    return frequencyMap;
}
    function displayFrequencyTable(frequencyData) {
        const frequencyDataBody = document.getElementById('frequencyDataBody');
        frequencyDataBody.innerHTML = '';
        for (const [dataPoint, frequency] of Object.entries(frequencyData)) {
            const row = `<tr><td>${dataPoint}</td><td>${frequency}</td></tr>`;
            frequencyDataBody.innerHTML += row;
        }

        document.getElementById('frequencyDataTable').style.display = 'table';
    }

    function generateFrequencyChart(frequencyData) {
        const canvas = document.getElementById('frequencyChart');
        const ctx = canvas.getContext('2d');
   
        if (window.frequencyChart && typeof window.frequencyChart.destroy === 'function') {
            window.frequencyChart.destroy(); 
        }
    
        const dataPoints = Object.keys(frequencyData).map(Number);
        const frequencies = Object.values(frequencyData);

        window.frequencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataPoints,
                datasets: [{
                    label: 'Frequency',
                    data: frequencies,
                    backgroundColor: 'rgba(0,0,0)', 
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Data' 
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Frequency' 
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }    
    