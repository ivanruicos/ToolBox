document.addEventListener("DOMContentLoaded", iniciar, false);

function iniciar() {
    cambiarVista(window.location.hash.substring(1));

    // Mostrar la vista correspondiente al cambiar el hash en la URL
    window.onhashchange = function () {
        cambiarVista(window.location.hash.substring(1));
    };

    rutaInicio();

    // Cargar el token
    var token = recuperarTokenSesion();
    var DNI = recuperarDNISesion();

    // Comprobar si el token existe
    if (token && DNI) {
        console.log('Usuario autenticado');
        mostrarInformacionUsuario();
        document.getElementById("id_binicio").addEventListener('click', mostrarUsuario);
        document.getElementById('id_dlogout').style.display = 'block';
        document.getElementById('id_registerLogin').style.display = 'none';

    } else {
        console.log('Usuario no autenticado');
        document.getElementById('id_dlogout').style.display = 'none';
    }

    // Funciones para mostrar datos de inicio de sesión y registro
    document.getElementById("id_login").addEventListener('click', mostrarInicio);
    document.getElementById("id_register").addEventListener('click', mostrarRegister);

    // Función para mostrar datos del usuario
    document.getElementById("id_binicio").addEventListener('click', mostrarUsuario);
    document.getElementById("id_bcerrar").addEventListener('click', mostrarResgisterLogin);
    document.getElementById("id_bregistro").addEventListener('click', mostrarResgisterLogin);

    // función para imprimir nombre del usuario y que se inicie sesión
    document.getElementById('id_binicio').addEventListener('click', login);

    // Función para que se registre el usuario
    document.getElementById('id_bregistro').addEventListener('click', register);

    // Función para cerrar sesión
    document.getElementById('id_bcerrar').addEventListener('click', function () {
        logout();
        //window.location.reload();
    });

    // Función para mostrar la ubicación del taller
    mapa();

    // Función para llamar al calendario
    if (document.getElementById('fechaCitas')) {
        document.getElementById('fechaCitas').addEventListener('change', mostrarCalendario);
        mostrarFechaActual();
    }

    // Función para mostrar intervenciones
    if (document.getElementById('mostrarIntervenciones')) {
        $('#id_DNILogin').on('keyup', function () {
            $('#id_passwordLogin').on('keyup', function () {
                mostrarIntervenciones();
            })
        });
    }

    // Función para mostrar vehículos
    if (document.getElementById('mostrarVehiculos')) {
        $('#id_DNILogin').on('keyup', function () {
            $('#id_passwordLogin').on('keyup', function () {
                mostrarVehiculos();
            })
        });
    }

    // Función para mostrar citas
    if (document.getElementById('mostrarCitas')) {
        $('#id_DNILogin').on('keyup', function () {
            $('#id_passwordLogin').on('keyup', function () {
                mostrarCitas();
            })
        });
    }
}

function rutaInicio() {
    window.onload = function () {
        var indexView = document.getElementById('index');
        indexView.style.display = 'block';
        window.location.hash = 'index';
    };
}

function cambiarVista(hash) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(vista => {
        if (vista.id === hash) {
            vista.style.display = 'block';
        } else {
            vista.style.display = 'none';
        }
    });
}

// Funciones para manejar el token de inicio de sesión
function almacenarTokenSesion(token) {
    localStorage.setItem('token', token);
}

function recuperarTokenSesion() {
    return localStorage.getItem('token') !== null;
}

function eliminarTokenSesion() {
    localStorage.removeItem('token');
}

// Funciones para manejar el nombre de inicio de sesión
function almacenarNombreSesion(nombre) {
    localStorage.setItem('nombre', nombre);
}

function recuperarNombreSesion() {
    return localStorage.getItem('nombre');
}

function eliminarNombreSesion() {
    localStorage.removeItem('nombre');
}

// Funciones para manejar el DNI de inicio de sesión
function almacenarDNISesion(DNI) {
    localStorage.setItem('DNI', DNI);
}

function recuperarDNISesion() {
    return localStorage.getItem('DNI');
}

function eliminarDNISesion() {
    localStorage.removeItem('DNI');
}

// Función para mostrar información específica del usuario
function mostrarInformacionUsuario() {
    var nombreUsuario = recuperarNombreSesion();
    document.getElementById("id_resultado").innerText = nombreUsuario;
}

// FUNCIONES DE FRONT
// Variable para saber en que archivo .html estoy
var currentPage = window.location.pathname.split("/").pop();

//  Funciones para ocultar formulario de inicio de sesión y nombre de usuario
function mostrarInicio(e) {
    e.preventDefault();
    document.getElementById('id_registerLogin').style.display = 'none';
    document.getElementById('id_dlogin').style.display = 'block';
    document.getElementById('id_dregister').style.display = 'none';
    document.getElementById('id_dlogout').style.display = 'none';
}

function mostrarRegister(e) {
    e.preventDefault();
    document.getElementById('id_registerLogin').style.display = 'none';
    document.getElementById('id_dlogin').style.display = 'none';
    document.getElementById('id_dregister').style.display = 'block';
    document.getElementById('id_dlogout').style.display = 'none';
    document.getElementById('intervenciones').style.display = 'none';
    document.getElementById('vehiculos').style.display = 'none';
    document.getElementById('mostrarCitas').style.display = 'none';
}

function mostrarUsuario(e) {
    e.preventDefault();
    document.getElementById('id_registerLogin').style.display = 'none';
    document.getElementById('id_dlogin').style.display = 'none';
    document.getElementById('id_dregister').style.display = 'none';
    document.getElementById('id_dlogout').style.display = 'block';
}

function mostrarResgisterLogin(e) {
    e.preventDefault();
    document.getElementById('id_registerLogin').style.display = 'block';
    document.getElementById('id_dlogin').style.display = 'none';
    document.getElementById('id_dregister').style.display = 'none';
    document.getElementById('id_dlogout').style.display = 'none';
}

// Función para mostrar el mapa 
function mapa() {
    var resultado = document.getElementById("id_resultado");
    var mapa = document.getElementById("id_mapa");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (objPosition) {
            var map = L.map('map').setView([40.9265351, -4.1118941], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            var marker = L.marker([40.9265351, -4.1118941]).addTo(map);
        },

            function (objPositionError) {
                switch (objPositionError.code) {
                    case objPositionError.PERMISSION_DENIED:
                        resultado.innerHTML = "No se ha permitido el acceso a la posición del usuario";
                        break;
                    case objPositionError.POSITION_UNAVAILABLE:
                        resultado.innerHTML = "No se ha podido acceder a la información de su posición";
                        break;
                    case objPositionError.TIMEOUT:
                        resultado.innerHTML = "El servicio ha tardado demasiado tiempo en responder";
                        break;
                    default:
                        resultado.innerHTML = "Error desconocido";
                }
            },
            {
                maxinumAge: 75000,
                timeout: 15000
            })
    } else {
        resultado.innerHTML = "Su navegador no soporta la API de geolocalización";
    }
}

// Funciones para mostrar el calendario 
function mostrarFechaActual() {
    var fechaActual = new Date();

    var year = fechaActual.getFullYear();
    var month = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, por lo que necesitas sumar 1

    // Formatear el mes para que tenga dos dígitos
    var monthString = month < 10 ? '0' + month : '' + month;

    // Construir el valor para el input de tipo month
    var valorMes = year + '-' + monthString;

    document.getElementById('fechaCitas').value = valorMes;
    mostrarCalendario();
}

function mostrarCalendario() {
    var fechaInput = document.getElementById('fechaCitas').value;
    var DNI = document.getElementById('id_DNILogin').value;

    // Obtener el año y mes seleccionados
    var year = fechaInput.split('-')[0];
    var month = fechaInput.split('-')[1];

    var calendario = document.getElementById('calendario');

    var primerDiaMes = new Date(year, month - 1, 1);

    var primerDiaSemana = primerDiaMes.getDay(); // 0 (domingo) a 6 (sábado)

    var tablaCalendario = '<table class="tablaCalendario">';

    tablaCalendario += '<tr><th>Domingo</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th></tr>';

    var contadorDias = 1;

    // Bucle para llenar las filas del calendario
    for (var i = 0; i < 6; i++) { // Máximo 6 semanas en un mes
        tablaCalendario += '<tr>';
        for (var j = 0; j < 7; j++) { // 7 días de la semana
            if (i === 0 && j < primerDiaSemana) {
                tablaCalendario += '<td></td>';
            } else if (contadorDias > diasEnMes(year, month)) {
                break;
            } else {
                tablaCalendario += '<td><button class="btnDia" onclick="mostrarDetalleDia(' + year + ',' + month + ',' + contadorDias + ', \'' + DNI + '\')">' + contadorDias + '</button></td>';
                contadorDias++;
            }
        }
        tablaCalendario += '</tr>';
    }

    tablaCalendario += '</table>';
    calendario.innerHTML = tablaCalendario;
}

// Función para obtener el número de días en un mes y año dados
function diasEnMes(year, month) {
    return new Date(year, month, 0).getDate();
}

// Función para mostrar el detalle del día seleccionado
function mostrarDetalleDia(year, month, day, DNI) {
    var fechaSeleccionada = new Date(year, month - 1, day);
    var detalleDia = document.getElementById('detalleDia');

    var detalleCalendario = '<h2>' + day + '/' + month + '/' + year + '</h2>';
    detalleCalendario += '<table>';

    detalleCalendario += '<tr><th>Hora</th><th>Disponibilidad</th></tr>';

    var isAdmin = (DNI === '11111111A');

    for (var i = 8; i <= 17; i++) { // Horas de 8:00 a 17:00
        detalleCalendario += '<tr>';
        var tdId = 'tdColor' + i;
        recuperarColorDeLocalStorage(tdId);
        var btnId = 'btnHora' + i;
        detalleCalendario += '<td id="' + tdId + '" style="background-color: green">' + i + ':00</td>';
        if (!isAdmin) {
            detalleCalendario += '<td><button id="' + btnId + '" onclick="cambiarReserva(' + i + ')">Reservar</button></td>';
        } else {
            detalleCalendario += '<td><span id="' + btnId + '" style="color: gray;">Reservar</span></td>';
        }
        detalleCalendario += '</tr>';


    }

    detalleCalendario += '</table>';
    detalleDia.innerHTML = detalleCalendario;
}

// Función para cambiar el color de reserva
function cambiarReserva(hora) {
    console.log('cambio color del botón');
    var tdId = 'tdColor' + hora;
    var tdColor = document.getElementById(tdId);
    if (tdColor) {
        tdColor.style.backgroundColor = 'red';
        guardarColorEnLocalStorage(tdId, 'red');
    }
}

// Función para guardar el color de fondo en localStorage
function guardarColorEnLocalStorage(tdId, color) {
    localStorage.setItem(tdId, color);
}

// Función para recuperar el color de fondo de localStorage y aplicarlo
function recuperarColorDeLocalStorage(tdId) {
    var storedColor = localStorage.getItem(tdId);
    if (storedColor) {
        var tdColor = document.getElementById(tdId);
        if (tdColor) {
            tdColor.style.backgroundColor = storedColor;
        }
    }
}

// FUNCIONES DE BACK
// Variable y bucle para definir la ruta del php en función del archivo .html en el que nos encontremos
var url = 'php/db.php';

// Función de registro
function register() {
    let DNI = $('#id_DNIRegister').val();
    let nombre = $('#id_nombreRegister').val();
    let password = $('#id_passwordRegister').val();

    $('#id_DNIRegister').val('');
    $('#id_nombreRegister').val('');
    $('#id_passwordRegister').val('');

    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: { action: 'register', DNI: DNI, nombre: nombre, password: password },
        success: function (respuesta) {
            window.alert('Usuario ' + nombre + ' registrado de form correcta');
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

// Función de login
function login() {
    let DNI = $('#id_DNILogin').val();
    let password = $('#id_passwordLogin').val();

    $('#id_DNILogin').val('');
    $('#id_passwordLogin').val('');

    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: { action: 'login', DNI: DNI, password: password },
        success: function (response) {
            var responseObject = JSON.parse(response);
            var nombreUsuario = responseObject.nombre;
            $('#id_resultado').text(nombreUsuario);

            if (responseObject.token) {
                almacenarTokenSesion(responseObject.token);
                console.log('Sesión iniciada con token: ' + responseObject.token);
            }

            if (responseObject.nombre) {
                almacenarNombreSesion(responseObject.nombre);
                almacenarDNISesion(DNI);
                console.log('Sesión iniciada con nombre: ' + responseObject.nombre);
            }
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

// Función de logout
function logout() {
    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: { action: 'logout' },
        success: function (respuesta) {
            window.alert('Sesión cerrada con éxito');
            eliminarTokenSesion();
            eliminarNombreSesion();
            eliminarDNISesion();

            $("#tablaIntervencion").empty();
            $("#tablaVehiculos").empty();
            $("#tablaCitas").empty();
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

// Funciones de vehiculos
function registerVehiculo() {
    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: { action: 'insertVehiculo' }, // falta agregar valores
        success: function (respuesta) {
            console.log(respuesta);
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

function removeVehiculo() {
    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: { action: 'deleteVehiculo' }, // falta agregar valores
        success: function (respuesta) {
            console.log(respuesta);
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

//Funcion que muestra las intervenciones
function mostrarIntervenciones() {
    let DNI = $('#id_DNILogin').val();

    $.ajax({
        type: "post",
        url: url,
        data: { action: 'showIntervencion', DNI: DNI, nocache: Math.random() },
        dataType: "json",
        success: function (response) {
            var tablaIntervencion = $("#tablaIntervencion");
            tablaIntervencion.empty();
            tablaIntervencion.append("<tr><th>Id Vehiculo</th><th>Fecha</th><th>Descripción</th><th>Precio</th></tr>");
            response.forEach(element => {
                tablaIntervencion.append("<tr><td>" + element.id_v + "</td><td>" + element.fecha + "</td><td>" + element.descripcion + "</td><td>" + element.precio + "</td></tr>");
            });
        },
        error: function () {
            window.alert("Se ha producido un error");
        }
    });
}

// Función para mostrar vehículos
function mostrarVehiculos() {
    let DNI = $('#id_DNILogin').val();

    $.ajax({
        type: "post",
        url: url,
        data: { action: 'showVehiculos', DNI: DNI, nocache: Math.random() },
        dataType: "json",
        success: function (response) {
            var tablaVehiculos = $("#tablaVehiculos");
            tablaVehiculos.empty();
            tablaVehiculos.append("<tr><th>Id Vehiculo</th><th>Matricula</th><th>Marca</th><th>Kilometros</th><th>Año</th><th>Modelo</th></tr>");
            response.forEach(element => {
                tablaVehiculos.append("<tr><td>" + element.id_v + "</td><td>" + element.matricula + "</td><td>" + element.marca + "</td><td>" + element.kilometros + "</td><td>" + element.anio + "</td><td>" + element.modelo + "</td></tr>");
            });

        }
    });
}

// Función para mostrar averías
function mostrarCitas() {
    let DNI = $('#id_DNILogin').val();

    $.ajax({
        type: "post",
        url: url,
        data: { action: 'showCitas', DNI: DNI, nocache: Math.random() },
        dataType: "json",
        success: function (response) {
            var tablaCitas = $("#tablaCitas");
            tablaCitas.empty();
            tablaCitas.append("<tr><th>Descripción</th><th>Fecha</th></tr>");
            response.forEach(element => {
                tablaCitas.append("<tr><td>" + element.descripcion + "</td><td>" + element.fecha + "</td></tr>");
            });
        }
    });
}