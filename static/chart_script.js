document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('line-chart').getContext('2d');
    var myChart;

    // Function to update chart data
    function updateChart() {
    // Make AJAX request to fetch updated data
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Parse the response JSON
                var newData = JSON.parse(xhr.responseText);

                // Update chart data
                myChart.data.labels = newData.labels;
                myChart.data.datasets[0].data = newData.values;

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
                datasets: [{
                    label: 'My First Dataset',
                    data: initialData.values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
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
    setInterval(updateChart, 5000);
});
function selectModel(modelName, modelObject) {
        // Send an HTTP request to the Flask backend with the selected model
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
                console.log('Model selection sent successfully');
                console.log(response.json());
                // Hide the dropdown content
                toggleDropdown();
            } else {
                // Handle error if needed
                console.error('Error sending model selection');
            }
        })
        .catch(error => {
            console.error('Error sending model selection:', error);
        });
    }
function escapeJson(jsonString) {
    // Replace single quotes with their HTML entity representation
    return jsonString.replace(/'/g, '&#39;');
}


