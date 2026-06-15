# Compipro Ecosystem

Este repositorio contiene el ecosistema de servicios y aplicaciones de Compipro. Aquí se agrupan microservicios, aplicaciones web, paquetes compartidos y utilidades para la gestión integral de la plataforma.

## Estructura del Proyecto

```
compipro-ecosystem/
├── .github/            # Workflows y configuración de GitHub Actions
├── apps/               # Aplicaciones principales (web, CRM)
├── services/           # Microservicios (Go)
├── docs/               # Documentación y diagramas
├── scripts/            # Scripts de automatización y utilidades
├── README.md           # Este archivo
└── LICENSE             # Licencia
```

## Requisitos

- Node.js >= 18.x
- Docker (opcional, para desarrollo y despliegue)
- Go 1.20+ (para microservicios)
- .NET 7+ (si usas servicios en C#)

## Instalación rápida

1. Clona el repositorio:
	```bash
	git clone https://github.com/tu-usuario/compipro-ecosystem.git
	cd compipro-ecosystem
	```
2. Instala dependencias para la app principal:
	```bash
	cd apps/crm-next
	npm install
	```
3. Inicia la aplicación:
	```bash
	npm run dev
	```
4. Consulta los README.md de cada microservicio o app para instrucciones específicas.

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Realiza tus cambios y haz commit.
4. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.