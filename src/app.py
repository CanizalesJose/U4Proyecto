# Importar librerías
from flask import Flask, render_template, redirect, request, url_for, flash, get_flashed_messages, abort
from flask_mysqldb import MySQL
from models.ModelUsers import ModelUsers
from models.entities.users import User
from models.ModelProducts import ModelProducts
from models.entities.products import Product
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from functools import wraps
from config import config

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

# Definir rutas y funciones
@app.route("/")
def index():
    return redirect("login")
# -------------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('tienda'))
    if request.method == "POST":
        user = User(0, request.form['username'], request.form['password'], 0)
        logged_user = ModelUsers.login(db, user)

        if logged_user != None:
            login_user(logged_user)
            if current_user.usertype == 1:
                return redirect(url_for('admin'))
            else:
                return redirect(url_for('tienda'))
        else:
            flash("Datos incorrectos...")
            return render_template("auth/login.html")
    else:
        return render_template("auth/login.html")
# -------------------
@app.route("/info")
def info():
    if current_user.is_authenticated:
        if current_user.usertype == 1:
            encabezadoTienda = "Tienda"
            encabezadoAdministrar = "Administrar"
            
            return render_template("auth/info.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar)
        else:
            encabezadoTienda = "Tienda"
            
            return render_template("auth/info.html", encabezadoTienda=encabezadoTienda)

    return render_template("auth/info.html")
# -------------------
@app.route("/admin")
def admin():
    if current_user.is_authenticated and current_user.usertype==1:
        encabezadoTienda = "Tienda"
        encabezadoAdministrar = "Administrar"
        return render_template("auth/crud.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar)
    else:
        return redirect(url_for('login'))
# -------------------
@app.route("/tienda")
def tienda():
    if current_user.is_authenticated:
        encabezadoTienda = "Tienda"
        if current_user.usertype == 1:
            encabezadoAdministrar = "Administrar"
            return render_template("auth/tienda.html", encabezadoTienda=encabezadoTienda, encabezadoAdministrar=encabezadoAdministrar)
        return render_template("auth/tienda.html", encabezadoTienda=encabezadoTienda)
    else:
        return redirect(url_for('login'))
# -------------------
@app.route("/logout")
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('login'))
# -------------------

if __name__ == "__main__":
    app.config.from_object(config['development'])
    app.run(use_reloader=False)