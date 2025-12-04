let monitors = [];        // lista global de monitores
let selectedMonitor = {}; // monitor elegido
let currentId = null;     // id de la sesión actual

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };
}

// Carga monitores en el select de la página
async function loadMonitors() {
  try {
    const res = await fetch("/api/v1/monitors", {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    monitors = await res.json();
    const monitorSel = document.getElementById("monitor");
    monitorSel.innerHTML = "";

    monitors.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.name;
      monitorSel.appendChild(opt);
    });

    if (monitors.length > 0) {
      selectedMonitor = monitors[0];
    }

    console.log("Monitores cargados:", monitors);
  } catch (e) {
    document.getElementById("monitorsStatus").textContent =
      `Error cargando monitores: ${e.message}`;
  }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // 🔑 MUY IMPORTANTE: permite guardar cookies
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    alert("✔ Login exitoso");
    window.location.href = "index.html"; // ahora sí funcionará
  } catch (err) {
    document.getElementById("loginStatus").textContent = "❌ " + err.message;
  }
});



// cada vez que cambia el select
document.addEventListener("DOMContentLoaded", () => {
  const monitorSelect = document.getElementById("monitor");
  if (monitorSelect) {
    monitorSelect.addEventListener("change", (e) => {
      selectedMonitor = monitors.find(m => m.id == e.target.value);
    });
  }
});

// Envía formulario de sesión manual
async function submitForm(event) {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const topic = document.getElementById("topic").value;

  const payload = {
    monitorId: parseInt(selectedMonitor.id),
    date,
    topic,
  };

  try {
    const res = await fetch("/api/v1/mentoring-sessions/create", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const created = await res.json();
    currentId = created.id;

    document.getElementById("createSessionStatus").textContent =
      `✔ Sesión #${created.id} con ${selectedMonitor.name} registrada correctamente.`;
  } catch (e) {
    document.getElementById("createSessionStatus").textContent =
      `❌ Error registrando sesión: ${e.message}`;
  }
}

// Cargar sesiones
async function getSessions() {
  try {
    const res = await fetch("/api/v1/mentoring-sessions", {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const sessions = await res.json();
    const tbody = document.querySelector("#sessionsTable tbody");
    tbody.innerHTML = "";

    sessions.forEach(s => {
      const tr = document.createElement("tr");
      const monitor = monitors.find(m => m.id === s.monitorId);
      const students = s.studentIds && s.studentIds.length > 0
        ? s.studentIds.join(", ")
        : "N/A";

      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${s.date}</td>
        <td>${monitor ? monitor.name : "N/A"}</td>
        <td>${s.topic}</td>
        <td>${students}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById("sessionsStatus").textContent =
      `✔ ${sessions.length} sesiones cargadas.`;
    return sessions;
  } catch (e) {
    document.getElementById("sessionsStatus").textContent =
      `Error cargando sesiones: ${e.message}`;
    return [];
  }
}

// Añadir estudiante
async function addStudentToSession(event) {
  event.preventDefault();

  if (!currentId) {
    alert("Primero crea una sesión.");
    return;
  }

  const studentId = document.getElementById("studentId").value;
  const studentName = document.getElementById("studentName").value;

  if (!studentId || !studentName) {
    alert("Rellena ambos campos de alumno.");
    return;
  }

  const payload = {
    sessionId: parseInt(currentId),
    id: parseInt(studentId),
    name: studentName
  };

  try {
    const res = await fetch("/api/v1/mentoring-sessions/add-student", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const updated = await res.json();
    console.log("Alumno añadido a la sesión:", updated);
    return updated;
  } catch (e) {
    console.error("Error añadiendo alumno:", e);
    return null;
  }
}

// Modal de creación automática
function showSessionModal() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("modalDate").value = today;
  document.getElementById("sessionModal").classList.remove("hidden");
}

async function createSessionFromModal() {
  const date = document.getElementById("modalDate").value;
  const topic = document.getElementById("modalTopic").value;

  if (!topic) {
    alert("Debes ingresar un tema para la sesión.");
    return;
  }

  const payload = {
    monitorId: parseInt(selectedMonitor.id),
    date,
    topic
  };

  try {
    const res = await fetch("/api/v1/mentoring-sessions/create", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const created = await res.json();
    currentId = created.id;

    document.getElementById("createSessionStatus").textContent =
      `✔ Sesión #${created.id} creada automáticamente.`;

    document.getElementById("sessionModal").classList.add("hidden");
  } catch (e) {
    alert("❌ Error creando sesión: " + e.message);
  }
}

// Inicialización al entrar en index.html
if (window.location.pathname.endsWith("index.html")) {
  loadMonitors().then(() => {
    showSessionModal();
  });

  document.getElementById("saveSessionBtn").addEventListener("click", createSessionFromModal);
  document.getElementById("createSessionBtn").addEventListener("click", submitForm);
  document.getElementById("refreshSessionsBtn").addEventListener("click", getSessions);
  document.getElementById("addStudent").addEventListener("click", addStudentToSession);
}
