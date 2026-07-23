const tasklist = document.querySelector(".tasklist");
const taskInput = document.querySelector("#taskInput");
const categorybox = document.querySelector(".categorybox");
const prioritybox = document.querySelector(".prioritybox");
const datebox = document.querySelector(".datebox");
const add = document.querySelector(".add");
const emptybox = document.querySelector(".emptybox");
let editId = null;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const navlinks = document.querySelectorAll(".navlink");
const pages = document.querySelectorAll(".page");
const alltasklist = document.querySelector(".alltasklist");

const searchBox = document.querySelectorAll(".searchBox");
let searchValue = "";
searchBox.forEach((searchbox) => {
  searchbox.addEventListener("input", (i) => {
    searchValue = searchbox.value.trim().toLowerCase();
    showTask();
  });
});

const filterbtns = document.querySelectorAll(".filterbtn");
let currentFilter = "all";

filterbtns.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterbtns.forEach((btn) => {
      btn.classList.remove("filteractive");
    });
    button.classList.add("filteractive");
    showTask();
  });
});

const themebtn = document.querySelector(".themebtn");
let theme = localStorage.getItem("theme") || "dark";
document.body.className = theme;
themebtn.innerHTML = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
themebtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  if (document.body.classList.contains("dark")) {
    theme = "dark";
    themebtn.innerHTML = "☀️ Light Mode";
  } else {
    theme = "light";
    themebtn.innerHTML = "🌙 Dark Mode";
  }
  localStorage.setItem("theme", theme);
});

navlinks.forEach((navlink) => {
  navlink.addEventListener("click", () => {
    const pageName = navlink.dataset.page;

    navlinks.forEach((link) => {
      link.classList.remove("active");
    });

    pages.forEach((page) => {
      page.classList.add("hide");
    });

    navlink.classList.add("active");

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
      selectedPage.classList.remove("hide");
    }
  });
});

const saveTask = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
const completeTask = (id) => {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }
    return task;
  });
  showTask();
  saveTask();
};
const taskStstus = () => {
  const total1 = document.querySelector(".total1");
  const total2 = document.querySelector(".total2");
  const active1 = document.querySelector(".active1");
  const active2 = document.querySelector(".active2");
  const completeds = document.querySelector(".complete1");
  const complete2 = document.querySelector(".complete2");
  const high2 = document.querySelector(".high2");
  let total = tasks.length;
  total1.innerHTML = `All (${total})`;
  total2.innerHTML = total;

  let actives = tasks.filter((task) => {
    return task.completed === false;
  }).length;

  let complete = tasks.filter((task) => {
    return task.completed === true;
  }).length;

  let prioritys = tasks.filter((task) => {
    // return task.priority==
    return task.priority === "high";
  }).length;

  active1.innerHTML = `Active (${actives})`;
  active2.innerHTML = actives;
  completeds.innerHTML = `Completed (${complete})`;
  complete2.innerHTML = complete;
  high2.innerHTML = prioritys;
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => {
    return task.id !== id;
  });
  console.log(id);
  showTask();
  saveTask();
};

const editTask = (id) => {
  let findTask = tasks.find((task) => {
    return task.id === id;
  });
  taskInput.value = findTask.title;
  categorybox.value = findTask.category;
  prioritybox.value = findTask.priority;
  datebox.value = findTask.dueDate;
  editId = id;
  add.innerHTML = "Update Task";
};

const addTask = () => {
  let inputvalue = taskInput.value;
  let category = categorybox.value;
  let priority = prioritybox.value;
  let dueDate = datebox.value;

  if (
    inputvalue.trim() === "" ||
    category == "" ||
    priority == "" ||
    dueDate == ""
  ) {
    alert("Enter data");
    return;
  }
  if (editId !== null) {
    tasks = tasks.map((task) => {
      if (task.id === editId) {
        return {
          ...task,
          title: inputvalue,
          category: category,
          priority: priority,
          dueDate: dueDate,
        };
      }
      return task;
    });
    editId = null;
  } else {
    const newTask = {
      id: Date.now(),
      title: inputvalue,
      category: category,
      priority: priority,
      dueDate: dueDate,
      completed: false,
    };
    tasks.push(newTask);
  }
  taskInput.value = "";
  categorybox.value = "";
  prioritybox.value = "low";
  datebox.value = "";
  showTask();
  saveTask();
};

const showTask = () => {
  alltasklist.innerHTML = "";
  tasklist.innerHTML = "";
  emptybox.style.display = "none";

  let filterTask = [...tasks];

  if (searchValue !== "") {
    filterTask = filterTask.filter((task) => {
      return task.title.toLowerCase().includes(searchValue);
    });
  }

  if (currentFilter === "active") {
    filterTask = tasks.filter((task) => {
      return task.completed === false;
    });
  }

  if (currentFilter === "completed") {
    filterTask = tasks.filter((task) => {
      return task.completed === true;
    });
  }

  if (
    currentFilter === "study" ||
    currentFilter === "work" ||
    currentFilter === "personal"
  ) {
    filteredTasks = tasks.filter((task) => {
      return task.category === currentFilter;
    });
  }

  if (tasks.length === 0) {
    emptybox.style.display = "block";
  } else {
    emptybox.style.display = "none";
  }

  filterTask.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task");

    if (task.completed) {
      taskCard.classList.add("taskcomplete");
    }

    taskCard.setAttribute("data-id", task.id);
    taskCard.setAttribute(
      "data-status",
      task.completed ? "completed" : "active",
    );
    taskCard.setAttribute("data-category", task.category);

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("taskleft");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskData = document.createElement("div");
    taskData.classList.add("taskdata");

    const taskHeading = document.createElement("div");
    taskHeading.classList.add("taskheading");

    const title = document.createElement("h3");
    title.innerText = task.title;

    if (task.completed) {
      title.classList.add("taskdone");
    }

    const category = document.createElement("span");
    category.classList.add("categorytag");
    category.innerText = task.category;

    taskHeading.append(title, category);

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("taskinfo");

    const date = document.createElement("p");
    date.innerHTML = `
      <i class="fa-regular fa-calendar"></i>
      ${task.dueDate}
    `;

    const priority = document.createElement("span");
    priority.classList.add("priority");
    priority.classList.add(`${task.priority}priority`);
    priority.innerText = `${task.priority} Priority`;

    taskInfo.append(date, priority);

    taskData.append(taskHeading, taskInfo);

    taskLeft.append(checkbox, taskData);

    const taskButtons = document.createElement("div");
    taskButtons.classList.add("taskbuttons");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.innerHTML = `
      <i class="fa-regular fa-pen-to-square"></i>
      Edit
    `;

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("completebtn");
    completeBtn.innerHTML = `
      <i class="fa-solid fa-check"></i>
      ${task.completed ? "Undo" : "Complete"}
    `;
    completeBtn.type = "button";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = `
      <i class="fa-regular fa-trash-can"></i>
      Delete
    `;

    editBtn.addEventListener("click", () => {
      editTask(task.id);
    });

    completeBtn.addEventListener("click", () => {
      completeTask(task.id);
    });

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    checkbox.addEventListener("change", () => {
      completeTask(task.id);
    });

    taskButtons.append(editBtn, completeBtn, deleteBtn);

    taskCard.append(taskLeft, taskButtons);

    tasklist.appendChild(taskCard);
    const allTaskCard = taskCard.cloneNode(true);

    const allEditBtn = allTaskCard.querySelector(".edit");
    const allCompleteBtn = allTaskCard.querySelector(".completebtn");
    const allDeleteBtn = allTaskCard.querySelector(".delete");
    const allCheckbox = allTaskCard.querySelector('input[type="checkbox"]');

    allEditBtn.addEventListener("click", () => {
      editTask(task.id);

      document.querySelectorAll(".page").forEach((page) => {
        page.classList.add("hide");
      });

      document.querySelector("#dashboard").classList.remove("hide");
    });

    allCompleteBtn.addEventListener("click", () => {
      completeTask(task.id);
    });

    allDeleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    allCheckbox.addEventListener("change", () => {
      completeTask(task.id);
    });

    alltasklist.appendChild(allTaskCard);
    // alltasklist.appendChild(taskCard);
  });
  taskStstus();
};

add.addEventListener("click", addTask);

showTask();
// saveTask();
