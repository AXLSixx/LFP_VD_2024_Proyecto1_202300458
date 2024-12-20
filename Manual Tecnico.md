# Manual Técnico

Analizador Lexico

## Descripción General
El programa Analizador Léxico está diseñado para analizar archivos JSON con operaciones matemáticas y lógicas, identificar errores y generar reportes de análisis léxico. Está implementado en *Node.js* y utiliza las bibliotecas estándar para manejar entradas/salidas y el sistema de archivos.

## Estructura del Proyecto
El proyecto tiene la siguiente estructura de carpetas y archivos:


AnalizadorLexico/
├── main.js                # Archivo principal del programa
├── Archivos/             # Carpeta para almacenar los archivos JSON cargados
├── Errores/              # Carpeta para almacenar los archivos de errores
├── Reportes/             # Carpeta para almacenar los reportes generados


## Dependencias
El programa utiliza las siguientes bibliotecas estándar de Node.js:
- *readline*: Para la interacción con el usuario en la terminal.
- *fs*: Para manejar el sistema de archivos.
- *path*: Para manejar rutas de archivos y directorios.

## Requisitos del Sistema
1. *Node.js*: Versión 14.0 o superior.
2. *Sistema Operativo*: Compatible con Windows, macOS y Linux.

## Funcionalidades Principales

### 1. Cargar Archivo
- *Descripción*: Permite al usuario cargar un archivo JSON desde una ruta específica a la carpeta Archivos.
- *Código Relevante*:
javascript
cargarArchivo() {
    this.rl.question('Ingrese la ruta del archivo JSON: ', (ruta) => {
        const carpetaDestino = path.join(process.cwd(), 'Archivos');
        const nombreArchivo = path.basename(ruta);
        const rutaDestino = path.join(carpetaDestino, nombreArchivo);

        fs.copyFile(ruta, rutaDestino, (err) => {
            if (err) {
                console.error("Error:", err.message);
            } else {
                console.log(`Archivo copiado a: ${rutaDestino}`);
            }
            this.rl.close();
        });
    });
}


### 2. Analizar Archivo
- *Descripción*: Analiza un archivo JSON seleccionado de la carpeta Archivos.
- *Salida Generada*: Archivo .dot en la carpeta Reportes.
- *Código Relevante*:
javascript
analizarArchivo() {
    const carpetaArchivos = path.join(process.cwd(), 'Archivos');
    const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));

    console.log("\nArchivos disponibles para analizar:");
    archivosDisponibles.forEach((archivo, index) => console.log(`${index + 1}. ${archivo}`));

    this.rl.question('Seleccionar: ', (userInput) => {
        const indiceSeleccionado = parseInt(userInput) - 1;
        const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);

        try {
            const contenido = fs.readFileSync(rutaArchivoSeleccionado, 'utf8');
            console.log(`\nAnalizando archivo: ${archivosDisponibles[indiceSeleccionado]}`);

            this.operations = this.parseManualJSON(contenido);
            // Proceso de análisis...
        } catch (error) {
            console.error("Error:", error.message);
        }

        this.rl.close();
    });
}


### 3. Generar Archivo de Errores
- *Descripción*: Detecta errores en las operaciones del archivo JSON y los guarda en un archivo errores.json.
- *Código Relevante*:
javascript
generarErrores() {
    const carpetaArchivos = path.join(process.cwd(), 'Archivos');
    const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));

    console.log("\nArchivos disponibles para analizar:");
    archivosDisponibles.forEach((archivo, index) => console.log(`${index + 1}. ${archivo}`));

    this.rl.question('Seleccionar: ', (respuestaUsuario) => {
        const indiceSeleccionado = parseInt(respuestaUsuario) - 1;
        const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);

        try {
            const contenidoArchivo = JSON.parse(fs.readFileSync(rutaArchivoSeleccionado, 'utf8'));
            const errores = [];

            if (contenidoArchivo.operaciones) {
                contenidoArchivo.operaciones.forEach((operacion, i) => {
                    // Validación de errores...
                });
            } else {
                errores.push(this.crearError(1, 'operaciones', 0, 0));
            }

            if (errores.length > 0) {
                const rutaErrores = path.join(process.cwd(), 'Errores', 'errores.json');
                fs.writeFileSync(rutaErrores, JSON.stringify({ errores }, null, 2), 'utf8');
                console.log(`Archivo de errores generado en: ${rutaErrores}`);
            } else {
                console.log("Sin errores detectados.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }

        this.rl.close();
    });
}


## Detalles de Implementación

### Parsing de JSON
El programa incluye un analizador manual para procesar archivos JSON. Este enfoque es útil para manejar entradas con formatos no estándar.

### Generación de Archivos .dot
Se utiliza un formato de gráfico para representar las relaciones entre operaciones.
- *Formato*: [Graphviz DOT Language](https://graphviz.org/doc/info/lang.html)

### Generación de Reportes HTML
Se genera un archivo HTML con los detalles léxicos de los archivos analizados. Contiene una tabla con las siguientes columnas:
- Archivo
- Tipo de lexema
- Lexema
- Fila
- Columna

## Estructura del Archivo JSON Esperado

json
{
  "operaciones": [
    {
      "operacion": "suma",
      "valor1": 10,
      "valor2": 20
    },
    {
      "operacion": "resta",
      "valor1": 15,
      "valor2": 5
    }
  ]
}


## Posibles Errores
- *Ruta Inválida*: Archivo JSON no encontrado.
- *Formato JSON Incorrecto*: Estructura o sintaxis inválida.
- *Operaciones Desconocidas*: Operaciones no definidas en el programa.

## Créditos
Creado por Axel Salan, 202300458.