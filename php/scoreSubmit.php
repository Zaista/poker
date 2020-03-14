<?php

	if (!isset($_GET['name']) || !isset($_GET['score'])) {
		echo "Name or score not set!";
		exit;
	} else {
		$name = $_GET['name'];
		$score = $_GET['score'];
	}
	
	function connect($xml) {
	    // create connection
	    $mysqli = new mysqli($xml->database->hostname, $xml->database->username, $xml->database->password, $xml->database->database);
	    // check connection
	    if ($mysqli->connect_error) {
	        die("Connection failed: " . $mysqli->connect_error);
	    }
	    
	    // this will make sure cyrilic letters are displayed properly
	    $mysqli->query("SET NAMES utf8");
	    
	    return $mysqli;
	}
	
	function get_config($config) {
	    // load configuration file
	    $xml = simplexml_load_file($config) or die("Error: Cannot load configuration file");
	    return $xml;
	}
	
	$xml = get_config('private/config.xml');
	$mysqli = connect($xml);

	$stmt = $mysqli->prepare('INSERT INTO scoreboard (Name, Score, Date) VALUES (?, ?, NOW());');
	$stmt->bind_param('ss', $name, $score);

	$stmt->execute();
	$result = $stmt->affected_rows;

	if ($result === 1) {
		echo 'success';
	}
?>
