const url = "http://localhost/api";

let lista = document.getElementById('lista');
let datos = JSON.parse(localStorage.cotizacion);
let valorSinDescuento = 0;
if (datos.internet.valor > 0) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(`Internet: ${datos.internet.nombre}`);
    node.appendChild(textnode);
    lista.appendChild(node);
    valorSinDescuento += parseInt(datos.internet.valor);
}
if (datos.telefonia.valor > 0) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(`Telefonía fija: ${datos.telefonia.nombre}`);
    node.appendChild(textnode);
    lista.appendChild(node);
    valorSinDescuento += parseInt(datos.telefonia.valor);
}
if (datos.moviles.valor > 0) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(`Servicios móviles: ${datos.moviles.nombre}`);
    node.appendChild(textnode);
    lista.appendChild(node);
    valorSinDescuento += parseInt(datos.moviles.valor);
}
if (datos.television.valor > 0) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(`Televisión: ${datos.television.nombre}`);
    node.appendChild(textnode);
    lista.appendChild(node);
    valorSinDescuento += parseInt(datos.television.valor);
}
let valorDescuento = 0;
let valorConDescuento = 0;
if (datos.descuento > 0) {
    valorDescuento = parseInt(valorSinDescuento * (datos.descuento / 100));
    valorConDescuento = parseInt(valorSinDescuento * (1 - datos.descuento / 100));
}
valorDescuento = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valorDescuento);
valorConDescuento = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valorConDescuento);
valorSinDescuento = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valorSinDescuento);

document.getElementById('cantidad').appendChild(document.createTextNode(datos.cantidad));
document.getElementById('tipoCliente').appendChild(document.createTextNode(datos.tipo));
document.getElementById('descuento').appendChild(document.createTextNode(`${datos.descuento}%`));
document.getElementById('valorSinDescuento').appendChild(document.createTextNode(`${valorSinDescuento}`));
document.getElementById('valorDescuento').appendChild(document.createTextNode(`${valorDescuento}`));
document.getElementById('valorConDescuento').appendChild(document.createTextNode(`${valorConDescuento}`));

function showContent(element) {
    let temp = document.getElementById(element);
    let clon = temp.content.cloneNode(true);
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').appendChild(clon);
}

let usuario = null;
if (localStorage.usuario) {
    usuario = JSON.parse(localStorage.usuario);
}

if (usuario) {
    showContent('conDatos');
    let textnode = document.createTextNode(usuario.tipo);
    let node = document.getElementById('tipoIdentificacion');
    node.appendChild(textnode);

    textnode2 = document.createTextNode(usuario.codigo);
    node2 = document.getElementById('numeroIdentificacion');
    node2.appendChild(textnode2);

    textnode3 = document.createTextNode(usuario.nombre);
    node3 = document.getElementById('nombreCliente');
    node3.appendChild(textnode3);

} else {
    showContent('sinDatos');
    let textnode = document.createTextNode("CC");
    let textnode2 = document.createTextNode("CC");
    if (datos.tipo === 'empresas') {
        textnode = document.createTextNode('NIT');
        textnode2 = document.createTextNode('NIT');
    }
    let node = document.getElementById('tipoIdentificacionIngresarYContratar');
    node.appendChild(textnode);

    let node2 = document.getElementById('tipoIdentificacionRegistrarYContratar');
    node2.appendChild(textnode2);
}

function ingresarYContratar() {
    let numero = document.getElementById('identifiacionIngresarYContratar').value;
    let tipo = 'CC';
    if (datos.tipo === "empresas") {
        tipo = 'NIT';
    }
    fetch(`${url}/users?tipo=${tipo}&&codigo=${numero}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(usuario => {
            if (typeof (Storage) !== "undefined" && usuario) {
                localStorage.usuario = JSON.stringify(usuario);
                contratar();
            }
        })
        .catch(error => { throw error });
}

function registrarYContratar() {
    let nombre = document.getElementById('nombre').value;
    let codigo = document.getElementById('registrarIdentificacion').value;
    if (codigo && nombre) {
        let tipo = 'CC';
        if (datos.tipo === "empresas") {
            tipo = 'NIT';
        }
        let formulario = {
            nombre,
            codigo,
            tipo
        };
        fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formulario)
        })
            .then(response => response.json())
            .then(usuario => {
                if (usuario) {
                    fetch(`${url}/users?tipo=${tipo}&&codigo=${codigo}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(usuario => {
                            if (typeof (Storage) !== "undefined" && usuario) {
                                if (usuario.servicios) {
                                    usuario.servicios = JSON.parse(usuario.servicios);
                                }
                                localStorage.usuario = JSON.stringify(usuario);
                                contratar();
                            }
                        })
                        .catch(error => { throw error });
                }
            })
            .catch(error => { throw error });
    }
}

function contratar() {
    if (typeof (Storage) !== "undefined") {
        let usuario = JSON.parse(localStorage.usuario);
        let formulario = {
            tipo: usuario.tipo,
            codigo: usuario.codigo,
            nombre: usuario.nombre,
            servicios: datos
        }
        fetch(`${url}/users/${usuario.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formulario)
        })
            .then(response => response.json())
            .then(operacion => {
                if (typeof (Storage) !== "undefined") {
                    window.location.pathname = './perfil/perfil.html';
                }
            })
            .catch(error => { throw error });
    }
}