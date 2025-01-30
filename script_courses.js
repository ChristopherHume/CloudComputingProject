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
    c.textContent = `${course.id} : ${course.name} ( ${course.credits} Credits )`;

    // Sets the id for the course
    c.id = `${course.id}`;

    // Creates the dataset of prerequisites and requirements
    c.dataset.prerequisites = JSON.stringify(course.prerequisites);
    c.dataset.required_by = JSON.stringify(course.required_by);

    // Sets onclick function for the course
    c.onclick = function() { clickCourse(c.id) };
    courses.appendChild(c);
  });
}

// courses.appendChild(<span onClick="click('CSD_111')" id="CSD_111"> CSD 111: Programming</span>)

// Get coursesJSON from lambda
coursesJSON = ('PUT LAMBDA CONNECTION HERE')

// Fetch data from courses.json
fetch(coursesJSON)
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

//this code is used to start the program
// Allow user to click spans without prerequirements
document.getElementById('startButton').addEventListener('click', function () {
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

// Function about clicking a course
// Allow a user to click spans between lightgreen (course completed) and white (course available)
function clickCourse(courseId) {
  // Get course
  c = document.getElementById(courseId);
  // If the span's background is white (available)
  if (c.style.backgroundColor === 'white') {
    // Set background color to lightgreen (completed)
    c.style.backgroundColor = 'lightgreen';
    // Get the array of courses that need this course
    const required_by = JSON.parse(c.dataset.required_by);
    // If the course is a prerequisite
    if (required_by.length > 0) {
      // For each course that needs this course
      required_by.forEach(requiredId => {
        const course = document.getElementById(requiredId);
        const prereqs = JSON.parse(course.dataset.prerequisites);
        // Check if all prerequisites are completed
        const allCompleted = prereqs.every(prereqId => {
          const prereq = document.getElementById(prereqId);
          return prereq.style.backgroundColor === 'lightgreen';
        });
        // Make the course available if all prerequisites are completed
        if (allCompleted) {
          course.style.backgroundColor = 'white';
        }
      });
    }
  }

  // If the span's background is lightgreen (completed)
  else if (c.style.backgroundColor === 'lightgreen') {
    // Set background color back to white (available)
    c.style.backgroundColor = 'white';
    // Get the array of courses that need this course
    const required_by = JSON.parse(c.dataset.required_by);
    // If the course is a prerequisite
    if (required_by.length > 0) {
      // For each course that needs this course
      greyOutRequiredBy(required_by);
    }
  }
}

/* 
  Recursive Function to grey out classes when prerequisite is deselected
 */
function greyOutRequiredBy(requiredBY){

  // base case
  if(requiredBY.length === 0){
    return;
  }

  // go through each class and the classes required by it.
  requiredBY.forEach(id => {
    // Get the course id
    const course = document.getElementById(id);
    // If the course does not exist, return (error)
    if(!course){
      return;
    }
    
    // Set course to unavailable
    course.style.backgroundColor = 'lightgrey';

    // Get the group of required by classes and process them.
    const nextGroup = JSON.parse(course.dataset.required_by);
    // Recursively run function to set other courses unavailable
    greyOutRequiredBy(nextGroup);
  })
}

