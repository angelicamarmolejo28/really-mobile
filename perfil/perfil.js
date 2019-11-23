const url = "http://localhost/api";

function cargarServicios() {
    let datos = null;
    if (localStorage.usuario) {
        let usuario = JSON.parse(localStorage.usuario);
        if(usuario.servicios){
            datos = usuario.servicios;
        }
    }
    if (datos) {
        let temp = document.getElementById('servicios');
        let clon = temp.content.cloneNode(true);
        document.getElementById('contenedor').innerHTML = '';
        document.getElementById('contenedor').appendChild(clon);

        let lista = document.getElementById('lista');
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
        document.getElementById('descuento').appendChild(document.createTextNode(`${datos.descuento}%`));
        document.getElementById('valorSinDescuento').appendChild(document.createTextNode(`${valorSinDescuento}`));
        document.getElementById('valorDescuento').appendChild(document.createTextNode(`${valorDescuento}`));
        document.getElementById('valorConDescuento').appendChild(document.createTextNode(`${valorConDescuento}`));
    }
}

function showContent(element) {
    let temp = document.getElementById(element);
    let clon = temp.content.cloneNode(true);
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').appendChild(clon);
}

function cerrarSesion() {
    if (typeof (Storage) !== "undefined") {
        localStorage.usuario = null;
        cargarUsuario();
    }
}

function cargarUsuario() {
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
        cargarServicios();

    } else {
        showContent('sinDatos');
    }
}

function identificarse() {
    let numero = document.getElementById('identificacionIngresar').value;
    let tipo = '';
    let valores = document.getElementsByName('tipoIdentificacionAcceder');
    if(numero){
        if (valores) {
            for (let i = 0; i < valores.length; i++) {
                if (valores[i].checked) {
                    tipo = valores[i].value;
                }
            }
        }
        fetch(`${url}/users?tipo=${tipo}&&codigo=${numero}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(usuario => {
                if (typeof (Storage) !== "undefined" && usuario) {
                    if(usuario.servicios){
                        usuario.servicios = JSON.parse(usuario.servicios);
                    }
                    localStorage.usuario = JSON.stringify(usuario);
                    cargarUsuario();
                }
            })
            .catch(error => { throw error });
    }
}

function borrarUsuario() {
    let usuario = null;
    if (localStorage.usuario) {
        usuario = JSON.parse(localStorage.usuario);
    }

    if (usuario && usuario.id) {
        fetch(`${url}/users/${usuario.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((value) => {
                if (value) {
                    localStorage.usuario = null;
                    cargarUsuario();
                }
            })
            .catch(error => { throw error });
    }
}

function editarUsuario() {
    let usuario = null;
    if (localStorage.usuario) {
        usuario = JSON.parse(localStorage.usuario);
    }

    if (usuario && usuario.id) {
        document.getElementById('container').innerHTML = '';
        document.getElementById('contenedor').innerHTML = '';

        let temp = document.getElementById('editarForm');
        let clon = temp.content.cloneNode(true);
        document.getElementById('container').appendChild(clon);
        if (usuario.tipo === 'CC') {
            document.getElementById("registrarCCEditar").checked = true;
        } else {
            document.getElementById("registrarNITEditar").checked = true;
        }
        document.getElementById("nombreEditar").value = usuario.nombre;
        document.getElementById("editarNumero").value = usuario.codigo;
    }
}

function guardarUsuario() {
    let nombre = document.getElementById('nombreEditar').value;
    let codigo = document.getElementById('editarNumero').value;
    let tipo = '';
    let valores = document.getElementsByName('tipoIdentificacionEditar');
    if (valores) {
        for (let i = 0; i < valores.length; i++) {
            if (valores[i].checked) {
                tipo = valores[i].value;
            }
        }
    }
    let formulario = {
        nombre,
        codigo,
        tipo
    };
    let usuario = null;
    if (localStorage.usuario) {
        usuario = JSON.parse(localStorage.usuario);
    }

    if (usuario && usuario.id) {
        fetch(`${url}/users/${usuario.id}`, {
            method: 'PUT',
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
                                if(usuario.servicios){
                                    usuario.servicios = JSON.parse(usuario.servicios);
                                }
                                localStorage.usuario = JSON.stringify(usuario);
                                cargarUsuario();
                            }
                        })
                        .catch(error => { throw error });
                }
            })
            .catch(error => { throw error });
    }
}

function cancelarUsuario() {
    cargarUsuario();
}

function irPlanes(){
    window.location.pathname = '../planes/planes.html';
}

function registrarse() {
    let nombre = document.getElementById('nombre').value;
    let codigo = document.getElementById('registrarIdentificacion').value;
    if(codigo && nombre){
        let tipo = '';
        let valores = document.getElementsByName('tipoIdentificacionRegistrar');
        if (valores) {
            for (let i = 0; i < valores.length; i++) {
                if (valores[i].checked) {
                    tipo = valores[i].value;
                }
            }
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
                                if(usuario.servicios){
                                    usuario.servicios = JSON.parse(usuario.servicios);
                                }
                                localStorage.usuario = JSON.stringify(usuario);
                                cargarUsuario();
                            }
                        })
                        .catch(error => { throw error });
                }
            })
            .catch(error => { throw error });
    }
}
(()=>{
    let usuario = null;
    if (localStorage.usuario) {
        usuario = JSON.parse(localStorage.usuario);
    }
    if (usuario) {
        fetch(`${url}/users?tipo=${usuario.tipo}&&codigo=${usuario.codigo}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(usuario => {
                if (typeof (Storage) !== "undefined" && usuario) {
                    if(usuario.servicios){
                        usuario.servicios = JSON.parse(usuario.servicios);
                    }
                    localStorage.usuario = JSON.stringify(usuario);
                    cargarUsuario();
                }
            })
            .catch(error => { throw error });
    } else {
        cargarUsuario();
    }
})();