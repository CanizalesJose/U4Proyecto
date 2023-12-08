document.addEventListener("DOMContentLoaded", function(){
    const usuarios = JSON.parse(document.querySelector("meta[name=usuarios]").content);

    llenarTabla();
    agregarUsuario();

    function llenarTabla(){
        const listaUsuarios = document.querySelector("#listaUsuarios");
        listaUsuarios.innerHTML = "";
        
        usuarios.forEach(usuario => {
            const fila = document.createElement("tr");
            var tipoUsuario = "";
            if (parseInt(usuario['usertype']) == 1)
                tipoUsuario = "Administrador";
            else
                tipoUsuario = "Cliente";

            fila.innerHTML = `
                <td>${usuario['id']}</td>
                <td>${usuario['username']}</td>
                <td>${usuario['fullname']}</td>
                <td>${tipoUsuario}</td>
                <td>
                    <form id="updateForm${usuario['id']}">

                        <div class="form-floating mb-1">
                            <input type="text" class="form-control" id="inputNewUsername${usuario['id']}" placeholder="Username" value="${usuario['username']}">
                            <label for="inputNewUsername${usuario['id']}">Nombre de usuario</label>
                        </div>

                        <div class="form-floating mb-1">
                            <input type="text" class="form-control" id="inputNewFullname${usuario['id']}" placeholder="Fullname" value="${usuario['fullname']}">
                            <label for="inputNewFullname${usuario['id']}">Nombre completo</label>
                        </div>

                        <div class="form-floating mb-1">
                            <input type="password" class="form-control" id="inputNewPassword${usuario['id']}" placeholder="">
                            <label for="inputNewPassword${usuario['id']}">Nueva contraseña</label>
                        </div>

                        <div class="form-floating mb-1">
                            <select class="form-select" id="inputNewUsertype${usuario['id']}" aria-label="Floating label select example">
                                <option value="0" ${usuario['usertype'] === 0 ? 'selected' : ''}>Cliente</option>
                                <option value="1" ${usuario['usertype'] === 1 ? 'selected' : ''}>Administrador</option>
                            </select>
                            <label for="inputNewUsertype${usuario['id']}">Tipo de Usuario</label>
                        </div>

                    </form>
                    <button type="button" class="btn btn-primary bg-gradient mt-3" id="updateUser${usuario['id']}">Modificar</button>
                    <button type="button" class="btn btn-danger bg-gradient mt-3" id="eraseUser${usuario['id']}">Eliminar</button>
                </td>
            `;
            listaUsuarios.appendChild(fila);

            document.querySelector("#eraseUser" + usuario['id']).addEventListener("click", function(){
                if (confirm("¿Confirmar eliminar al usuario " + usuario['fullname'] + "?")){
                    borrarUsuario(usuario['id']);
                    llenarTabla();
                }
            });

            document.querySelector("#updateUser" + usuario['id']).addEventListener("click", function(){
                if (confirm("¿Confirmar modificar al usuario " + usuario['fullname']) + "?"){
                    actualizarUsuario(usuario['id']);
                    llenarTabla();
                }
            });
        });
    }

    function borrarUsuario(userId){
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i]['id'] === userId){
                // Envio de la solicitud de borrar usando AJAX
                $.ajax({
                    url: "/borrarUsuario",
                    type: "POST",
                    data: JSON.stringify(usuarios[i]),
                    success: function(respuesta){
                        alert(respuesta);
                    },
                    error: function(){
                        alert("Hubo un problema inesperado...");
                    }
                });
                usuarios.splice(i, 1);
                break;
            }
            
        }
    }

    function agregarUsuario(){
        botonAgregar = document.querySelector("#botonAgregarUser");
        formUsers = document.querySelector("#formUser");

        botonAgregar.addEventListener("click", function(){
            const newUsername = document.querySelector("#inputNewUsername").value.trim();
            const newFullname = document.querySelector("#inputNewFullname").value.trim();
            const newPassword = document.querySelector("#inputNewPassword").value;
            const newUserType = document.querySelector("#inputNewUsertype").value;

            if (newUsername.length > 0 && newFullname.length > 0 && newPassword.length > 0 && confirm("¿Agregar usuario?")){
                const newUser = {
                    username : newUsername,
                    fullname : newFullname,
                    password : newPassword,
                    usertype : parseInt(newUserType)
                }

                $.ajax({
                    url: "/agregarUsuario",
                    type: "POST",
                    data: JSON.stringify(newUser),
                    success: function(respuesta){
                        alert(respuesta);
                    },
                    error: function(){
                        alert("Hubo un problema inesperado...");
                    }
                });

                location.reload();
            }else{
                alert("El formato de los datos es erróneo.");
            }
        });
    }

    function actualizarUsuario(userId){
        const newUsername = document.querySelector("#inputNewUsername"+userId).value.trim();
        const newPassword = document.querySelector("#inputNewPassword"+userId).value;
        const newFullname = document.querySelector("#inputNewFullname"+userId).value.trim();
        const newUsertype = document.querySelector("#inputNewUsertype"+userId).value;

        if (newUsername.length > 0 && newPassword.length > 0 && newFullname.length > 0){
            const updatedUser = {
                id: parseInt(userId),
                username : newUsername,
                fullname : newFullname,
                password : newPassword,
                usertype : parseInt(newUsertype)
            };
            
            $.ajax({
                url: "/actualizarUsuario",
                type: "POST",
                data: JSON.stringify(updatedUser),
                success: function(respuesta){
                    alert(respuesta);
                    location.reload();
                },
                error: function(){
                    alert("Hubo un problema inesperado...");
                }
            });
            location.reload();

        }else{
            alert("Formato erróneo...");
        }
    }
});