
document.getElementById("btn-diversificar").addEventListener('click', onClickDiversificar);
document.getElementById("btn-configuracion").addEventListener('click', onClickConfiguracion);
document.getElementById("btn-cancelar").addEventListener('click', onClickCancelarConfiguracion);
document.getElementById("form-configuracion").addEventListener('submit', onClickGuardarConfiguracion);
PATRON = '';
function onClickEliminarConfiguracion(e){
    e.preventDefault();
    if (confirm("Esta seguro que desea eliminar? se perderan los datos que no fueron guardados")) {
        let indice = parseInt(this.getAttribute('data-id'));
        let almacenamiento = new Almacenamiento();
        let patron_data = almacenamiento.get_patron();
        let patron = Patron.create_from_object(patron_data);
        let activos = patron.get_activos();
        delete activos[Object.keys(activos)[indice]];
        patron.activos = activos
        almacenamiento.set_patron(patron);
        onClickConfiguracion();
    }
}

function log(mensaje) {
    let log_element = document.getElementById('mensajes-log');
    log_element.innerHTML = '';
    log_element.innerHTML = mensaje;
}

function onClickCancelarConfiguracion(e) {
    e.preventDefault();
    document.getElementById('form-configuracion-container').style.display = "none";
}

function onClickGuardarConfiguracion(e) {
    e.preventDefault();

    let form = document.getElementById("form-configuracion");
    let activo_inputs = form.querySelectorAll('[name*=activo]');
    let porcentaje_inputs = form.querySelectorAll('[name*=porcentaje]');

    let objeto = {}
    for (let i = 0; i < activo_inputs.length; i++) {
        objeto[activo_inputs[i].value] = porcentaje_inputs[i].value;
    }
    patron = Patron.create_from_object({ activos: objeto });
    if (!patron.is_valid()) {
        log(patron.errores);
        return false;
    }
    let almacenamiento = new Almacenamiento();
    almacenamiento.set_patron(patron);

    document.getElementById('form-configuracion-container').style.display = "none";
    document.getElementById("patron-json").textContent = JSON.stringify(patron, undefined, 2);

    log("Datos guardados correctamente");
    return false;
}

function onClickDiversificar() {
    let ingresos = document.getElementById("input-ingresos").value;
    ingresos = parseFloat(ingresos) || 0;

    let almacenamiento = new Almacenamiento();
    let patron_data = almacenamiento.get_patron();
    let patron = Patron.create_from_object(patron_data);

    let diversificador = new Diversificador(patron);
    let resultado = diversificador.diversificar(ingresos);
    document.getElementById("resultado-json").textContent = JSON.stringify(resultado, undefined, 2);
};

function onClickConfiguracion() {
    console.log("Funcionalidad de configuracion");
    document.getElementById('form-configuracion-container').style.display = "block";
    let almacenamiento = new Almacenamiento();
    let patron_data = almacenamiento.get_patron();
    let patron = Patron.create_from_object(patron_data);
    let table_body_contaier = document.getElementById('table-container');
    table_body_contaier.innerHTML = '';
    let ids = 0;
    for (let [activo, porcentaje] of Object.entries(patron.get_activos())) {
        tr = document.createElement('tr');

        td = document.createElement('td');
        input = document.createElement('input');
        label = document.createElement('label');
        input.name = 'activo_' + ids;
        input.value = activo;
        td.appendChild(input);
        tr.appendChild(td);

        td = document.createElement('td');
        input = document.createElement('input');
        label = document.createElement('label');
        input.name = 'porcentaje_' + ids;
        input.value = porcentaje;
        td.appendChild(input);
        tr.appendChild(td);

        td = document.createElement('td');
        button = document.createElement('button');
        button.innerHTML = 'Eliminar';
        button.setAttribute('data-id', ids);
        button.addEventListener('click', onClickEliminarConfiguracion);
                
        td.appendChild(button);
        tr.appendChild(td);

        table_body_contaier.appendChild(tr);
        ids += 1;
    }
    let button_add = document.createElement('button');
    button_add.innerHTML = "Agregar"
    button_add.addEventListener('click', (e) => {
        e.preventDefault();
        create_empty_option(table_body_contaier);
    });
    table_body_contaier.appendChild(button_add);
}

function create_empty_option(table_body_contaier){
    tr = document.createElement('tr');
    td = document.createElement('td');
    input = document.createElement('input');
    label = document.createElement('label');
    input.name = 'activo_0';
    input.placeholder = "Nuevo activo";
    td.appendChild(input);
    tr.appendChild(td);

    td = document.createElement('td');
    input = document.createElement('input');
    label = document.createElement('label');
    input.name = 'porcentaje_0';
    input.placeholder = "Nuevo porcentaje";
    td.appendChild(input);
    tr.appendChild(td);

    let all_tr = table_body_contaier.getElementsByTagName('tr');
    let last_tr = all_tr[all_tr.length - 1];
    
    td = document.createElement('td');
    button = document.createElement('button');
    button.innerHTML = 'Eliminar';
    button.setAttribute('data-id', all_tr.length);
    button.addEventListener('click', onClickEliminarConfiguracion);
    
    td.appendChild(button);
    tr.appendChild(td);

    table_body_contaier.insertBefore(tr, last_tr.nextSibling );
}

// CLASES
class Diversificador {
    constructor(patron) {
        this.patron = patron;
    }

    porcentaje = (numero, porcentaje) => (numero * porcentaje) / 100;

    diversificar = (ingresos) => {
        return {
            ingresos_totales: ingresos,
            resultado: Object.entries(this.patron.get_activos())
                .map(([activo, porcentaje]) => {
                    return {
                        activo: activo,
                        porcentaje: porcentaje,
                        monto: this.porcentaje(ingresos, porcentaje)
                    }
                })
        };
    }
}

class Patron {
    constructor() {
        this.activos = {};
        this.errores = [];
    }

    static create_from_object(data) {
        let patron = new Patron();
        if (data) {
            patron.activos = data.activos;
        }
        return patron;
    }

    add_activo = (nombre, porcentaje) => this.activos[nombre] = porcentaje;

    get_activos = () => this.activos;

    es_vacio = () => Object.entries(this.activos).length === 0;

    is_valid = () => {
        let total = 0;
        Object.entries(this.get_activos()).forEach(([activo, porcentaje]) => {
            if (! activo) {
                this.errores.push("Campo Activo no puede ser vacio");    
            }
            if (! porcentaje) {
                this.errores.push("Campo Porcentaje no puede ser vacio");    
            }
            total += parseFloat(porcentaje);
        })

        if (total > 100) {
            this.errores.push("El total de porcentajes no debe superar el 100%");
        }
        if (total < 1) {
            this.errores.push("El total debe ser mayor a 0");
        }

        return (this.errores.length == 0);
    }
}

class Almacenamiento {
    constructor() { }

    guardar = (key, value) => localStorage.setItem(key, value);

    recuperar = (key) => localStorage.getItem(key);

    eliminar = (key) => localStorage.removeItem(key);

    get_patron = () => JSON.parse(this.recuperar('patron'));

    set_patron = (data) => this.guardar('patron', JSON.stringify(data));
}

function main() {
    console.log("Iniciando diversificador");
    let almacenamiento = new Almacenamiento();
    document.getElementById('form-configuracion-container').style.display = "none";
    
    let patron_data = almacenamiento.get_patron();
    let patron = Patron.create_from_object(patron_data);
    PATRON = patron;
    if (patron.es_vacio()) {
        patron = new Patron();
        patron.add_activo('BTC', 10);
        patron.add_activo('ALT', 10);
        patron.add_activo('Dolares', 10);
        almacenamiento.set_patron(patron);
    };
    document.getElementById("patron-json").textContent = JSON.stringify(patron, undefined, 2);
}

main();