var data = 0;
function updateChart(data1) {
    var ctx = document.getElementById('line-chart').getContext('2d');
    data = data1;

    console.log(data)
        }

document.addEventListener("DOMContentLoaded", function() {

    var ctx = document.getElementById('line-chart').getContext('2d');
    var myChart;
    var current_data;

    // Function to update chart data
    function updateChart() {
    if (data != 0){
        if (current_data != data){

        console.log(data)
        var labels1 = [];
        for (var i=0; i< data[0].length; i++){
            labels1.push(i);
        }
        console.log(labels1)

        myChart.data.labels = labels1;
       var newData = [
    {
        label: 'Rpm',
        data: data[0],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red background color
        borderColor: 'rgba(255, 99, 132, 1)', // Red border color
        borderWidth: 1
    },
    {
        label: 'Speed',
        data: data[1],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue background color
        borderColor: 'rgba(54, 162, 235, 1)', // Blue border color
        borderWidth: 2
    },
    {
        label: 'Temperature',
        data: data[2],
        backgroundColor: 'rgba(255, 206, 86, 0.2)', // Yellow background color
        borderColor: 'rgba(255, 206, 86, 1)', // Yellow border color
        borderWidth: 2
    }


];
        for (var i=0; i < newData.length; i++){
            if (myChart.data.datasets.length > 0){
                myChart.data.datasets[i] = newData[i];
            }
            else{
            myChart.data.datasets.push(newData[i]);
}
        }
            // Add the new dataset to the chart

        var maxValue = Math.max(data[0]);
        console.log(data);
        // Update y-axis scale to accommodate the new data
        myChart.options.scales.y.suggestedMax = maxValue + 10;
        myChart.update();
        current_data = data
        }

    }else{


    // Make AJAX request to fetch updated data
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Parse the response JSON
                var newData = JSON.parse(xhr.responseText);

                // Update chart data
                myChart.data.labels = newData.labels;
                //myChart.data.datasets[0].data = newData.values;

                // Update the chart
                myChart.update();
            } else {
                console.error('Failed to fetch data:', xhr.status);
            }
        }
    };
    xhr.open('GET', '/update_chart_data', true);
    xhr.send();

    // Send request to process_model function
}
}

    // Function to create the initial chart
    function createChart() {
        // Initial data (you can replace this with your actual data)
        var initialData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            values: [65, 59, 80, 81, 56, 55, 40]
        };

        // Create the chart
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: initialData.labels,
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Create the initial chart
    createChart();

    // Update the chart every 5 seconds (you can adjust the interval as needed)
    setInterval(updateChart, 1000);
});

function escapeJson(jsonString) {
    // Replace single quotes with their HTML entity representation
    return jsonString.replace(/'/g, '&#39;');
}
function toggleDropdown() {
        var dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }

    function selectModel(modelName, modelObject) {
        // Your code to handle the selection, e.g., updating the chart with the selected data
         fetch('/process_model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model: modelObject }),
        })
        .then(response => {
            if (response.ok) {
                // Handle success if needed
                return response.json()
            } else {
                // Handle error if needed
                console.error('Error sending model selection');
            }
        }).then(data=> {
        if (data && data.length > 0) {
        console.log(data);
        updateChart(data);
        }
        else {
        console.error('Received empty or null data. Chart not updated.');
    }

        })
        .catch(error => {
            console.error('Error sending model selection:', error);
        });
         var selectedModelElement = document.getElementById('selected-model');
    if (modelName !== undefined) {
        selectedModelElement.textContent = "Model: " + modelName;
    } else {
        selectedModelElement.textContent = "Model: None";
    }

        // Close the dropdown after selection
        var dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.display = 'none';
    }

    // Hide dropdown when clicking elsewhere on the screen
    document.addEventListener('click', function(event) {
        var dropdownMenu = document.getElementById('dropdownMenu');
        var target = event.target;
        if (!dropdownMenu.contains(target)) {
            var dropdownContent = dropdownMenu.querySelector('.dropdown-content');
            dropdownContent.style.display = 'none';
        }
    });

