import { fetchUserData } from './query.js'


async function displayExperience() {
    let xpSum = 0;
    const data = await fetchUserData();
    if (data) {
        // Create a map for quick lookup by path
        const progressMap = new Map(data.progresses.map(item => [item.path, item.createdAt]));

        // Add createdAt to the corresponding xps items
        data.xps.forEach(xp => {
            xpSum += xp.amount;
            if (progressMap.has(xp.path)) {
                xp.createdAt = progressMap.get(xp.path);
            }
        });
        console.log(data.xps)

        const auditsCount = data.audits_aggregate.aggregate.count;
        const ratio = data.auditRatio;

        const userExp = document.createElement('div');
        const header = document.createElement('h2');
        const xps = document.createElement('p');
        const auditDone = document.createElement('p');
        const auditPassed = document.createElement('p');
        const auditRatio = document.createElement('p');

        header.innerText = 'User progress:';
        xps.innerText = 'Total gained xps: ' + Math.round(xpSum / 1000) + ' Kb' || 'No user xp available';
        auditDone.innerText = 'Audits done: ' + auditsCount || 'No audit done available';
        auditPassed.innerText = 'Passed audits: ' + Math.round(auditsCount / ratio) || 'No audits passed available';
        auditRatio.innerText = 'Audits ratio: ' + data.auditRatio.toFixed(2) || 'No audits ratio available';
        userExp.classList.add('user-xps');
        userExp.id = 'xps';

        userExp.appendChild(header);
        userExp.appendChild(xps);
        userExp.appendChild(auditRatio);
        userExp.appendChild(auditDone);
        userExp.appendChild(auditPassed);

        document.body.appendChild(userExp);
    } else {
        console.error('User experience could not be retrieved or is empty');
    }

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 50, left: 60 },
        width = 1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#background")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "background-svg")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Format the data
    data.xps.forEach(d => {
        d.createdAt = parseTime(d.createdAt.split('T')[0]);
        d.projectName = d.path.split('/').pop();
    });

    // Sort data by date
    data.xps.sort((a, b) => a.createdAt - b.createdAt);

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const valueline = d3.line()
        .x(d => x(d.createdAt))
        .y(d => y(d.amount));

    // Scale the range of the data
    x.domain(d3.extent(data.xps, d => d.createdAt));
    y.domain([0, d3.max(data.xps, d => d.amount)]);

    // Add the valueline path.
    svg.append("path")
        .data([data.xps])
        .attr("class", "line")
        .attr("d", valueline)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", "2");

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data.xps)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.createdAt))
        .attr("cy", d => y(d.amount))
        .style("fill", "red");

    // Add labels
    svg.selectAll("text.label")
        .data(data.xps)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.createdAt) + 5)
        .attr("y", d => y(d.amount) - 5)
        .text(d => d.projectName)
        .style("font-size", "10px")
        .style("fill", "black");

    // Add the X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


}


displayExperience();
