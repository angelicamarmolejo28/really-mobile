// Instalar dependencias con composer.
ir a la carpeta 'api' para ejecutar:
// Opcion 1
php composer.phar install
// Opcion 2 con composer en el PATH
composer install
---------------------------
Crear base de datos SQL:
CREATE DATABASE reallyMobile;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `tipo` varchar(3) DEFAULT NULL,
  `codigo` varchar(45) DEFAULT NULL,
  `servicios` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
----------------------------