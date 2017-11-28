fetch("/api/tasks", {
  method: "get"
})
  .then((response, err) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw `Erreur avec la requête API : ${response.statusText}`;
    }
  })
  .then(arrayOfTasks => {
    arrayOfTasks.map(elem => {
      componentTask(elem);
    });
  })
  .catch(err => {
    throw err;
  });

const componentTask = elem => {
  const tasksList = document.querySelector(".tasksList");
  const taskContainer = document.createElement("article");
  const taskTitleContainer = document.createElement("h2");
  const taskTitle = document.createTextNode(elem.title);
  const tasksActionContainer = document.createElement("div");
  const taskValidateContainer = document.createElement("i");
  const taskRemoveContainer = document.createElement("i");

  taskValidateContainer.classList = `changeDoneStatus fontSize20`;
  taskRemoveContainer.classList = `removeTask fontSize20 ml-2`;
  taskContainer.id = `task-${elem._id}`;
  taskContainer.classList = `taskListItem list-group-item taskItemIsDone${
    elem.isDone
  } d-flex justify-content-between`;
  taskContainer.dataset.id = elem._id;
  taskContainer.dataset.taskIsDone = elem.isDone;

  taskContainer.appendChild(taskTitleContainer);
  taskTitleContainer.appendChild(taskTitle);
  tasksList.appendChild(taskContainer);
  if (elem.isDone) {
    taskValidateContainer.innerHTML = "&#9100;";
  } else {
    taskValidateContainer.innerHTML = "&#10003;";
  }
  taskRemoveContainer.innerHTML = "&times;";
  tasksActionContainer.appendChild(taskValidateContainer);
  tasksActionContainer.appendChild(taskRemoveContainer);
  taskContainer.appendChild(tasksActionContainer);

  handleClickUpdateTask(elem._id, elem.isDone, taskValidateContainer);
  handleClickRemoveTask(elem._id);
};

const taskAddForm = document.getElementById("addTaskForm");
const taskTitleInput = document.getElementsByName("title")[0];

taskAddForm.addEventListener("submit", evt => {
  evt.preventDefault();

  // Vérifier la présence de valeur dans le formulaire
  if (taskTitleInput.value !== "") {
    document.querySelector(".alert-danger").classList.add("d-none");
    // Ajouter un document dans la collection MongoDb => post()
    fetch("/api/task", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: taskTitleInput.value
      })
    })
      .then(newTask => newTask.json())
      .then(newTask => {
        componentTask(newTask);
        taskTitleInput.value = "";
      })
      .catch(err => {
        throw err;
      });
  } else {
    document.querySelector(".alert-danger").classList.remove("d-none");
  }
});

const handleClickUpdateTask = (taskId, taskIsDone, taskIconStatus) => {
  document
    .querySelector(`#task-${taskId} .changeDoneStatus`)
    .addEventListener("click", e => {
      const currentTask = document.getElementById(`task-${taskId}`);

      if (taskIsDone) {
        taskIconStatus.innerHTML = "&#10003;";
      } else {
        taskIconStatus.innerHTML = "&#9100;";
      }

      currentTask.dataset.taskIsDone = !taskIsDone;
      taskIsDone = !taskIsDone;

      fetch(`/api/task/${taskId}`, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: currentTask.childNodes[0].innerHTML,
          isDone: taskIsDone
        })
      }).catch(err => {
        throw err;
      });
    });
};

const handleClickRemoveTask = taskId => {
  document
    .querySelector(`#task-${taskId} .removeTask`)
    .addEventListener("click", e => {
      const currentTask = document.getElementById(`task-${taskId}`);

      fetch(`/api/task/${taskId}`, {
        method: "delete"
      })
        .then(res => {
          currentTask.remove();
        })
        .catch(err => {
          throw err;
        });
    });
};
