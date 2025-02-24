# Chartdown


Convert markdown with chart definitions into interactive visualizations. Built on top of Showdown and Plotly.js.

## Run the demo
python -m http.server 8000
<img width="1512" alt="Screenshot" src="https://github.com/user-attachments/assets/0217ed87-4a37-431a-be9f-f682698a33e4" />

## Chart Syntax

Charts are defined in markdown using `:::chart` blocks:

```markdown
:::chart
{
  type: "pie",
  values: [20, 30, 50],
  labels: ["A", "B", "C"]
}
:::
```

Any valid Plotly.js configuration works:

```markdown
:::chart
{
  data: [{
    type: "scatter",
    mode: "lines+markers",
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17]
  }],
  layout: {
    title: "Trend Analysis"
  }
}
:::
```

## Usage with LLMs

Add this to your prompt to get chart-ready output:

```
Format data visualizations using :::chart blocks with Plotly.js JSON configuration.

Example:
:::chart
{
  data: [{
    type: "scatter",
    mode: "lines+markers",
    x: ["2023-01", "2023-03", "2023-06", "2023-09", "2023-12", "2024-03"],
    y: [100, 120, 150, 140, 180, 190],
    name: "Stock A"
  }, {
    type: "scatter",
    mode: "lines+markers",
    x: ["2023-01", "2023-03", "2023-06", "2023-09", "2023-12", "2024-03"],
    y: [90, 95, 85, 110, 120, 135],
    name: "Stock B"
  }],
  layout: {
    title: "Market Performance Trends",
    xaxis: { title: "Date" },
    yaxis: { title: "Price ($)" }
  }
}
:::

:::chart
{
  data: [{
    type: "sankey",
    orientation: "h",
    node: {
      label: ["Income Tax", "Corporate Tax", "Other Revenue", "Healthcare", "Social Security", "Defense", "Other Spending"],
      color: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"]
    },
    link: {
      source: [0, 1, 2, 0, 1, 2],
      target: [3, 4, 5, 6, 6, 6],
      value: [1200, 800, 600, 900, 700, 1000]
    }
  }],
  layout: {
    title: "Federal Budget Flow (Billions USD)"
  }
}
:::
```


## License

MIT © Chartdown Contributors
