<?php
	if (!isset($_GET['name']) || !isset($_GET['score'])) {
		echo "Name or score not set!";
		exit;
	} else {
		$name = $_GET['name'];
		$score = $_GET['score'];
	}

	$hostname = 'db18.cpanelhosting.rs';
	$username = 'aven_santa';
	$password = 'Aven.021';
	$database = 'aven_secretsanta';
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

	$stmt = $mysqli->prepare('INSERT INTO scoreboard (Name, Score, Date) VALUES (?, ?, NOW());');
	$stmt->bind_param('ss', $name, $score);

	$stmt->execute();
	$result = $stmt->affected_rows;

	if ($result === 1) {
		echo 'success';
	}
?>
