
const rootStyles = getComputedStyle(document.documentElement);

const theme = {
        bg: rootStyles.getPropertyValue('--background-color').trim(),
        text: rootStyles.getPropertyValue('--default-color').trim(),
        heading: rootStyles.getPropertyValue('--heading-color').trim(), //Dark Red
        golden: rootStyles.getPropertyValue('--surface-color').trim(),
        teal: rootStyles.getPropertyValue('--contrast-color').trim(),
        orange: rootStyles.getPropertyValue('--orange-color').trim(),
        grid: 'rgba(34, 29, 63, 0.1)',

        // Data Source Colors (Consistent across all charts)
        sources: {
            istat: rootStyles.getPropertyValue('--contrast-color').trim(),    // Teal
            openData: rootStyles.getPropertyValue('--surface-color').trim(), // Golden
            data: rootStyles.getPropertyValue('--orange-color').trim(),  // Orange
            histCenter: rootStyles.getPropertyValue('--heading-color').trim(), // Dark Red
            outerZones: rootStyles.getPropertyValue('--surface-color').trim()
        }
    };


// --- CHART 1: ISTAT vs Open Data Growth Comparison (MD1) ---
function initGrowthChart() {
        fetch("assets/datasets/MD1_istat_opendata_comparison.csv")
            .then(response => {
                if (!response.ok) throw new Error("File not found");
                return response.text();
            })
            .then(csvText => {
                const lines = csvText.trim().split(/\r?\n/);
                const delimiter = lines[0].includes(';') ? ';' : ',';
                const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));
                const rows = lines.slice(1).map(line => {
                    const values = line.split(delimiter);
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] ? values[i].trim().replace(/"/g, '') : null;
                        return obj;
                    }, {});
                });

                const clean = (val) => {
                    if (!val) return null;
                    let n = parseFloat(val.toString().replace(',', '.'));
                    return isNaN(n) ? null : n;
                };

                const traceIstat = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['percentuale crescita istat'])),
                    name: 'ISTAT',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.istat, width: 3, shape: 'spline' }
                };

                const traceOpenData = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['percentuale crescita open data bologna'])),
                    name: 'Open Data Bologna',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.openData, width: 3, dash: 'dot', shape: 'spline' }
                };

                const layout = {
                    title: { text: 'ISTAT vs Open Data Comparison', font: { color: theme.heading, size: 20 } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: theme.text },
                    xaxis: { title: 'Year', gridcolor: theme.grid },
                    yaxis: { title: 'Growth %', gridcolor: theme.grid },
                    hoverlabel: {
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      bordercolor: theme.heading,
                      font: { color: '#333' },
                    },
                    hovermode: 'x unified',
                    legend: { orientation: 'h', y: -0.2 },
                    dragmode: 'select', // This makes Box Select the default active tool
                };

                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToAdd: ['select2d', 'lasso2d'] // Ensures the select tools are available
                };

                Plotly.newPlot('line-plot1', [traceIstat, traceOpenData], layout, config);
            })
            .catch(err => console.error("Error Chart 1:", err.message));
}


// --- CHART 2: Per-establishment Tourism Load in Bologna (MD2) ---
function initCapacityChart () {
        fetch("assets/datasets/MD2_tourism_load.csv")
          .then(response => {
              if (!response.ok) throw new Error("File not found");
              return response.text();
          })

          .then(csvText => {
                const lines = csvText.trim().split(/\r?\n/);
                const delimiter = lines[0].includes(';') ? ';' : ',';
                const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));
                const rows = lines.slice(1).map(line => {
                    const values = line.split(delimiter);
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] ? values[i].trim().replace(/"/g, '') : null;
                        return obj;
                    }, {});
                });

                const clean = (val) => {
                    if (!val) return null;
                    let n = parseFloat(val.toString().replace(',', '.'));
                    return isNaN(n) ? null : n;
                };

                const traceLoadDensity = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['densità di carico'])),
                    name: 'Arrival Density (per structure)',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.data, width: 3, shape: 'spline' },
                    showLegend: true,
                };

                const layout = {
                    title: { text: 'Per-establishment Tourism Load in Bologna', font: { color: theme.heading, size: 20 } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: theme.text },

                    // --- LEGEND SETTINGS ---
                    showlegend: true,
                    legend: {
                        orientation: 'h',
                        yanchor: 'bottom',
                        y: -0.3,
                        font: { color: theme.text }
                    },
                    // -----------------------

                    xaxis: { title: 'Year', gridcolor: theme.grid },
                    yaxis: {
                      title: {
                        text: 'Arrival Density (per structure)',
                        standoff: 15
                      },
                      gridcolor: theme.grid
                    },
                    hovermode: 'x unified',
                    dragmode: 'select', // This makes Box Select the default active tool
                };

                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToAdd: ['select2d', 'lasso2d'] // Ensures the select tools are available
                };

                Plotly.newPlot('line-plot2', [traceLoadDensity], layout, config);
            })
            .catch(err => console.error("Error Chart 2:", err.message));
}


// --- CHART 3: Legislative impact (MD3) ---
function initLegislativeChart () {
        fetch("assets/datasets/MD3_legislative_impact.csv")
          .then(response => {
              if (!response.ok) throw new Error("File not found");
              return response.text();
          })

          .then(csvText => {
                const parseCSVLine = (line) => {
                    const result = [];
                    let cur = '';
                    let inQuotes = false;
                    for (let char of line) {
                        if (char === '"') inQuotes = !inQuotes;
                        else if (char === ',' && !inQuotes) {
                            result.push(cur.trim());
                            cur = '';
                        } else cur += char;
                    }
                    result.push(cur.trim());
                    return result;
                };
                const lines = csvText.trim().split(/\r?\n/);
                const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());

                const rows = lines.slice(1).map(line => {
                    const values = parseCSVLine(line);
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] || null;
                        return obj;
                    }, {});
                });

                const clean = (val) => {
                    if (!val) return null;
                    let n = parseFloat(val.toString().replace(',', '.'));
                    return isNaN(n) ? null : n;
                };

                // --- COLOR MAPPING FOR PERIODS ---
                const periodColorMap = {
                    "Mercato deregolamentato": theme.teal,
                    "Istituzionalizzazione locazioni brevi": theme.golden,
                    "Obbligo CIR": theme.orange,
                    "Obbligo nazionale CIN": theme.heading,
                    "Aumento gettito fiscale": theme.text,
                };

                let data = []
                let shapes = [];
                let annotations = [];
                let periodsInLegend = [];

                const traceIstat = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['conteggio istat'])),
                    name: 'ISTAT',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.istat, width: 3, shape: 'spline' },
                    showLegend: true,
                };

                const traceOpenData = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['conteggio open data bologna'])),
                    name: 'Open Data Bologna',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.openData, width: 3, dash: 'dot', shape: 'spline' },
                    showLegend: true,
                };

                data.push(traceIstat, traceOpenData);

                // SHAPES AND ANNOTATIONS
                rows.forEach((row, i) => {

                    // Law Annotations
                    if (row['id_legge'] && row['id_legge'] !== "null") {
                        annotations.push({
                            x: row['anno'],
                            y: clean(row['conteggio open data bologna']),
                            text: row['id_legge'],
                            showarrow: true, arrowhead: 2, ax: 0, ay: -40,
                            font: { size: 10, color: theme.text },
                            bgcolor: theme.bg, bordercolor: theme.grid
                        });
                    }

                    // Background shapes (Rectangles between points)
                    if (i < rows.length - 1) {
                    const currentYear = row['anno'];
                    const nextYear = rows[i+1]['anno'];
                    const periodName = row['periodo normativo'];
                    const periodColor = periodColorMap[periodName] || periodColorMap['default'];

                        shapes.push({
                            type: 'rect', xref: 'x', yref: 'paper',
                            x0: currentYear, x1: nextYear, y0: 0, y1: 1,
                            fillcolor: periodColor, opacity: 0.15,
                            line: { width: 0 }, layer: 'below'
                        });

                        // Fake trace for Legend entry of periods
                        if (!periodsInLegend.includes(periodName)) {
                            data.push({
                                x: [null], y: [null],
                                name: periodName,
                                mode: 'markers',
                                marker: { symbol: 'square', size: 12, color: periodColor, opacity: 0.5 },
                                legendgroup: 'periods',
                                showlegend: true
                            });
                            periodsInLegend.push(periodName);
                        }
                    }
                });

                const layout = {
                    title: { text: 'Legislative Impact', font: { color: theme.heading, size: 20 } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: theme.text },

                    // --- LEGEND SETTINGS ---
                    showlegend: true,
                    legend: {
                        orientation: 'h',
                        y: -0.3,
                        xanchor: 'center',
                        x: 0.5,
                        font: { color: theme.text }
                    },
                    // -----------------------

                    xaxis: {
                      title: "Year",
                      gridcolor: theme.grid,
                      dtick: 1
                    },
                    yaxis: {
                      title: {
                        text: "Number of Accommodation Facilities",
                        standoff: 15,
                      },
                      gridcolor: theme.grid,
                    },
                    margin: { t: 80, b: 180, l: 80, r: 50 },
                    shapes: shapes,
                    annotations: annotations,
                    data: data,
                    hovermode: 'x unified',
                    dragmode: 'select', // This makes Box Select the default active tool
                };

                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToAdd: ['select2d', 'lasso2d'] // Ensures the select tools are available
                };

                Plotly.newPlot('line-plot3', data, layout, config);
            })
            .catch(err => console.error("Error Chart 3:", err.message));
}


// --- CHART 4: Price vs. Facilities Growth Rate (MD4) ---
function initGrowthPricesChart () {
        fetch("assets/datasets/MD4_correlation_prices_vs_facilities_by_zone.csv")
          .then(response => {
              if (!response.ok) throw new Error("File not found");
              return response.text();
          })

          .then(csvText => {
                const lines = csvText.trim().split(/\r?\n/);
                const delimiter = lines[0].includes(';') ? ';' : ',';
                const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''));
                const rows = lines.slice(1).map(line => {
                    const values = line.split(delimiter);
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] ? values[i].trim().replace(/"/g, '') : null;
                        return obj;
                    }, {});
                });

                const clean = (val) => {
                    if (!val) return null;
                    let n = parseFloat(val.toString().replace(',', '.'));
                    return isNaN(n) ? null : n;
                };

                const tracePricesHistCentre = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['crescita prezzi centro storico'])),
                    name: 'Price Growth (Historic Center)',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.histCenter, width: 3, dash: 'dot', shape: 'spline' },
                    showLegend: true,
                };

                const traceFacilitiesHistCentre = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['crescita strutture centro storico'])),
                    name: 'Increase in Accomodations (Historic Center)',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.histCenter, width: 3, shape: 'spline' },
                    showLegend: true,
                };

                const tracePricesOuterZones = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['crescita prezzi zone esterne'])),
                    name: 'Price Growth (Outer Zones)',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.outerZones, width: 3, dash: 'dot', shape: 'spline' },
                    showLegend: true,
                };

                const traceFacilitiesOuterZones = {
                    x: rows.map(r => r['anno']),
                    y: rows.map(r => clean(r['crescita strutture zone esterne'])),
                    name: 'Increase in Accomodations (Outer Zones)',
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: theme.sources.outerZones, width: 3, shape: 'spline' },
                    showLegend: true,
                };

                const layout = {
                    title: { text: 'Price vs. Facilities Growth Rate', font: { color: theme.heading, size: 20 } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: theme.text },

                    // --- LEGEND SETTINGS ---
                    showlegend: true,
                    legend: {
                        orientation: 'h', // Horizontal
                        y: -0.3,         // Position it below the x-axis
                        xanchor: 'center',
                        x: 0.5,
                        font: { color: theme.text }
                    },
                    // -----------------------

                    xaxis: { title: 'Year', gridcolor: theme.grid },
                    yaxis: {
                      title: {
                        text: 'Growth Rate (%)',
                        standoff: 15
                      },
                      gridcolor: theme.grid
                    },
                    hovermode: 'x unified',
                    dragmode: 'select', // This makes Box Select the default active tool
                };

                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToAdd: ['select2d', 'lasso2d'] // Ensures the select tools are available
                };

                Plotly.newPlot('line-plot4', [traceFacilitiesHistCentre, traceFacilitiesOuterZones, tracePricesHistCentre, tracePricesOuterZones], layout, config);
            })
            .catch(err => console.error("Error Chart 4:", err.message));
}


// --- CHART 6: Price Sensitivity vs. Enrollment Growth (2014-2024) ---
function initSensitivityScatterPlot() {
        fetch("assets/datasets/MD6_regional_enrollment_rent_correlation.csv")
            .then(response => {
                if (!response.ok) throw new Error("File not found");
                return response.text();
            })

            .then(csvText => {
                const lines = csvText.trim().split(/\r?\n/);

                // SMART PARSER
                const parseCSVLine = (line) => {
                    const result = [];
                    let cur = '';
                    let inQuotes = false;
                    for (let char of line) {
                        if (char === '"') inQuotes = !inQuotes;
                        else if (char === ',' && !inQuotes) {
                            result.push(cur.trim());
                            cur = '';
                        } else cur += char;
                    }
                    result.push(cur.trim());
                    return result;
                };

                // CLEAN HEADERS: Remove BOM, spaces, and force lowercase
                const headers = parseCSVLine(lines[0]).map(h =>
                    h.replace(/[^\x20-\x7E]/g, "").trim().toLowerCase()
                );

                const normalize = s =>
                    s.replace(/[^\x20-\x7E]/g, "")
                    .trim()
                    .toLowerCase();

                const rows = lines.slice(1).map(line => {
                    const values = parseCSVLine(line);
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] || null;
                        return obj;
                    }, {});
                });

                const clean = (val) => {
                    if (val === undefined || val === null || val === "") return 0;
                    let n = parseFloat(val.toString().replace(',', '.').replace(/[^\d.-]/g, ''));
                    return isNaN(n) ? 0 : n;
                };
                // 2. DATA EXTRACTION
                const regions = rows.map(r => r['regione']);
                const xSens = rows.map(r => clean(r[normalize('indice di sensibilità')]));
                const yGrowth = rows.map(r => clean(r[normalize('delta percentuale decennale')]));

                // Generate colors dynamically since we don't have Knime RowColors
                const regionColors = regions.map((_, i) => {
                    const palette = [theme.sources.istat, theme.sources.openData, theme.heading, '#221D3F', '#82B5AE', '#C9A12D'];
                    return palette[i % palette.length];
                });

                // 3. SCATTER TRACE
                const data = [{
                    x: xSens,
                    y: yGrowth,
                    text: regions,
                    mode: 'markers',
                    textposition: 'top center',
                    type: 'scatter',
                    marker: {
                        size: 18, // Fixed uniform size
                        color: regionColors,
                        line: { width: 2 }
                      },
                      hovertemplate: '<b>%{text}</b><br>Sensitivity: %{x:.2f}<br>Growth: %{y:.1f}%<extra></extra>'
                }];

                // 4. LAYOUT WITH QUADRANTS
                const layout = {
                    title: {
                        text: 'Price Sensitivity vs. Enrollment Growth (2014-2024)',
                        font: { color: theme.heading, size: 20 }
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: '#E5D2CC',
                    font: { color: theme.text },
                    hovermode: 'closest',
                    xaxis: {
                        title: 'Price Sensitivity (Correlation Coefficient)',
                        range: [Math.min(...xSens) - 0.1, Math.max(...xSens) + 0.1],
                        zeroline: true,
                        zerolinewidth: 2,
                        zerolinecolor: '#333',
                        gridcolor: theme.grid
                    },
                    yaxis: {
                        title: 'Enrollment Growth (%)',
                        range: [Math.min(...yGrowth) -0.5, Math.max(...yGrowth) +0.5 ],
                        zeroline: true,
                        zerolinewidth: 2,
                        zerolinecolor: '#333',
                        gridcolor: theme.grid
                    },
                    annotations: [
                        {
                            xref: 'paper', yref: 'paper',
                            x: 0.05, y: 0.95, // Top Left
                            text: '<b>Resilient / Price Insensitive</b>',
                            showarrow: false,
                            font: {color: theme.text, size: 11},
                            xanchor: 'left'
                        },
                        {
                            xref: 'paper', yref: 'paper',
                            x: 0.05, y: 0.05, // Bottom Left
                            text: '<b>Vulnerable / Price Driven</b>',
                            showarrow: false,
                            font: {color: '#771710', size: 11},
                            xanchor: 'left'
                        },
                        {
                            xref: 'paper', yref: 'paper',
                            x: 0.95, y: 0.95, // Top Right
                            text: '<b>Steady Growth</b>',
                            showarrow: false,
                            font: {color: theme.text, size: 11},
                            xanchor: 'right'
                        }
                    ],
                    shapes: [
                        // Vertical line at X=0 that always stretches top to bottom
                        { type: 'line', x0: 0, x1: 0, y0: 0, y1: 1, xref: 'x', yref: 'paper', line: { color: 'black', width: 1, dash: 'dot' } },
                        // Horizontal line at Y=0 that always stretches left to right
                        { type: 'line', x0: 0, x1: 1, y0: 0, y1: 0, xref: 'paper', yref: 'y', line: { color: 'black', width: 1, dash: 'dot' } }
                    ],
                    margin: { t: 80, b: 80, l: 80, r: 50 },
                    dragmode: 'select', // This makes Box Select the default active tool
                    autosize: true,
                };

                const config = {
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToAdd: ['select2d', 'lasso2d'] // Ensures the select tools are available
                };

                Plotly.newPlot('sensitivity-plot', data, layout, config);
            })
            .catch(err => console.error("Error Sensitivity Plot:", err));
}


// --- CHART 6: Choropleth map ---
/// 1. Initialize Map
// Initialize Map

// Define the corners of the Italy bounding box
const southWest = L.latLng(35.0, 6.0);
const northEast = L.latLng(47.5, 19.0);
const bounds = L.latLngBounds(southWest, northEast);

const map = L.map('map', {
    center: [41.8719, 12.5674],
    zoom: 5,
    minZoom: 4,           // Prevents zooming out to see Europe
    maxBounds: bounds,    // Locks the view to Italy
    maxBoundsViscosity: 1.0 // Makes the edges "hard" so you can't pull past them
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

let geoData, csvData, geoLayer;

// Color Function (Dark Red #771710 for high values)
function getColor(d) {
    return d > 20  ? '#771710' :
           d > 10  ? '#9A2D24' :
           d > 5   ? '#C04F47' :
           d > 2   ? '#E07A74' :
                     '#F3B1AD';
}

// Mapping Object (Ensure these keys match your GeoJSON properties exactly)
const regionMapper = {
    "Valle d'Aosta/Vallée d'Aoste": "VALLE D'AOSTA",
    "Trentino-Alto Adige/Südtirol": "TRENTINO ALTO ADIGE",
    "Friuli-Venezia Giulia": "FRIULI VENEZIA GIULIA",
    "Emilia-Romagna": "EMILIA ROMAGNA"
};


// Initialization
async function initItalyMap() {
    try {
        // FETCH LOCAL FILES
        geoData = await d3.json("assets/datasets/limits_IT_regions.geojson");
        csvData = await d3.csv("assets/datasets/D1_student_composition.csv");

        const yearSelect = document.getElementById("yearSelect");
        const years = [...new Set(csvData.map(d => d.AnnoA))].sort().reverse();

        years.forEach(year => {
            let opt = document.createElement("option");
            opt.value = year;
            opt.innerHTML = year;
            yearSelect.appendChild(opt);
        });

        // Call updateMap for the first time to show the first year
        updateMap(years[0]);

        // Update map whenever the user changes the year
        yearSelect.addEventListener("change", (e) => updateMap(e.target.value));


        // LOAD MAP avoiding viewport resizing
        function forceProperLayout() {
            applyResponsiveFit();
            map.invalidateSize(true);
          }

          map.whenReady(() => {
            requestAnimationFrame(() => {
              forceProperLayout();
              setTimeout(() => {
                map.invalidateSize(true);
              }, 200);
            });
          });

          window.addEventListener(
            "load",
            () => {
              setTimeout(() => {
                forceProperLayout();
              }, 300);
            },
            { once: true }
          );
          let resizeTimer;

        const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            map.invalidateSize();
            applyResponsiveFit();
        }, 100);
        });

        const mapDiv = document.getElementById("map");
        if (mapDiv) {
        resizeObserver.observe(mapDiv);
        }

    } catch (err) {
        console.error("Data loading failed. Check filenames:", err);
    }
}


function updateMap(selectedYear) {
    // Remove existing layer so colors don't stack/overlap
    if (geoLayer) map.removeLayer(geoLayer);

    const yearRow = csvData.find(d => d.AnnoA === selectedYear);

    geoLayer = L.geoJson(geoData, {
        style: (feature) => {
            const geoName = feature.properties.reg_name || feature.properties.name;
            const csvCol = (regionMapper[geoName] || geoName).toUpperCase().trim();
            const val = parseFloat(yearRow[csvCol]) || 0;

            return {
                fillColor: getColor(val),
                weight: 1.5,
                color: 'white',
                fillOpacity: 0.8
            };
        },
        onEachFeature: (feature, layer) => {
            const geoName = feature.properties.reg_name || feature.properties.name;
            const csvCol = (regionMapper[geoName] || geoName).toUpperCase().trim();
            const val = yearRow[csvCol] || 0;

            // 1. Create the Tooltip (appears on hover)
            layer.bindTooltip(
                `<div style="text-align: center;">
                    <strong style="font-size: 14px;">${csvCol}</strong><br/>
                    <span style="font-size: 18px; color: #771710;">${val}%</span>
                </div>`,
                {
                    sticky: true,        // Tooltip follows the mouse
                    direction: "auto",
                    className: "custom-tooltip" // We will style this in CSS
                }
            );

            // Interactive Hover Effect
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({
                        weight: 1,
                        color: theme.heading , // Darker border on hover
                        fillOpacity: 1
                    });
                    l.bringToFront();
                },
                mouseout: (e) => {
                    geoLayer.resetStyle(e.target);
                }
            });
        }
    }).addTo(map);
}

const legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend legend-container');
    const grades = [0, 2, 5, 10, 20];
    div.innerHTML += '<strong>Enrollment %</strong><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div><i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+') + '</div>';
    }
    return div;
};
legend.addTo(map);


// Carousel Resize Handler and Navigation Button Visibility
document.getElementById('workflowCarousel').addEventListener('slide.bs.carousel', function (event) {
    // This finds all Plotly graphs on the page and tells them to resize to their containers
    const plotlyPlots = document.querySelectorAll('.js-plotly-plot');
    plotlyPlots.forEach(plot => {
        Plotly.Plots.resize(plot);
    });
});

// Update carousel navigation button visibility after slide transition
document.getElementById('workflowCarousel').addEventListener('slid.bs.carousel', function () {
    updateCarouselButtons();
});

// Function to update carousel navigation button visibility
function updateCarouselButtons() {
    const carousel = document.getElementById('workflowCarousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const activeItem = carousel.querySelector('.carousel-item.active');
    const activeIndex = Array.from(items).indexOf(activeItem);

    const prevBtn = carousel.querySelector('.carousel-control-prev');
    const nextBtn = carousel.querySelector('.carousel-control-next');

    // Hide prev button on first slide
    if (activeIndex === 0) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }

    // Hide next button on last slide
    if (activeIndex === items.length - 1) {
        nextBtn.style.visibility = 'hidden';
    } else {
        nextBtn.style.visibility = 'visible';
    }
}


// --- INITIALIZE ALL CHARTS ---
document.addEventListener('DOMContentLoaded', () => {
    initGrowthChart();
    initCapacityChart();
    initLegislativeChart();
    initGrowthPricesChart();
    initSensitivityScatterPlot();
    initItalyMap(); // Start the async map function

    // Initialize carousel button visibility on page load
    updateCarouselButtons();
});
