function showContent(element) {
    let temp = document.getElementById(element);
    let clon = temp.content.cloneNode(true);
    document.getElementById('container').innerHTML = '';
    document.getElementById('container').appendChild(clon);
}
