-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: PMYSQL175.dns-servicio.com:3306
-- Tiempo de generación: 23-05-2024 a las 09:24:26
-- Versión del servidor: 8.0.35
-- Versión de PHP: 8.2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `10430865_taller`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int NOT NULL,
  `DNI` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `DNI`, `hora`, `fecha`) VALUES
(55, '1234567C', '08:00:00', '2024-05-16'),
(60, '70265782T', '16:00:00', '2024-05-28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `DNI` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`DNI`, `nombre`, `password`) VALUES
('11111111A', 'admin', '$2y$10$dpNBpBCLKE27uCqTLdIR0enBmA6ddnmijS9KwWn/TX8AGxUPDspfG'),
('12345678L', 'Usuario', '$2y$10$hF558BQ6MEePxgNZ0V62a.PuZNV85UK9TMgcGim/tFxJTtS3NelyG'),
('12345678P', 'Pedro Sánchez', '$2y$10$3n4Ffu0YnpXrN7g4OKIM/uVnV/Gj5YlRQbWM0MOhXGo5O8nwZW40G'),
('12345678Z', 'Alvaro', '$2y$10$Bz0CQYd9FbN.jspy/NgNFef41newmWggpkZGsZndZKysFUnXfa7Ne'),
('1234567C', 'Pedro Sánchez', '$2y$10$./NNnAqEx91NBwhXGTWS2uNCGL9y6RhMF9JSivfDa8B3pdGZzVX7O'),
('1234567D', 'Leñadora', '$2y$10$d30LV/WiOqLswcHEUV/6ruK4Ye6Ow1cTSA/KyyN07kBqpGz25gXAy'),
('33333333C', 'admin 3', '$2y$10$w8XqmVIJlj2oZNdJOts6e.EBtz47DnSkwbqAlHDfyl/dVAp5nzB1y'),
('70265782T', 'ivan', '$2y$10$q/jbTpmOsvalUVTHAG22RO0pW6DpTNNxfe9ypNW0v919At.6q7RO6'),
('70274733G', 'María García Conde', '$2y$10$5yXioIgnPCp02YLN0SNsXuJyEzfzbStPPIo/XQXfL5Jx30ZTyGEUi'),
('98765432P', 'Calla', '$2y$10$zoCIfEcNfH1S3fIIOO9oOuc4fAeIXuoicRpbBerETbxskxqNVuP3.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intervencion`
--

CREATE TABLE `intervencion` (
  `id_i` int NOT NULL,
  `id_v` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `intervencion`
--

INSERT INTO `intervencion` (`id_i`, `id_v`, `fecha`, `descripcion`, `precio`) VALUES
(3, 3, '2024-04-10', 'Descripción', 200.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id_v` int NOT NULL,
  `DNI` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `matricula` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `marca` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kilometros` int DEFAULT NULL,
  `anio` int DEFAULT NULL,
  `modelo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id_v`, `DNI`, `matricula`, `marca`, `kilometros`, `anio`, `modelo`) VALUES
(3, '70265782T', '2291GVC', 'BMW', 180000, 2010, 'Serie 1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `DNI` (`DNI`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`DNI`);

--
-- Indices de la tabla `intervencion`
--
ALTER TABLE `intervencion`
  ADD PRIMARY KEY (`id_i`),
  ADD KEY `id_v` (`id_v`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id_v`),
  ADD KEY `DNI` (`DNI`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `intervencion`
--
ALTER TABLE `intervencion`
  MODIFY `id_i` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_v` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`DNI`) REFERENCES `clientes` (`DNI`);

--
-- Filtros para la tabla `intervencion`
--
ALTER TABLE `intervencion`
  ADD CONSTRAINT `intervencion_ibfk_1` FOREIGN KEY (`id_v`) REFERENCES `vehiculos` (`id_v`);

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`DNI`) REFERENCES `clientes` (`DNI`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
