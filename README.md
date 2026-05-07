# Sistema Escolar - Gestor de Alumnos

## Introducción
Este proyecto es un simulador web frontend para la gestión de expedientes de alumnos. Implementa un sistema CRUD (Crear, Leer, Actualizar, Borrar) que se ejecuta íntegramente en la memoria del navegador (`sessionStorage`), permitiendo simular un entorno backend completo.

## Instalación y Uso
1. Extrae todos los archivos manteniendo la estructura de directorios intacta (`/css`, `/js`, `/pages`).
2. Haz doble clic en el archivo `index.html` para abrirlo en tu navegador.
3. El sistema conservará los datos de los alumnos registrados mientras la pestaña o ventana del navegador se mantenga abierta.

## Explicación de GET y POST (Simulación)
- **Simulación POST (Alta y Edición):** En la página `formulario.html`, el evento de envío del formulario se intercepta con JavaScript (`event.preventDefault()`). En lugar de enviar los datos a un servidor, se realizan las validaciones y se guarda el objeto del alumno en un array dentro de `sessionStorage`.
- **Simulación GET (Búsqueda):** El formulario de búsqueda envía los parámetros a través de la URL hacia `crud.html` (ej. `crud.html?busqueda=juan&categoria=Derecho`). Allí, el archivo `app.js` captura estos parámetros usando `URLSearchParams`, filtra el registro de alumnos guardado y renderiza únicamente los que coinciden con los criterios de búsqueda.