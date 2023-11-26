create database tiendaflora;
use tiendaflora;

create table users(
    id int unsigned not null primary key auto_increment,
    username varchar(20) not null,
    fullname varchar(120) not null,
    password char(120) not null,
    usertype  tinyint not null
) engine=InnoDB auto_increment=2 default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table products(
    productId varchar(20) not null primary key,
    productName varchar(120) not null,
    productPrice float not null,
    productImage  varchar(255) not null
) engine=InnoDB auto_increment=2 default charset=utf8mb4 collate=utf8mb4_unicode_ci;

-- Procedimientos de la tabla usuarios
DELIMITER //
CREATE PROCEDURE registrarUsuario(in newUsername varchar(20), in newFullname varchar(120), in newPassword varchar(120), in newUsertype tinyint)
    BEGIN
        DECLARE passwordCifrada varchar(255);
        SET passwordCifrada = SHA2(newPassword, 256);
        INSERT INTO users (username, fullname, password, usertype)
        VALUES (newUsername, newFullname, passwordCifrada, newUsertype);
    END //
DELIMITER ;

DELIMITER // 
CREATE PROCEDURE iniciarSesion(IN pUsername varchar(20), IN pPassword varchar(120))
    BEGIN

        DECLARE storedPassword varchar(255);
        SELECT password INTO storedPassword FROM users WHERE username = pUserName COLLATE utf8mb4_unicode_ci;

        IF storedPassword IS NOT NULL AND storedPassword = SHA2(pPassword, 256) THEN
            SELECT id, username, fullname, password, usertype from users WHERE username = pUserName COLLATE utf8mb4_unicode_ci;
        ELSE
            SELECT NULL;
        END IF;

    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE eliminarUsuario(IN currentUsername varchar(20), IN currentPassword varchar(120))
    BEGIN
        DELETE FROM users WHERE username=currentUsername COLLATE utf8mb4_unicode_ci AND password=SHA2(currentPassword, 256) COLLATE utf8mb4_unicode_ci;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE borrarUsuario(IN currentId int)
    BEGIN
        DELETE FROM users WHERE id=currentId COLLATE utf8mb4_unicode_ci;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE actualizarUsuario(IN currentId int, IN newUsername varchar(120), IN newFullname varchar(120), IN newPassword varchar(120), IN newUsertype int)
    BEGIN
        UPDATE users SET username=newUsername, fullname=newFullname, password=SHA2(newPassword, 256), usertype=newUsertype WHERE id=currentId COLLATE utf8mb4_unicode_ci;
    END //
DELIMITER ;

-- Procedimientos de la tabla productos
DELIMITER //
    CREATE PROCEDURE registrarProducto(IN productNewId varchar(20), IN productNewName varchar(120), IN productNewPrice float, IN productNewImage varchar(255))
    BEGIN
        INSERT INTO products (productId, productName, productPrice, productImage)
        VALUES (productNewId, productNewName, productNewPrice, CONCAT("../../static/img/",productNewImage));
    END //
DELIMITER ;

DELIMITER //
    CREATE PROCEDURE eliminarProducto(IN productOldId varchar(20))
    BEGIN
        DELETE FROM products WHERE productId=productOldId COLLATE utf8mb4_unicode_ci;
    END //
DELIMITER ;

DELIMITER //
    CREATE PROCEDURE actualizarProducto(IN productCurrentID varchar(20), IN productNewName varchar(120), IN productNewPrice float, IN productNewImage varchar(255))
    BEGIN
        UPDATE products SET productName=productNewName, productPrice=productNewPrice, productImage=CONCAT("../../static/img/",productNewImage)
        WHERE productId=productCurrentID COLLATE utf8mb4_unicode_ci;
    END //
DELIMITER ;

-- Generar unos pocos registros de ejemplo
call registrarProducto("1", "Gusanitos de gomita", 15, "gusanitos.jpg");
call registrarProducto("2", "Panditas de gomita", 15, "panditas.jpg");
call registrarProducto("3", "Dibujos para pintar", 10, "dibujos.jpg");
call registrarProducto("4", "Lucas", 15, "lucas.jpg");

call registrarUsuario("admin", "test admin name", "123", 1);
call registrarUsuario("usuario", "test user name", "123", 0);