class Course {
    constructor(id, name, sub, credits, quarter, prerequisites) {
        this.id = id;
        this.name = name;
        this.sub = sub;
        this.credits = credits;
        this.quarter = quarter;
        this.prerequisites = prerequisites;
    }
}

// Function to load courses from JSON file
async function loadCourses() {
    try {
        const response = await fetch('../data/courses.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const courses = data.map(courseData => new Course(
            courseData.id,
            courseData.name,
            courseData.sub,
            courseData.credits,
            courseData.quarter,
            courseData.prerequisites
        ));

        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Function to display courses on the web page
// Function to display courses on the web page
function displayCourses(courses) {
    const courseList = document.getElementById('courseList');
    const quarters = {};
    const displayedCourses = new Set();

    // Group courses by quarter
    courses.forEach(course => {
        if (!quarters[course.quarter]) {
            quarters[course.quarter] = [];
        }
        quarters[course.quarter].push(course);
    });

    // Create and append quarter headers and courses
    Object.keys(quarters).sort().forEach(quarter => {
        const quarterHeader = document.createElement('h2');
        quarterHeader.textContent = `Quarter ${quarter}`;
        courseList.appendChild(quarterHeader);

        quarters[quarter].forEach(course => {
            if (displayedCourses.has(course.id)) {
                return; // Skip if the course is already displayed
            }

            const courseDiv = document.createElement('div');
            courseDiv.className = 'course grey';
            courseDiv.textContent = `${course.id}: ${course.name} (${course.credits} credits)`;
            courseDiv.dataset.id = course.id;
            courseDiv.dataset.prerequisites = JSON.stringify(course.prerequisites);
            courseDiv.addEventListener('click', () => handleCourseClick(courseDiv, courses));
            courseList.appendChild(courseDiv);
            displayedCourses.add(course.id);

            // Check if the course has a sub that is not null
            if (course.sub) {
                // Create and append the "or" header
                const orHeader = document.createElement('h3');
                orHeader.textContent = 'or';
                courseList.appendChild(orHeader);

                // Find the sub course
                const subCourse = courses.find(c => c.id === course.sub);
                if (subCourse && !displayedCourses.has(subCourse.id)) {
                    const subCourseDiv = document.createElement('div');
                    subCourseDiv.className = 'course grey';
                    subCourseDiv.textContent = `${subCourse.id}: ${subCourse.name} (${subCourse.credits} credits)`;
                    subCourseDiv.dataset.id = subCourse.id;
                    subCourseDiv.dataset.prerequisites = JSON.stringify(subCourse.prerequisites);
                    subCourseDiv.addEventListener('click', () => handleCourseClick(subCourseDiv, courses));
                    courseList.appendChild(subCourseDiv);
                    displayedCourses.add(subCourse.id);
                }
            }
        });
    });
}

// Function to handle course click events
function handleCourseClick(clickedCourseDiv, courses) {
    if (!clickedCourseDiv.classList.contains('white')) {
        return; // Only allow clicking on white courses
    }

    // Toggle the clicked course's color
    clickedCourseDiv.classList.remove('white');
    clickedCourseDiv.classList.add('green');

    // Get the id of the clicked course
    const clickedCourseId = clickedCourseDiv.dataset.id;

    // Update the color of dependent courses
    const courseDivs = document.querySelectorAll('.course');
    courseDivs.forEach(courseDiv => {
        const prerequisites = JSON.parse(courseDiv.dataset.prerequisites);
        if (prerequisites.includes(clickedCourseId)) {
            // Check if all prerequisites are green
            const allPrerequisitesGreen = prerequisites.every(prerequisite => {
                const prerequisiteDiv = document.querySelector(`.course[data-id="${prerequisite}"]`);
                return prerequisiteDiv && prerequisiteDiv.classList.contains('green');
            });

            if (allPrerequisitesGreen && courseDiv.classList.contains('grey')) {
                courseDiv.classList.remove('grey');
                courseDiv.classList.add('white');
            }
        }
    });
}

// Function to initialize courses when the start button is pressed
function initializeCourses() {
    const courseDivs = document.querySelectorAll('.course');
    courseDivs.forEach(courseDiv => {
        const prerequisites = JSON.parse(courseDiv.dataset.prerequisites);
        if (prerequisites.length === 0) {
            courseDiv.classList.remove('grey');
            courseDiv.classList.add('white');
        }
    });
}

// Load courses when the page loads
window.onload = () => {
    loadCourses();
    document.getElementById('startButton').addEventListener('click', initializeCourses);
};