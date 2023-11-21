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