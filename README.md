# Backend Veterinaria San Marcos
- Frontend: https://github.com/ItaloCarmonaM/Ev2_vet_san_marcos.git

API REST con Node.js, Express, Sequelize y PostgreSQL. Maneja usuarios, inicio de sesión con JWT y roles.
## Estado del trabajo

| Operación | Ruta | Estado |
|---|---|---|
| Tabla de usuarios (contraseñas con hash) | modelo `Usuario` | Listo |
| Inicio de sesión con JWT | POST `/api/auth/login` | Listo |
| Registro de usuario | POST `/api/auth/register` | Listo |
| Modificar usuario | PUT `/api/usuarios/:id` | En avance |
| Listar usuarios | GET `/api/usuarios` | En avance |
| Eliminar usuario | DELETE `/api/usuarios/:id` | En avance |
