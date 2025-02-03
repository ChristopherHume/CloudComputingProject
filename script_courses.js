
/*
This function creates a div for each quarter, 
then creates a table for the courses per quarter 
*/
function creatTablePerQuarter(programCourses) {

  //iterate the array to get the information from each course
  programCourses.forEach(course => {

      //create an span for each course like this --> CSD 111: Computer Programming Fundamentals ( 5 credits )
      let span_course = document.createElement("span");
      span_course.setAttribute("class", "grey");
      span_course.textContent = `${course.id} : ${course.name} ( ${course.credits} Credits )`;
      span_course.id = `${course.id}`; // Sets the id for the course

      //check if a quarter is already in the html page:
      //if not, create a new div and add a table inside that div
      let quarter_n = document.getElementById("divq" + course.quarter);
      if (quarter_n == null) {
          // Create div with id of quarter
          let main = document.getElementById("main");
          let quarterDiv = document.createElement("div");
          quarterDiv.setAttribute("id", "divq" + course.quarter);
          let quarterHead = document.createElement("h2");
          quarterDiv.appendChild(quarterHead);
          quarterHead.innerHTML = "Quarter " + course.quarter;
          //create the table and append the course
          let quartertable = document.createElement("table");
          let tbody = document.createElement("tbody");
          quartertable.appendChild(tbody);
          tbody.setAttribute("id", "q" + course.quarter);
          tbody.appendChild(span_course);
          quarterDiv.appendChild(quartertable);
          main.appendChild(quarterDiv);
      } else {
          //add the course to the corresponding table in the div
          let table = document.getElementById("q" + course.quarter);
          table.appendChild(span_course);

      }


      //Chris code starts here for the click course function---------------------->

      // Creates the dataset of prerequisites and requirements
      span_course.dataset.prerequisites = JSON.stringify(course.prerequisites);
      span_course.dataset.required_by = JSON.stringify(course.required_by);

      // Sets onclick function for the course
      span_course.onclick = function () { clickCourse(span_course.id) };

      // courses.appendChild(<span onClick="click('CSD_111')" id="CSD_111"> CSD 111: Programming</span>)

      //Chris code ends here----------------------------------------------------->

  });

}

//get the json file from lambda
const coursesJSON = 'https://auct08p43b.execute-api.us-east-1.amazonaws.com/default/GetCoursesFromJson';

fetch(coursesJSON)
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
  })
  .then(data => {

      //create a table with the courses in the html page
      creatTablePerQuarter(data);
  })
  .catch(error => {
      console.error("Error fetching the JSON file:", error);
  });


/*
This code is used to start the program and 
allows user to click spans without prerequirements
*/
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


/*
Function about clicking a course:
Allow a user to click spans between lightgreen (course completed) and white (course available)
*/
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


