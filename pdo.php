<?php
// блок инициализации
try {
	if ($_GET['type'] == 'MySQL') {
		$pdoSet = new PDO('mysql:host='.$_GET['address'].';port:'.$_GET['port'], $_GET['login'], $_GET['password']);
		$pdoSet->query('SET NAMES utf8');
	}
	if ($_GET['type'] == 'MSSQL')
		$pdoSet = new PDO('odbc:DRIVER=FreeTDS;TDS_Version=8.0;SERVERNAME='.$_GET['address'].';PORT='.$_GET['port'].';UID='.$_GET['login'].';PWD='.$_GET['password'].';');

	
	if (isset($_GET['tables'])) {
		$pdoSet->query('USE '.$_GET['tables']);
	}
	if (isset($_GET['base'])) {
		$pdoSet->query('USE '.$_GET['base']);
	}
} catch (PDOException $e) {
	print "Error!: " . $e->getMessage() . "<br/>";
	die();
}

// обновление 1 ячейки в одной строке.
if (isset($_GET['update'])) {
	$sql = "UPDATE ".$_GET['update']." SET ".$_GET['pmP']."='".$_GET['pmV']."' WHERE ";
	
	for ($i = 0; isset($_GET['pP'.$i]); ++$i) {
		$spV = $_GET['pP'.$i]."= '".$_GET['pV'.$i]."'";
		if ($_GET['pV'.$i] == 'NULL') $spV = '('.$_GET['pP'.$i].' IS NULL OR '.$_GET['pP'.$i].'=\'\')';
		
		$sql .= $spV." AND ";
	}
	$sql .= "1=1";
	
	echo $sql;
	$stmt = $pdoSet->query($sql);

	die();
	
}

// список баз на одном экз. сервера.
if (isset($_GET['bases'])) {
	if ($_GET['type'] == 'MySQL')
		$sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA";
	if ($_GET['type'] == 'MSSQL')
		$sql = "EXEC sp_databases";
	
	$stmt = $pdoSet->query($sql);
	$resultMF = $stmt->fetchAll(PDO::FETCH_NUM);
	// перебор двухмерного массива [][] с числ. индексами.
	$divBases = '';	for ($i = 0; $i < Count($resultMF); ++$i) $divBases .= '<div>'.$resultMF[$i][0].'</div>';
	GetDOM($divBases);
	die();
}
// список таблиц.
if (isset($_GET['tables'])) {
	if ($_GET['type'] == 'MySQL')
		$sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='".$_GET['tables']."'";
	if ($_GET['type'] == 'MSSQL')
		$sql = "SELECT TABLE_SCHEMA+'.'+TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG='".$_GET['tables']."'";

	$stmt = $pdoSet->query($sql);
	$resultMF = $stmt->fetchAll(PDO::FETCH_NUM);
	// перебор двухмерного массива [][] с числ. индексами.
	$divTables = ''; for ($i = 0; $i < Count($resultMF); ++$i) $divTables .= '<li><div class="nav_point">'.$resultMF[$i][0].'</div></li>';
	GetDOM($divTables);
	die();
}
// список столбцов и строк.
if (isset($_GET['rows'])) {
	?><!DOCTYPE html><html><head></head><body><div id='iTableGet'><?php
	if ($_GET['type'] == 'MySQL')
		$sql_cols = "SHOW COLUMNS FROM ".$_GET['rows'];
	if ($_GET['type'] == 'MSSQL')
		$sql_cols = "SELECT COLUMN_NAME AS Field FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG+'.'+TABLE_SCHEMA+'.'+TABLE_NAME = '".$_GET['rows']."'";
	
	echo '<table><tr>';
	$stmt = $pdoSet->query($sql_cols);
	$resultMF = $stmt->fetchAll();
	for ($i = 0; $i < Count($resultMF); ++$i) echo '<td>'.$resultMF[$i]["Field"].'</td>';
	echo '</tr>';
	
	$iCountCols = Count($resultMF);
	$stmt = $pdoSet->query("SELECT COUNT(*) FROM ".$_GET['rows']);
	$resultMF = $stmt->fetchAll();
	$iCountRows = $resultMF[0][0];

	if ($iCountRows > 0) {
		if ($_GET['type'] == 'MySQL')
			$sql = "SELECT * FROM ".$_GET['rows']." LIMIT ".$_GET['top'];
		if ($_GET['type'] == 'MSSQL')
			$sql = "SELECT TOP ".$_GET['top']." * FROM ".$_GET['rows'];

		$stmt = $pdoSet->query($sql);
		// не все MSSQL поддерживают TOP.
		if ((!$stmt) && ($_GET['type'] == 'MSSQL'))
			$sql = "SELECT * FROM ".$_GET['rows'];

		$resultMF = $stmt->fetchAll(PDO::FETCH_NUM);
		// перебор двухмерного массива [][] с числ. индексами.
		for ($i = 0; $i < Count($resultMF); ++$i) {
			echo '<tr>';
			for ($iCol = 0; $iCol < Count($resultMF[$i]); ++$iCol) {
				if ($resultMF[$i][$iCol] != null) {
					echo '<td>'.$resultMF[$i][$iCol].'</td>';
				} else {
					echo '<td>NULL</td>';
				}
			}
			echo '</tr>';		
		}
	}
	echo '</table>';
	?></div><div id='iCountCols'><?php echo $iCountCols; ?></div>
	<div id='iCountRows'><?php echo $iCountRows; ?></div>
	<div id='iListStatus'>good</div></body></html><?php
}

function GetDOM($sInner) {
?><!DOCTYPE html><html><head></head><body><div id='iTableGet'><?php	echo $sInner;
?></div><div id='iListStatus'>good</div></body></html><?php
}