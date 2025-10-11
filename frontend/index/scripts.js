document.addEventListener("DOMContentLoaded", () => {
  const API_URL = `${window.env.BACKEND_DIR}/productos`;

  const tablaBody = document.querySelector("#tabla-productos tbody");
  const modal = document.getElementById("modal");
  const form = document.getElementById("form-producto");
  const btnNuevo = document.getElementById("btn-nuevo");
  const btnCerrar = document.getElementById("btn-cerrar");
  const buscarInput = document.getElementById("buscar");

  let productos = [];

  // 🔹 Obtener productos del backend
  async function cargarProductos() {
    const res = await fetch(API_URL);
    productos = await res.json();
    mostrarProductos(productos);
  }

  // 🔹 Mostrar productos en tabla
  function mostrarProductos(lista) {
    tablaBody.innerHTML = "";
    lista.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.sabor}</td>
        <td>${p.tamano}</td>
        <td>${p.cantidad}</td>
        <td>
          <button class="btn-secondary" onclick="editarProducto(${p.id})">✏️</button>
          <button class="btn-secondary" onclick="eliminarProducto(${p.id})">🗑️</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  // 🔹 Filtrar productos
  buscarInput.addEventListener("input", () => {
    const texto = buscarInput.value.toLowerCase();
    const filtrados = productos.filter(
      p => p.sabor.toLowerCase().includes(texto) || p.tamano.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });

  // 🔹 Nuevo producto
  btnNuevo.addEventListener("click", () => {
    form.reset();
    document.getElementById("producto-id").value = "";
    modal.classList.remove("oculto");
  });

  btnCerrar.addEventListener("click", () => modal.classList.add("oculto"));

  // 🔹 Guardar producto
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      sabor: form.sabor.value,
      tamano: form.tamano.value,
      cantidad: parseInt(form.cantidad.value)
    };
    const id = form["producto-id"].value;

    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
    }

    modal.classList.add("oculto");
    cargarProductos();
  });

  // 🔹 Editar producto (expuesta al window para onclick)
  window.editarProducto = async (id) => {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    document.getElementById("producto-id").value = p.id;
    form.sabor.value = p.sabor;
    form.tamano.value = p.tamano;
    form.cantidad.value = p.cantidad;
    modal.classList.remove("oculto");
  };

  // 🔹 Eliminar producto
  window.eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarProductos();
  };

  cargarProductos();
});
