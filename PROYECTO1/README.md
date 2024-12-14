# Manual de Usuario

## Proyecto No. 1: NodeLex - Escáner Léxico y Procesador Numérico con Node.js

---

### Introducción
Este manual está diseñado para guiar al usuario en la operación de NodeLex, una herramienta que analiza archivos JSON para identificar y procesar instrucciones matemáticas, generando diagramas operacionales y reportes de errores.

---

### Requisitos Previos
- Node.js instalado en el sistema.
- Editor de texto o IDE para visualizar archivos JSON.
- Archivo JSON con formato válido para pruebas.

---

### Instalación
1. Clona el repositorio del proyecto desde GitHub:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd NodeLex
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

---

### Uso de NodeLex
Para ejecutar NodeLex, sigue las instrucciones detalladas a continuación.

#### Ejecución del programa
1. Inicia el programa desde la consola:
   ```bash
   node app.js
   ```
2. Aparecerá el menú interactivo con las siguientes opciones:
   - **Archivo**
     - `Abrir`: Permite cargar un archivo JSON para su análisis.
     - `Salir`: Finaliza la ejecución del programa.
   - **Analizar**: Procesa el archivo JSON cargado e identifica las operaciones y errores presentes.
   - **Errores**: Muestra los errores detectados del archivo analizado en un formato JSON.
   - **Reporte**: Genera diagramas operacionales en base a las instrucciones analizadas utilizando Graphviz.

---

### Formato del Archivo JSON de Entrada
El archivo JSON debe contener las instrucciones en el siguiente formato:

```json
{
  "operaciones": [
    {
      "tipo": "SUMA",
      "valores": [2, 3, 4]
    },
    {
      "tipo": "DIVISION",
      "valores": [10, 0]
    }
  ]
}
```

- **"tipo"**: Indica el tipo de operación (SUMA, RESTA, MULTIPLICACION, DIVISION, etc.).
- **"valores"**: Lista de operandos u operaciones anidadas.

---

### Análisis y Resultados
1. **Reconocimiento de Operaciones**
   - NodeLex identificará y ejecutará operaciones matemáticas válidas.
   - Si las operaciones contienen errores, serán detallados en el archivo de errores.

2. **Errores Detectados**
   - Los errores léxicos se registran en un archivo `errores.json` con el siguiente formato:

```json
{
  "errores": [
    {
      "linea": 5,
      "descripcion": "División por cero."
    }
  ]
}
```

3. **Generación de Diagramas**
   - Los diagramas de las operaciones son generados en formato DOT y pueden visualizarse con Graphviz.
   - Ejemplo de un árbol de operación:

```
+-- SUMA
   |
   +-- 2
   +-- 3
   +-- 4
```

---

### Salida de Resultados
Los resultados se generan en archivos separados:
- **`resultados.json`**: Contiene el resultado de las operaciones realizadas.
- **`errores.json`**: Incluye detalles de los errores léxicos detectados.
- **Diagramas DOT**: Archivos .dot generados para representar los árboles de operaciones.

---

### Salir del Programa
Para salir del programa, selecciona la opción `Salir` en el menú principal o presiona `Ctrl + C` en la consola.

---

### Resolución de Problemas
1. **Error: "No se encuentra Node.js"**
   - Asegúrate de que Node.js esté correctamente instalado y configurado en el sistema.

2. **Error: "Archivo JSON inválido"**
   - Revisa el formato del archivo JSON de entrada y corrige posibles errores de sintaxis.

3. **Graphviz no genera diagramas**
   - Verifica que Graphviz esté instalado y configurado correctamente en el sistema.

---

### Conclusión
NodeLex es una herramienta potente para el análisis léxico y procesamiento numérico. Este manual proporciona todas las instrucciones necesarias para su correcto uso. Si encuentras problemas, consulta la sección de resolución de problemas o revisa el repositorio en GitHub.
