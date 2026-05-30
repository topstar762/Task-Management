const API = 'http://localhost:5000';


// ================= REGISTER =================

async function register() {

  const name =
    document.getElementById('registerName').value;

  const email =
    document.getElementById('registerEmail').value;

  const password =
    document.getElementById('registerPassword').value;


  if (!name || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {

    const response = await fetch(
      `${API}/api/auth/register`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      alert('Registration Successful');

      window.location.href = 'login.html';

    } else {

      alert(data.message);

    }

  } catch (err) {

    console.log(err);

    alert('Server Error');

  }

}



// ================= LOGIN =================

async function login() {

  const email =
    document.getElementById('loginEmail').value;

  const password =
    document.getElementById('loginPassword').value;


  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {

    const response = await fetch(
      `${API}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (data.token) {

      sessionStorage.setItem(
        'token',
        data.token
      );

      window.location.href = 'dashboard.html';

    } else {

      alert(data.message);

    }

  } catch (err) {

    console.log(err);

    alert('Login Failed');

  }

}



// ================= FETCH TASKS =================

async function fetchTasks() {

  const token =
    sessionStorage.getItem('token');

  if (!token) {

    window.location.href = 'login.html';

    return;
  }

  try {

    const response = await fetch(
      `${API}/api/tasks`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    const tasks = await response.json();

    tasks.sort((a, b) => {

      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
      };

      return (
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
      );

    });

    const container =
      document.getElementById('taskContainer');

    container.innerHTML = '';

    tasks.forEach(task => {

      container.innerHTML += `

        <div class="task-card">

          <div class="task-top">

            <h2>${task.title}</h2>

            <span class="priority ${task.priority}">
              ${task.priority}
            </span>

          </div>

          <p>
            ${task.description}
          </p>

          <button
            onclick="deleteTask('${task._id}')"
          >
            Delete
          </button>

        </div>

      `;
    });

  } catch (err) {

    console.log(err);

  }

}



// ================= ADD TASK =================

async function addTask() {

  const token =
    sessionStorage.getItem('token');

  const title =
    document.getElementById('title').value;

  const description =
    document.getElementById('description').value;

  const priority =
    document.getElementById('priority').value;


  if (!title || !description) {
    alert('Please fill all fields');
    return;
  }

  try {

    await fetch(
      `${API}/api/tasks`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },

        body: JSON.stringify({
          title,
          description,
          priority
        })
      }
    );

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';

    fetchTasks();

  } catch (err) {

    console.log(err);

  }

}



// ================= DELETE TASK =================

async function deleteTask(id) {

  const token =
    sessionStorage.getItem('token');

  try {

    await fetch(
      `${API}/api/tasks/${id}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: token
        }
      }
    );

    fetchTasks();

  } catch (err) {

    console.log(err);

  }

}



// ================= LOGOUT =================

function logout() {

  sessionStorage.removeItem('token');

  window.location.href = 'login.html';

}