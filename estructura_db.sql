-- TABLA CLIENTES

CREATE TABLE Cliente (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_info TEXT
);


-- TABLA PROVEEDORES

CREATE TABLE Proveedor (
    proveedor_id SERIAL PRIMARY KEY,
    proveedor_name VARCHAR(100) NOT NULL,
    contacto TEXT
);


-- TABLA ITEMS (Productos)
-- Cada producto pertenece a un proveedor

CREATE TABLE Item (
    item_id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES Proveedor(proveedor_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    stock INT DEFAULT 0
);

-- TABLA ÓRDENES

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES Cliente(customer_id) ON DELETE CASCADE,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Pendiente'
);

-- TABLA DETALLE DE ÓRDENES
-- Una orden puede tener múltiples productos

CREATE TABLE OrderDetails (
    order_id INT NOT NULL REFERENCES Orders(order_id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES Item(item_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (order_id, item_id)
);


-- TABLA ENVÍOS (Shipments)

CREATE TABLE Shipments (
    shipment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES Orders(order_id) ON DELETE CASCADE,
    shipment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    carrier VARCHAR(100),
    tracking_number VARCHAR(100)
);


-- TABLA DETALLE DE ENVÍOS
-- Relaciona cada envío con productos enviados

CREATE TABLE ShipmentDetails (
    shipment_id INT NOT NULL REFERENCES Shipments(shipment_id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES Item(item_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (shipment_id, item_id)
);

-- TABLA MOVIMIENTOS DE INVENTARIO
-- Registra entradas, salidas, internos

CREATE TABLE InventoryMovements (
    movement_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES Item(item_id),
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'interna')),
    quantity INT NOT NULL CHECK (quantity > 0),
    movement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100),
    destination VARCHAR(100)
);

-- TABLA DE INTEGRACIONES (log de entrada/salida de software externo)

CREATE TABLE IntegrationLogs (
    log_id SERIAL PRIMARY KEY,
    system VARCHAR(100) NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('entrada', 'salida')),
    reference_id INT,
    log_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'OK'
);


