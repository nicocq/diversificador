
document.getElementById("btn-ingresos").addEventListener('click', onClickIngresos); 
document.getElementById("btn-configuracion").addEventListener('click', onClickConfiguracion); 

function onClickIngresos(){
    alert("Funcionalidad de ingresos");
};
function onClickConfiguracion(){
    alert("Funcionalidad de configuracion");
}

// CLASES
class Diversificador {
    constructor(patron){
        this.patron = patron;
    }

    porcentaje(numero, porcentaje){
        return (numero * porcentaje) / 100
    }

    diversificar(ingresos){
        return {
            ingresos_totales: ingresos,
            resultado: Object.entries(this.patron.get_activos())
            .map(([activo, porcentaje]) => { 
                return {
                    activo: activo,
                    porcentaje: porcentaje, 
                    monto: this.porcentaje(ingresos, porcentaje)} 
            }) 
        };
        
    }
}

class Patron {
    constructor(){
        this.activos = {};
    }

    static create_from_object(data){
        let patron = new Patron();
        if (data) {
            patron.activos = data.activos;
        }
        return patron;
    }

    add_activo(nombre, porcentaje){
        this.activos[nombre] = porcentaje;
    }

    get_activos = () => this.activos ;

    toString() { return `[Patron]
        activos:       ${this.activos},
    `;
    };

    es_vacio = () => Object.entries(this.activos).length === 0

}

class Almacenamiento {
    constructor(){}

    guardar(key, value){
        return localStorage.setItem(key, value);
    }

    recuperar(key){
        return localStorage.getItem(key);
    }

    eliminar(key){
        return localStorage.removeItem(key);
    }

    get_patron(){
        return JSON.parse(this.recuperar('patron'));
    }

    set_patron(data){
        this.guardar('patron', JSON.stringify(data));
    }
}   

function main(){
    console.log("Iniciando diversificador");
    let almacenamiento = new Almacenamiento();

    let patron_data = almacenamiento.get_patron();
    let patron = Patron.create_from_object(patron_data);
    if ( patron.es_vacio()){ 
        patron = new Patron();
        patron.add_activo('BTC', 10);
        patron.add_activo('ALT', 10);
        patron.add_activo('Dolares', 10);
        almacenamiento.set_patron(patron);
        console.log("Datos guardados");
    };
    console.log(patron);
    console.log(patron.toString());

    let diversificador = new Diversificador(patron);
    let resultado = diversificador.diversificar(120000);
    document.getElementById("patron-json").textContent = JSON.stringify(patron, undefined, 2);
    document.getElementById("resultado-json").textContent = JSON.stringify(resultado, undefined, 2);
    
}

main();