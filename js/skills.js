import { fetchUserData } from './query.js';
// Drawing two circles of skills graphs
export async function drawSkills() {
    const data = await fetchUserData();
    let filters = [
        { type: 'skill_algo' },
        { type: 'skill_front-end' },
        { type: 'skill_back-end' },
        { type: 'skill_stats' },
        { type: 'skill_ai' },
        { type: 'skill_game' }
    ];
    const techSkills = data.transactions.filter(item => filters.some(filter => filter.type === item.type));
    const techData = data.transactions.filter(item => !techSkills.some(techItem => techItem.type === item.type));

    const colors = [
        '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0',
        '#ffb3e6', '#c4e17f', '#76d7c4', '#f7b1ab', '#dab6e1', '#cbbeb5'
    ];

    function drawSkillChart(svgId, chartData, shapeSides) {
        const svg = document.getElementById(svgId);
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        const angleIncrement = 360 / shapeSides;

        // Clear previous contents
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Set the viewBox attribute for responsiveness
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Draw the 100% radius circle
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('cx', centerX);
        outerCircle.setAttribute('cy', centerY);
        outerCircle.setAttribute('r', radius);
        outerCircle.setAttribute('fill', 'none');
        outerCircle.setAttribute('stroke', '#cccccc');
        outerCircle.setAttribute('stroke-width', '2');
        svg.appendChild(outerCircle);

        // Calculate points for each skill
        let skillPoints = chartData.map((item, index) => {
            const percentage = item.amount / 100;
            const skillRadius = percentage * radius;
            const angle = angleIncrement * index - 90;
            const skillX = centerX + skillRadius * Math.cos(angle * Math.PI / 180);
            const skillY = centerY + skillRadius * Math.sin(angle * Math.PI / 180);
            const fullX = centerX + radius * Math.cos(angle * Math.PI / 180);
            const fullY = centerY + radius * Math.sin(angle * Math.PI / 180);
            return { skillX, skillY, fullX, fullY, color: colors[index % colors.length], type: item.type };
        });

        // Draw the polygon connecting actual skill points
        let pathData = "M" + skillPoints.map(p => `${p.skillX},${p.skillY}`).join(" L ") + " Z";
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);

        // Draw the radius lines, points, and legends
        skillPoints.forEach(point => {
            // Draw radius line to the surface of the outer circle
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', point.fullX);
            line.setAttribute('y2', point.fullY);
            line.setAttribute('stroke', point.color);
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);

            // Draw point circle at the actual skill level
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.skillX);
            circle.setAttribute('cy', point.skillY);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', point.color);
            svg.appendChild(circle);

            // Add legend text at the tip of the radius
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', point.fullX);
            text.setAttribute('y', point.fullY);
            text.setAttribute('fill', 'black');
            text.setAttribute('font-size', '12');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = point.type;
            svg.appendChild(text);
        });
    }

    function resizeCharts() {
        drawSkillChart('techChart', techData, techData.length);
        drawSkillChart('skillChart', techSkills, techSkills.length);
    }

    // Initial draw
    resizeCharts();

    // Redraw charts on window resize
    window.addEventListener('resize', resizeCharts);
}