// Reference the table body
const courses = document.querySelector("#courseTable tbody");

// Function to render table rows for a specific quarter
function renderTableForQuarter(quarter, data) {
    const quarterHeader = document.createElement("h2");
    quarterHeader.textContent = `Quarter ${quarter}`;
   courses.appendChild(quarterHeader);

    data.forEach(course => {
      // Creates the span for the course
        const c = document.createElement("span");
        // Creates the text for the span
        c.innerHTML = `
            ${course.id} : ${course.name} ( ${course.credits} Credits )
        `;
        // Sets the id for the course
        c.id = `${course.id}`;
        // Creates the dataset of prerequisites
        c.dataset.prerequisites = JSON.stringify(course.prerequisites);
        // Creates the dataset of requirements
        c.dataset.required_by = JSON.stringify(course.required_by);
       courses.appendChild(c);
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

// Allow user to click spans without prerequirements
document.getElementById('startButton').addEventListener('click', function() {
  // Gets all spans on the page
  const spans = document.querySelectorAll('span');
  // ForEach loop for spans
  spans.forEach((span) => {
    // Gets the prerequisites array
      const prerequisites = JSON.parse(span.dataset.prerequisites);
      // If the array is empty
      if (prerequisites.length === 0) {
        // Set the background color to white (available)
        span.style.backgroundColor = 'white';
      }
  });
});


// Allow user to click spans that are available to be clicked
document.body.addEventListener('click', function(event) {
  // If the item is a span
  if (event.target.tagName === 'SPAN') {
    // If the span's background is white (available)
    if (event.target.style.backgroundColor === 'white') {
      // Set background color to lightgreen
      event.target.style.backgroundColor = 'lightgreen';
      // Get the array of courses that need this course
      required_by = JSON.parse(event.target.dataset.required_by);
      // If the course is a prerequisite
      if (required_by.length > 0) {
        // for each course that needs this course
        for (let i = 0; i < required_by.length; i++) {
          // Checks the course
          course = document.getElementById(required_by[i])
          // Get prereqs for that course
          prereqs = JSON.parse(course.dataset.prerequisites);
          // boolean for whether the course should be made available
          avail = true
          for (let i = 0; i < prereqs.length; i++) {
            // get the course to check
            c = document.getElementById(prereqs[i])
            // If the course is not completed
            if (c.backgroundColor != 'lightgreen') {
              // Set avail to false
              avail = false
            }
          }
          // Since all prereqs were completed
          if (true) {
            // Set background color to white
            course.style.backgroundColor = 'white';
          }
        }
      }
    }
  }
});
