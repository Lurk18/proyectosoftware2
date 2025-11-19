(function () {
	// Helper para construir URL de la API usando window.env.BACKEND_DIR si está definido
	function apiUrl(path) {
		const env = window.env && window.env.BACKEND_DIR ? window.env.BACKEND_DIR : '';
		if (!env) return path; // usar ruta relativa
		// Añadir protocolo si no viene
		let base = env;
		if (!/^https?:\/\//i.test(base)) base = 'http://' + base;
		// Quitar slash final
		if (base.endsWith('/')) base = base.slice(0, -1);
		// Asegurar que path comienza con /
		if (!path.startsWith('/')) path = '/' + path;
		return base + path;
	}

	// ---------- Inicializadores para otras vistas ----------

	function initCrearPedido() {
		const form = document.getElementById('formCrearPedido');
		const resultado = document.getElementById('crearPedidoResultado');
		if (!form || !resultado) return;

		function show(text, isError = false) {
			resultado.innerHTML = '';
			const p = document.createElement('pre');
			p.textContent = text;
			if (isError) p.style.color = 'crimson';
			resultado.appendChild(p);
		}

		form.replaceWith(form.cloneNode(true));
		const newForm = document.getElementById('formCrearPedido');
		newForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const fd = new FormData(newForm);
			const customer_id = parseInt(fd.get('customer_id'));
			let productosText = fd.get('productos');
			let productos;
			try {
				productos = JSON.parse(productosText);
				if (!Array.isArray(productos)) throw new Error('Productos debe ser un arreglo');
			} catch (err) {
				show('JSON de productos inválido: ' + err.message, true);
				return;
			}

			show('Creando pedido...');
			try {
				const res = await fetch(apiUrl('/pedidos'), {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ customer_id, productos })
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					show('Error: ' + JSON.stringify(data, null, 2), true);
				} else {
					show('Pedido creado:\n' + JSON.stringify(data, null, 2));
				}
			} catch (err) {
				show('Error de red: ' + err.message, true);
			}
		});
	}

	function initDetallePedido() {
		const form = document.getElementById('formDetallePedido');
		const resultado = document.getElementById('detallePedidoResultado');
		if (!form || !resultado) return;

		function showHTML(node) { resultado.innerHTML = ''; resultado.appendChild(node); }
		function showText(t, isError = false) { resultado.innerHTML = ''; const p = document.createElement('pre'); p.textContent = t; if (isError) p.style.color = 'crimson'; resultado.appendChild(p); }

		form.replaceWith(form.cloneNode(true));
		const newForm = document.getElementById('formDetallePedido');
		newForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const fd = new FormData(newForm);
			const order_id = fd.get('order_id');
			if (!order_id) { showText('ID de pedido inválido', true); return; }
			showText('Consultando pedido...');
			try {
				const res = await fetch(apiUrl(`/pedidos/orden/${encodeURIComponent(order_id)}`));
				if (res.status === 404) { showText('Pedido no encontrado'); return; }
				if (!res.ok) { const t = await res.text(); showText('Error: ' + t, true); return; }
				const data = await res.json().catch(() => ({}));
				const pedido = data && data.pedido ? data.pedido : data;
				const div = document.createElement('div');
				const header = document.createElement('h3'); header.textContent = `Pedido ${pedido.order_id || ''} - Cliente ${pedido.customer_id || ''}`;
				div.appendChild(header);
				const fecha = pedido.order_date || pedido.fecha || pedido.date || '';
				const estado = pedido.status || pedido.estado || '';
				const meta = document.createElement('p'); meta.textContent = `Fecha: ${fecha} | Estado: ${estado} | Total: ${pedido.totalPedido || ''}`;
				div.appendChild(meta);
				if (Array.isArray(pedido.productos)) {
					const ul = document.createElement('ul');
					pedido.productos.forEach(p => { const li = document.createElement('li'); li.textContent = `${p.productoId || p.producto_id || p.item_id || ''} - ${p.nombre || ''} x ${p.cantidad || ''} @ ${p.precioUnitario || p.precio || ''}`; ul.appendChild(li); });
					div.appendChild(ul);
				}
				showHTML(div);
			} catch (err) { showText('Error de red: ' + err.message, true); }
		});
	}

	function initEliminarPedido() {
		const form = document.getElementById('formEliminarPedido');
		const resultado = document.getElementById('eliminarPedidoResultado');
		if (!form || !resultado) return;

		function show(t, isError = false) { resultado.innerHTML = ''; const p = document.createElement('pre'); p.textContent = t; if (isError) p.style.color = 'crimson'; resultado.appendChild(p); }

		form.replaceWith(form.cloneNode(true));
		const newForm = document.getElementById('formEliminarPedido');
		newForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const fd = new FormData(newForm);
			const id = fd.get('order_id');
			if (!id) { show('ID inválido', true); return; }
			show('Eliminando pedido...');
			try {
				const res = await fetch(apiUrl(`/pedidos/remove/${encodeURIComponent(id)}`), { method: 'DELETE' });
				const data = await res.json().catch(() => ({}));
				if (!res.ok) { show('Error: ' + JSON.stringify(data, null, 2), true); } else { show(JSON.stringify(data, null, 2)); }
			} catch (err) { show('Error de red: ' + err.message, true); }
		});
	}

	function initActualizarEstado() {
		const form = document.getElementById('formActualizarEstado');
		const resultado = document.getElementById('actualizarEstadoResultado');
		if (!form || !resultado) return;

		function show(t, isError = false) { resultado.innerHTML = ''; const p = document.createElement('pre'); p.textContent = t; if (isError) p.style.color = 'crimson'; resultado.appendChild(p); }

		form.replaceWith(form.cloneNode(true));
		const newForm = document.getElementById('formActualizarEstado');
		newForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const fd = new FormData(newForm);
			const id = fd.get('order_id');
			const estado = fd.get('estado');
			if (!id || !estado) { show('ID o estado inválido', true); return; }
			show('Actualizando estado...');
			try {
				const res = await fetch(apiUrl(`/pedidos/update/${encodeURIComponent(id)}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
				const data = await res.json().catch(() => ({}));
				if (!res.ok) { show('Error: ' + JSON.stringify(data, null, 2), true); } else { show(JSON.stringify(data, null, 2)); }
			} catch (err) { show('Error de red: ' + err.message, true); }
		});
	}

	function initInformeInventario() {
		const btn = document.getElementById('btnConsultarInventario');
		const resultado = document.getElementById('informeInventarioResultado');
		if (!btn || !resultado) return;

		function showError(t) { resultado.innerHTML = ''; const p = document.createElement('pre'); p.textContent = t; p.style.color = 'crimson'; resultado.appendChild(p); }
		function showJSON(obj) { resultado.innerHTML = ''; const pre = document.createElement('pre'); pre.textContent = JSON.stringify(obj, null, 2); resultado.appendChild(pre); }

		btn.replaceWith(btn.cloneNode(true));
		const newBtn = document.getElementById('btnConsultarInventario');
		newBtn.addEventListener('click', async () => {
			resultado.innerHTML = 'Consultando...';
			try {
				const res = await fetch(apiUrl('/informes/inventario'));
				if (!res.ok) { const t = await res.text(); showError('Error: ' + t); return; }
				const data = await res.json();
				const div = document.createElement('div');
				const title = document.createElement('h3'); title.textContent = data.titulo || 'Informe'; div.appendChild(title);
				const gen = document.createElement('p'); gen.textContent = 'Generado: ' + (data.fecha_generacion || ''); div.appendChild(gen);
				if (data.resumen) { const r = document.createElement('pre'); r.textContent = JSON.stringify(data.resumen, null, 2); div.appendChild(r); }
				if (Array.isArray(data.detalle)) {
					const table = document.createElement('table'); table.style.borderCollapse = 'collapse'; table.style.width = '100%';
					const thead = document.createElement('thead'); const hr = document.createElement('tr'); ['Item', 'Producto', 'Proveedor', 'Stock', 'Precio', 'Valor total'].forEach(h => { const th = document.createElement('th'); th.textContent = h; th.style.border = '1px solid #ccc'; th.style.padding = '6px'; hr.appendChild(th); }); thead.appendChild(hr); table.appendChild(thead);
					const tbody = document.createElement('tbody');
					data.detalle.forEach(it => { const tr = document.createElement('tr'); [it.item_id || '', it.producto_nombre || '', it.proveedor_nombre || '', it.stock || '', it.precio_unitario || it.precio_unitario || '', it.valor_total_item || ''].forEach(v => { const td = document.createElement('td'); td.textContent = v; td.style.border = '1px solid #eee'; td.style.padding = '6px'; tr.appendChild(td); }); tbody.appendChild(tr); });
					table.appendChild(tbody); div.appendChild(table);
				}
				resultado.innerHTML = ''; resultado.appendChild(div);
			} catch (err) { showError('Error de red: ' + err.message); }
		});
	}

	function initProductoMasVendido() {
		const btn = document.getElementById('btnConsultarMasVendido');
		const resultado = document.getElementById('productoMasVendidoResultado');
		if (!btn || !resultado) return;
		btn.replaceWith(btn.cloneNode(true));
		const newBtn = document.getElementById('btnConsultarMasVendido');
		newBtn.addEventListener('click', async () => {
			resultado.innerHTML = 'Consultando...';
			try {
				const res = await fetch(apiUrl('/informes/producto-mas-vendido'));
				if (res.status === 404) { resultado.textContent = 'No hay ventas registradas todavía.'; return; }
				if (!res.ok) { const t = await res.text(); resultado.textContent = 'Error: ' + t; return; }
				const data = await res.json();
				resultado.innerHTML = '';
				const pre = document.createElement('pre'); pre.textContent = JSON.stringify(data, null, 2); resultado.appendChild(pre);
			} catch (err) { resultado.textContent = 'Error de red: ' + err.message; }
		});
	}
	// initView(viewName) se llama desde index.html después de insertar la vista.
	window.initView = function (view) {
		if (view === 'consultarPedidos') {
			initConsultarPedidos();
		}
		if (view === 'crearPedido') {
			initCrearPedido();
		}
		if (view === 'detallePedido') {
			initDetallePedido();
		}
		if (view === 'eliminarPedido') {
			initEliminarPedido();
		}
		if (view === 'actualizarEstado') {
			initActualizarEstado();
		}
		if (view === 'informeInventario') {
			initInformeInventario();
		}
		if (view === 'productoMasVendido') {
			initProductoMasVendido();
		}
	};

	function initConsultarPedidos() {
		const form = document.getElementById('formConsultarPedidos');
		const resultado = document.getElementById('consultarPedidosResultado');
		if (!form || !resultado) return; // no es la vista correcta

		function renderMessage(text, isError = false) {
			resultado.innerHTML = '';
			const p = document.createElement('p');
			p.textContent = text;
			p.style.color = isError ? 'crimson' : 'inherit';
			resultado.appendChild(p);
		}
				// View initializers moved to top-level


		function renderOrders(orders) {
			resultado.innerHTML = '';

			// Normalizar: si la respuesta viene como { pedidos: [...] } usar esa lista
			let list = orders;
			if (!list) list = [];
			if (!Array.isArray(list) && typeof orders === 'object' && orders.pedidos) {
				list = orders.pedidos;
			}

			if (!Array.isArray(list) || list.length === 0) {
				renderMessage('No se encontraron pedidos para este cliente.');
				return;
			}

			const table = document.createElement('table');
			table.style.borderCollapse = 'collapse';
			table.style.width = '100%';
			const thead = document.createElement('thead');
			const headerRow = document.createElement('tr');
			['Order ID', 'Fecha', 'Estado', 'Total Productos'].forEach(h => {
				const th = document.createElement('th');
				th.textContent = h;
				th.style.border = '1px solid #ccc';
				th.style.padding = '6px';
				headerRow.appendChild(th);
			});
			thead.appendChild(headerRow);
			table.appendChild(thead);

			const tbody = document.createElement('tbody');
			list.forEach(o => {
				const tr = document.createElement('tr');
				// Mapear campos comunes de la API a las columnas
				const orderId = o.order_id || o.id || o.orderId || '';
				const fecha = o.order_date || o.fecha || o.date || '';
				const estado = o.status || o.estado || o.order_status || '';
				const totalProductos = o.totalProductos != null ? o.totalProductos : (o.cantidad != null ? o.cantidad : '');
				[orderId, fecha, estado, totalProductos].forEach(val => {
					const td = document.createElement('td');
					td.textContent = val;
					td.style.border = '1px solid #eee';
					td.style.padding = '6px';
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});
			table.appendChild(tbody);
			resultado.appendChild(table);
		}

		// Quitamos listeners previos para evitar duplicados
		form.replaceWith(form.cloneNode(true));
		const newForm = document.getElementById('formConsultarPedidos');

		newForm.addEventListener('submit', async function (e) {
			e.preventDefault();
			const formData = new FormData(newForm);
			const customerId = formData.get('customer_id');
			if (!customerId) {
				renderMessage('Ingrese un ID de cliente válido.', true);
				return;
			}

			renderMessage('Consultando pedidos...');

			try {
				const url = apiUrl(`/pedidos/cliente/${encodeURIComponent(customerId)}`);
				console.debug('Fetching', url);
				const resp = await fetch(url);
				if (resp.status === 404) {
					// intentar obtener cuerpo con más detalle
					let body = '';
					try { body = await resp.text(); } catch (e) { body = ''; }
					renderMessage(`No hay pedidos para ese cliente. (url: ${resp.url}, status: 404)\n${body}`);
					return;
				}
				if (!resp.ok) {
					const txt = await resp.text();
					renderMessage('Error al consultar pedidos: ' + (txt || resp.statusText), true);
					return;
				}
				const data = await resp.json();
				renderOrders(data);
			} catch (err) {
				renderMessage('Error de red: ' + err.message, true);
			}
		});
	}

})();

