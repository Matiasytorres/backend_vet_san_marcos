-- ===== Roles =====
DO $$ BEGIN
  CREATE TYPE enum_usuarios_rol AS ENUM ('administrador', 'recepcionista', 'dueno_mascota');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ===== Usuarios =====
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           enum_usuarios_rol NOT NULL DEFAULT 'dueno_mascota',
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);

-- ===== Servicios (catálogo) =====
CREATE TABLE IF NOT EXISTS servicios (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(10) NOT NULL UNIQUE,
  nombre        VARCHAR(100) NOT NULL,
  categoria     VARCHAR(30) NOT NULL,
  especie       VARCHAR(40) NOT NULL,
  duracion      VARCHAR(20) NOT NULL,
  precio        INTEGER NOT NULL CHECK (precio > 0),
  observaciones VARCHAR(200) NOT NULL DEFAULT '',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== Mascotas (cada una pertenece a un dueño) =====
CREATE TABLE IF NOT EXISTS mascotas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(60) NOT NULL,
  especie     VARCHAR(20) NOT NULL CHECK (especie IN ('Perro', 'Gato', 'Conejo', 'Ave')),
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== Citas (solicitud principal) =====
-- precio_final guarda el precio cobrado al pedir la cita (con recargo si aplica).
CREATE TABLE IF NOT EXISTS citas (
  id          SERIAL PRIMARY KEY,
  fecha       DATE NOT NULL,
  hora        TIME NOT NULL,
  estado      VARCHAR(12) NOT NULL DEFAULT 'Pendiente'
              CHECK (estado IN ('Pendiente', 'Confirmada', 'Completada', 'Cancelada')),
  motivo      VARCHAR(300) NOT NULL DEFAULT '',
  precio_final INTEGER NOT NULL CHECK (precio_final > 0),
  mascota_id  INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE RESTRICT,
  servicio_id INTEGER NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dos citas confirmadas no pueden compartir fecha y hora
CREATE UNIQUE INDEX IF NOT EXISTS ux_citas_horario_confirmado
  ON citas (fecha, hora) WHERE estado = 'Confirmada';

-- ===== Datos iniciales del catálogo =====
INSERT INTO servicios (codigo, categoria, nombre, especie, duracion, precio, observaciones) VALUES
('SV001','Consultas','Consulta general','Perro / Gato','30 min',15000,''),
('SV002','Consultas','Consulta urgencia','Perro / Gato','30 min',25000,'Fuera de horario +$10.000'),
('SV003','Consultas','Control postoperatorio','Perro / Gato','20 min',10000,''),
('SV004','Consultas','Consulta ave / conejo','Ave / Conejo','30 min',18000,''),
('SV005','Consultas','Segunda opinión médica','Todas','40 min',20000,'Requiere ficha previa'),
('VA001','Vacunación','Vacuna antirrábica canina','Perro','10 min',12000,'Obligatoria por ley'),
('VA002','Vacunación','Vacuna sextuple canina','Perro','10 min',18000,'Refuerzo anual'),
('VA003','Vacunación','Vacuna bivalente felina','Gato','10 min',15000,'Refuerzo anual'),
('VA004','Vacunación','Vacuna triple felina','Gato','10 min',17000,'Refuerzo anual'),
('VA005','Vacunación','Vacuna Bordetella canina','Perro','10 min',14000,'Tos de las perreras'),
('VA006','Vacunación','Vacuna antirrábica felina','Gato','10 min',12000,''),
('CI001','Cirugía','Esterilización hembra canina','Perra','90 min',80000,'Incluye anestesia y hospitalización 24h'),
('CI002','Cirugía','Esterilización macho canino','Perro','60 min',60000,'Incluye anestesia'),
('CI003','Cirugía','Esterilización hembra felina','Gata','60 min',65000,'Incluye anestesia y hospitalización 12h'),
('CI004','Cirugía','Esterilización macho felino','Gato','45 min',50000,'Incluye anestesia'),
('CI005','Cirugía','Extirpación de tumor cutáneo','Perro / Gato','60 min',120000,'Precio referencial; varía según tamaño'),
('CI006','Cirugía','Cesárea de urgencia','Perra / Gata','120 min',180000,''),
('DE001','Desparasitación','Desparasitación interna pequeños (<10 kg)','Perro','5 min',8000,''),
('DE002','Desparasitación','Desparasitación interna medianos (10-25 kg)','Perro','5 min',9500,''),
('DE003','Desparasitación','Desparasitación interna grandes (>25 kg)','Perro','5 min',11000,''),
('DE004','Desparasitación','Desparasitación interna felina','Gato','5 min',8000,''),
('DE005','Desparasitación','Antiparasitario externo (pipeta)','Perro / Gato','5 min',7500,'Incluye aplicación'),
('EX001','Exámenes','Hemograma completo','Perro / Gato','30 min',22000,'Resultado en 24-48 h'),
('EX002','Exámenes','Perfil bioquímico completo','Perro / Gato','30 min',35000,'Resultado en 24-48 h'),
('EX003','Exámenes','Radiografía (1 proyección)','Perro / Gato','20 min',28000,''),
('EX004','Exámenes','Ecografía abdominal','Perro / Gato','30 min',45000,''),
('EX005','Exámenes','Test de leishmaniasis','Perro','20 min',18000,''),
('OT001','Otros','Corte de uñas','Perro / Gato','15 min',5000,''),
('OT002','Otros','Limpieza dental','Perro / Gato','45 min',55000,'Requiere anestesia'),
('OT003','Otros','Microchip identificación','Perro / Gato','10 min',15000,'Incluye registro'),
('OT004','Otros','Hospitalización (por día)','Perro / Gato','24 h',30000,'Incluye monitoreo y alimentación básica')
ON CONFLICT (codigo) DO NOTHING;

-- Primer administrador: regístrate por la API y luego ejecuta UNA vez:
-- UPDATE usuarios SET rol = 'administrador' WHERE email = 'admin@vet.com';