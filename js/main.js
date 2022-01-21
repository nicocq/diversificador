
document.getElementById("btn-ingresos").addEventListener('click', onClickIngresos); 
document.getElementById("btn-configuracion").addEventListener('click', onClickConfiguracion); 

function onClickIngresos(){
    alert("Funcionalidad de ingresos");
};
function onClickConfiguracion(){
    alert("Funcionalidad de configuracion");
}

// CLASES
class ConfiguracionActivo {
    constructor(activo, porcentaje){
        this.activo = activo;
        this.porcentaje = porcentaje;
    }

    toString() { return `[ConfiguracionActivo]
        activo:       ${this.activo},
        porcentaje:   ${this.porcentaje}
    `;
    };
}

class Activo {
    constructor(nombre){
        this.nombre = nombre;
    }
}

class Diversificador {
    constructor(configuracion){
        this.configuracion = configuracion;
    }

    porcentaje(numero, porcentaje){
        /** TODO */
    }

    diversificar(ingresos){ 
        /** TODO */
    }
}

class Patron {
    constructor(){
        this.configuracion_activos = [];
    }
}

function main(){
    console.log("Iniciando diversificador");
    let configuracion = new ConfiguracionActivo("BTC", 123);
    console.log(configuracion);
    console.log(configuracion.toString());
}


main();