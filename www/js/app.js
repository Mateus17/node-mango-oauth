"use strict";

fetch("/api/tasks", {
  method: "get"
}).then(function (response, err) {
  if (response.status === 200) {
    return response.json();
  } else {
    throw "Erreur avec la requ\xEAte API : " + response.statusText;
  }
}).then(function (arrayOfTasks) {
  arrayOfTasks.map(function (elem) {
    componentTask(elem);
  });
}).catch(function (err) {
  throw err;
});

var componentTask = function componentTask(elem) {
  var tasksList = document.querySelector(".tasksList");
  var taskContainer = document.createElement("article");
  var taskTitleContainer = document.createElement("h2");
  var taskTitle = document.createTextNode(elem.title);
  var tasksActionContainer = document.createElement("div");
  var taskValidateContainer = document.createElement("i");
  var taskRemoveContainer = document.createElement("i");

  taskValidateContainer.classList = "changeDoneStatus fontSize20";
  taskRemoveContainer.classList = "removeTask fontSize20 ml-2";
  taskContainer.id = "task-" + elem._id;
  taskContainer.classList = "taskListItem list-group-item taskItemIsDone" + elem.isDone + " d-flex justify-content-between";
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

var taskAddForm = document.getElementById("addTaskForm");
var taskTitleInput = document.getElementsByName("title")[0];

taskAddForm.addEventListener("submit", function (evt) {
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
    }).then(function (newTask) {
      return newTask.json();
    }).then(function (newTask) {
      componentTask(newTask);
      taskTitleInput.value = "";
    }).catch(function (err) {
      throw err;
    });
  } else {
    document.querySelector(".alert-danger").classList.remove("d-none");
  }
});

var handleClickUpdateTask = function handleClickUpdateTask(taskId, taskIsDone, taskIconStatus) {
  document.querySelector("#task-" + taskId + " .changeDoneStatus").addEventListener("click", function (e) {
    var currentTask = document.getElementById("task-" + taskId);

    if (taskIsDone) {
      taskIconStatus.innerHTML = "&#10003;";
    } else {
      taskIconStatus.innerHTML = "&#9100;";
    }

    currentTask.dataset.taskIsDone = !taskIsDone;
    taskIsDone = !taskIsDone;

    fetch("/api/task/" + taskId, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: currentTask.childNodes[0].innerHTML,
        isDone: taskIsDone
      })
    }).catch(function (err) {
      throw err;
    });
  });
};

var handleClickRemoveTask = function handleClickRemoveTask(taskId) {
  document.querySelector("#task-" + taskId + " .removeTask").addEventListener("click", function (e) {
    var currentTask = document.getElementById("task-" + taskId);

    fetch("/api/task/" + taskId, {
      method: "delete"
    }).then(function (res) {
      currentTask.remove();
    }).catch(function (err) {
      throw err;
    });
  });
};