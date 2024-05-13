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
        case 'edit':
            
            break;
        case 'delete':
            
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

        // Funciones de averias
        public function mostrarAverias($DNI){
            $parametros = array(':DNI' => $DNI);
            $pdo = $this->db_handler->prepare("SELECT averias.* 
            FROM averias
            JOIN clientes ON averias.DNI = clientes.DNI
            WHERE clientes.DNI = :DNI");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
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
            $pdo = $this->db_handler->prepare("SELECT * FROM citas WHERE DNI IN (SELECT DNI FROM clientes WHERE DNI = :DNI)");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
        }

        // Funciones de vehiculos
        public function mostrarVehiculos($DNI){
            $parametros = array(':DNI' => $DNI);
            $pdo = $this->db_handler->prepare("SELECT * FROM vehiculos WHERE DNI IN (SELECT DNI FROM clientes WHERE DNI = :DNI)");
            $pdo -> execute($parametros);
            $devolver = $pdo->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($devolver);
        }

        public function insertVehiculo($id_c, $matricula, $marca, $modelo, $kilometros, $anio){
            $parametros = array('id_c' => $id_c, ':matricula' => $matricula, ':marca' => $marca, ':modelo' => $modelo, ':kilometros' => $kilometros, ':anio' => $anio);
            $pdo = $this->db_handler->prepare("INSERT INTO vehiculos (id_c, matricula, marca, modelo, kilometros, anio) VALUES (:id_c, :matricula, :marca, :modelo, :kilometros, :anio)");

            try {
                $pdo->execute($parametros);
                return $pdo->rowCount();
            } catch (PDOException $e) {
                echo "Error al insertar: " . $e->getMessage();
                return false;
            }
        }

        public function deleteVehiculo($id_v){
            $parametros = array(":id_v"=>$id_v);
            $pdo = $this->db_handler->prepare("DELETE FROM vehiculos WHERE id_v = :id_v");
            $pdo->execute($parametros);
            return $pdo->rowcount();
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
    // echo $db->insertVehiculo(1, '2291GVC', 'BMW', 'Serie 1', 180000, 2010);
    // echo $db->deleteVehiculo(3);
    // print_r($db->mostrarClientes());
    // print_r($db->mostrarCitas('70265782T'));
    // print_r($db->mostrarVehiculos('70265782T'));
    // print_r($db->mostrarVehiculos('11111111A'));
    // print_r($db->mostrarIntervenciones('70265782T'));
    // print_r($db->mostrarIntervenciones('11111111A'));
    // echo $db->prueba(17);
    // echo $db->verificarSesion();
?>
