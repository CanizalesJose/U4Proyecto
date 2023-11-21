use tiendaflora;

create table products(
    productId varchar(20) not null primary key,
    productName varchar(120) not null,
    productPrice float not null,
    productImage  varchar(255) not null
) engine=InnoDB auto_increment=2 default charset=utf8mb4 collate=utf8mb4_unicode_ci;

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