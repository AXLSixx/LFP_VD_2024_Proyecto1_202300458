const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('***** Analizador Léxico *****');
console.log("1. Cargar archivo");
console.log("2. Analizar archivo");
console.log("3. Generar archivo de errores");
console.log("4. Reportes");
console.log("5. Salir");

// Captura la opción del usuario
rl.question('Ingrese una opción: ', (opcion) => {
    console.log(`Has ingresado: ${opcion}`);
    manejarOpcion(opcion);
});

function manejarOpcion(opcion) {
    if (opcion === '1') {
        console.log("Cargando archivo");
        CargarArchivo();
    } else if (opcion === '2') {
        console.log("Analizando archivo");
        AnalizarArchivo();
    } else if (opcion === '3') {
        console.log("Generando archivo de errores");
        GenerarErrores();
    } else if (opcion === '4') {
        console.log("Generando reportes");
        GenerarReportes();
        rl.close();
    } else if (opcion === '5') {
        console.log("Saliendo");
        rl.close();
    } else {
        console.log("Opción no válida");
        rl.close();
    }
}

function CargarArchivo() {
    rl.question('Ingrese la ruta del archivo JSON: ', (ruta) => {
        fs.readFile(ruta, 'utf8', (data) => {
                try {
                    const contenido = JSON.parse(data);
                    const carpetaDestino = path.join(process.cwd(), 'Archivos'); //Esto es para hacer un pwd y ver el direcctorio donde esta 
                    //ejemplo esto hace que peuda saber enq ue carpeta esta actualmente 
                    const nombreArchivo = path.basename(ruta);
                    const rutaDestino = path.join(carpetaDestino, nombreArchivo);

                    fs.writeFile(rutaDestino, JSON.stringify(contenido, null, 2), () => { //guarda el objeto como es JSON es un metodo para que se gaurde todo
`
`
                        console.log(`Archivo guardado ${rutaDestino}`);
                    });
                } catch (error) {
                    console.error("Error", error.message);
                }
        });
    });
}


//=============================================================================

function AnalizarArchivo() {
    const carpetaArchivos = path.join(process.cwd(), 'Archivos');
    const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));

    console.log("\nArchivos disponibles para analizar:");

    
    let index = 0;
    
    while (index < archivosDisponibles.length) {
        console.log(`${index +1}. ${archivosDisponibles[index]}`);
        index++;
    }
    
    
    rl.question('Selecionar: ', (respuestaUsuario) => {
        const indiceSeleccionado = parseInt(respuestaUsuario) - 1;

        const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);
        
        try {
            const contenidoArchivo = JSON.parse(fs.readFileSync(rutaArchivoSeleccionado, 'utf8')); //probar quitar utf8
            console.log(`\nAnalizando archivo: ${archivosDisponibles[indiceSeleccionado]}`);
            
            
            if (contenidoArchivo.operaciones) {
                for (let indice = 0; indice < contenidoArchivo.operaciones.length; indice++) {
                    const operacion = contenidoArchivo.operaciones[indice];
                    const resultado = procesarOperacion(operacion);
                    //console.log(operacion);

                    console.log(`Operación ${indice + 1}: ${operacion.operacion} = ${resultado}`);
                }
            } 
        } catch (error) {
            console.error("Error: ", error.message);
        }

        rl.close();
    });
}


function procesarOperacion(operacion) {
    const convertirARadianes = (grados) => (grados * Math.PI) / 180;


    const primerValor = procesarValor(operacion.valor1);
    const segundoValor = procesarValor(operacion.valor2);

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
            return Math.pow(primerValor, segundoValor);
        case 'raiz':
            return Math.pow(primerValor, 1 / segundoValor);
        case 'inverso':
            return 1 / primerValor;
        case 'seno':
            return Math.sin(convertirARadianes(primerValor));
        case 'coseno':
            return Math.cos(convertirARadianes(primerValor));
        case 'tangente':
            return Math.tan(convertirARadianes(primerValor));
        case 'mod':
            return primerValor % segundoValor;
        default:
            console.error(`Operación desconocida: ${operacion.operacion}`);
            return null;
    }
}

function procesarValor(valor) {
    if (Array.isArray(valor)) {
        return procesarOperacion(valor[0]);
    } else {
        return valor;
    }
}


//=============================================================================
function GenerarErrores() {
    const carpetaArchivos = path.join(process.cwd(), 'Archivos');
    const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));

    console.log("\nArchivos disponibles para analizar:");

    let index = 0;
    
    while (index < archivosDisponibles.length) {
        console.log(`${index +1}. ${archivosDisponibles[index]}`);
        index++;
    }

    rl.question('Selecionar', (respuestaUsuario) => {
        const indiceSeleccionado = parseInt(respuestaUsuario) - 1;
        const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivosDisponibles[indiceSeleccionado]);

        try {
            const contenidoArchivo = JSON.parse(fs.readFileSync(rutaArchivoSeleccionado, 'utf8'));
            const errores = [];
            let contadorErrores = 1;

            if (contenidoArchivo.operaciones) {
                contenidoArchivo.operaciones.forEach((operacion, index) => {
                    if (!operacion.operacion || typeof operacion.operacion !== 'string') {
                        errores.push({
                            No: contadorErrores++,
                            descripcion: {
                                lexema: "operacion",
                                tipo: "error lexico",
                                columna: index + 1,
                                fila: 1
                            }
                        });
                    }

                    if (operacion.valor1 === undefined) {
                        errores.push({
                            No: contadorErrores++,
                            descripcion: {
                                lexema: "valor1",
                                tipo: "error lexico",
                                columna: index + 1,
                                fila: 2
                            }
                        });
                    }

                    if (operacion.valor2 === undefined && !['seno', 'coseno', 'tangente', 'inverso'].includes(operacion.operacion)) {
                        errores.push({
                            No: contadorErrores++,
                            descripcion: {
                                lexema: "valor2",
                                tipo: "error lexico",
                                columna: index + 1,
                                fila: 3
                            }
                        });
                    }

                    if (operacion.operacion && !['suma', 'resta', 'multiplicacion', 'division', 'potencia', 'raiz', 
                        'inverso', 'seno', 'coseno', 'tangente', 'mod'].includes(operacion.operacion.toLowerCase())) {
                        errores.push({
                            No: contadorErrores++,
                            descripcion: {
                                lexema: operacion.operacion,
                                tipo: "error lexico",
                                columna: index + 1,
                                fila: 4
                            }
                        });
                    }
                });
            } else {
                errores.push({
                    No: contadorErrores++,
                    descripcion: {
                        lexema: "operaciones",
                        tipo: "error lexico",
                        columna: 0,
                        fila: 0
                    }
                });
            }

            if (errores.length > 0) {
                const reporteErrores = {
                    errores: errores
                };

                const rutaErrores = path.join(process.cwd(), 'errores.json');
                fs.writeFileSync(rutaErrores, JSON.stringify(reporteErrores, null, 2), 'utf8');
                console.log(`Se encontraron errores. Detalles guardados en: ${rutaErrores}`);
            } else {
                console.log("No se encontraron errores en el archivo seleccionado.");
            }
        } catch (error) {
            console.error("Error al leer el archivo JSON: ", error.message);
        }

        rl.close();
    });
}



function GenerarReportes() {
    const fs = require('fs');
    const path = require('path');
    
        // Verificar si el archivo ha sido cargado y analizado
        const carpetaArchivos = path.join(process.cwd(), 'Archivos');
        const archivosDisponibles = fs.readdirSync(carpetaArchivos).filter(archivo => archivo.endsWith('.json'));
    
        // Si no hay archivos, retornar un mensaje
        if (archivosDisponibles.length === 0) {
            console.log("No hay archivos para generar reportes.");
            rl.close();
            return;
        }
    
        // Preguntar al usuario por el archivo que desea usar para generar el reporte
        console.log("\nArchivos disponibles para generar reportes:");
        let index = 0;
        archivosDisponibles.forEach((archivo, i) => {
            console.log(`${i + 1}. ${archivo}`);
        });
    
        rl.question('Seleccione el archivo para generar el reporte: ', (respuestaUsuario) => {
            const indiceSeleccionado = parseInt(respuestaUsuario) - 1;
            const archivoSeleccionado = archivosDisponibles[indiceSeleccionado];
            const rutaArchivoSeleccionado = path.join(carpetaArchivos, archivoSeleccionado);
    
            try {
                // Leer el contenido del archivo JSON seleccionado
                const contenidoArchivo = JSON.parse(fs.readFileSync(rutaArchivoSeleccionado, 'utf8'));
                let reporte = `Reporte generado para el archivo: ${archivoSeleccionado}\n`;
                reporte += `Fecha: ${new Date().toISOString()}\n\n`;
    
                if (contenidoArchivo.operaciones) {
                    contenidoArchivo.operaciones.forEach((operacion, indice) => {
                        const resultado = procesarOperacion(operacion);
                        reporte += `Operación ${indice + 1}: ${operacion.operacion}\n`;
                        reporte += `Resultado: ${resultado}\n\n`;
                    });
                }
    
                // Generar el reporte y guardarlo en un archivo .txt
                const rutaReporte = path.join(process.cwd(), 'reportes', `${path.basename(archivoSeleccionado, '.json')}_reporte.txt`);
                fs.mkdirSync(path.dirname(rutaReporte), { recursive: true }); // Crear la carpeta de reportes si no existe
    
                fs.writeFileSync(rutaReporte, reporte);
                console.log(`Reporte generado y guardado en: ${rutaReporte}`);
    
            } catch (error) {
                console.error("Error al generar el reporte: ", error.message);
            }
    
            rl.close();
        });
}
    
