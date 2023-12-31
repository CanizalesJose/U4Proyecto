# Importar librerías
from flask import Flask, render_template, redirect, request, url_for, flash, get_flashed_messages, abort, session
from flask_mysqldb import MySQL
from models.ModelUsers import ModelUsers
from models.entities.users import User
from models.ModelProducts import ModelProducts
from models.entities.products import Product
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from functools import wraps
from config import config
import json

# -------------------

# Crear instancias
app = Flask(__name__)
db = MySQL(app)
login_manager_app = LoginManager(app)

# -------------------

# Función obligatoria para cargar el usuario
@login_manager_app.user_loader
def load_user(id):
    return ModelUsers.get_by_id(db, id)

# Decorador para verificar si un usuario es admin
def admin_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated or current_user.usertype != 1:
            abort(403)
        return func(*args, **kwargs)
    return decorated_view

# -------------------
# Evitar que surja el error 404 de favicon.ico
@app.route("/favicon.ico")
def favicon():
    return redirect(url_for('login'))
# -------------------
# Definir rutas y funciones
@app.route("/")
def index():
    return redirect("login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('tienda'))
    if request.method == "POST":
        user = User(0, request.form['username'], "", request.form['password'], 0)
        logged_user = ModelUsers.login(db, user)

        if logged_user != None:
            login_user(logged_user)
            if current_user.usertype == 1:
                return redirect(url_for('adminProducts'))
            else:
                return redirect(url_for('tienda'))
        else:
            flash("Datos incorrectos...")
            return render_template("auth/login.html")
    else:
        return render_template("auth/login.html")


@app.route("/info")
def info():
    if current_user.is_authenticated:
        currentUserName = current_user.fullname
        encabezadoCerrar = "Cerrar Sesión"
        if current_user.usertype == 1:
            encabezadoTienda = "Tienda"
            encabezadoAdministrar = "Administrar"
            
            return render_template("auth/info.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar, encabezadoCerrar=encabezadoCerrar, currentUserName=currentUserName)
        else:
            encabezadoTienda = "Tienda"
            
            return render_template("auth/info.html", encabezadoTienda=encabezadoTienda, encabezadoCerrar=encabezadoCerrar, currentUserName=currentUserName)

    return render_template("auth/info.html")


@app.route("/adminProducts")
def adminProducts():
    if current_user.is_authenticated and current_user.usertype==1:
        encabezadoTienda = "Tienda"
        encabezadoAdministrar = "Administrar"
        encabezadoCerrar = "Cerrar Sesión"
        currentUserName = current_user.fullname
        productos = json.dumps(ModelProducts.showAllProducts(db))

        return render_template("auth/crud.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar, encabezadoCerrar=encabezadoCerrar, currentUserName=currentUserName, productos=productos)
    else:
        return redirect(url_for('login'))


@app.route("/adminUsers")
def adminUsers():
    if current_user.is_authenticated and current_user.usertype==1:
        encabezadoTienda = "Tienda"
        encabezadoAdministrar = "Administrar"
        encabezadoCerrar = "Cerrar Sesión"
        currentUserName = current_user.fullname
        usuarios = json.dumps(ModelUsers.showAllUsers(db))

        return render_template("auth/crudUsers.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar, encabezadoCerrar=encabezadoCerrar, currentUserName=currentUserName, usuarios=usuarios)
    else:
        return redirect(url_for('login'))


@app.route("/tienda")
def tienda():
    if current_user.is_authenticated:
        productos = ModelProducts.showAllProducts(db)
        productos = productos
        jsonProductos = json.dumps(productos)
        encabezadoCerrar = "Cerrar Sesión"
        currentUserName = current_user.fullname

        encabezadoTienda = "Tienda"
        if current_user.usertype == 1:
            encabezadoAdministrar = "Administrar"
            return render_template("auth/tienda.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar, encabezadoCerrar=encabezadoCerrar, productos=productos, currentUserName=currentUserName, jsonProductos=jsonProductos)
        return render_template("auth/tienda.html", encabezadoTienda=encabezadoTienda, encabezadoCerrar=encabezadoCerrar, productos=productos, currentUserName=currentUserName, jsonProductos=jsonProductos)
    else:
        return redirect(url_for('login'))


@app.route("/ticket", methods=["GET", "POST"])
def ticket():
    if current_user.is_authenticated:
        if request.method == "POST":
            carrito = request.get_data().decode("utf-8")
            session["carrito"] = carrito
            return render_template("auth/ticket.html", carrito=carrito)
        else:
            carrito = session.get("carrito", [])
            return render_template("auth/ticket.html", carrito=carrito)
    else:
        return redirect(url_for('login'))


@app.route("/logout")
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('login'))
# -------------------
# Solicitudes desde el JS
@app.route("/nuevoProducto", methods=["GET", "POST"])
def nuevoProducto():
    if (request.method == "POST"):
        newProduct = request.get_data()
        newProduct = json.loads(newProduct)
        
        try:
            ModelProducts.registrarProducto(db, newProduct['productId'], newProduct['productName'], newProduct['productPrice'], newProduct['productImage'])
        except Exception as ex:
            return json.dumps("Hubo un problema inesperado...")
        return json.dumps("Producto agregado!")
    else:
        return redirect(url_for('login'))


@app.route("/eliminarProducto", methods=["GET", "POST"])
def eliminarProducto():
    if (request.method == "POST"):
        eraseRequest = json.loads(request.get_data())
        try:
            ModelProducts.eliminarProducto(db, eraseRequest)
            return json.dumps("Producto eliminado!")
        except Exception as ex:
            return json.dumps("Hubo un problema ejecutando el procedimiento...")
    else:
        return redirect(url_for('login'))


@app.route("/actualizarProducto", methods=["GET", "POST"])
def actualizarProducto():
    if (request.method == "POST"):
        updatedProduct = json.loads(request.get_data())
        try:
            ModelProducts.actualizarProducto(db, updatedProduct['productId'], updatedProduct['productName'], updatedProduct['productPrice'], updatedProduct['productImage'])
            return json.dumps("Producto actualizado!")
        except Exception as ex:
            return json.dumps("Hubo un problema ejecutando el procedimiento...")
    else:
        return redirect(url_for('login'))


@app.route("/borrarUsuario", methods=["GET", "POST"])
def borrarUsuario():
    if (request.method=="POST"):
        erasedUser = request.get_data()
        erasedUser = json.loads(erasedUser)
        erasedId = erasedUser['id']
        
        try:
            ModelUsers.borrarUsuario(db, erasedId)
            return json.dumps("Usuario eliminado!")
        except Exception as ex:
            raise ex
    else:
        return redirect(url_for('login'))


@app.route("/agregarUsuario", methods=["GET", "POST"])
def agregarUsuario():
    if (request.method=="POST"):
        newUser = json.loads(request.get_data())
        try:
            ModelUsers.registrarUsuario(db,newUser['username'], newUser['fullname'], newUser['password'], newUser['usertype'])
            return json.dumps("Usuario agregado!")
        except Exception as ex:
            raise ex
    else:
        return redirect(url_for('login'))


@app.route("/actualizarUsuario", methods=["GET", "POST"])
def actualizarUsuario():
    if (request.method == "POST"):
        updatedUser = json.loads(request.get_data())
        try:
            ModelUsers.actualizarUsuario(db, updatedUser['id'], updatedUser['username'], updatedUser['fullname'], updatedUser['password'], updatedUser['usertype'])
            return json.dumps("Usuario actualizado!")
        except Exception as ex:
            raise ex
    else:
        return redirect(url_for('login'))
# Definir una ruta por defecto que lleve al login
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def defaultRute(path):
    return redirect(url_for('login'))

# -------------------
if __name__ == "__main__":
    app.config.from_object(config['development'])
    app.run(use_reloader=False)