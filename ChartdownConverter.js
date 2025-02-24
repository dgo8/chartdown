/**
 * A wrapper around showdown that adds chart support
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['./lib/showdown/showdown'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS
    module.exports = factory(require('../lib/showdown/showdown'));
  } else {
    // Browser globals
    root.ChartdownConverter = factory(root.showdown);
  }
}(this, function (showdown) {
  'use strict';

  class ChartdownConverter {
    constructor(options = {}) {
      // Register the charts extension
      if (!showdown.extensions.charts) {
        showdown.extension('charts', {
          type: 'lang',
          filter: function(text, converter, options) {
            if (!options.charts) {
              return text;
            }

            const chartRegex = /:::chart\n([\s\S]*?)\n:::/g;
            
            return text.replace(chartRegex, function(match, chartContent) {
              const chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
              
              try {
                // First try to evaluate as JavaScript object
                let obj = new Function('return (' + chartContent + ')')();
                
                // Handle Promise objects
                if (obj instanceof Promise) {
                  return `<div class="showdown-chart-error">
                            Error: Chart configuration cannot be a Promise
                          </div>`;
                }
                
                // If it's a simple chart without data array, wrap it
                if (!obj.data) {
                  obj = {
                    data: [{ ...obj }]
                  };
                }
                
                // Convert to JSON string for storage
                const jsonContent = JSON.stringify(obj);
                
                // Return div with the chart data
                return `<div id="${chartId}" 
                             class="showdown-chart" 
                             data-chart='${jsonContent}'></div>`;
              } catch (error) {
                // If JS eval fails, try parsing as JSON directly
                try {
                  let jsonContent = JSON.parse(chartContent);
                  // Check if we need to wrap the data
                  if (!jsonContent.data) {
                    jsonContent = {
                      data: [{ ...jsonContent }]
                    };
                  }
                  return `<div id="${chartId}" 
                               class="showdown-chart" 
                               data-chart='${JSON.stringify(jsonContent)}'></div>`;
                } catch (jsonError) {
                  return `<div class="showdown-chart-error">
                            Error parsing chart data: ${error.message}
                          </div>`;
                }
              }
            });
          }
        });
      }

      // Create converter with charts extension and tables enabled by default
      this.converter = new showdown.Converter({
        extensions: ['charts'],
        tables: true,           // Enable tables by default
        ghCodeBlocks: true,     // Enable GitHub style code blocks
        tasklists: true,        // Enable task lists
        strikethrough: true,    // Enable strikethrough
        ...options              // Allow overriding defaults with user options
      });

      // Enable charts option
      this.converter.setOption('charts', true);
    }

    /**
     * Convert markdown to HTML
     * @param {string} markdown Input markdown text
     * @param {string} containerId ID of the container element to render the chart
     * @returns {string} HTML output with chart placeholders
     */
    convert(markdown, containerId) {
      // Convert markdown to HTML
      const html = this.converter.makeHtml(markdown);
      
      if (typeof window !== 'undefined' && containerId) {
        const element = document.getElementById(containerId);
        if (element) {
          element.innerHTML = html;
          // Render charts immediately
          this._renderCharts(element);
        }
      }
      return html;
    }

    // Private method for chart rendering
    _renderCharts(container) {
      if (!window.Plotly) {
        throw new Error('Plotly.js is required for rendering charts');
      }

      const charts = container.querySelectorAll('.showdown-chart');
      for (const chart of charts) {
        try {
          const config = JSON.parse(chart.dataset.chart);
          Plotly.newPlot(chart.id, config.data, config.layout || {});
        } catch (error) {
          console.error('Error rendering chart:', error);
          chart.innerHTML = `Error rendering chart: ${error.message}`;
          chart.classList.add('showdown-chart-error');
        }
      }
    }
  }

  return ChartdownConverter;
})); 