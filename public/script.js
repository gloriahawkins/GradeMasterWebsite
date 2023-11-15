
//this is the code that is adding the event listeners to various elements in our HTML document

//when the elementwith the id addSubject is click, it will call upon the add subject function
document.getElementById('addSubject').addEventListener('click', addSubject);

//when an element with id calculateGrades is clicked, it will call the function calculateGrades
document.getElementById('calculateGrades').addEventListener('click', calculateGrades);

//when  an element with the class add-module, remove module or remove subject is clicked inside the elemtn with Id subjectsContainer, it will call the appropriate function
document.getElementById('subjectsContainer').addEventListener('click', function(event) {
    //e.g here the add module is being called 
    if (event.target.classList.contains('add-module')) {
        addModule(event.target.closest('.subject'));
    } else if (event.target.classList.contains('remove-module')) {
        removeModule(event.target.closest('.module'));
    } else if (event.target.classList.contains('remove-subject')) {
        removeSubject(event.target.closest('.subject'));
    }
});

//the function add subjection is used to create a new subject element
function addSubject() {
    //create the new subject element
    const subjectsContainer = document.getElementById('subjectsContainer');
    const subjectDiv = document.createElement('div');
    //setting the class name and HTMLL content for the new subject
    subjectDiv.className = 'subject';
    subjectDiv.innerHTML = `
        <input type="text" placeholder="Subject Name" class="subject-name">
        <div class="modules"></div>
        <button type="button" class="add-module">Add Module</button>
        <button type="button" class="remove-subject">Remove Subject</button>
        <input type="number" class="desired-subject-grade" placeholder="Desired Numeric Grade" min="0" max="100">
        <!-- Removed the select dropdown for desired letter grade -->
    `;
    //appending the new subject to the subjects container
    subjectsContainer.appendChild(subjectDiv);
    //adding a module to the new subject
    addModule(subjectDiv);
}


//here, a new module can be added to a subject section (e.g a test, essay, assignment1 etc.)
function addModule(subjectElement) 
{
    const modulesDiv = subjectElement.querySelector('.modules');
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module';
    //setting the class name and HTML content for the new module 
    //changed Module Name to assesment type
    moduleDiv.innerHTML = `
        <input type="text" placeholder="Assesment Type" class="module-name">
        <input type="number" placeholder="Grade e.g. 70" class="grade">
        <input type="number" placeholder="Weight e.g. 20" class="weight">
        <button type="button" class="remove-module">Remove Module</button>
    `;
    //appending the new module to the modules container (within subject)
    modulesDiv.appendChild(moduleDiv);
}

//this function is how the module can be removed 
function removeModule(moduleElement) {
    moduleElement.remove();
}

//this function is used to remove a subject 
function removeSubject(subjectElement) {
    subjectElement.remove();
}


//this is the function to caluculate the grades for the user 
function calculateGrades() {
    let totalWeight = 0;
    let totalWeightedScoreSum = 0;
    const subjectGradesDiv = document.getElementById('subjectGrades');
    const overallGradeDiv = document.getElementById('overallGrade');
    subjectGradesDiv.innerHTML = ''; // Clear previous subject grades
    const subjects = document.querySelectorAll('.subject');
    
    const gradingSystem = getCurrentGradingSystem(); // Get the current grading system
    
    subjects.forEach(subject => {
        let subjectWeightedScoreSum = 0;
        let subjectTotalWeight = 0;
        const grades = subject.querySelectorAll('.grade');
        const weights = subject.querySelectorAll('.weight');
        
        grades.forEach((grade, index) => {
            const weight = weights[index].valueAsNumber || 0;
            const score = grade.valueAsNumber || 0;
            subjectWeightedScoreSum += score * weight;
            subjectTotalWeight += weight;
        });
        
        const subjectGrade = subjectTotalWeight ? (subjectWeightedScoreSum / subjectTotalWeight) : 0;
        const letterGrade = getLetterGrade(subjectGrade, gradingSystem); // Pass the grading system
        
        // Append subject grade to the subjectGrades div
        subjectGradesDiv.innerHTML += `<p>${subject.querySelector('.subject-name').value || 'Subject'} Grade: ${subjectGrade.toFixed(2)} (${letterGrade})</p>`;
        
        // Add to overall totals
        totalWeightedScoreSum += subjectWeightedScoreSum;
        totalWeight += subjectTotalWeight;
    });
    
    const overallAverageGrade = totalWeight ? (totalWeightedScoreSum / totalWeight) : 0;
    const overallLetterGrade = getLetterGrade(overallAverageGrade, gradingSystem); // Pass the grading system
    
    overallGradeDiv.textContent = `Overall Average Grade: ${overallAverageGrade.toFixed(2)} (${overallLetterGrade})`;
}

document.getElementById('predictGrades').addEventListener('click', predictGrades);
function predictGrades() {
    const subjects = document.querySelectorAll('.subject');
    const neededGradesDiv = document.getElementById('neededGrades');
    neededGradesDiv.innerHTML = ''; // Clear previous predictions
    
    subjects.forEach(subject => {
        const desiredGradeInput = subject.querySelector('.desired-subject-grade');
        if (!desiredGradeInput || desiredGradeInput.value === '') {
            alert('Please enter a desired numeric grade for each subject.');
            return;
        }
        
        const desiredGrade = parseFloat(desiredGradeInput.value);
        if (isNaN(desiredGrade)) {
            alert('Please enter a valid desired numeric grade for each subject.');
            return;
        }
        
        let subjectWeightedScoreSum = 0;
        let subjectTotalWeight = 0;
        const grades = subject.querySelectorAll('.grade');
        const weights = subject.querySelectorAll('.weight');
        
        grades.forEach((grade, index) => {
            const weight = weights[index].valueAsNumber || 0;
            const score = grade.valueAsNumber || 0;
            subjectWeightedScoreSum += score * weight;
            subjectTotalWeight += weight;
        });
        
        const remainingWeight = 100 - subjectTotalWeight;
        if (remainingWeight <= 0) {
            neededGradesDiv.innerHTML += `<p>${subject.querySelector('.subject-name').value || 'Subject'}: You've already reached 100% of the weight, no more grades are needed.</p>`;
        } else {
            const gradingSystem = getCurrentGradingSystem(); // Get the current grading system
            const neededScoreSum = desiredGrade * 100 - subjectWeightedScoreSum;
            const letterGrade = getLetterGrade(neededScoreSum / remainingWeight, gradingSystem); // Pass the grading system
            
            if (neededScoreSum <= 0) {
                neededGradesDiv.innerHTML += `<p>${subject.querySelector('.subject-name').value || 'Subject'}: Your desired grade is already exceeded with the current grades.</p>`;
            } else {
                const neededGrade = neededScoreSum / remainingWeight;
                if (neededGrade > 100) {
                    neededGradesDiv.innerHTML += `<p>${subject.querySelector('.subject-name').value || 'Subject'}: You need a grade higher than 100% on the remaining weight to achieve your desired grade. This may not be possible.</p>`;
                } else {
                    neededGradesDiv.innerHTML += `<p>${subject.querySelector('.subject-name').value || 'Subject'}: To achieve your desired grade of ${desiredGrade.toFixed(2)}, you need an average grade of ${neededGrade.toFixed(2)} (${letterGrade}) on the remaining weight of ${remainingWeight}%.`;
                }
            }
        }
    });
}

document.getElementById('predictGrades').addEventListener('click', predictGrades);





// Object containing grade boundaries for different grading systems
//using an array(s) here 

const gradeBoundaries = {
    NZ: [
        // Each entry is an object with a grade and its threshold
        { grade: 'A+', threshold: 90 },
        { grade: 'A', threshold: 85 },
        { grade: 'A-', threshold: 80 },
        { grade: 'B+', threshold: 75 },
        { grade: 'B', threshold: 70 },
        { grade: 'B-', threshold: 65 },
        { grade: 'C+', threshold: 60 },
        { grade: 'C', threshold: 55 },
        { grade: 'C-', threshold: 50 },
        { grade: 'D', threshold: 0 },
    ],
    USA: [
        // Each entry is an object with a grade and its threshold
        { grade: 'A+', threshold: 97 },
        { grade: 'A', threshold: 93 },
        { grade: 'A-', threshold: 90 },
        { grade: 'B+', threshold: 87 },
        { grade: 'B', threshold: 83 },
        { grade: 'B-', threshold: 80 },
        { grade: 'C+', threshold: 77 },
        { grade: 'C', threshold: 73 },
        { grade: 'C-', threshold: 70 },
        { grade: 'D+', threshold: 67 },
        { grade: 'D', threshold: 65 },
        { grade: 'D-', threshold: 0 },
    ],
};
// Function to get the letter grade based on numeric grade and grading system
function getLetterGrade(numericGrade, gradingSystem = 'NZ') {
    const boundaries = gradeBoundaries[gradingSystem];
    let letterGrade = 'F';// Default grade
 // Loop through grade boundaries to find matching grade
    for (const boundary of boundaries) {
        if (numericGrade >= boundary.threshold) {
            letterGrade = boundary.grade;
            break;// Exit loop once the correct grade is found
        }
    }

    return letterGrade;
}

// Function to set the grading system in local storage
function setGradingSystem(system) {
    localStorage.setItem('gradingSystem', system);
}
// Function to get the current grading system from local storage, defaulting to 'NZ'
function getCurrentGradingSystem() {
    return localStorage.getItem('gradingSystem') || 'NZ'; // Default to NZ
}


// Function to generate a summary of grades
function generateGradeSummary() {
    const subjects = document.querySelectorAll('.subject');
    let gradeSummary = "Grade Summary\n\n";
// Loop through each subject to calculate and compile grades
    subjects.forEach(subject => {
        const subjectName = subject.querySelector('.subject-name').value || 'Unnamed Subject';
        let subjectWeightedScoreSum = 0;
        let subjectTotalWeight = 0;
        let subjectGradesText = [];

        const grades = subject.querySelectorAll('.grade');
        const weights = subject.querySelectorAll('.weight');

        grades.forEach((grade, index) => {
            const weight = weights[index].valueAsNumber || 0;
            const score = grade.valueAsNumber || 0;
            subjectWeightedScoreSum += score * weight;
            subjectTotalWeight += weight;
            const moduleName = grade.closest('.module').querySelector('.module-name').value || 'Unnamed Module';
            subjectGradesText.push(`Module: ${moduleName}, Grade: ${score}, Weight: ${weight}%`);
        });

        const subjectGrade = subjectTotalWeight ? (subjectWeightedScoreSum / subjectTotalWeight).toFixed(2) : "N/A";
        const letterGrade = getLetterGrade(parseFloat(subjectGrade));

        gradeSummary += `Subject: ${subjectName}\n`;
        gradeSummary += `${subjectGradesText.join('\n')}\n`;
        gradeSummary += `Subject Grade: ${subjectGrade} (${letterGrade})\n`;
        gradeSummary += `Total Weight: ${subjectTotalWeight}%\n\n`;
    });
// Add overall grade and predictions to the summary if available
    // Overall grade (if already calculated)
    const overallGradeElement = document.getElementById('overallGrade').textContent.trim();
    gradeSummary += ` ${overallGradeElement}\n\n`;

    // Predictions (if any were made)
    const predictionsDiv = document.getElementById('neededGrades');
    const predictions = predictionsDiv.querySelectorAll('p');
    if(predictions.length > 0) {
        gradeSummary += "Predictions:\n";
        predictions.forEach(prediction => {
            gradeSummary += `${prediction.textContent}\n`;
        });
    }

    return gradeSummary;
}


// Function to download the grade summary
function downloadGradeSummary() {
    const gradeSummary = generateGradeSummary();
    
    const gradingSystem = getCurrentGradingSystem(); // Get the current grading system
    
     // Combine grading system information with the grade summary
    const summaryWithGradingSystem = `Grading System: ${gradingSystem}\n\n${gradeSummary}`;
     // Create a Blob for the summary and trigger download
    const blob = new Blob([summaryWithGradingSystem], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "GradeSummary.txt"; // or .csv if you format it that way
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}
// Attach the download function to the button click event
document.getElementById('downloadGrades').addEventListener('click', downloadGradeSummary);
// Function to navigate back to the index page
function goBack() {
    // Redirect to the index.html page
    window.location.href = "index.html";
}