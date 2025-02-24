// Node.js / CommonJS
const ChartdownConverter = require('./ChartdownConverter.js');
const showdown = require('./lib/showdown/showdown.js');

// Browser
// <script src="src/ChartdownConverter.js"></script>

const converter = new ChartdownConverter({
  // showdown options here
  tables: true,
  ghCodeBlocks: true
});

const markdown = `
# Chart Examples

## Cloud Market Share 2024

:::chart
{
  type: "pie",
  values: [34, 33, 16, 10, 7],
  labels: ["AWS", "Azure", "Google Cloud", "Alibaba Cloud", "Others"],
  title: "Cloud Market Share 2024"
}
:::

## US Federal Budget Flow

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
    title: "US Federal Budget Flow (Simplified, Billions USD)"
  }
}
:::

## Monthly Sales Performance

:::chart
{
  type: "bar",
  x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  y: [20, 14, 23, 18, 25, 31],
  marker: {
    color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]
  },
  title: "Monthly Sales 2024"
}
:::
`;

// Convert markdown to HTML
const html = converter.makeHtml(markdown);

// In browser: render charts
if (typeof window !== 'undefined') {
  converter.renderCharts('output')
    .catch(console.error);
} 