// Reference the table body
const courses = document.querySelector("#courseTable tbody");

// Function to render table rows for a specific quarter
function renderTableForQuarter(quarter, data) {
    const quarterHeader = document.createElement("h3");
    quarterHeader.textContent = `Quarter ${quarter}`;
   courses.appendChild(quarterHeader);

    data.forEach(course => {
        const quarter = document.createElement("tr");

        quarter.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
        `;

       courses.appendChild(quarter);
    });
}

// Fetch data from courses.json
fetch('courses.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Group the courses by quarter
    const quarters = [1, 2, 3, 4, 5, 6];
    
    quarters.forEach(quarter => {
        const coursesInQuarter = data.filter(course => course.quarter === quarter);
        if (coursesInQuarter.length > 0) {
            renderTableForQuarter(quarter, coursesInQuarter); // Render courses for each quarter
        }
    });
  })
  .catch(error => {
    console.error("Error fetching the JSON file:", error);
  });
