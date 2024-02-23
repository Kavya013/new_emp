// Function to add a new row to the table
function addRowToTable(data) {
  console.log(data);
  const tableBody = document.getElementById('employee-table-body');
  const newRow = document.createElement('tr');
  newRow.setAttribute('data-id', data.employee_id); // Use employeeId as the attribute
  newRow.innerHTML = `
    <td>${data.name}</td>
    <td>${data.employee_id}</td>
    <td>${data.department}</td>
    <td>${data.dob}</td>
    <td>${data.gender}</td>
    <td>${data.designation}</td>
    <td>${data.salary}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  tableBody.appendChild(newRow);
}

document.addEventListener('DOMContentLoaded', function() {

  loadTableData();

  // Add event listener to the form submission
  document.getElementById('employee-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = getFormData();
    if (!formData) return;
    sendDataToServer(formData); // Send data to the server
  });

  // Add event listener to the delete button
  document.getElementById('employee-table-body').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
      const row = event.target.closest('tr');
      const employeeId = row.getAttribute('data-id');
      deleteRow(employeeId); // Delete row from local storage
      row.remove();
    }
  });

  // Function to retrieve form data
  function getFormData() {
    const employeeName = document.getElementById('employee-name').value.trim();
    const employeeId = document.getElementById('employee-id').value.trim();
    const department = document.getElementById('department').value;
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const designation = document.getElementById('designation').value.trim();
    const salary = document.getElementById('salary').value.trim();

    if (!employeeName || !employeeId || !department || !dob || !gender || !designation || !salary) {
      alert('Please fill all fields');
      return null;
    }

    return {
      employeeName: employeeName,
      employeeId: employeeId,
      department: department,
      dob: dob,
      gender: gender.value,
      designation: designation,
      salary: salary
    };
  }

  // Function to send data to the server
  function sendDataToServer(formData) {
    fetch('/submitEmployeeData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        addRowToTable(formData);
        clearForm(); // Clear the form fields
      } else {
        alert('Something went wrong:(');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong:(');
    });
  }

  // Function to clear the form fields
  function clearForm() {
    document.getElementById('employee-form').reset();
  }
});

// Function to load data into the table
function loadTableData() {
  // Fetch data from local storage
  const localData = JSON.parse(localStorage.getItem('employeeData')) || [];

  // Fetch data from MySQL
  fetch('/getEmployeeData') // Assuming you have an endpoint to fetch employee data from MySQL
    .then(response => response.json())
    .then(mysqlData => {
      const combinedData = [...localData, ...mysqlData];
      const tableBody = document.getElementById('employee-table-body');
      combinedData.forEach(employee => {
        addRowToTable(employee);
      });
    })
    .catch(error => {
      console.error('Error loading table data:', error);
    });
}

// Function to delete a row from local storage
function deleteRow(employeeId) {
  fetch(`/deleteEmployeeData/${employeeId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete employee data');
    }
  })
  .catch(error => {
    console.error('Error deleting employee data:', error);
    alert('Something went wrong:(');
  });
}




  

  