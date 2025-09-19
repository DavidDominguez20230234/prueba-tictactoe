# Tic Tac Toe - Proyecto Web

## Descripción

Tic Tac Toe es un juego clásico de tres en raya implementado como aplicación web interactiva. Permite jugar entre dos jugadores humanos (PvP) o contra la computadora (CPU) con tres niveles de dificultad: fácil, medio y difícil.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6 (modular)
- LocalStorage para guardar configuración y estado del juego
- Imágenes y sonidos para mejorar la experiencia de usuario

## Estructura del Proyecto

tictactoe/
├─ index.html # Pantalla principal y menú
├─ game.html # Pantalla del juego
├─ css/
│ ├─ base.css # Estilos generales
│ ├─ screens/ # Estilos por pantalla
│ │ ├─ loading.css
│ │ ├─ menu.css
│ │ ├─ player-setup.css
│ │ └─ game.css
│ ├─ modal-confirmation.css
│ └─ modal.css
├─ js/
│ ├─ app.js # Script principal
│ ├─ screens/
│ │ ├─ game.js # Lógica de la pantalla de juego
│ │ ├─ loading.js # Lógica de la pantalla de juego
│ │ └─ menu.js # Lógica del menú
│ ├─ utils/
│ │ ├─ modal.js # Funciones de modal
│ │ └─ sounds.js # Funciones de sonidos
│ ├─ app.js
│ ├─ cpu.js # Lógica de movimientos de la CPU
│ ├─ storage.js # Gestión de LocalStorage
│ └─ gameLogic.js # Lógica de juego y reglas
├─ assets/
│ ├─ images/
│ └─ icons/
└─ partials/
└─ modal.html # HTML del modal de confirmación

## Funcionalidades

- Menú con opciones: Jugador vs Jugador y Jugador vs CPU.
- Configuración de nombres de jugadores.
- Selección de dificultad para la CPU: fácil, medio, difícil.
- Tablero interactivo con turnos alternados.
- Visualización de símbolos (X y O) con imágenes.
- Modal para mostrar resultados: victoria, derrota o empate.
- Guardado automático del estado y configuración usando LocalStorage.
- Botón de refrescar para reiniciar partida con confirmación.
- Continuar partidas guardadas desde el menú.
- Sonidos para movimientos, victoria, empate y botones.

## Cómo Ejecutar

1. Clonar o descargar el proyecto.
2. Abrir `index.html` en un navegador web moderno.
3. Interactuar con el menú para iniciar una partida.
4. Jugar seleccionando casillas del tablero.

## Contribuciones

Este proyecto puede ser extendido agregando:

- Mejoras en la interfaz gráfica.
- Soporte para estadísticas históricas más detalladas.
- Animaciones y efectos visuales avanzados.
- Versión móvil optimizada.
