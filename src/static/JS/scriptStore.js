document.addEventListener("DOMContentLoaded", function(){
    // Consigue desde el html el elemento meta con nombre jsonProductos y extrae el atributo content
    var productos = document.querySelector('meta[name="jsonProductos"]').content;
    // Lo convierte en objeto JS
    productos = JSON.parse(productos);
    // Ejemplo de como usar este arreglo:
    // productos[0]["productName"]
    // Esto dará como resultado el nombre del producto de la primera fila

    // Establecer en 0 todos los contenedores de cantidad
    setQuantity();
    function setQuantity(){
        productos.forEach(producto => {
            document.querySelector('#cantidadProducto'+producto["productId"]).value = 0;
        });
    }

    productos.forEach(producto => {
        const botonAgregar = document.querySelector('#button'+producto["productId"]);
        botonAgregar.addEventListener("click", function(){
            const cantidad = parseInt(document.querySelector('#cantidadProducto'+producto["productId"]).value);

            if (cantidad > 0){
                agregarProductoCarrito(producto, cantidad);
            }else{
                // Mostrar aviso de que no sea menor a 0
                window.alert("Solo cantidades mayores a 0...");
            }
            document.querySelector('#cantidadProducto'+producto["productId"]).value = 0;
        });
    });

    const carrito = [];
    function agregarProductoCarrito(producto, cantidad){
        const productoEnCarrito = carrito.find((item) => item.producto["productId"] === producto["productId"]);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else{
            carrito.push({producto, cantidad});
        }
        // El carrito es un array con dos valores, un diccionario y un int cantidad
        // console.log(carrito[0].cantidad);
        actualizarResumenCompra();
        setQuantity();
    }

    const resumenCompra = document.querySelector("#resumenCompra");
    const total = document.querySelector("#total");

    function actualizarResumenCompra(){
        resumenCompra.innerHTML = "";
        let subtotalTotal = 0;

        carrito.forEach(element => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${element.producto['productName']}</td>
                <td>${element.cantidad}</td>
                <td>$ ${element.producto['productPrice']*element.cantidad}</td>
            `;
            resumenCompra.appendChild(fila);
            subtotalTotal += element.producto['productPrice']*element.cantidad;
        });
        total.textContent = `$${subtotalTotal}`
    }

    /* 
    // Función para enviar datos al servidor y que los procese
    function testFunction(){
        // Se crea la variable del dato a enviar y se protege convirtiendolo en un string JSON
        var envio =  JSON.stringify("asdasd");
        // Se obtiene el botón que va a acccionar el evento
        const finalizarcompra = document.querySelector('#finalizarCompra');
        // Se le asigna un evento al hacer click al botón
        finalizarcompra.addEventListener("click", function(){
            // Debbug para ver el mensaje de envío
            console.log(envio);
            // Formato AJAX para enviar un dato
            $.ajax({
                // url es la dirección que se ejecutará en app.py
                url: "/test",
                // type es el tipo de método que ejecuta, la ruta tendra que tener el método
                type: "POST",
                // data es el dato de envío que se recibirá desde Python
                data: envio
            });
        });
    }
    testFunction();
    */

});