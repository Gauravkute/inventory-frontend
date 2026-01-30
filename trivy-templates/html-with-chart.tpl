<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Trivy Security Report</title>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 20px;
    }
    h1 {
      text-align: center;
    }
    .chart-container {
      width: 70%;
      margin: auto;
    }
  </style>
</head>

<body>

<h1>Trivy Vulnerability Summary</h1>

<div class="chart-container">
  <canvas id="severityChart"></canvas>
</div>

<script>
  const data = {
    labels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    datasets: [{
      label: "Vulnerabilities",
      data: [
        {{ .Summary.Low }},
        {{ .Summary.Medium }},
        {{ .Summary.High }},
        {{ .Summary.Critical }}
      ],
      backgroundColor: [
        "#5fbb31",
        "#e9c600",
        "#ff8800",
        "#e40000"
      ]
    }]
  };

  new Chart(document.getElementById("severityChart"), {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
</script>

<hr>

{{ template "report.html" . }}

</body>
</html>
