# BurgerSosa Web 🍔

Plataforma full-stack diseñada específicamente para el restaurante BurgerSosa. Este sistema digitaliza y automatiza todo el proceso de toma de pedidos, reemplazando el antiguo modelo manual por una solución moderna, estética e integrada con WhatsApp.

## 🚀 Problemas que soluciona

Antes, los pedidos se tomaban manualmente, lo que generaba pérdida de tiempo, errores en las comandas y cuellos de botella en horas pico. BurgerSosa Web soluciona esto ofreciendo:

- **Catálogo Digital Autogestionable:** Los clientes pueden ver todos los productos actualizados en tiempo real sin necesidad de preguntar precios ni stock.
- **Carrito de Compras Persistente:** Los usuarios pueden armar su pedido a su ritmo. El sistema recuerda su carrito incluso si cierran la página por accidente (gracias a la persistencia en `localStorage`).
- **Control Automático de Stock e Inventario:** Cada hamburguesa vendida descuenta automáticamente los ingredientes (pan, carne, queso, etc.) del inventario del local.
- **Pedidos Directos por WhatsApp:** Al finalizar la compra, el sistema estructura un mensaje claro y detallado (cantidades, modificaciones, método de pago, envío) y lo envía directamente al WhatsApp del local, eliminando ambigüedades.
- **Panel de Administrador Seguro:** Un backoffice protegido con JWT donde el dueño puede crear/editar productos, gestionar categorías, configurar horarios de apertura y alias bancarios, sin tocar una línea de código.

## 💻 Tecnologías Utilizadas

Este proyecto utiliza un stack moderno y escalable (PERN modificado con Prisma y NestJS):

### Frontend
- **React.js (Vite)**: Interfaz de usuario rápida y reactiva.
- **TailwindCSS**: Estilizado moderno, responsivo y modo oscuro nativo.
- **Zustand**: Gestión del estado global (carrito de compras, autenticación).
- **Lucide React**: Sistema de iconografía ligera.

### Backend
- **NestJS**: Framework backend en Node.js, estructurado y escalable.
- **Prisma ORM**: Modelado y consultas seguras a la base de datos.
- **PostgreSQL**: Base de datos relacional robusta.
- **JWT (JSON Web Tokens)**: Autenticación segura para el panel administrativo.

## ⚙️ Instalación Local

Para correr el proyecto en tu máquina local, necesitarás **Node.js (v18+)** y **Docker** (para levantar la base de datos).

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/champagneplease/BurgerSosa-Web.git
cd BurgerSosa-Web

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 2. Levantar la Base de Datos Local
En la raíz del proyecto, ejecuta Docker Compose para levantar PostgreSQL:
```bash
docker-compose up -d
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/burgersosa?schema=public"
JWT_SECRET="tu_secreto_local_aqui"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

Crea un archivo `.env` en la carpeta `frontend/` con el siguiente contenido:
```env
VITE_API_URL="http://localhost:3000/api"
```

### 4. Inicializar Base de Datos y Correr el Proyecto
En la carpeta `backend/`, ejecuta las migraciones para crear las tablas y corre el servidor:
```bash
cd backend
npx prisma migrate dev
npm run start:dev
```

En otra terminal, corre el frontend:
```bash
cd frontend
npm run dev
```
La página estará disponible en `http://localhost:5173`.

## ☁️ Despliegue en Producción (Railway)

Este monorepo está optimizado para desplegarse fácilmente en **Railway.app**.

1. **PostgreSQL:** Crea un servicio PostgreSQL en Railway y obtén su `DATABASE_URL`.
2. **Backend:** Despliega la carpeta `/backend`. Configura en sus variables: `DATABASE_URL`, `JWT_SECRET`, y `FRONTEND_URL`. (Las migraciones de Prisma correrán automáticamente en el build). Genera su dominio público.
3. **Frontend:** Despliega la carpeta `/frontend`. Configura en sus variables: `VITE_API_URL` apuntando al dominio del backend. Genera su dominio público.
