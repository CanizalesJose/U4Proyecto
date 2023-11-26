document.addEventListener("DOMContentLoaded", function(){
    const productos = JSON.parse(document.querySelector('meta[name="productos"]').content);

    const mensajeError = document.querySelector("#mensajeError");
    mensajeError.setAttribute("style", "display: none");
    var mensaje = "";

    // Ejecutar al iniciar la página

    // Generar lista:
    llenarTabla();
    agregarProducto();
    
    // Funciones
    function llenarTabla(){
        listaProductos = document.querySelector("#listaArticulos");
        listaProductos.innerHTML = "";
        productos.forEach(producto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${producto['productId']}</td>
            <td>${producto['productName']}</td>
            <td>${producto['productPrice']}</td>
            <td><img src="${producto['productImage']}" class="imgAdm"></td>
            <td>
                <form id="updateForm${producto['productId']}">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="inputNewName${producto['productId']}" value="${producto['productName']}">
                        <label for="inputNewName${producto['productId']}">Nuevo nombre</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="inputNewPrice${producto['productId']}" value="${producto['productPrice']}">
                        <label for="inputNewPrice${producto['productId']}">Nuevo Precio</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="inputNewImage${producto['productId']}" value="${producto['productImage'].replace("../../static/img/","")}">
                        <label for="inputNewImage${producto['productId']}">Nuevo Imagen</label>
                    </div>
                </form>
                <button type="button" class="btn btn-primary bg-gradient mt-3" id="updateProduct${producto['productId']}">Modificar</button>
                <button type="button" class="btn btn-danger bg-gradient mt-3" id="deleteProduct${producto['productId']}">Eliminar</button>
            </td>
            `;
            listaProductos.appendChild(fila);

            // Crear evento para eliminar el producto de cada elemento de la lista
            document.querySelector("#deleteProduct"+producto['productId']).addEventListener("click", function(){
                if(confirm("¿Estas seguro de eliminar " + producto['productName'] + "?")){
                    borrarProducto(producto['productId']);
                    llenarTabla();
                }
            });

            // Crear evento para modificar un elemento de la lista
            document.querySelector("#updateProduct" + producto['productId']).addEventListener("click", function(){
                if (confirm("¿Seguro de modificar el producto " + producto['productName'] + "?")){
                    actualizarProducto(producto['productId']);
                    llenarTabla();
                }
            });
        });
    }

    function agregarProducto(){
        // Obtener el boton y el formulario
        botonAgregar = document.querySelector("#botonAgregar");
        formProducts = document.querySelector("#formulario");
        // Generar evento para el botón
        botonAgregar.addEventListener("click", function() {
            // Recuperar los datos de los campos
            const newId = document.querySelector("#id").value.trim();
            const newName = document.querySelector("#name").value.trim();
            const newPrice = document.querySelector("#price").value;
            const newImage = document.querySelector("#image").value.trim();
            // Confirmación por parte del usuario
            if (confirm("¿Estas seguro?")){
                // Validar todos los campos
                if (newId.length > 0 && newName.length > 0 && newImage.length > 0 && newPrice > 0){
                    // Buscar elementos repetidos
                    for (let i = 0; i < productos.length; i++) {
                        if (productos[i]['productId'] === newId){
                            // Si encuentra un elemento repetido, regresa null para salirse del método.
                            alert("El ID ya existe...");
                            return null;
                        }
                    }
                    // Genera un nuevo elemento para la lista productos
                    newProducto = {
                        productId:newId,
                        productName:newName,
                        productPrice:parseFloat(newPrice),
                        productImage:newImage
                    };

                    // Enviar este nuevo elemento al servidor para que lo agregue a la tabla
                    envio = JSON.stringify(newProducto);
                    $.ajax({
                        // url es la dirección que se ejecutará en app.py
                        url: "/nuevoProducto",
                        // type es el tipo de método que ejecuta, la ruta tendra que tener el método
                        type: "POST",
                        // data es el dato de envío que se recibirá desde Python
                        data: envio,
                        success: function(respuesta){
                            alert(respuesta);
                        },
                        error: function(){
                            alert("Hubo un problema inesperado...");
                        }
                    });
                    newProducto['productImage'] = "../../static/img/" + newProducto['productImage'];

                    productos.push(newProducto);

                    llenarTabla();
                    formProducts.reset();
                }else{
                    // En caso de que los campos no cumplan los requisitos
                    alert("Los campos no pueden estar vacíos");
                }

            }
        });

    }

    function borrarProducto(currentProductId){
        for (let i = 0; i < productos.length; i++) {
            if (productos[i]['productId'] === currentProductId) {
                $.ajax({
                    // url es la dirección que se ejecutará en app.py
                    url: "/eliminarProducto",
                    // type es el tipo de método que ejecuta, la ruta tendra que tener el método
                    type: "POST",
                    // data es el dato de envío que se recibirá desde Python
                    data: JSON.stringify(currentProductId),
                    success: function(respuesta){
                        alert(respuesta);
                    },
                    error: function(){
                        alert("Hubo un problema inesperado...");
                    }
                });
                productos.splice(i, 1);
                break;
            }
        }
    }

    function actualizarProducto(currentProductId){
        const newProductName = document.querySelector("#inputNewName"+currentProductId).value.trim();
        const newProductPrice = document.querySelector("#inputNewPrice"+currentProductId).value;
        const newProductImage = document.querySelector("#inputNewImage"+currentProductId).value.trim();

        if (newProductName.length > 0 && newProductImage.length > 0 && newProductPrice > 0){
            const updatedProduct = {
                productId : currentProductId,
                productName : newProductName,
                productPrice : newProductPrice,
                productImage : newProductImage
            };
            $.ajax({
                // url es la dirección que se ejecutará en app.py
                url: "/actualizarProducto",
                // type es el tipo de método que ejecuta, la ruta tendra que tener el método
                type: "POST",
                // data es el dato de envío que se recibirá desde Python
                data: JSON.stringify(updatedProduct),
                success: function(respuesta){
                    alert(respuesta);
                },
                error: function(){
                    alert("Hubo un problema inesperado...");
                }
            });
    
            for (let i = 0; i < productos.length; i++) {
                if (productos[i]['productId'] == currentProductId){
                    productos[i]['productName'] = newProductName;
                    productos[i]['productPrice'] = parseFloat(newProductPrice);
                    productos[i]['productImage'] = "../../static/img/" + newProductImage;
                }
            }
        }else{
            alert("Los datos no pueden estar vacíos y el precio no puede ser menor a 0...");
            return null;
        }  
    }

});