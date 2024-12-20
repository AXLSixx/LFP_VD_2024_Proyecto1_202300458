const readline = require('readline');
const fs = require('fs');
const path = require('path');

class AnalizadorLexico {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    iniciar() {
        console.log('***** Analizador Léxico *****');
        console.log("1. Cargar archivo");
        console.log("2. Analizar archivo");
        console.log("3. Generar archivo de errores");
        console.log("4. Reportes");
        console.log("5. Salir");

        this.rl.question('Ingrese una opción: ', (opcion) => {
            console.log(`Has ingresado: ${opcion}`);
            this.manejarOpcion(opcion);
        });
    }

    manejarOpcion(opcion) {
        if (opcion === '1') {
            console.log("Cargando archivo");
            this.cargarArchivo();
        } else if (opcion === '2') {
            console.log("Analizando archivo");
            this.analizarArchivo();
        } else if (opcion === '3') {
            console.log("Generando archivo de errores");
            this.generarErrores();
        } else if (opcion === '4') {
            console.log("Generando reportes");
            this.generarReportes();
            this.rl.close();
        } else if (opcion === '5') {
            console.log("Saliendo");
            this.rl.close();
        } else {
            console.log("Opción no válida");
            this.rl.close();
        }
    }
    

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
    analizarArchivo() {
        const carpetaArchivos = path.join(process.cwd(), 'Archivos');
        const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));
    
        console.log("\nArchivos disponibles para analizar:");
        let index = 0;
        while (index < archivosDisponibles.length) {
            console.log(`${index + 1}. ${archivosDisponibles[index]}`);
            index++;
        }
    
        this.rl.question('Seleccionar: ', (userInput) => {
            const indiceSeleccionado = parseInt(userInput) - 1;
            const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);
    
            try {
                const contenido = fs.readFileSync(rutaArchivoSeleccionado, 'utf8');
                console.log(`\nAnalizando archivo: ${archivosDisponibles[indiceSeleccionado]}`);
    
                this.operations = this.parseManualJSON(contenido);
    
                for (let index = 0; index < this.operations.length; index++) {
                    const result = this.procesarOperacion(this.operations[index]);
                    console.log(`Operación ${index + 1}: ${this.operations[index].operacion} = ${result}`);

                };
    
                
                // Generar el archivo .dot
                const dotString = this.generarDot(this.operations); // Cambiado a this.generarDot
                const nombreDot = `grafo_${Date.now()}.dot`;
                const rutaDot = path.join(process.cwd(), 'Reportes', nombreDot);
    
    
                fs.writeFileSync(rutaDot, dotString, 'utf8');
                console.log(`Archivo .dot generado correctamente: ${rutaDot}`);
            } catch (error) {
                console.error("Error:", error.message);
            }
    
            this.rl.close();
        });
    }
    
    generarDot(operaciones) {
        let dotString = 'digraph {\n';
    
        const agregarNodo = (id, etiqueta) => {
            dotString += `  ${id} [label=\"${etiqueta}\"]\n`;
        };
    
        const agregarRelacion = (parentId, childId) => {
            dotString += `  ${parentId} -> ${childId}\n`;
        };
    
        const procesarNodo = (parentId, nodo) => {
            if (nodo.valor1) {
                let childId1;
                if (typeof nodo.valor1 === 'object') {
                    childId1 = nodo.valor1.operacion;
                } else {
                    childId1 = nodo.valor1;
                }
                agregarRelacion(parentId, childId1);
                if (typeof nodo.valor1 === 'object') {
                    procesarNodo(childId1, nodo.valor1);
                }
            }
            
            if (nodo.valor2) {
                let childId2;
                if (typeof nodo.valor2 === 'object') {
                    childId2 = nodo.valor2.operacion;
                } else {
                    childId2 = nodo.valor2;
                }
                agregarRelacion(parentId, childId2);
                if (typeof nodo.valor2 === 'object') {
                    procesarNodo(childId2, nodo.valor2);
                }
            }

            
        };
    
        for (let i = 0; i < operaciones.length; i++) {
            const operacion = operaciones[i];
            const parentId = `op${i}`;
            const resultado = this.procesarOperacion(operacion); // CORRECTO
        
            const etiqueta = `${operacion.operacion} = ${resultado}`;
            agregarNodo(parentId, etiqueta);
            procesarNodo(parentId, operacion);
        }
        
    
        dotString += '}\n';
        return dotString;
    }
    

    
    parseManualJSON(contenido) {
        let operaciones = []; // Lista para almacenar las operaciones extraídas del JSON
        let posicion = 0; // Posición actual en el contenido
    
        // Obtiene el código ASCII del carácter actual
        const siguienteCaracter = () => contenido.charCodeAt(posicion);
    
        // Avanza a la siguiente posición
        const avanzar = () => posicion++;
    
        // Omite espacios, saltos de línea y tabulaciones
        const omitirEspacios = () => {
            while (
                posicion < contenido.length && 
                (siguienteCaracter() === 32 || siguienteCaracter() === 10 || 
                 siguienteCaracter() === 9 || siguienteCaracter() === 13)
            ) {
                avanzar();
            }
        };
    
        // Lee y retorna una cadena entre comillas
        const leerCadena = () => {
            let resultado = '';
            if (siguienteCaracter() === 34) { // ASCII 34 es "
                avanzar();
                while (siguienteCaracter() !== 34 && posicion < contenido.length) {
                    resultado += String.fromCharCode(siguienteCaracter());
                    avanzar();
                }
                avanzar();
            }
            return resultado;
        };
    
        // Lee y retorna un número (entero o decimal)
        const leerNumero = () => {
            let resultado = '';
            while (
                (siguienteCaracter() >= 48 && siguienteCaracter() <= 57) || 
                siguienteCaracter() === 46 // ASCII 46 es '.'
            ) {
                resultado += String.fromCharCode(siguienteCaracter());
                avanzar();
            }
            return parseFloat(resultado);
        };
    
        // Lee y retorna un objeto
        const leerObjeto = () => {
            let objeto = {};
            avanzar(); // Saltar '{'
            while (siguienteCaracter() !== 125) { // ASCII 125 es '}'
                omitirEspacios();
                const clave = leerCadena();
                omitirEspacios();
                avanzar(); // Saltar ':'
                omitirEspacios();
    
                if (siguienteCaracter() === 34) { // Si el valor es una cadena
                    objeto[clave] = leerCadena();
                } else if (siguienteCaracter() === 91) { // Si el valor es un array
                    objeto[clave] = leerArray();
                } else if (siguienteCaracter() >= 48 && siguienteCaracter() <= 57) { // Si el valor es un número
                    objeto[clave] = leerNumero();
                } else if (siguienteCaracter() === 123) { // Si el valor es otro objeto
                    objeto[clave] = leerObjeto();
                }
                omitirEspacios();
                if (siguienteCaracter() === 44) avanzar(); // Saltar ','
            }
            avanzar(); // Saltar '}'
            return objeto;
        };
    
        // Lee y retorna un array
        const leerArray = () => {
            let arreglo = [];
            avanzar(); // Saltar '['
            while (siguienteCaracter() !== 93) { // ASCII 93 es ']'
                omitirEspacios();
                if (siguienteCaracter() === 123) { // Si el elemento es un objeto
                    arreglo.push(leerObjeto());
                } else if (siguienteCaracter() >= 48 && siguienteCaracter() <= 57) { // Si el elemento es un número
                    arreglo.push(leerNumero());
                }
                omitirEspacios();
                if (siguienteCaracter() === 44) avanzar(); // Saltar ','
            }
            avanzar(); // Saltar ']'
            return arreglo;
        };
    
        // Analiza el contenido inicial
        const analizar = () => {
            omitirEspacios();
            if (siguienteCaracter() === 123) { // Si empieza con '{'
                const objeto = leerObjeto();
                if (objeto.operaciones) {
                    operaciones = objeto.operaciones;
                }
            }
        };
    
        analizar();
        return operaciones; // Retorna las operaciones extraídas
    }
    
    procesarOperacion(operacion) {
        // Convierte grados a radianes
        const aRadianes = (grados) => (grados * Math.PI) / 180;
    
        // Procesa los valores de la operación
        const primerValor = this.procesarValor(operacion.valor1);
        const segundoValor = this.procesarValor(operacion.valor2);
    
        // Realiza la operación según el tipo indicado
        switch (operacion.operacion.toLowerCase()) {
            case 'suma':
                return primerValor + segundoValor;
            case 'resta':
                return primerValor - segundoValor;
            case 'multiplicacion':
                return primerValor * segundoValor;
            case 'division':
                return primerValor / segundoValor;
            case 'potencia':
                return primerValor ** segundoValor; 
            case 'raiz':
                return primerValor ** (1 / segundoValor);
            case 'inverso':
                return 1 / primerValor;
            case 'seno':
                return Math.sin(aRadianes(primerValor));
            case 'coseno':
                return Math.cos(aRadianes(primerValor));
            case 'tangente':
                return Math.tan(aRadianes(primerValor));
            case 'mod':
                return primerValor % segundoValor;
            default:
                console.error(`Operación desconocida: ${operacion.operacion}`);
                return null;
        }
    }
    
    procesarValor(valor) {
        // Verifica si el valor es un arreglo
        if (Array.isArray(valor)) {
            // Si es un arreglo, procesa la primera operación del arreglo
            return this.procesarOperacion(valor[0]);
        } else {
            // Si no es un arreglo, retorna el valor directamente
            return valor;
        }
    }
    

    generarErrores() {
        const carpetaArchivos = path.join(process.cwd(), 'Archivos');
        const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));
    
        console.log("\nArchivos disponibles para analizar:");
        for (let index = 0; index < archivosDisponibles.length; index++) {
            console.log(`${index + 1}. ${archivosDisponibles[index]}`);
        }
    
        this.rl.question('Seleccionar: ', (respuestaUsuario) => {
            const indiceSeleccionado = parseInt(respuestaUsuario) - 1;
            const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);
    
            try {
                const contenidoArchivo = JSON.parse(fs.readFileSync(rutaArchivoSeleccionado, 'utf8'));
                const errores = [];
                let contadorErrores = 1;
    
                if (contenidoArchivo.operaciones) {
                    for (let i = 0; i < contenidoArchivo.operaciones.length; i++) {
                        const operacion = contenidoArchivo.operaciones[i];
    
                        if (!operacion.operacion || typeof operacion.operacion !== 'string') {
                            errores.push(this.crearError(contadorErrores++, 'operacion', i, 1));
                        }
    
                        if (operacion.valor1 === undefined) {
                            errores.push(this.crearError(contadorErrores++, 'valor1', i, 2));
                        }
    
                        if (operacion.valor2 === undefined && !['seno', 'coseno', 'tangente', 'inverso'].includes(operacion.operacion)) {
                            errores.push(this.crearError(contadorErrores++, 'valor2', i, 3));
                        }
    
                        if (operacion.operacion && !['suma', 'resta', 'multiplicacion', 'division', 'potencia', 'raiz', 'inverso', 'seno', 'coseno', 'tangente', 'mod'].includes(operacion.operacion.toLowerCase())) {
                            errores.push(this.crearError(contadorErrores++, operacion.operacion, i, 4));
                        }
                    }
                } else {
                    errores.push(this.crearError(contadorErrores++, 'operaciones', 0, 0));
                }
    
                if (errores.length > 0) {
                    const reporteErrores = { errores };
    
                    const carpetaErrores = path.join(process.cwd(), 'Errores');
                    const rutaErrores = path.join(carpetaErrores, 'errores.json');
    
                    if (!fs.existsSync(carpetaErrores)) fs.mkdirSync(carpetaErrores);
                    fs.writeFileSync(rutaErrores, JSON.stringify(reporteErrores, null, 2), 'utf8');
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
    
    

    crearError(numero, lexema, columna, fila) {
        return {
            No: numero,
            descripcion: {
                lexema,
                tipo: "error lexico",
                columna,
                fila
            }
        };
    }
    generarReportes() {
        const carpetaArchivos = path.join(process.cwd(), 'Archivos');
        const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));
    
        if (archivosDisponibles.length === 0) {
            console.log("No se encontraron archivos JSON en la carpeta 'Archivos'.");
            return;
        }
    
        try {
            const reportes = [];
    
            for (let archivoIndex = 0; archivoIndex < archivosDisponibles.length; archivoIndex++) {
                const archivo = archivosDisponibles[archivoIndex];
                const rutaArchivo = path.join(carpetaArchivos, archivo);
                const contenidoArchivo = fs.readFileSync(rutaArchivo, 'utf8');
    
                const lineas = contenidoArchivo.split('\n');
                for (let i = 0; i < lineas.length; i++) {
                    const linea = lineas[i];
                    const caracteres = linea.split('');
                    for (let j = 0; j < caracteres.length; j++) {
                        const char = caracteres[j];
                        const tipo = this.determinarTipo(char); // Determinar tipo del lexema
                        if (tipo) {
                            reportes.push({
                                archivo,
                                tipo,
                                lexema: char,
                                fila: i + 1,
                                columna: j + 1,
                            });
                        }
                    }
                }
            }
    
            // Generar archivo HTML
            const carpetaReportes = path.join(process.cwd(), 'Reportes');
            if (!fs.existsSync(carpetaReportes)) fs.mkdirSync(carpetaReportes);
    
            const rutaHTML = path.join(carpetaReportes, 'reporte_lexico.html');
            const contenidoHTML = this.generarHTMLReportes(reportes);
            fs.writeFileSync(rutaHTML, contenidoHTML, 'utf8');
    
            console.log(`Reporte léxico generado correctamente en: ${rutaHTML}`);
        } catch (error) {
            console.error("Error al generar el reporte:", error.message);
        }
    }
    
    
    determinarTipo(char) {
        if (/[a-zA-Z]/.test(char)) return 'Identificador';
        if (/\d/.test(char)) return 'Número';
        if (/[{}[\]()]/.test(char)) return 'Paréntesis o Llave';
        if (/["']/.test(char)) return 'Comilla';
        if (/[\s]/.test(char)) return null; // Ignorar espacios
        return 'Símbolo Especial';
    }
    
    generarHTMLReportes(reportes) {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte Léxico</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Reporte Léxico</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Archivo</th>
                            <th>Tipo</th>
                            <th>Lexema</th>
                            <th>Fila</th>
                            <th>Columna</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (let i = 0; i < reportes.length; i++) {
            const reporte = reportes[i];
            html += `
                <tr>
                    <td>${reporte.archivo}</td>
                    <td>${reporte.tipo}</td>
                    <td>${reporte.lexema}</td>
                    <td>${reporte.fila}</td>
                    <td>${reporte.columna}</td>
                </tr>
            `;
        }
        
    
        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
    
        return html;
    }
    
    
    
}

const analizador = new AnalizadorLexico();
analizador.iniciar();
