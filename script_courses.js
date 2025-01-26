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
fetch('https://vo239v3ve2.execute-api.us-east-1.amazonaws.com/Dev')
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




//this code is used to select between courses
// Allow a user to click spans between lightgreen (course completed) and white (course available)
document.body.addEventListener('click', function (event) {
  // If the item is a span
  if (event.target.tagName === 'SPAN') {
    // If the span's background is white (available)
    if (event.target.style.backgroundColor === 'white') {
      // Set background color to lightgreen (completed)
      event.target.style.backgroundColor = 'lightgreen';

      // Get the array of courses that need this course
      const required_by = JSON.parse(event.target.dataset.required_by);
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
    //I included this part only
    // If the span's background is lightgreen (completed)
    else if (event.target.style.backgroundColor === 'lightgreen') {
      // Set background color back to white (available)
      event.target.style.backgroundColor = 'white';

      // Get the array of courses that need this course
      const required_by = JSON.parse(event.target.dataset.required_by);
      // If the course is a prerequisite
      if (required_by.length > 0) {
        // For each course that needs this course
        greyOutRequiredBy(required_by);


        // TODO: I left this code in until verification that everything works and 
        //        it is no longer needed.

        
        // required_by.forEach(requiredId => {
        //   const course = document.getElementById(requiredId);
        //   alert(course.id);
        //   const testName = document.getElementById(course.id);
        //   alert( testName.dataset.required_by + " " + testName.id);
        //   const prereqs = JSON.parse(course.dataset.prerequisites);
        //   // Check if this course is still required
        //   if (prereqs.includes(event.target.id)) {
        //     course.style.backgroundColor = 'lightgrey'; // Reset to default (gray)
        //   }
        // });
      }
    }
  }
});


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
    const course = document.getElementById(id);
    if(!course){
      return;
    }
    
    course.style.backgroundColor = 'lightgrey';

    // Get the group of required by classes and process them.
    const nextGroup = JSON.parse(course.dataset.required_by);
    greyOutRequiredBy(nextGroup);
  })
}



/*
Note: this is the original Chris's code where I added more lines to change from green to white when clicking on the span. 
the code I added begins in the else if line

// Allow user to click spans that are available to be clicked
document.body.addEventListener('click', function (event) {
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
*/