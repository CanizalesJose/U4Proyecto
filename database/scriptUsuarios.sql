create database tiendaflora;
use tiendaflora;

create table users(
    id smallint unsigned not null primary key auto_increment,
    username varchar(20) not null,
    password char(120) not null,
    usertype  tinyint not null
) engine=InnoDB auto_increment=2 default charset=utf8mb4 collate=utf8mb4_unicode_ci;

DELIMITER //
CREATE PROCEDURE registrarUsuario(in newUsername varchar(20), in newPassword varchar(120), in newUsertype tinyint)
    BEGIN
        DECLARE passwordCifrada varchar(255);
        SET passwordCifrada = SHA2(newPassword, 256);
        INSERT INTO users (username, password, usertype)
        VALUES (newUsername, passwordCifrada, newUsertype);
    END //
DELIMITER ;

DELIMITER // 
CREATE PROCEDURE iniciarSesion(IN pUsername varchar(20), IN pPassword varchar(120))
    BEGIN

        DECLARE storedPassword varchar(255);
        SELECT password INTO storedPassword FROM users WHERE username = pUserName COLLATE utf8mb4_unicode_ci;

        IF storedPassword IS NOT NULL AND storedPassword = SHA2(pPassword, 256) THEN
            SELECT id, username, password, usertype from users WHERE username = pUserName COLLATE utf8mb4_unicode_ci;
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