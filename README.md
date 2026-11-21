# Backend Veterinaria San Marcos

API RESTful del **Grupo 2** para el sistema de gestión de la Veterinaria San Marcos, desarrollada con Node.js, Express, Sequelize y PostgreSQL, con autenticación mediante JWT y control de acceso basado en roles.

## Enlaces del proyecto y despliegue
- **Repositorio Frontend:** https://github.com/ItaloCarmonaM/Ev2_vet_san_marcos
- **Repositorio Backend:** https://github.com/Matiasytorres/backend_vet_san_marcos
- **Documentación API (Swagger):** http://3.229.45.167:3000/api/docs/
- **API Base URL (AWS EC2):** `http://3.229.45.167:3000/api/v1`
- **Aplicación Frontend (AWS EC2):** http://54.81.168.243:5173

## Integrantes
- Ítalo Carmona (`ItaloCarmonaM`)
- Camilo Peña (`lokiinsano` / `archivohtml`)
- Matías Yañez (`Matiasytorres`)

## Tecnologías
- Node.js + Express
- PostgreSQL + Sequelize (ORM y modelos relacionales)
- JSON Web Token (`jsonwebtoken`) + `bcryptjs` (hash de contraseñas)
- Swagger UI (`swagger-ui-express` / `swagger-jsdoc`)
- CORS configurado para comunicación con el frontend en AWS EC2

## Estado del trabajo y endpoints implementados

### Autenticación y Sesión
| Operación | Método y Ruta | Acceso | Estado |
| :--- | :--- | :--- | :--- |
| Inicio de sesión con JWT | `POST /api/v1/auth/login` | Público | Listo |
| Registro de cliente (`dueno_mascota`) | `POST /api/v1/auth/register` | Público | Listo |
| Obtener perfil autenticado | `GET /api/v1/auth/me` | Autenticado (JWT) | Listo |

### Gestión de Usuarios
| Operación | Método y Ruta | Acceso | Estado |
| :--- | :--- | :--- | :--- |
| Listar usuarios | `GET /api/v1/usuarios` | `administrador` | Listo |
| Crear usuario con rol | `POST /api/v1/usuarios` | `administrador` | Listo |
| Cambiar rol de usuario | `PATCH /api/v1/usuarios/:id/rol` | `administrador` | Listo |
| Activar / desactivar usuario | `PATCH /api/v1/usuarios/:id/estado` | `administrador` | Listo |

### Catálogo de Servicios
| Operación | Método y Ruta | Acceso | Estado |
| :--- | :--- | :--- | :--- |
| Listar servicios | `GET /api/v1/servicios` | Público | Listo |
| Crear servicio (código `SRV-XXX`) | `POST /api/v1/servicios` | `administrador` | Listo |
| Actualizar servicio | `PUT /api/v1/servicios/:id` | `administrador` | Listo |
| Eliminar servicio | `DELETE /api/v1/servicios/:id` | `administrador` | Listo |

### Gestión de Citas y Reglas de Negocio
| Operación | Método y Ruta | Acceso | Estado |
| :--- | :--- | :--- | :--- |
| Listar citas (todas o propias según rol) | `GET /api/v1/citas` | Autenticado (JWT) | Listo |
| Consultar bloques horarios ocupados | `GET /api/v1/citas/ocupadas` | Público / Autenticado | Listo |
| Solicitar nueva cita | `POST /api/v1/citas` | `dueno_mascota` | Listo |
| Cambiar estado (valida conflicto `409`) | `PATCH /api/v1/citas/:id/estado` | `administrador`, `recepcionista` | Listo |

## Configuración y ejecución local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar las variables de entorno en un archivo `.env` (base de datos PostgreSQL, secreto JWT, puerto `3000` y orígenes permitidos en `CORS_ORIGINS`).
3. Iniciar el servidor:
   ```bash
   npm start
   ```
4. Abrir la documentación interactiva en `http://localhost:3000/api/docs/`.
