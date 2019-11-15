const url = "http://localhost/really-mobile/api";

function cotizarPersonas() {
    let formulario = {
        tipo: 'personas',
        internet: validarCheck('personasInternet'),
        telefonia: validarCheck('personasTelefonia'),
        moviles: validarCheck('personasMoviles'),
        television: validarCheck('personasTelevision')
    }
    fetch(`${url}/personas/evaluar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formulario)
        })
        .then(response => response.json())
        .then(cotizacion => {
            if (typeof(Storage) !== "undefined") {
                localStorage.cotizacion = JSON.stringify(cotizacion);
                window.location.pathname = './really-mobile/cotizacion/cotizacion.html';
            }
        })
        .catch(error => { throw error });
}

function cotizarEmpresas() {
    let formulario = {
        tipo: 'empresas',
        internet: validarCheck('empresasInternet'),
        telefonia: validarCheck('empresasTelefonia'),
        moviles: validarCheck('empresasMoviles'),
        television: validarCheck('empresasTelevision')
    }
    fetch(`${url}/empresas/evaluar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formulario)
        })
        .then(response => response.json())
        .then(cotizacion => {
            if (typeof(Storage) !== "undefined") {
                localStorage.cotizacion = JSON.stringify(cotizacion);
                window.location.pathname = '../cotizacion/cotizacion.html';
            }
        })
        .catch(error => { throw error });
}

function validarCheck(nombreCampo) {
    let valores = document.getElementsByName(nombreCampo);
    if (valores) {
        for (let i = 0; i < valores.length; i++) {
            if (valores[i].checked) {
                let etiqueta = document.getElementById(`${valores[i].id}Label`);
                let nombreOpcion = '';
                if (etiqueta) {
                    nombreOpcion = etiqueta.innerText;
                }
                return { nombre: nombreOpcion, valor: valores[i].value };
            }
        }
    }
    return { nombre: '', valor: 0 };
}