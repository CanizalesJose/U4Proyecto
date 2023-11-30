document.addEventListener("DOMContentLoaded", function(){
    const cuerpoTicket = document.querySelector("#cuerpoTicket");
    const totalProductos = document.querySelector("#totalProductos");
    const totalFinal = document.querySelector("#totalCompra");
    var txtfecha = document.querySelector("#fecha");
    var fecha = new Date();
    txtfecha.textContent = fecha.getDay()+"/"+fecha.getMonth()+"/"+fecha.getFullYear()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();

    const carrito = JSON.parse(document.querySelector("meta[name=carrito]").content);

    var total = 0;
    var cantidad = 0;
    carrito.forEach(linea => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td></td>
            <td> ${linea.cantidad} </td>
            <td> ${linea.producto['productName']} </td>
            <td> ${linea.producto['productPrice']} </td>
        `;
        cuerpoTicket.appendChild(fila);
        total = total + (linea.cantidad * linea.producto['productPrice']);
        cantidad = cantidad + linea.cantidad;
    });
    totalProductos.textContent = cantidad;
    totalFinal.textContent = total;
});