from .entities.users import User

class ModelUsers():

    @classmethod
    def login(self, db, user):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call iniciarSesion(%s, %s)", (user.username, user.password))
            row = cursor.fetchone()
            if row[0] != None:
                user = User(row[0], row[1], row[2], row[3])
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def get_by_id(self, db, id):
        try:
            cursor = db.connection.cursor()
            cursor.execute("select id, username, password, usertype from users where id=%s", (id))
            row = cursor.fetchone()
            if row != None:
                return User(row[0], row[1], row[2], row[3])
        except Exception as ex:
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def registrarUsuario(self, db, newUsername, newPassword, newUsertype):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call registrarUsuario(%s, %s, %s);", (newUsername, newPassword, newUsername))
            cursor.commit()
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def eliminarUsuario(self, db, currentUsername, currentUserPassword):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call eliminarUsuario(%s, %s);", (currentUsername, currentUserPassword))
            cursor.commit()
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def showAllUsers(self, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("select id, username, usertype from users")

            resultados = cursor.fetchall()

            usuarios = []
            for linea in resultados:
                linea = {
                    "id"        :  linea[0],
                    "username"  :  linea[1],
                    "usertype"  :  linea[2]
                }
                usuarios.append(linea)
            return usuarios
        except Exception as ex:
            raise Exception(ex)
        finally:
            cursor.close()