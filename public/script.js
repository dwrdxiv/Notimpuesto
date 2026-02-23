async function cargarClientes() {
    const respuesta = await fetch('/clientes');
    const clientes = await respuesta.json();

    const tabla = document.querySelector('#lista-clientes');
    clientes.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cliente.razon_social}</td>
            <td>${cliente.rif}</td>
            <td>${cliente.lastdigit}</td>
        `;
        tabla.appendChild(fila);
    });
}

cargarClientes();