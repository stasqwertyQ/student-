document.addEventListener('DOMContentLoaded', ()=> { 
    const studentsForm = document.querySelector('#student-form') 
    const studentsTable = document.querySelector('#students-table').getElementsByTagName('tbody')[0] 
    const editStudentForm = document.querySelector('#edit-student')
    let currentIndex = null;
 
 
 
    function findStudents() { 
        fetch('/students') 
            .then(response => response.json()) 
            .then(students => { 
                studentsTable.innerHTML = '' 
                students.forEach((student, index) => { 
                    const row = document.createElement('tr') 
                    row.innerHTML = ` 
                    <td>${student.name}</td> 
                    <td>${student.surname}</td> 
                    <td>${student.age}</td> 
                    <td>${student.course}</td> 
                    <td>${student.faculty}</td> 
                    <td>${student.subjects}</td> 
                    <td> 
                    <button onClick='editStudent(${index})'>edit</button> 
                    <button>delete</button> 
                    </td> 
                    ` 
                    studentsTable.appendChild(row) 
                }) 
            }) 
 
 
    } 

    function addStudents(event) {
        event.preventDefault();
        
        const studentsData = {
            name: studentsForm.name.value,
            surname: studentsForm.surname.value,
            age: studentsForm.age.value,
            course: studentsForm.course.value,
            faculty: studentsForm.faculty.value,
            subjects: studentsForm.subjects.value // This should be a string; we'll handle it as an array on the server
        };
    
        console.log("Sending student data:", studentsData); // Debug: Log the data being sent
    
        fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentsData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.text();
        })
        .then(message => {
            console.log("Server response:", message); // Debug: Log server response
            findStudents(); // Refresh the student list
        })
        .catch(error => {
            console.error("Error adding student:", error); // Log client-side error
        });
    }

    window.editStudent = (index) => {
        fetch('/students') 
            .then(response => response.json()) 
            .then(students => { 
                const student = students[index];
                currentIndex = index;
                editStudentForm.style.display = 'block';
                document.getElementById('edit-name').value = student.name
            }) 
    }
    
    studentsForm.addEventListener('submit', addStudents)
    findStudents()
})