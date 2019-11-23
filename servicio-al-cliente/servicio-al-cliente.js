let temp = document.getElementById('formulario');
let clon = temp.content.cloneNode(true);
document.getElementById('container').innerHTML = '';
document.getElementById('container').appendChild(clon);

function enviar() {
    let temp = document.getElementById('respuesta');
    let clon = temp.content.cloneNode(true);
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').appendChild(clon);
}
