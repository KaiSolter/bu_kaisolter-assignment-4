document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let query = document.getElementById("query").value;
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        displayResults(data);
        displayChart(data);
      });
  });

function displayResults(data) {
  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Results</h2>";
  for (let i = 0; i < data.documents.length; i++) {
    let docDiv = document.createElement("div");
    docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
    resultsDiv.appendChild(docDiv);
  }
}

function displayChart(data) {
  let ctx = document.getElementById("similarity-chart").getContext("2d");
  if (window.similarityChart) {
    window.similarityChart.destroy();
  }
  let labels = data.indices.map((index) => `Doc ${index}`);
  let similarities = data.similarities;
  window.similarityChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Cosine Similarity",
          data: similarities,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Semi-transparent blue
          borderColor: "rgba(54, 162, 235, 1)", // Solid blue
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}
