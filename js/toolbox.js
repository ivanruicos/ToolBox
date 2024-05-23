document.addEventListener("DOMContentLoaded", iniciar, false);

var sesionIniciada = false;
var isAdmin = false;

function iniciar() {
    // Funciones para el carruel de fotos
    carrusel();

    cambiarVista(window.location.hash.substring(1));

    // Mostrar la vista correspondiente al cambiar el hash en la URL
    window.onhashchange = function () {
        cambiarVista(window.location.hash.substring(1));
    };

    rutaInicio();

    // Cargar el token
    var token = recuperarTokenSesion();
    var DNI = recuperarDNISesion();

    if($('#id_DNILogin').val() === '11111111A'){
        $('#admin').show();
    }

    // Comprobar si el token existe
    if (token && DNI) {
        //console.log('Usuario autenticado');
        mostrarInformacionUsuario();
        document.getElementById("id_binicio").addEventListener('click', mostrarUsuario);
        document.getElementById('id_dlogout').style.display = 'block';
        document.getElementById('id_registerLogin').style.display = 'none';
    } else {
        //console.log('Usuario no autenticado');
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

    // Función para insertar vehiculos e intervenciones
    document.getElementById('btnInsertarVehiculo').addEventListener('click', insertVehiculos);
    document.getElementById('btnInsertarIntervencion').addEventListener('click', insertIntervenciones);

    // Función para cerrar sesión
    document.getElementById('id_bcerrar').addEventListener('click', function () {
        logout();
        cambiarVista('index');
        window.location.hash = 'index';
    });

    // Función para mostrar la ubicación del taller
    mapa();

    // Función para llamar al calendario
    if (document.getElementById('fechaCitas')) {
        document.getElementById('fechaCitas').addEventListener('change', mostrarCalendario);
        mostrarFechaActual();
    }

    document.getElementById('id_binicio').addEventListener('click', function() {
        sesionIniciada = true;
        habilitarBotonesReserva();
    });

    document.getElementById('id_bcerrar').addEventListener('click', function() {
        sesionIniciada = false;
        deshabilitarBotonesReserva();
    });

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

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if(link.getAttribute('href') === `#${hash}`) {
            link.classList.add('seleccionado');
        } else {
            link.classList.remove('seleccionado');
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
            L.marker([40.9265351, -4.1118941]).addTo(map)
                .bindPopup('TOOL BOX')
                .openPopup();
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

// Función para habilitar los botones de reserva y anulación al iniciar sesión
function habilitarBotonesReserva() {
    var botonesReserva = document.querySelectorAll('.btnReserva');
    botonesReserva.forEach(function(boton) {
        boton.disabled = false;
    });
}

// Función para deshabilitar los botones de reserva y anulación al cerrar sesión
function deshabilitarBotonesReserva() {
    var botonesReserva = document.querySelectorAll('.btnReserva');
    botonesReserva.forEach(function(boton) {
        boton.disabled = true;
    });
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

    var primerDiaSemana = (primerDiaMes.getDay() + 6) % 7; // Ajuste para que el lunes sea el numero 0

    var tablaCalendario = '<table class="tablaCalendario">';

    tablaCalendario += '<tr><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th><th>Sábado</th><th>Domingo</th></tr>';

    var contadorDias = 1;

    // Bucle para llenar las filas del calendario
    for (var i = 0; i < 6; i++) { // Máximo 6 semanas en un mes
        tablaCalendario += '<tr>';
        for (var j = 0; j < 7; j++) { // 7 días de la semana
            if (i === 0 && j < primerDiaSemana) {
                tablaCalendario += '<td></td>';
            } else if (contadorDias > diasEnMes(year, month)) {
                tablaCalendario += '<td></td>';
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
    var fecha = year + '-' + month + '-' + day;
    var detalleDia = document.getElementById('detalleDia');
    
    // Ocultar el detalle si ya está mostrando
    if (detalleDia.dataset.fecha === fecha && detalleDia.dataset.visible === 'true') {
        detalleDia.innerHTML = '';
        detalleDia.dataset.visible = 'false';
        return;
    }

    var detalleCalendario = '<h2>' + day + '/' + month + '/' + year + '</h2>';
    detalleCalendario += '<table>';

    detalleCalendario += '<tr><th>Hora</th><th>Disponibilidad</th><th>Anular</th></tr>';

    for (var i = 8; i <= 17; i++) { // Horas de 8:00 a 17:00
        var tdId = fecha + '-' + i;
        detalleCalendario += '<tr>';
        detalleCalendario += '<td id="' + tdId + '" style="background-color: green">' + i + ':00</td>';
        detalleCalendario += '<td><button class="btnReserva" id="btnHora' + i + '" onclick="cambiarReserva(\'' + fecha + '\', ' + i + ', \'' + DNI + '\')" ' + (sesionIniciada ? '' : 'disabled') + '>Reservar</button></td>';
        detalleCalendario += '<td><button class="btnReserva" id="btnAnular' + i + '" onclick="anularReserva(\'' + fecha + '\', ' + i + ', \'' + DNI + '\')" ' + (sesionIniciada ? '' : 'disabled') + '>Anular</button></td>';
        detalleCalendario += '</tr>';
    }

    detalleCalendario += '</table>';
    detalleDia.innerHTML = detalleCalendario;
    detalleDia.dataset.fecha = fecha;
    detalleDia.dataset.visible = 'true';

    // Recuperar los colores después de generar la tabla
    for (var i = 8; i <= 17; i++) {
        recuperarColorDeLocalStorage(fecha, i);
    }
}

// Función para cambiar el color de reserva
function cambiarReserva(fecha, hora, DNI) {
    var DNI = recuperarDNISesion();
    //console.log('DNI recuperado:', DNI);

    var tdId = fecha + '-' + hora;
    var tdColor = document.getElementById(tdId);
    if (tdColor) {
        tdColor.style.backgroundColor = 'red';
        guardarReservaEnLocalStorage(fecha, hora, 'red', DNI);

        $.ajax({
            type: "POST",
            url: url,
            data: {action: 'reservar', fecha: fecha, hora: hora + ':00:00', DNI: DNI},
            success: function (response) {
                mostrarCitas();
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }
}

function anularReserva(fecha, hora, DNI) {
    var DNI = recuperarDNISesion();
    var reserva = obtenerReservaDeLocalStorage(fecha, hora);
    
    if (reserva && reserva.color === 'red' && reserva.DNI === DNI) {
        var tdId = fecha + '-' + hora;
        var tdColor = document.getElementById(tdId);
        if (tdColor) {
            tdColor.style.backgroundColor = 'green';
            guardarReservaEnLocalStorage(fecha, hora, 'green', null);

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    action: 'anular',
                    fecha: fecha,
                    hora: hora + ':00:00',
                    DNI: DNI
                },
                success: function (response) {
                    mostrarCitas();
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        }
    } else {
        alert('Solo el usuario que realizó la reserva puede anularla.');
    }
}

function guardarReservaEnLocalStorage(fecha, hora, color, DNI) {
    var id = fecha + '-' + hora;
    var reserva = {
        color: color,
        DNI: DNI
    };
    localStorage.setItem(id, JSON.stringify(reserva));
}

function obtenerReservaDeLocalStorage(fecha, hora) {
    var id = fecha + '-' + hora;
    var reserva = localStorage.getItem(id);
    return reserva ? JSON.parse(reserva) : null;
}

function recuperarColorDeLocalStorage(fecha, hora) {
    var reserva = obtenerReservaDeLocalStorage(fecha, hora);
    if (reserva && reserva.color) {
        var tdId = fecha + '-' + hora;
        var tdColor = document.getElementById(tdId);
        if (tdColor) {
            tdColor.style.backgroundColor = reserva.color;
        }
    }
}

// Función para el carrusel de fotos
function carrusel(){
    var banner = new Array("img/carrusel1.jpg", "img/carrusel2.jpg", "img/carrusel3.jpg", "img/carrusel4.jpg", "img/carrusel5.jpg");
    var cont = 0;
    var numImagenes = banner.length;
    
    function rotate(){
        if(document.images){
            cont++;
            if(cont == numImagenes) cont = 0;
            document.getElementById("imgBanner").src = banner[cont];
        }
        window.setTimeout(rotate, 7000);
    }
    rotate();
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
            window.alert('Usuario ' + nombre + ' registrado de forma correcta');
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
                //console.log('Sesión iniciada con token: ' + responseObject.token);
            }

            if (responseObject.nombre) {
                almacenarNombreSesion(responseObject.nombre);
                almacenarDNISesion(DNI);
                //console.log('Sesión iniciada con nombre: ' + responseObject.nombre);
            }

            if(DNI === '11111111A'){
                $('#enlaceAdmin').show();
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

            rutaInicio();

            $('#enlaceAdmin').hide();
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
    let DNI;

    if(sesionIniciada == true){
        DNI = recuperarDNISesion();
    } else {
        DNI = $('#id_DNILogin').val();
    }
    
    //console.log('DNI para mostrar citas:', DNI);

    $.ajax({
        type: "post",
        url: url,
        data: { action: 'showCitas', DNI: DNI, nocache: Math.random() },
        dataType: "json",
        success: function (response) {
            //console.log('tabla');
            var tablaCitas = $("#tablaCitas");
            tablaCitas.empty();
            tablaCitas.append("<tr><th>Fecha</th><th>Hora</th></tr>");
            response.forEach(cita => {
                //console.log('response');
                //console.log(cita);
                tablaCitas.append("<tr><td>" + cita.fecha + "</td><td>" + cita.hora + "</td></tr>");
            });
        }
    });
}

function insertVehiculos(){
    let DNI = $('#DNIInsertar').val();
    let matricula = $('#matricula').val();
    let marca = $('#marca').val();
    let kilometros = $('#kilometros').val();
    let anio = $('#anio').val();
    let modelo = $('#modelo').val();

    $('#DNIInsertar').val('');
    $('#matricula').val('');
    $('#marca').val('');
    $('#kilometros').val('');
    $('#anio').val('');
    $('#modelo').val('');

    $.ajax({
        type: "POST",
        url: url,
        async: true,
        data: {
            action: 'insertVehiculos',
            DNI: DNI,
            matricula: matricula,
            marca: marca,
            kilometros: kilometros,
            anio: anio,
            modelo: modelo
        },
        success: function (response) {
            window.alert('Vehiculo guardado correctamente');
        },
        error: function(){
            window.alert('error al insertar vehículo');
        }
    });
}

function insertIntervenciones(){
    let id_v = $('#id_vInsertar').val();
    let fecha = $('#fecha').val();
    let descripcion = $('#descripcion').val();
    let precio = $('#precio').val();

    $('#id_vInsertar').val('');
    $('#fecha').val('');
    $('#descripcion').val('');
    $('#precio').val('');

    $.ajax({
        type: "POST",
        url: url,
        async: true,
        data: {
            action: 'insertIntervenciones',
            id_v: id_v,
            fecha: fecha,
            descripcion: descripcion,
            precio: precio
        },
        dataType: "json",
        success: function (response) {
            window.alert('Intervención guardada correctamente');
        },
        error: function(){
            window.alert('error al insertar intervencion');
        }
    });
}