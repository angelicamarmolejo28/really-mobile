<?php

class Db {

	public $conn;
	private $servername;
    private $username;
    private $password;

	function __construct() {
		$this->servername = "localhost";
		$this->username = "root";
        $this->password = "";
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password);

        // Check connection
        if ($this->conn->connect_error) {
			echo "it failed";
            die("Connection failed: " . $conn->connect_error);
		}
		$this->conn->select_db("really-mobile");
        // echo "Connected successfully";

	}
	function encontrarUsuario($tipo, $codigo){
		$sql = "SELECT * FROM users WHERE tipo='".$tipo."' AND codigo='".$codigo."'";
		$result = $this->conn->query($sql);
		$this->conn->close();
		if ($result->num_rows > 0) {
			$value = null;
			while($row = $result->fetch_assoc()) {
				$value = $row;
			}
			return $value;
		} else {
			return null;
		}
	}

	function crearUsuario($tipo, $codigo, $nombre){
		$sql = "INSERT INTO users (tipo, codigo, nombre) VALUES ('".$tipo."', ".$codigo.", '".$nombre."')";
		$result = $this->conn->query($sql);
		$this->conn->close();
		return $result;
	}

	function actualizarUsuario($id, $tipo, $codigo, $nombre){
		$sql = "UPDATE users SET tipo='".$tipo."', codigo=".$codigo.", nombre='".$nombre."' WHERE id=".$id;
		$result = $this->conn->query($sql);
		$this->conn->close();
		return $result;
	}

	function eliminarUsuario($id){
		$sql = "DELETE FROM users WHERE id=".$id;
		$result = $this->conn->query($sql);
		$this->conn->close();
		return $result;
	}
}
