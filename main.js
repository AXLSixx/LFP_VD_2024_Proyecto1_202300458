// shdjkfhaslkjdfhajklshdkl

//Esto es para la caputa de los datos en la terminal 
const readline = require('readline');

const fs = require('fs'); //Es para tomar el archvio que necsitamos

const rl = readline.createInterface({ //hacemos constante el input y output 
    input: process.stdin,
    output: process.stdout
});

console.log ('***** Analizador Léxico *****');
console.log ("1. Cargar archivo");
console.log ("2. Analizar archivo");
console.log ("3. Generar archivo de errores");
console.log ("4.Reportes");
console.log ("5. Salir");

//Aqui lo captura 
rl.question('Ingrese una opción: ', (opcion) => {console.log(`Has ingresado: ${opcion}`);
    manejarOpcion(opcion); 
    rl.close();
});


function manejarOpcion(opcion) {
    switch (opcion) {
        case '1':
            console.log("Cargando archivo...");
            CargarArchivo(); 
            break;
        case '2':
            console.log("Analizando archivo...");
            AnalizandoArchivo()
            break;
        case '3':
            console.log("Generando archivo de errores...");
            GenerandoErrores()
            break;
        case '4':
            console.log("Generando reportes...");
            GenerandoReportes()
            break;
        case '5':
            console.log("Saliendo...");
            break;
        default:
            console.log("Opción no válida");
            break;
    }
}

function CargarArchivo() {
    rl.question('Por favor, ingresa la ruta del archivo a cargar: ', (rutaArchivo) => {
        const carpetaDestino = '/home/toto/toto/CODE/TutoriaLex/Proyecto1/archivos';
        if (!fs.existsSync(carpetaDestino)) {
            fs.mkdirSync(carpetaDestino, { recursive: true });
        }
        const nombreArchivo = path.basename(rutaArchivo);
        const rutaDestino = path.join(carpetaDestino, nombreArchivo);
        fs.copyFile(rutaArchivo, rutaDestino, (err) => {
            if (err) {
                console.error('Error al cargar el archivo:', err.message);
            } else {
                console.log(`Archivo cargado exitosamente en "${carpetaDestino}" como ${nombreArchivo}`);
            }
            rl.close();
        });
    });
}







function AnalizandoArchivo() {
    
}


function GenerandoErrores() {
}


function GenerandoReportes() {
}


