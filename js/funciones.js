/**
 * @fileoverview Snake Game.
 *
 * @author                 Andrés Aguirre < https://github.com/AndresWick >
 * @author                 Diego Hernandez < https://github.com/USERCALL >
 *
*/

/**
* velocidad de la serpiente por defecto.
*/
var velocidad=60;
/**
* Función principal del juego, la
* cual permite acceder a las funciones Jugar,
* Pausa y Reanudar.
*/
$(document).ready(function() {
    $("#Jugar").click(function() {
    jugar();
    $('#Jugar').hide();
    $('#Pausa').show();
    $('#Reanudar').hide();
});
$('#Pausa').click(function() {
    clearInterval(game_loop);
    $('#Pausa').hide();
    $('#Reanudar').show();
});
$('#Reanudar').click(function() {
    clearInterval(game_loop);
    $('#Pausa').show();
    $('#Reanudar').hide();
    game_loop = setInterval(dibujar, 60);
});
$('#Reiniciar').click(function() {
    jugar();
    $('#Jugar').hide();
    $('#Pausa').show();
    $('#Reanudar').hide();
});

$('#facil').click(function() {
    velocidad = 200;
});
velocidad = 150;
$('#medio').click(function() {});

$('#dificil').click(function() {
    velocidad = 10;
});
});

// Canvas en el que se dibuja todo el juego.
var canvas = $("#canvasGame")[0];
var contexto = canvas.getContext("2d");
var w = $("#canvasGame").width();
var h = $("#canvasGame").height();
// Tamaño de los cuadros.
var tamCuadro = 10;
// Dirección de la serpiente.
var direccion;
// Alimento de la serpiente.
var comida;
// Puntaje del juego.
var puntaje;
// Variable que representa la serpiente.
var serpiente;

/**
* Función que ejecuta el juego por primera vez.
*/
function jugar() {
    // Dirección inicial por defecto.
    direccion = "right";
    crear_serpiente();
    crear_comida();
    puntaje = 0;
    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(dibujar, velocidad);
}

/**
* Función que crea la serpiente.
*/
function crear_serpiente() {
    // Tamaño inicial por defecto.
    var tamaño = 3;
    serpiente = [];
    for (var i = tamaño - 1; i >= 0; i--) {
        serpiente.push({
            x: i,
            y: 0
        });
    }
}

/**
* Función que crea la serpiente.
*/
function crear_comida() {
    comida = {
        x: Math.round(Math.random() * (w - tamCuadro) / tamCuadro),
        y: Math.round(Math.random() * (h - tamCuadro) / tamCuadro),
    };
}

/**
* Función que dibuja en el canvas el mapa del juego.
*/
function dibujar() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.strokeStyle = "hsl(0,0%,10.3%)";

    for (var i = 0; i < (canvas.height / 10); i++) {
        for (var j = 0; j < (canvas.width / 10); j++) {
            contexto.strokeRect(10 * i, 10 * j, 10, 10);
        };
    }

    var posX = serpiente[0].x;
    var posY = serpiente[0].y;

    if (direccion == "right") posX++;
    else if (direccion == "left") posX--;
    else if (direccion == "up") posY--;
    else if (direccion == "down") posY++;

    if (posX == -1 || posX == w / tamCuadro || posY == -1 || posY == h / tamCuadro || colision(posX, posY, serpiente)) {
        $('#songs2')[0].play();
        $('#Pausa').hide();
        $('#Reanudar').hide();
        $('#Jugar').hide();
        $('#Reiniciar').show();

        clearInterval(game_loop);
        return;
    }
    if (posX == comida.x && posY == comida.y) {
        var tail = {
            x: posX,
            y: posY
        };
        $('#songs')[0].play();
        puntaje++;
        crear_comida();
    } else {
        var tail = serpiente.pop();
        tail.x = posX;
        tail.y = posY;
    }

    serpiente.unshift(tail);

    for (var i = 0; i < serpiente.length; i++) {
        var c = serpiente[i];
        dibujar_celda(c.x, c.y);
    }

    dibujar_celda(comida.x, comida.y);
    var puntaje_text = "Puntaje: " + puntaje;
    $("#puntaje").html(puntaje_text);
}

/**
* Función que dibuja cada celda del mapa de juego.
* @param {int} x es la posición en el eje X de la celda.
* @param {int} y es la posición en el eje Y de la celda.
*/
function dibujar_celda(x, y) {
    var num = Math.floor(Math.random() * (230 + 1));
    var color = "rgba(" + num + ", 255, 0, 1)";
    color = "#fff";
    contexto.fillStyle = color;
    contexto.fillRect(x * tamCuadro, y * tamCuadro, tamCuadro, tamCuadro);
    contexto.strokeStyle = "hsl(0,0%,10.3%)";
    contexto.strokeRect(x * tamCuadro, y * tamCuadro, tamCuadro, tamCuadro);
}

/**
* Función que verifica si la serpiente se colisiona.
* @param {int} x es la posición en el eje X de la celda.
* @param {int} y es la posición en el eje Y de la celda.
* @param {int} serpiente es el arreglo que representa la serpiente.
* @return {boolean} true si está en colisión y false si es lo contrario.
*/
function colision(x, y, serpiente) {
    for (var i = 0; i < serpiente.length; i++) {
        if (serpiente[i].x == x && serpiente[i].y == y)
            return true;
    }
    return false;
}

/**
* Función que permite cambiar de dirección a la serpiente.
*/
$(document).keydown(function(e) {
    var tecla = e.which;
    if ((tecla == "37" || tecla == "65") && direccion != "right") direccion = "left";
    else if ((tecla == "38" || tecla == "87") && direccion != "down") direccion = "up";
    else if ((tecla == "39" || tecla == "68") && direccion != "left") direccion = "right";
    else if ((tecla == "40" || tecla == "83") && direccion != "up") direccion = "down";
})
