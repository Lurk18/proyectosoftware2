-- SCRIPT COMPLETO PARA POBLAR LA BASE DE DATOS
-- AUTOGENERADO PARA EL MODELO DE INVENTARIO Y ÓRDENES

-- =============================
-- 1. CLIENTES
-- =============================
INSERT INTO Cliente (customer_name, contact_info) VALUES 
('Tiendas Naturales VidaPlena', 'contacto@vidaplena.com | +57 310 555 0182'),
('GranolaFit Market', 'ventas@granolafit.co | +57 314 667 2011'),
('EcoSalud Orgánicos', 'info@ecosalud.com | +57 300 918 4421'),
('NutriBar Distribuciones', 'nutribar@distribuciones.co | +57 315 802 3399'),
('Healthy Crunch Stores', 'ventas@healthycrunch.com | +57 320 541 2288'),
('Gimnasio Energym', 'contacto@energymfit.co | +57 311 728 5544'),
('Supermercado BioMarket', 'biomarket@super.com | +57 312 333 9012'),
('Natural Boost Express', 'ventas@naturalboost.com | +57 310 640 7722'),
('Wellness & Snacks SAS', 'info@wellnesssnacks.co | +57 313 290 1184'),
('Alimentos La Montaña', 'compras@lamontana.com | +57 301 721 8844');

-- =============================
-- 2. PROVEEDORES
-- =============================
INSERT INTO Proveedor (proveedor_name, contacto) VALUES
('CampoVerde Foods', 'ventas@campoverde.com | +57 315 887 2201'),
('GranolaMaster SAS', 'contacto@granolamaster.co | +57 317 550 9182'),
('Healthy Roots Co', 'info@healthyroots.co | +57 314 660 1102'),
('EcoSeeds Importaciones', 'ecoseeds@import.com | +57 300 710 9001');

-- =============================
-- 3. ITEMS (PRODUCTOS)
-- =============================
INSERT INTO Item (proveedor_id, name, description, price, stock) VALUES
(1, 'Barra Granola Natural', 'Barra de avena con miel 35g', 2500, 500),
(1, 'Barra Granola Chocolate', 'Barra con chips de chocolate 40g', 2800, 450),
(2, 'Barra Granola Café', 'Barra con sabor a café 35g', 2600, 300),
(2, 'Barra Proteica Almendra', 'Barra alta en proteína 45g', 3500, 350),
(3, 'Barra Semillas Mixtas', 'Semillas de girasol, chía y linaza', 3000, 600),
(4, 'Barra Frutos Rojos', 'Granola con frutos rojos 35g', 2900, 400);

-- =============================
-- 4. ÓRDENES
-- =============================
INSERT INTO Orders (customer_id, order_date, status) VALUES
(1, CURRENT_DATE - INTERVAL '10 days', 'Completada'),
(3, CURRENT_DATE - INTERVAL '7 days', 'Pendiente'),
(5, CURRENT_DATE - INTERVAL '3 days', 'En proceso'),
(2, CURRENT_DATE - INTERVAL '1 days', 'Pendiente');

-- =============================
-- 5. DETALLE DE ÓRDENES
-- =============================
INSERT INTO OrderDetails (order_id, item_id, quantity, unit_price) VALUES
(1, 1, 100, 2500),
(1, 2, 70, 2800),
(2, 3, 50, 2600),
(3, 4, 120, 3500),
(3, 5, 80, 3000),
(4, 6, 60, 2900);

-- =============================
-- 6. ENVÍOS
-- =============================
INSERT INTO Shipments (order_id, shipment_date, carrier, tracking_number) VALUES
(1, CURRENT_DATE - INTERVAL '8 days', 'Servientrega', 'TRK001'),
(3, CURRENT_DATE - INTERVAL '1 days', 'Coordinadora', 'TRK002');

-- =============================
-- 7. DETALLE DE ENVÍOS
-- =============================
INSERT INTO ShipmentDetails (shipment_id, item_id, quantity) VALUES
(1, 1, 100),
(1, 2, 70),
(2, 4, 120),
(2, 5, 80);

-- =============================
-- 8. MOVIMIENTOS DE INVENTARIO
-- =============================
INSERT INTO InventoryMovements (item_id, movement_type, quantity, source, destination) VALUES
(1, 'salida', 100, 'Bodega Central', 'Envio TRK001'),
(2, 'salida', 70, 'Bodega Central', 'Envio TRK001'),
(4, 'salida', 120, 'Bodega Central', 'Envio TRK002'),
(5, 'salida', 80, 'Bodega Central', 'Envio TRK002'),
(3, 'entrada', 500, 'Proveedor GranolaMaster', 'Bodega Central');

-- =============================
-- 9. LOGS DE INTEGRACIÓN
-- =============================
INSERT INTO IntegrationLogs (system, direction, reference_id, status) VALUES
('ERP Externo', 'entrada', 1, 'OK'),
('API Ventas', 'salida', 3, 'OK'),
('ERP Externo', 'entrada', 2, 'OK'),
('App Movil', 'salida', 4, 'OK');
-- =============================
-- FIN DEL SCRIPT
-- =============================