class DevelopmentConfig():
    DEBUG = True
    SECRET_KEY = "test"
    MYSQL_HOST = "localhost"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = "1234"
    MYSQL_DB = "tiendaflora"
config = {"development":DevelopmentConfig}