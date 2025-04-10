const tableTasks = document.getElementById("tableTasks");
const modalDelete = document.getElementById("deleteModal");
const modalEdit = document.getElementById("editModal");
const modalError = document.getElementById("errorModal");
const modalDeleteAll = document.getElementById("modalDeleteAll");
const inputBox = document.getElementById("input-box");
const editTaskInput = document.getElementById("editTask");
const errorMessage = document.getElementById("errorMessage");
const btnDeleteAll = document.getElementById("deleteAllTask");

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
  {
    id: 4,
    description: "Coding",
    status: "incomplete",
    priority: "low-priority",
  },
  {
    id: 5,
    description: "Learn NodeJS",
    status: "completed",
    priority: "low-priority",
  },
];

let deleteTaskId = null;
let editTaskId = null;
let currentFilterStatus = "all";
let currentFilterPriority = "priority";
let searchDescription = "";
let currentSortState = 0;
let currentPage = 1;
const taskPerPage = 5;

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
  const filterTasks = listTasks.filter((task) => {
    const matchSearch =
      searchDescription === "" ||
      task.description.toLowerCase().includes(searchDescription);
    const matchStatus =
      currentFilterStatus === "all" || task.status === currentFilterStatus;
    const matchPriority =
      currentFilterPriority === "priority" ||
      task.priority === currentFilterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  if (filterTasks.length === 0) {
    tableTasks.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          <p>Task is empty!</p>
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  const totalTasks = filterTasks.length;
  const totalPages = Math.ceil(totalTasks / taskPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * taskPerPage;
  const endIndex = startIndex + taskPerPage;
  const tasksForPage = filterTasks.slice(startIndex, endIndex);

  tableTasks.innerHTML = tasksForPage
    .map(
      (task) => `
    <tr>
      <td>
        <input 
          type="checkbox" 
          data-id="${task.id}"
            id="${task.id}"
          class="task-checkbox"
        >
      </td>
      <td class="truncate-1">
        <label class="pointer" for="${task.id}">${task.description}</label>
      </td>
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
  renderPagination(totalPages);
}

renderTask();

function validateInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return "Task cannot be empty!";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return "Task cannot contain HTML tags!";
  if (/[^ \p{L}\p{N}\s.,?!&()@:]/u.test(trimmed)) {
    return "Task cannot contain special characters!";
  }
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

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");

  searchDescription = searchInput.value.trim().toLowerCase();
  searchInput.value = "";
  renderTask();
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

window.addEventListener("click", function (e) {
  if (e.target === modalDelete) closeModal(modalDelete);
  if (e.target === modalEdit) closeModal(modalEdit);
  if (e.target === modalError) closeModal(modalError);
  if (e.target === modalDeleteAll) closeModal(modalDeleteAll);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal(modalDelete);
    closeModal(modalEdit);
    closeModal(modalError);
    closeModal(modalDeleteAll);
  }
});

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

function updateMultiSelect() {
  const checkedTask = document.querySelectorAll(".task-checkbox");
  const toggleSelectTask = document.getElementById("toggleSelectTask");
  const anyChecked = Array.from(checkedTask).some((cb) => cb.checked);

  toggleSelectTask.innerText = anyChecked ? "Unselect All" : "Select All";
  btnDeleteAll.style.display = anyChecked ? "block" : "none";
}

function selectAll() {
  const checkedTask = tableTasks.querySelectorAll(".task-checkbox");
  const hasChecked = Array.from(checkedTask).some((cb) => cb.checked);

  checkedTask.forEach((cb) => (cb.checked = !hasChecked));
  updateMultiSelect();
}

tableTasks.addEventListener("change", updateMultiSelect);

function deleteMultiTask() {
  openModal(document.getElementById("modalDeleteAll"));
}

function confirmDeleteMultiTask() {
  const checkedCheckboxes = document.querySelectorAll(".task-checkbox:checked");

  const taskIds = Array.from(checkedCheckboxes).map((checkbox) =>
    parseInt(checkbox.getAttribute("data-id"))
  );

  for (let i = listTasks.length - 1; i >= 0; i--) {
    if (taskIds.includes(listTasks[i].id)) {
      listTasks.splice(i, 1);
    }
  }
  renderTask();
  closeModal(document.getElementById("modalDeleteAll"));
  updateMultiSelect();
}

function cancelDeleteMultiTask() {
  closeModal(document.getElementById("modalDeleteAll"));
}

function filterByStatus() {
  const filterSelect = document.getElementById("filterStatus");
  currentFilterStatus = filterSelect.value;
  renderTask();
}

function filterByPriority() {
  const filterSelect = document.getElementById("filterPriority");
  currentFilterPriority = filterSelect.value;
  renderTask();
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let paginationHTML = `
    <button 
      onclick="changePage(currentPage - 1)" 
      class="btn text-gray"
        ${currentPage === 1 ? "disabled" : ""}
    >
      Previous
    </button>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button 
        onclick="changePage(${i})"
        class="btn text-gray px-3 ${
          currentPage === i ? "bg-gray text-white" : ""
        }"
      >
        ${i}
      </button>`;
  }

  paginationHTML += `
    <button 
      onclick="changePage(currentPage + 1)"
      class="btn text-gray"
      ${currentPage === totalPages ? "disabled" : ""}
    >
      Next
    </button>`;

  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  currentPage = page;
  renderTask();
}
