// Load Chart.js from CDN (add to HTML head: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>)
document.addEventListener('DOMContentLoaded', function() {
    // Function to load CSV data (assumes CSV is in /data/sample_water_data.csv with columns: Date,pH,Turbidity)
    async function loadData() {
        try {
            const response = await fetch('data/sample_water_data.csv'); // Adjust path if needed
            const text = await response.text();
            const rows = text.split('\n').slice(1); // Skip header
            const data = rows.map(row => {
                const [date, ph, turbidity] = row.split(',');
                return { date: new Date(date), ph: parseFloat(ph), turbidity: parseFloat(turbidity) };
            }).filter(d => !isNaN(d.ph)); // Filter valid data
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return [];
        }
    }

    // Analyze and visualize data
    loadData().then(data => {
        if (data.length === 0) return;

        // Calculate averages
        const avgPH = data.reduce((sum, d) => sum + d.ph, 0) / data.length;
        const avgTurbidity = data.reduce((sum, d) => sum + d.turbidity, 0) / data.length;

        // Display stats
        const statsDiv = document.getElementById('stats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <h3>Data Summary</h3>
                <p>Average pH: ${avgPH.toFixed(2)} (Ideal: 6.5-8.5 for drinking water)</p>
                <p>Average Turbidity: ${avgTurbidity.toFixed(2)} NTU (High levels >5 NTU indicate potential pollution)</p>
                <p>Biology Insight: Elevated turbidity often correlates with runoff, increasing microbial pathogens like E. coli, which can harm aquatic ecosystems and human health.</p>
                ${avgTurbidity > 5 ? '<p style="color:red;">Alert: Potential pollution detected—recommend microbial testing.</p>' : ''}
            `;
        }

        // Create charts
        const ctxPH = document.getElementById('phChart').getContext('2d');
        const ctxTurb = document.getElementById('turbChart').getContext('2d');

        new Chart(ctxPH, {
            type: 'line',
            data: {
                labels: data.map(d => d.date.toLocaleDateString()),
                datasets: [{
                    label: 'pH Level',
                    data: data.map(d => d.ph),
                    borderColor: 'blue',
                    fill: false
                }]
            },
            options: { responsive: true }
        });

        new Chart(ctxTurb, {
            type: 'line',
            data: {
                labels: data.map(d => d.date.toLocaleDateString()),
                datasets: [{
                    label: 'Turbidity (NTU)',
                    data: data.map(d => d.turbidity),
                    borderColor: 'green',
                    fill: false
                }]
            },
            options: { responsive: true }
        });
    });
});