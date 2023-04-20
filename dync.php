<?php
// блок инициализации
try {
	$pdoSet = new PDO('mysql:host='.$_GET['address'].';port:'.$_GET['port'], $_GET['login'], $_GET['password']);
	$pdoSet->query('SET NAMES utf8');
} catch (PDOException $e) {
	print "Error!: " . $e->getMessage() . "<br/>";
	die();
}
// динамическое получение значений из базы данных.
if (isset($_GET['bases'])) $sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA";
if (isset($_GET['tables'])) $sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='".$_GET['tables']."'";
if (isset($_GET['rows'])) {
	$sql_cols = "SHOW COLUMNS FROM ".$_GET['rows'];
	$sql = "SELECT * FROM ".$_GET['rows'];
}
?><!DOCTYPE html><html><head></head><body><div id='iTableGet'><?php
if (isset($_GET['rows'])) {
	echo '<table><tr>';
	$stmt = $pdoSet->query($sql_cols);
	$resultMF = $stmt->fetchAll();
	for ($i = 0; $i < Count($resultMF); ++$i) echo '<td>'.$resultMF[$i]["Field"].'</td>';
	echo '</tr>';
}
$stmt = $pdoSet->query($sql);
$resultMF = $stmt->fetchAll(PDO::FETCH_NUM);
// перебор двухмерного массива [][] с числ. индексами.
for ($i = 0; $i < Count($resultMF); ++$i) {
	if (isset($_GET['rows'])) echo '<tr>';
	for ($iCol = 0; $iCol < Count($resultMF[$i]); ++$iCol) {
		if (isset($_GET['bases'])) echo '<div>'.$resultMF[$i][$iCol].'</div>';
		if (isset($_GET['tables']))	echo '<li><div class="nav_point">'.$resultMF[$i][$iCol].'</div></li>';
		if (isset($_GET['rows'])) echo '<td>'.$resultMF[$i][$iCol].'</td>';
	}
	if (isset($_GET['rows'])) echo '</tr>';
}
if (isset($_GET['rows'])) echo '</table>';
?></div><div id='iListStatus'>good</div></body></html>