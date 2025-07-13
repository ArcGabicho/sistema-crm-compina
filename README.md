# 🧠 CRM – Compina S.A.C.

**CRM Compina** es un sistema de gestión de relaciones con clientes (Customer Relationship Management) desarrollado especialmente para **Compina S.A.C.**, una agencia de marketing peruana con enfoque en campañas digitales, fidelización y automatización comercial.

Desarrollado con **Next.js** y **Firebase**, este sistema permite a los asesores y ejecutivos de Compina acceder rápidamente a la información de más de **6,000 clientes activos** en tiempo real.

---

## 🚀 Características principales

- 👤 Gestión avanzada de clientes (alta, edición, seguimiento, historial)
- 📈 Visualización de KPIs comerciales y actividad por cliente
- 🔔 Notificaciones de tareas, recordatorios y seguimientos
- 🗓️ Calendario integrado para gestión de campañas y citas
- 🔍 Buscador rápido y filtros inteligentes
- 🔒 Acceso con autenticación segura (Firebase Auth)
- 🔄 Sincronización en tiempo real con **Cloud Firestore**
- 🌐 Acceso web multiplataforma y responsive

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **Next.js** | Framework React fullstack con SSR/CSR |
| **Firebase Auth** | Autenticación de usuarios con roles |
| **Cloud Firestore** | Almacenamiento NoSQL de +6000 registros de clientes |
| **Vercel** | Hosting rápido y escalable para producción |
| **Tailwind CSS** | Estilización rápida y responsiva |
| **Chart.js / Recharts** | Gráficos y métricas |
| **Day.js** | Manejo de fechas y horas |
| **React Hook Form + Zod** | Validación de formularios |

---

## 🏗️ Estructura del proyecto

```
/sistema-crm-compina
├── /components # Componentes reutilizables de UI
├── /pages # Rutas Next.js (auth, dashboard, etc.)
├── /firebase # Configuración de Firebase SDK
├── /lib # Funciones auxiliares (formatos, validadores, API)
├── /styles # Archivos Tailwind
├── /public # Assets (logos, íconos)
└── /types # Tipos TypeScript
```

---

## 🔧 Instalación del Proyecto

```bash
git clone https://github.com/compina-sac/crm-compina.git
```

```bash
cd sistema-crm-compina
```

```bash
npm install
```

---

## 🔧 Configurar Variables de Entorno

Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega las siguientes variables con los valores de tu proyecto de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=TU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=TU_APP_ID
```