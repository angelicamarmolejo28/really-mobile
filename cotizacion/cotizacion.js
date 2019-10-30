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
