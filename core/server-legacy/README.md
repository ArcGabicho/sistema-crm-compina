# Compipro API

![Portada](https://i.imgur.com/RYfsVS9.png)

## Descripción

La API de Compipro permite acceder a información sobre categorías y productos organizados en un formato JSON. Está diseñada para ser utilizada en aplicaciones web y móviles.

## Endpoints

### 1. Obtener todas las categorías
**GET** `/api/categorias`

- **Descripción:** Devuelve un listado de todas las categorías con su ID, nombre, descripción y cantidad de productos.
- **Respuesta:**
```json
[
  {
    "id": "ceramicos",
    "nombre": "Cerámicos",
    "descripcion": "Vajilla y artículos decorativos",
    "count": 10
  },
  {
    "id": "premium",
    "nombre": "Línea Premium",
    "descripcion": "Productos exclusivos de alta gama",
    "count": 10
  }
]
```

---

### 2. Obtener una categoría específica
**GET** `/api/categorias/:id`

- **Descripción:** Devuelve la información completa de una categoría específica.
- **Parámetros:**
  - `id` (string): ID de la categoría.
- **Respuesta:**
```json
{
  "id": "ceramicos",
  "portada": "/productos/img25.webp",
  "nombre": "Cerámicos",
  "descripcion": "Vajilla y artículos decorativos",
  "productos": [
    {
      "id": "p302",
      "imagen": "/pages-productos/ceramicos/juego-tazas.jpg",
      "nombre": "Juego de tazas",
      "descripcion": "Set de 6 tazas"
    }
  ]
}
```

---

### 3. Obtener los productos de una categoría
**GET** `/api/categorias/:id/productos`

- **Descripción:** Devuelve un listado de productos de una categoría específica.
- **Parámetros:**
  - `id` (string): ID de la categoría.
- **Respuesta:**
```json
[
  {
    "id": "p302",
    "imagen": "/pages-productos/ceramicos/juego-tazas.jpg",
    "nombre": "Juego de tazas",
    "descripcion": "Set de 6 tazas"
  }
]
```

---

### 4. Buscar productos
**GET** `/api/buscar?q=<termino>`

- **Descripción:** Busca productos por nombre o descripción.
- **Parámetros:**
  - `q` (string): Término de búsqueda.
- **Respuesta:**
```json
[
  {
    "id": "p302",
    "imagen": "/pages-productos/ceramicos/juego-tazas.jpg",
    "nombre": "Juego de tazas",
    "descripcion": "Set de 6 tazas",
    "categoria": "Cerámicos"
  }
]
```

---

### 5. Obtener todos los datos
**GET** `/api/data`

- **Descripción:** Devuelve toda la información de categorías y productos en formato JSON.
- **Respuesta:**
```json
[
  {
    "id": "ceramicos",
    "portada": "/productos/img25.webp",
    "nombre": "Cerámicos",
    "descripcion": "Vajilla y artículos decorativos",
    "productos": [
      {
        "id": "p302",
        "imagen": "/pages-productos/ceramicos/juego-tazas.jpg",
        "nombre": "Juego de tazas",
        "descripcion": "Set de 6 tazas"
      }
    ]
  }
]
```

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/compipro-api.git
   ```
2. Instala las dependencias:
   ```bash
   go mod tidy
   ```
3. Ejecuta el servidor:
   ```bash
   go run main.go
   ```

## Tecnologías

- **Lenguaje:** Go
- **Framework:** Gin
- **Formato de datos:** JSON

## Licencia

Este proyecto está bajo la licencia MIT.
