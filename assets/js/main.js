const tableTasks = document.getElementById("tableTasks");
const modalDelete = document.getElementById("deleteModal");
const modalEdit = document.getElementById("editModal");
const modalError = document.getElementById("errorModal");
const inputBox = document.getElementById("input-box");
const editTaskInput = document.getElementById("editTask");
const errorMessage = document.getElementById("errorMessage");

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

let deleteTaskId = null;
let editTaskId = null;

function findTaskById(taskId) {
  return listTasks.find((task) => task.id === taskId);
}

function updateTask(taskId, field, value) {
  const task = findTaskById(taskId);
  if (task) {
    task[field] = value;
    renderTask();
  }
}

function selectOption(id, field, currentValue, options) {
  return `
    <select 
      class="${currentValue}"
     onchange="updateTask(${id}, '${field}', this.value)"
    >
      ${options
        .map(
          (opt) =>
            `<option 
              value="${opt.value}" 
              ${opt.value === currentValue ? "selected" : ""}>
              ${opt.label}
            </option>`
        )
        .join("")}
    </select>
  
  `;
}

function renderTask() {
  tableTasks.innerHTML = listTasks
    .map(
      (task) => `
    <tr>
      <td><input type="checkbox"></td>
      <td>${task.description}</td>
      <td>
        ${selectOption(task.id, "status", task.status, [
          { value: "incomplete", label: "Chưa hoàn thành" },
          { value: "completed", label: "Hoàn thành" },
        ])}
      </td>
      <td>
        ${selectOption(task.id, "priority", task.priority, [
          { value: "high-priority", label: "Cao" },
          { value: "medium-priority", label: "Vừa" },
          { value: "low-priority", label: "Thấp" },
        ])}
      </td>
      <td>
        <button class="btn-edit" onclick="editTask(${task.id})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-delete" onclick="deleteTaskById(${task.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>`
    )
    .join("");
}

renderTask();

function validateInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return "Task cannot be empty!";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return "Task cannot contain HTML tags!";
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmed))
    return "Task cannot start with special characters!";
  return null;
}

function addTask(description) {
  listTasks.push({
    id: listTasks.length + 1,
    description: description.trim(),
    status: "incomplete",
    priority: "medium-priority",
  });
  renderTask();
}

document.getElementById("formAdd").addEventListener("submit", function (e) {
  e.preventDefault();
  const description = inputBox.value;
  const error = validateInput(description);
  if (error) {
    openErrorModal(error);
    return;
  }
  addTask(description);
  inputBox.value = "";
});

function deleteTaskById(taskId) {
  deleteTaskId = taskId;
  openModal(modalDelete);
}

function confirmDelete() {
  const indexTask = listTasks.findIndex((task) => task.id === deleteTaskId);
  if (indexTask !== -1) {
    listTasks.splice(indexTask, 1);
    renderTask();
  }
  closeModal(modalDelete);
}

function cancelDelete() {
  closeModal(modalDelete);
}

function deleteMultipleTasks(taskIds) {
  for (let i = listTasks.length - 1; i >= 0; i--) {
    if (taskIds.includes(listTasks[i].id)) {
      listTasks.splice(i, 1);
    }
  }
  renderTask();
}

function editTask(taskId) {
  editTaskId = taskId;
  const taskEdit = findTaskById(taskId);
  if (taskEdit) {
    editTaskInput.value = taskEdit.description;
    openModal(modalEdit);
    editTaskInput.focus();
    editTaskInput.select();
  }
}

function confirmEdit() {
  const newDescription = editTaskInput.value;
  const error = validateInput(newDescription);
  if (error) {
    alert(error);
    return;
  }
  const taskEdit = findTaskById(editTaskId);
  if (taskEdit) {
    taskEdit.description = newDescription.trim();
    renderTask();
  }
  closeModal(modalEdit);
}

function cancelEdit() {
  closeModal(modalEdit);
}
function openErrorModal(message) {
  errorMessage.innerText = message;
  openModal(modalError);
}
function closeErrorModal() {
  closeModal(modalError);
}

function openModal(modal) {
  modal.style.display = "flex";
}

function closeModal(modal) {
  modal.style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target === modalDelete) closeModal(modalDelete);
  if (e.target === modalEdit) closeModal(modalEdit);
  if (e.target === modalError) closeModal(modalError);
});

let currentSortState = 0;

function sortTask() {
  if (currentSortState === 0) {
    listTasks.sort((a, b) => a.description.localeCompare(b.description));
    currentSortState = 1;
  } else if (currentSortState === 1) {
    listTasks.sort((a, b) => b.description.localeCompare(a.description));
    currentSortState = 2;
  } else {
    listTasks.sort((a, b) => a.id - b.id);
    currentSortState = 0;
  }
  renderTask();
}

function sortTaskByStatus() {
  if (currentSortState === 0) {
    listTasks.sort((a, b) => {
      if (a.status === b.status) return a.id - b.id;
      return a.status === "completed" ? -1 : 1;
    });
    currentSortState = 1;
  } else if (currentSortState === 1) {
    listTasks.sort((a, b) => {
      if (a.status === b.status) return a.id - b.id;
      return a.status === "incomplete" ? -1 : 1;
    });
    currentSortState = 2;
  } else {
    listTasks.sort((a, b) => a.id - b.id);
    currentSortState = 0;
  }
  renderTask();
}
