-- Tipo para los roles
DO $$ BEGIN
  CREATE TYPE enum_usuarios_rol AS ENUM ('administrador', 'recepcionista', 'dueno_mascota');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabla de usuarios
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

-- Primer administrador: primero regístrate normalmente por la API
-- y luego ejecuta esto UNA vez con tu correo:
-- UPDATE usuarios SET rol = 'administrador' WHERE email = 'admin@correo.cl';