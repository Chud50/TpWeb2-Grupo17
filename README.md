# TpWeb2-Grupo17 - E-commerce App

Aplicación web full-stack de e-commerce con Angular y Node.js.

## 📋 Requisitos Previos

- Node.js 18+ 
- npm 9+
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPO]
cd TpWeb2-Grupo17
```

### 2. Configurar Backend
```bash
cd TrabajoPractico-Grupo17-back/backend
npm install
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/seed.ts
```

### 3. Configurar Frontend
```bash
cd ../../TrabajoPractico-Grupo17-front
npm install
```

## 🎯 Ejecutar el Proyecto

### Terminal 1 - Backend:
```bash
cd TrabajoPractico-Grupo17-back/backend
npm run dev
```
**Backend corriendo en:** http://localhost:3000

### Terminal 2 - Frontend:
```bash
cd TrabajoPractico-Grupo17-front
npm start
```
**Frontend corriendo en:** http://localhost:4200 (o el puerto que se asigne)

## 🔧 Funcionalidades

- ✅ Registro y Login de usuarios
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Base de datos SQLite
- ✅ API REST completa

## 🔍 Verificar que funciona

1. **Backend:** Ve a http://localhost:3000/api/producto
2. **Frontend:** Ve a http://localhost:4200
3. **Registra un usuario** y haz login
4. **Mira la consola** para ver logs de conexión

## ❗ Problemas Comunes

### Error "Cannot find module"
```bash
npm install
```

### Error "Port already in use"
- Cambiar puerto o cerrar procesos

### Error de base de datos
```bash
npx prisma generate
npx prisma migrate dev
```

## 👥 Equipo

- [Nombre 1]
- [Nombre 2] 
- [Nombre 3]

---
**Última actualización:** Junio 2025
