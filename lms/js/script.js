var hostname = 'localhost';
var port = 8080;

function onLoadEmployees() {
    removeAlert();
    // Set up our HTTP request
    const xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
        // Only run if the request is complete
        if (xhr.readyState !== 4) return;
        // Process our return data
        if (xhr.status === 200) {
            // What to do when the request is successful
            const table = document.querySelector('#employees');
            const selector = document.querySelector('#employeeName');
            selector.innerHTML = '';
            let option = document.createElement('option');
            option.textContent = 'Select an employee from the list';
            option.setAttribute('selected',true);
            selector.appendChild(option);

            // clear table
            table.innerHTML = '';
            clearEmployees();

            const employees = JSON.parse(xhr.responseText);

            console.log(xhr.responseText);

            for(let i=0; i < employees.length; i++) {
                let row = document.createElement('tr');
                
                const object = employees[i];
                const column1 = document.createElement('td');
                column1.textContent=object.id;
                row.appendChild(column1);
                
                const column2 = document.createElement('td');
                column2.textContent=object.firstname;
                row.appendChild(column2);
                
                const column3 = document.createElement('td');
                column3.textContent=object.lastname;
                row.appendChild(column3);
                
                const column4 = document.createElement('td');
                column4.textContent=object.department;
                row.appendChild(column4);
                
                const column5 = document.createElement('td');
                column5.textContent=object.dateOfBirth;
                row.appendChild(column5);
                
                const column6 = document.createElement('td');
                const buttonedit = document.createElement('button');
                buttonedit.classList.add('btn', 'btn-warning', 'btn-sm');
                buttonedit.textContent = 'Edit';
                buttonedit.setAttribute('onclick','loadEmployee('+ object.id +', true)');
                column6.appendChild(buttonedit);
                column6.appendChild(document.createTextNode(' '));
                const buttonremove = document.createElement('button');
                buttonremove.classList.add('btn', 'btn-danger', 'btn-sm');
                buttonremove.textContent = 'Remove';
                buttonremove.setAttribute('onclick','removeEmployee('+ object.id +')');
                column6.appendChild(buttonremove);
                row.appendChild(column6);

                table.appendChild(row);

                // add employee list to leaves section
                let option = document.createElement('option');
                option.textContent = object.firstname + ' ' + object.lastname + ' [' + object.dateOfBirth + ']';
                option.value = object.id;
                
                selector.appendChild(option);
            }
            
        } else if (xhr.status === 204) {
            const table = document.querySelector('#employees');
            table.innerHTML = '';
            const selector = document.querySelector('#employeeName');
            selector.innerHTML = '';
            let option = document.createElement('option');
            option.textContent = 'Select an employee from the list';
            option.setAttribute('selected',true);
            selector.appendChild(option);
            alert('Employee database is empty!');
        }
        else {
            alert('Server error');
            // What to do when the request has failed
            console.log('error on onLoadEmployees', xhr);
        }
    };
    // Create and send a GET request
    if (departmentName !== '')
        xhr.open('GET', 'http://'+hostname+':'+port+'/api/employees?department='+departmentName);
    else
        xhr.open('GET', 'http://'+hostname+':'+port+'/api/employees');
    xhr.send();
}

function onLoadLeaves() {
    removeAlert();
    // Set up our HTTP request
    const xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
        // Only run if the request is complete
        if (xhr.readyState !== 4) return;
        // Process our return data
        if (xhr.status === 200) {
            // What to do when the request is successful
            const table = document.querySelector('#leaves');

            // clear table
            table.innerHTML = '';
            clearLeaves();

            const leaves = JSON.parse(xhr.responseText);

            console.log(xhr.responseText);

            for(let i=0; i < leaves.length; i++) {
                let row = document.createElement('tr');
                
                const object = leaves[i];
                const column1 = document.createElement('td');
                column1.textContent=object.id;
                row.appendChild(column1);
                
                const column2 = document.createElement('td');
                // synchronous AJAX request
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://'+hostname+':'+port+'/api/employees/'+object.employeeId, false);  // `false` makes the request synchronous
                xhr.send(null);

                if (xhr.status === 200) {
                    let employee = JSON.parse(xhr.responseText);
                    column2.textContent = employee.firstname + ' ' + employee.lastname;
                }
                row.appendChild(column2);
                
                const column3 = document.createElement('td');
                column3.textContent=object.description;
                row.appendChild(column3);

                const column4 = document.createElement('td');
                column4.textContent=object.startDate;
                row.appendChild(column4);
                
                const column5 = document.createElement('td');
                column5.textContent=object.endDate;
                row.appendChild(column5);
                
                const column6 = document.createElement('td');
                column6.textContent=object.approved;
                row.appendChild(column6);
                
                const column7 = document.createElement('td');
                const buttonedit = document.createElement('button');
                buttonedit.classList.add('btn', 'btn-warning', 'btn-sm');
                buttonedit.textContent = 'Edit';
                buttonedit.setAttribute('onclick','loadLeave('+ object.id +')');
                column7.appendChild(buttonedit);
                column7.appendChild(document.createTextNode(' '));
                const buttonremove = document.createElement('button');
                buttonremove.classList.add('btn', 'btn-danger', 'btn-sm');
                buttonremove.textContent = 'Remove';
                buttonremove.setAttribute('onclick','removeLeave('+ object.id +')');
                column7.appendChild(buttonremove);
                row.appendChild(column7);

                table.appendChild(row);
            }
            
        } else if (xhr.status === 204) {
            const table = document.querySelector('#leaves');
            table.innerHTML = '';
            alert('Leave database is empty!');
        }
        else {
            alert('Server error');
            // What to do when the request has failed
            console.log('error', xhr);
        }
    };
    // Create and send a GET request
    let url = 'http://'+hostname+':'+port+'/api/leaves';
    let first = false;
    if (startDate !== '') {
        url = url + '?startDate='+startDate;
        first = true;
    }
    if (endDate !== '') {
        if(first === false)
            url = url + '?';
        else
            url = url + '&';
        first = true;
        url = url + 'endDate='+endDate;
    }
    if (approved !== null) {
        if(first === false)
            url = url + '?';
        else
            url = url + '&';
        first = true;
        url = url + 'approved='+approved;
    }
    console.log(url);
    xhr.open('GET', url);
    xhr.send();
}

window.onload = onLoadEmployees;

function onInsertEmployee() {
    if(!isDataValidatedEmployee())
        return;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 201) {
            removeAlert();
            console.log(JSON.parse(xhr.responseText));
            onLoadEmployees();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('POST', 'http://'+hostname+':'+port+'/api/employees');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    const employee = {};
    employee.firstname = document.querySelector('#firstname').value;
    employee.lastname = document.querySelector('#lastname').value;
    employee.department = document.querySelector('#department').value;
    employee.dateOfBirth = document.querySelector('#dateOfBirth').value;
    const json = JSON.stringify(employee);
    console.log(json);
    xhr.send(json);
}

function onInsertLeave() {
    //if(!isDataValidatedLeave())
    //    return;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 201) {
            removeAlert();
            console.log(JSON.parse(xhr.responseText));
            onLoadLeaves();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('POST', 'http://'+hostname+':'+port+'/api/leaves/employees/'+document.querySelector('#employeeId').value);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    const leave = {};
    leave.employeeId = document.querySelector('#employeeId').value;
    leave.description = document.querySelector('#description').value;
    leave.startDate = document.querySelector('#startDate').value;
    leave.endDate = document.querySelector('#endDate').value;
    leave.approved = document.querySelector('#approved').checked;
    const json = JSON.stringify(leave);
    console.log(json);
    xhr.send(json);
}

function removeEmployee(id) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 202 || xhr.status === 204) {
            removeAlert();
            //console.log(JSON.parse(xhr.responseText));
            onLoadEmployees();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('DELETE', 'http://'+hostname+':'+port+'/api/employees/'+id);
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    xhr.send();
}

function removeLeave(id) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 202 || xhr.status === 204) {
            removeAlert();
            //console.log(JSON.parse(xhr.responseText));
            onLoadLeaves();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('DELETE', 'http://'+hostname+':'+port+'/api/leaves/'+id);
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    xhr.send();
}

function onDeleteAllEmployees() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 202 || xhr.status === 204) {
            removeAlert();
            //console.log(JSON.parse(xhr.responseText));
            onLoadEmployees();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('DELETE', 'http://'+hostname+':'+port+'/api/employees');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    xhr.send();
}

function onDeleteAllLeaves() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200 || xhr.status === 202 || xhr.status === 204) {
            removeAlert();
            //console.log(JSON.parse(xhr.responseText));
            onLoadEmployees();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    xhr.open('DELETE', 'http://'+hostname+':'+port+'/api/leaves');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    xhr.send();
}

function onEditEmployee() {
    if(!isDataValidatedEmployee())
        return;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            removeAlert();
            console.log(JSON.parse(xhr.responseText));
            clearEmployees();
            onLoadEmployees();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    let id = document.querySelector('#id').value;
    xhr.open('PUT', 'http://'+hostname+':'+port+'/api/employees/'+id);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    const employee = {};
    employee.id = id;
    employee.firstname = document.querySelector('#firstname').value;
    employee.lastname = document.querySelector('#lastname').value;
    employee.department = document.querySelector('#department').value;
    employee.dateOfBirth = document.querySelector('#dateOfBirth').value;
    const json = JSON.stringify(employee);
    console.log(json);
    xhr.send(json);
}

function onEditLeave() {
    //if(!isDataValidatedLeave())
    //    return;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            removeAlert();
            console.log(JSON.parse(xhr.responseText));
            clearLeaves();
            onLoadLeaves();
        } else {
            if (xhr.status === 401) {
                alertElement.textContent = 'User Unauthorized (401)';
                alertElement.classList.remove('d-none');
            }
            else if (xhr.status === 403) {
                alertElement.textContent = 'Access to Resource Forbidden (403)';
                alertElement.classList.remove('d-none');
            }
        }
    };
    let leaveId = document.querySelector('#leaveId').value;
    let employeeId = document.querySelector('#employeeId').value;
    xhr.open('PUT', 'http://'+hostname+':'+port+'/api/leaves/'+leaveId);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let auth = btoa(username+':'+password);
    xhr.setRequestHeader('Authorization', 'Basic '+auth);
    const leave = {};
    leave.id = leaveId;
    leave.employeeId = employeeId;
    leave.description = document.querySelector('#description').value;
    leave.startDate = document.querySelector('#startDate').value;
    leave.endDate = document.querySelector('#endDate').value;
    leave.approved = document.querySelector('#approved').checked;
    const json = JSON.stringify(leave);
    console.log(json);
    xhr.send(json);
}

function removeAlert() {
    if(!alertElement.classList.contains('d-none'))
        alertElement.classList.add('d-none');
}

function loadEmployee(id) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            let employee = JSON.parse(xhr.responseText);
            document.querySelector('#id').value = employee.id;
            document.querySelector('#firstname').value = employee.firstname;
            document.querySelector('#lastname').value = employee.lastname;
            document.querySelector('#department').value = employee.department;
            document.querySelector('#dateOfBirth').value = employee.dateOfBirth;
            insertBtn.classList.add('d-none');
            editBtn.classList.remove('d-none');
            cancelBtn.classList.remove('d-none');
        } else {
            console.log('error', xhr);
        }
    };
    xhr.open('GET', 'http://'+hostname+':'+port+'/api/employees/'+id);
    xhr.send();
}

function loadLeave(id) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            let leave = JSON.parse(xhr.responseText);
            document.querySelector('#leaveId').value = leave.id;
            document.querySelector('#employeeId').value = leave.employeeId;
            document.querySelector('#employeeName').value = leave.employeeId;
            document.querySelector('#employeeName').setAttribute('disabled', true);
            document.querySelector('#description').value = leave.description;
            document.querySelector('#startDate').value = leave.startDate;
            document.querySelector('#endDate').value = leave.endDate;
            document.querySelector('#approved').checked = leave.approved;
            insertBtn2.classList.add('d-none');
            editBtn2.classList.remove('d-none');
            cancelBtn2.classList.remove('d-none');
        } else {
            console.log('error', xhr);
        }
    };
    xhr.open('GET', 'http://'+hostname+':'+port+'/api/leaves/'+id);
    xhr.send();
}

function isDataValidatedEmployee() {
    let flag = true;
    if(document.querySelector('#firstname').value=='') {
        document.querySelector('#firstnameMissing').textContent='Firstname missing';
        flag = false;
    }
    else {
        document.querySelector('#firstnameMissing').textContent='';
    }
    if(document.querySelector('#lastname').value=='') {
        document.querySelector('#lastnameMissing').textContent='Lastname missing';
        flag = false;
    }
    else {
        document.querySelector('#lastnameMissing').textContent='';
    }
    if(document.querySelector('#department').value=='') {
        document.querySelector('#departmentMissing').textContent='Department missing';
        flag = false;
    }
    else {
        document.querySelector('#departmentMissing').textContent='';
    }
    if(document.querySelector('#dateOfBirth').value=='') {
        document.querySelector('#dateOfBirthMissing').textContent='Date of birth missing';
        flag = false;
    }
    else {
        document.querySelector('#dateOfBirthMissing').textContent='';
    }
    return flag;
}

function employeeByDepartment() {
    departmentName = document.querySelector('#departmentSearch').value;
    onLoadEmployees();
}

function leaveBySearch() {
    startDate = document.querySelector('#startDateSearch').value;
    endDate = document.querySelector('#endDateSearch').value;
    onLoadLeaves();
}

function clearEmployees() {
    document.querySelector('#id').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#department').value = '';
    document.querySelector('#dateOfBirth').value = '';
    
    insertBtn.classList.remove('d-none');
    editBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');

    alertElement.classList.add('d-none');
}

function clearLeaves() {
    document.querySelector('#leaveId').value = '';
    document.querySelector('#employeeId').value = '';
    document.querySelector('#employeeName').selectedIndex = 0;
    document.querySelector('#employeeName').removeAttribute('disabled');
    document.querySelector('#description').value = '';
    document.querySelector('#startDate').value = '';
    document.querySelector('#endDate').value = '';
    document.querySelector('#approved').checked = false;
    
    insertBtn2.classList.remove('d-none');
    editBtn2.classList.add('d-none');
    cancelBtn2.classList.add('d-none');

    alertElement.classList.add('d-none');
}


var alertElement = document.querySelector('#alert');
var insertBtn = document.querySelector('#insertEmployee');
insertBtn.addEventListener('click', onInsertEmployee);
var editBtn = document.querySelector('#editEmployee');
editBtn.addEventListener('click', onEditEmployee);
var cancelBtn = document.querySelector('#cancel');
cancelBtn.addEventListener('click', clearEmployees);
var deleteAllBtn = document.querySelector('#deleteAllEmployees');
deleteAllBtn.addEventListener('click', onDeleteAllEmployees);

var leavesTab = document.querySelector('#ex1-tab-2');
leavesTab.addEventListener('click', onLoadLeaves);

var insertBtn2 = document.querySelector('#insertLeave');
insertBtn2.addEventListener('click', onInsertLeave);
var editBtn2 = document.querySelector('#editLeave');
editBtn2.addEventListener('click', onEditLeave);
var cancelBtn2 = document.querySelector('#cancel2');
cancelBtn2.addEventListener('click', clearLeaves);
var deleteAllBtn2 = document.querySelector('#deleteAllLeaves');
deleteAllBtn2.addEventListener('click', onDeleteAllLeaves);

var departmentSearch = document.querySelector('#departmentSearch');
departmentSearch.addEventListener('keyup', employeeByDepartment);
var departmentName = '';

var startDateSearch = document.querySelector('#startDateSearch');
startDateSearch.addEventListener('change', leaveBySearch);
var endDateSearch = document.querySelector('#endDateSearch');
endDateSearch.addEventListener('change', leaveBySearch);
var startDate = '';
var endDate = '';
var approved = null; // neither true nor false

var employeeNameSelector = document.querySelector('#employeeName');
employeeNameSelector.addEventListener('change', function() {
    const index = this.selectedIndex;
    document.querySelector('#employeeId').value = this.options[index].value;
});


function threeStateToggle(value) {
    value = parseInt(value, 10); // Convert to an integer
    const item = document.querySelector('#custom-toggle');
    if (value === 1) {
        item.classList.remove('tgl-off', 'tgl-def');
        item.classList.add('tgl-on');
        approved = true;
    } else if (value === 2) {
        item.classList.remove('tgl-on', 'tgl-off');
        item.classList.add('tgl-def');
        approved = null;
    } else if (value === 3) {
        item.classList.remove('tgl-def', 'tgl-on');
        item.classList.add('tgl-off');
        approved = false;
    }
    leaveBySearch();
  }