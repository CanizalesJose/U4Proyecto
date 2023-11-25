from .entities.products import Product

class ModelProducts():
    
    @classmethod
    def showAllProducts(self, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT productId, productName, productPrice, productImage FROM products")

            resultados = cursor.fetchall()

            productos = []
            for linea in resultados:
                linea = {
                    "productId"     : linea[0],
                    "productName"   : linea[1],
                    "productPrice"  : linea[2],
                    "productImage"  : linea[3]
                }
                productos.append(linea)
            return productos
        except Exception as ex:
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def registrarProducto(self, db, newId, newName, newPrice, newImage):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call registrarProducto(%s, %s, %s, %s)",(newId, newName, newPrice, newImage))
            db.connection.commit()
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def eliminarProducto(self, db, currentProductId):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call eliminarProducto(%s)",(currentProductId))
            db.connection.commit()
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)
        finally:
            cursor.close()

    @classmethod
    def actualizarProducto(self, db, currentProductId, newProductName, newProductPrice, newProductImage):
        try:
            cursor = db.connection.cursor()
            cursor.execute("call actualizarProducto(%s, %s, %s, %s)", (currentProductId, newProductName, newProductPrice, newProductImage))
            db.connection.commit()
        except Exception as ex:
            db.connection.rollback()
            raise Exception(ex)
        finally:
            cursor.close()