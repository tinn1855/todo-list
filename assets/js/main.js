let tableTasks = document.getElementById("tableTasks");
const listTasks = [
  {
    id: 1,
    description: "Học HTML, CSS",
    status: "completed",
    priority: "medium-priority",
  },
  {
    id: 2,
    description: "Học Javascript",
    status: "incomplete",
    priority: "high-priority",
  },
  {
    id: 3,
    description: "Học SQL",
    status: "incomplete",
    priority: "low-priority",
  },
];

function renderTasks() {
  tableTasks.innerHTML = "";
  listTasks.map((task) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <input type="checkbox" />
        </td>
        <td>${task.description}</td>
        <td>
            <select 
              class="${task.status}"
              onchange="changeStatus(${task.id}, this.value)"
              
            >
              <option value="incomplete"
                ${selectedOption(task.status, "incompleted")}
              >
                Chưa hoàn thành
              </option>
              <option 
                value="completed"
                ${selectedOption(task.status, "completed")}
              >
                Hoàn thành
              </option>
            </select>
        </td>
        <td>
            <select 
              class="${task.priority}" 
              onchange="changePriority(${task.id}, this.value)"
            >
              <option 
                value="high-priority"
                 ${selectedOption(task.priority, "high-priority")}
              > 
                Cao 
              </option>
              <option 
                value="medium-priority"
                ${selectedOption(task.priority, "medium-priority")}
              >
                Vừa
              </option>
              <option 
                value="low-priority"
                 ${selectedOption(task.priority, "low-priority")}
              >
                Thấp
              </option>
            </select>
        </td>
        <td>
            <button class="btn-edit" onclick="editTask(${task.id})">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-delete" onclick="deleteTaskById(${task.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;
    tableTasks.appendChild(row);
  });
}
renderTasks();

function validateInput(inputBox) {
  // Kiểm tra input có rỗng hay không
  if (!inputBox || /^\s*$/.test(inputBox)) {
    return "Task cannot be empty!";
  }

  // Kiểm tra có chứa thẻ HTML không
  if (/<[a-z][\s\S]*>/i.test(inputBox)) {
    return "Task cannot contain HTML tags!";
  }

  // Kiểm tra bắt đầu bằng ký tự đặc biệt
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(inputBox)) {
    return "Task cannot start with special characters!";
  }

  return null;
}

function addTask(descriptionTask) {
  const newTask = {
    id: listTasks.length + 1,
    description: descriptionTask,
    status: "incomplete",
    priority: "medium-priority",
  };

  listTasks.push(newTask);
  renderTasks();
}

document.getElementById("formAdd").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputBox = document.getElementById("input-box");
  const descriptionTask = inputBox.value.trim();
  const error = validateInput(descriptionTask);

  if (error) {
    alert(error);
    return;
  }

  addTask(descriptionTask);
  inputBox.value = "";
});

function deleteTaskById(taskId) {
  const taskIndex = listTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    listTasks.splice(taskIndex, 1);
    renderTasks();
  }
}

function editTask(taskId) {
  const taskToEdit = listTasks.find((task) => task.id === taskId);
  if (taskToEdit) {
    const newDescription = prompt("Add your text", taskToEdit.description);
    const error = validateInput(newDescription);

    if (newDescription === null) {
      return;
    }
    if (error) {
      alert(error);
      return;
    }

    taskToEdit.description = newDescription;
    renderTasks();
  }
}

function changeStatus(taskId, newStatus) {
  let task = listTasks.find((task) => task.id === taskId);
  if (task) {
    task.status = newStatus;
    renderTasks();
  }
}

function changePriority(taskId, newPriority) {
  let task = listTasks.find((task) => task.id === taskId);
  if (task) {
    task.priority = newPriority;
    renderTasks();
  }
}

function selectedOption(value, optionValue) {
  return value === optionValue ? "selected" : "";
}
