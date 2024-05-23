<?php
    session_start();

    define("DB_HOST", "PMYSQL175.dns-servicio.com");
    define("DB_NAME", "10430865_taller");
    define("DB_USER", "ivan");
    define("DB_PASSWORD", "0qrMu891#");

    $action = $_POST['action'];
    $crud = new db();

    switch ($action) {
        case 'register':
            $DNI = $_POST['DNI'];
            $nombre = $_POST['nombre'];
            $password = $_POST['password'];
            $data = $crud->insert($DNI, $nombre, $password);
            echo $data;
            break;
        case 'login':
            $DNI = $_POST['DNI'];
            $password = $_POST['password'];
            $data = $crud->login($DNI, $password);
            print_r($data);
            break;
        case 'logout':
            $crud->logout();
            break;
        case 'insertVehiculo':
            $matricula = $_POST['matricula'];
            $marca = $_POST['marca'];
            $modelo = $_POST['modelo'];
            $kilometros = $_POST['kilometros'];
            $anio = $_POST['anio'];
            $data = $crud->insertVehiculo($matricula, $marca, $modelo, $kilometros, $anio);
            echo $data;
            break;
        case 'deleteVehiculo':
            $id_v = $_POST['id_v'];
            $data = $crud->deleteVehiculo($id_v);
            echo $data;
            break;
        case 'showIntervencion':
            $DNI = $_POST['DNI'];
            $data = $crud->mostrarIntervenciones($DNI);
            print_r($data);
            break;
        case 'showVehiculos':
            $DNI = $_POST['DNI'];
            $data = $crud->mostrarVehiculos($DNI);
            print_r($data);
            break;
        case 'showCitas':
            $DNI = $_POST['DNI'];
            $data = $crud->mostrarCitas($DNI);
            print_r($data);
            break;
        case 'reservar':
            $DNI = $_POST['DNI'];
            $fecha = $_POST['fecha'];
            $hora = $_POST['hora'];
            $data = $crud->reservar($DNI, $fecha, $hora);
            print_r($data);
            break;
        case 'anular':
            $DNI = $_POST['DNI'];
            $fecha = $_POST['fecha'];
            $hora = $_POST['hora'];
            $data = $crud->anular($DNI, $fecha, $hora);
            print_r($data);
            break;
        case 'insertVehiculos':
            $DNI = $_POST['DNI'];
            $matricula = $_POST['matricula'];
            $marca = $_POST['marca'];
            $kilometros = $_POST['kilometros'];
            $anio = $_POST['anio'];
            $modelo = $_POST['modelo'];
            $data = $crud->insertVehiculos($DNI, $matricula, $marca, $kilometros, $anio, $modelo);
            echo $data;
            break;
        case 'insertIntervenciones':
            $id_v = $_POST['id_v'];
            $fecha = $_POST['fecha'];
            $descripcion = $_POST['descripcion'];
            $precio = $_POST['precio'];
            $data = $crud->insertIntervenciones($id_v, $fecha, $descripcion, $precio);
            echo $data;
            break;
    }

    class db {
        private $host;
        private $dbName;
        private $user;
        private $password;

        private $db_handler;

        public function __construct() {
            $this->host = DB_HOST;
            $this->dbName = DB_NAME;
            $this->user = DB_USER;
            $this->password = DB_PASSWORD;

            try {
                $dsn = "mysql:host=$this->host;dbname=$this->dbName";
                $this->db_handler = new PDO($dsn, $this->user, $this->password);
                $this->db_handler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->db_handler->exec("set names utf8");
                // echo "Conexión realizada con éxito";
            } catch (PDOException $e) {
                die("Error en la conexión " . $e->getMessage());
            }
        }

        public static function conectar() {
            return new self();
        }

        // Funciones de clientes
        public function insert($DNI, $nombre, $password) {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $parametros = array(':DNI' => $DNI, ':nombre' => $nombre, ':password' => $passwordHash);
            $pdo = $this->db_handler->prepare("INSERT INTO clientes (DNI, nombre, password) VALUES (:DNI, :nombre, :password)");

            try {
                $pdo->execute($parametros);
                return $pdo->rowCount();
            } catch (PDOException $e) {
                echo "Error al insertar: " . $e->getMessage();
                return false;
            }
        }

        public function login($DNI, $password){
            $parametros = array(':DNI' => $DNI);

            $pdo = $this->db_handler->prepare("SELECT * FROM clientes WHERE DNI = :DNI");
            $pdo->execute($parametros);

            if ($pdo->rowCount() == 1) {
                $row = $pdo->fetch(PDO::FETCH_ASSOC);
                if (password_verify($password, $row['password'])) {
                    $_SESSION['dni'] = $DNI;
                    $token = bin2hex(random_bytes(16));
                    $_SESSION['token'] = $token;
                    return json_encode(array('token' => $token, 'nombre' => $row['nombre']));
                } else {
                    return json_encode(array('error' => "Contraseña incorrecta"));
                }
            } else {
                return json_encode(array('error' => "Usuario no encontrado"));
            }
        }

        public function verificarSesion(){
            if(isset($_SESSION['token'])){
                echo '<br>'.$_SESSION['token'];
            } else {
                echo 'No funciona';
            }
        }

        public function logout(){
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }

            session_destroy();

            if (empty($_SESSION['nombre'])) {
                echo "La sesión se ha cerrado correctamente.";
            } else {
                echo "La sesión no se ha cerrado correctamente.";
            }
        }

        // Funciones de intervenciones
        public function mostrarIntervenciones($DNI){
            $parametros = array(':DNI' => $DNI);
            $pdo = $this -> db_handler -> prepare("SELECT * FROM intervencion WHERE id_v IN (SELECT id_v FROM vehiculos WHERE DNI IN (SELECT DNI FROM clientes WHERE DNI = :DNI))");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
        }

        // Funciones de citas
        public function mostrarCitas($DNI){
            $parametros = array(':DNI' => $DNI);
            $pdo = $this->db_handler->prepare("SELECT * FROM citas WHERE DNI = :DNI");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
        }

        public function anular($DNI, $fecha, $hora){
            $parametros = array(':DNI' => $DNI, ':fecha' => $fecha, ':hora' => $hora);
            $pdo = $this->db_handler->prepare("DELETE FROM citas WHERE DNI = :DNI AND fecha = :fecha AND hora = :hora");

            try {
                $pdo->execute($parametros);
                return $pdo->rowCount();
            } catch (PDOException $e) {
                echo "Error al anular la reserva: " . $e->getMessage();
                return false;
            }
        }

        public function reservar($DNI, $fecha, $hora){
            if (empty($DNI) || empty($fecha) || empty($hora)) {
                echo "Error: DNI, fecha o hora están vacíos.";
                return false;
            }
        
            // Verificar si el DNI existe en la tabla clientes
            $pdo = $this->db_handler->prepare("SELECT DNI FROM clientes WHERE DNI = :DNI");
            $pdo->execute([':DNI' => $DNI]);
            if ($pdo->rowCount() == 0) {
                echo "Error: El DNI no existe en la tabla clientes.";
                return false;
            }
            
            $parametros = array(':DNI' => $DNI, ':hora' => $hora, ':fecha' => $fecha);
            $sql = "INSERT INTO citas (DNI, hora, fecha) VALUES (:DNI, :hora, :fecha)";
            $pdo = $this->db_handler->prepare($sql);

            try {
                $pdo->execute($parametros);
                return $pdo->rowCount();
            } catch (PDOException $e) {
                echo "Error al insertar la reserva: " . $e->getMessage();
                echo "\nDNI: $DNI, Fecha: $fecha, Hora: $hora";
                return false;
            }
        }

        // Funciones de vehiculos
        public function mostrarVehiculos($DNI){
            $parametros = array(':DNI' => $DNI);
            $pdo = $this->db_handler->prepare("SELECT * FROM vehiculos WHERE DNI IN (SELECT DNI FROM clientes WHERE DNI = :DNI)");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
        }

        public function insertVehiculos($DNI, $matricula, $marca, $kilometros, $anio, $modelo) {
            try {
                // Verifica si el DNI existe en la tabla de usuarios/clientes
                $queryCheckDNI = $this->db_handler->prepare("SELECT COUNT(*) FROM clientes WHERE DNI = :DNI");
                $queryCheckDNI->execute(array(':DNI' => $DNI));
                $dniExists = $queryCheckDNI->fetchColumn();
        
                if ($dniExists) {
                    // Si el DNI existe, inserta el vehículo
                    $queryInsertVehiculo = $this->db_handler->prepare("INSERT INTO vehiculos (DNI, matricula, marca, kilometros, anio, modelo) VALUES (:DNI, :matricula, :marca, :kilometros, :anio, :modelo)");
                    $parametros = array(
                        ':DNI' => $DNI,
                        ':matricula' => $matricula,
                        ':marca' => $marca,
                        ':kilometros' => $kilometros,
                        ':anio' => $anio,
                        ':modelo' => $modelo
                    );
                    $queryInsertVehiculo->execute($parametros);
                    return $queryInsertVehiculo->rowCount();
                } else {
                    // Si el DNI no existe, retorna un error o falso
                    echo "El DNI no existe.";
                    return false;
                }
            } catch (PDOException $e) {
                echo "Error al insertar: " . $e->getMessage();
                return false;
            }
        }

        public function insertIntervenciones($id_v, $fecha, $descripcion, $precio) {
            try {
                // Verifica si el ID del vehículo existe en la tabla de vehículos
                $queryCheckVehiculoID = $this->db_handler->prepare("SELECT COUNT(*) FROM vehiculos WHERE id_v = :id_v");
                $queryCheckVehiculoID->execute(array(':id_v' => $id_v));
                $vehiculoExists = $queryCheckVehiculoID->fetchColumn();
        
                if ($vehiculoExists) {
                    // Si el ID del vehículo existe, inserta la intervención
                    $queryInsertIntervencion = $this->db_handler->prepare("INSERT INTO intervencion (id_v, fecha, descripcion, precio) VALUES (:id_v, :fecha, :descripcion, :precio)");
                    $parametros = array(
                        ':id_v' => $id_v,
                        ':descripcion' => $descripcion,
                        ':fecha' => $fecha,
                        ':precio' => $precio
                    );
                    $queryInsertIntervencion->execute($parametros);
                    return $queryInsertIntervencion->rowCount();
                } else {
                    // Si el ID del vehículo no existe, retorna un error o falso
                    echo "El ID del vehículo no existe.";
                    return false;
                }
            } catch (PDOException $e) {
                echo "Error al insertar: " . $e->getMessage();
                return false;
            }
        }

        public function auth(){
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $dni = $_POST['dni'] ?? null;
                $password = $_POST['password'] ?? null;
            
                if ($dni && $password) {
                    try {
                        $query = $this->db_handler->prepare("SELECT * FROM users WHERE dni = :dni AND password = :password");
                        $query->execute([':dni' => $dni, ':password' => $password]);
                        $user = $query->fetch(PDO::FETCH_ASSOC);
            
                        if ($user) {
                            $_SESSION['user'] = $user;
                            echo json_encode(['success' => true]);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'DNI o contraseña incorrectos']);
                        }
                    } catch (PDOException $e) {
                        echo json_encode(['success' => false, 'message' => "Error al autenticar: " . $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            }
        }
    }

    // Conectar a la base de datos
    $db = db::conectar();

    // Insertar datos
    // echo $db->insert('11111111A', 'admin', 'admin', 'ROLE_ADMIN');
    // echo $db->insert('70265782T', 'ivan', 'ivan', 'ROLE_USER');
    // print_r($db->login('70265782T', 'ivan'));
    // echo $db->login('gonza', 'gonza');
    // echo $db->logout();
    // echo $db->insertVehiculos('11111111A', '1111AAA', 'BMW', 200000, 2010, 'Serie 5');
    // echo $db->insertIntervenciones(4, '2024-04-30', 'Cambio de aceite', 145.00);
    // echo $db->deleteVehiculo(3);
    // print_r($db->mostrarClientes());
    // print_r($db->mostrarCitas('70265782T'));
    // print_r($db->mostrarVehiculos('70265782T'));
    // print_r($db->mostrarVehiculos('11111111A'));
    // print_r($db->mostrarIntervenciones('70265782T'));
    // print_r($db->mostrarIntervenciones('11111111A'));
    // echo $db->prueba(17);
    // echo $db->verificarSesion();
    // echo $db->reservar('70265782T', '2024/05/15', '12:00:00');
?>
