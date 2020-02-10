<?php
	$hostname = '169.254.0.2';
	$username = 'zaista_secretsanta';
	$password = 'Aven.021#';
	$database = 'zaista_secretsanta';
	/*
	$hostname = "localhost";
	$username = "root";
	$password = "";
	$database = "poker";
	*/

	$mysqli = new mysqli($hostname, $username, $password, $database);
	if ($mysqli->connect_error) {
		die("Connection failed: " . $mysqli->connect_error);
	}
	$mysqli->query("SET NAMES utf8");

	$stmt = $mysqli->prepare('SELECT Name, Score FROM scoreboard ORDER BY score DESC LIMIT 10');

	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {

		$scoreboard;
		while($row = $result->fetch_row()) {
			$scoreboard[] = $row;
		}
		echo json_encode($scoreboard);
	} else {
		echo "failed";
	}
?>
