# BurgerSosa

Plataforma full-stack para BurgerSosa.

## Despliegue en Producción (Railway)

El proyecto está preparado para ser desplegado en un único proyecto de Railway como un monorepo que contiene el frontend, el backend y la base de datos PostgreSQL.

### Arquitectura en Railway
```
Railway Project
├── PostgreSQL
├── Backend
└── Frontend
```

### Pasos Exactos de Despliegue

1. **PostgreSQL (Paso 1)**
   - Ingresa a tu dashboard de Railway y selecciona `New Project`.
   - Selecciona `Provision PostgreSQL`.
   - Una vez creado, ve a la pestaña `Variables` del servicio Postgres para visualizar la `DATABASE_URL` (la necesitarás en el siguiente paso).

2. **Backend (Paso 2)**
   - En el mismo proyecto de Railway, haz clic en `New` -> `GitHub Repo` y selecciona este repositorio.
   - Ve a `Settings` del nuevo servicio recién creado.
   - En la sección **Root Directory**, ingresa `/backend`.
   - Ve a la pestaña `Variables` y agrega las siguientes:
     - `DATABASE_URL`: Pega el valor obtenido de tu servicio PostgreSQL (Railway puede sugerírtelo automáticamente con un botón `Reference Variable`).
     - `JWT_SECRET`: Ingresa una frase secreta segura para cifrar las sesiones del panel de administrador.
     - `FRONTEND_URL`: (Ej. `https://burgersosa-frontend.up.railway.app` o tu dominio personalizado). Dejar pendiente hasta crear el frontend o completarlo después.
   - Ve a la pestaña `Networking` y pulsa **Generate Domain** (Este será tu dominio de Backend).
   - *Nota:* El Dockerfile del backend ya está configurado para ejecutar automáticamente `npx prisma migrate deploy` antes de arrancar la aplicación, por lo que tus tablas se crearán solas en la base de datos.

3. **Frontend (Paso 3)**
   - Haz clic nuevamente en `New` -> `GitHub Repo` y selecciona este repositorio.
   - Ve a `Settings` y en **Root Directory**, ingresa `/frontend`.
   - Ve a la pestaña `Variables` y agrega:
     - `VITE_API_URL`: Pega el dominio público que generaste para el Backend en el paso 2 (Ej. `https://burgersosa-backend.up.railway.app/api`). Es **crítico** cargar esta variable antes de que finalice el despliegue del frontend, ya que se inyecta durante el *build*.
   - Ve a `Networking` y pulsa **Generate Domain** (Este será el dominio visible para los clientes).
   - Vuelve a las variables del Backend (Paso 2) y asegúrate de que `FRONTEND_URL` coincida con este nuevo dominio para habilitar el CORS correctamente.

### Comprobación del Despliegue
- Visita el dominio público del frontend y verifica que la página cargue.
- Visita `https://TU_DOMINIO_BACKEND/health` y deberías ver el estado `{"status":"ok"}`.
- Ingresa a `/admin` en el frontend, inicia sesión, y crea un producto de prueba. Si se muestra en el menú público, ¡todo funciona perfecto!
