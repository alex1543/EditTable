<?php
// блок инициализации
if ($_GET['type'] == 'MySQL')
	@ $db = mysqli_connect($_GET['address'], $_GET['login'], $_GET['password'], '', $_GET['port']);
if (!$db) {
	echo "Ошибка: не удается соединиться с сервером.";
	exit;
}
mysqli_query($db, "SET NAMES utf8");

if (isset($_GET['tables']))
	mysqli_select_db($db, $_GET['tables']);

if (isset($_GET['base']))
	mysqli_select_db($db, $_GET['base']);

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
	$result = mysqli_query($db,$sql);

	die();
	
}

// список баз на одном экз. сервера.
if (isset($_GET['bases'])) {
	if ($_GET['type'] == 'MySQL')
		$sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA";
	
	$result = mysqli_query($db,$sql);
	if ($result) {
		$divBases = '';
		$num_results = mysqli_num_rows($result);
		for ($i = 0; $i < $num_results; ++$i) {
			$row = mysqli_fetch_array($result);
			$divBases .= '<div>'.$row[0].'</div>';
		}
		GetDOM($divBases);
		die();
	}
}

// список таблиц.
if (isset($_GET['tables'])) {
	if ($_GET['type'] == 'MySQL')
		$sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='".$_GET['tables']."'";

	$result = mysqli_query($db,$sql);
	if ($result) {
		$divTables = '';
		$num_results = mysqli_num_rows($result);
		for ($i = 0; $i < $num_results; ++$i) {
			$row = mysqli_fetch_array($result);
			$divTables .= '<li><div class="nav_point">'.$row[0].'</div></li>';
		}
		GetDOM($divTables);
		die();
	}
}


// список столбцов и строк.
if (isset($_GET['rows'])) {
	?><!DOCTYPE html><html><head></head><body><div id='iTableGet'><?php
	if ($_GET['type'] == 'MySQL')
		$sql_cols = "SHOW COLUMNS FROM ".$_GET['rows'];
	
	echo '<table><tr>';
	$result = mysqli_query($db,$sql_cols);
	if ($result) {
		$iCountCols = mysqli_num_rows($result);
		for ($i = 0; $i < $iCountCols; ++$i) {
			$row = mysqli_fetch_array($result);
			echo '<td>'.$row["Field"].'</td>';
		}
	}
	echo '</tr>';
	
	
	$result = mysqli_query($db,"SELECT COUNT(*) FROM ".$_GET['rows']);
	if ($result) {
		$row = mysqli_fetch_array($result);
		$iCountRows = $row[0];
	}


	if ($iCountRows > 0) {
		if ($_GET['type'] == 'MySQL')
			$sql = "SELECT * FROM ".$_GET['rows']." LIMIT ".$_GET['top'];

		$result = mysqli_query($db,$sql);
		if ($result) {
			for ($i = 0; $i < $iCountRows; ++$i) {
				echo '<tr>';
				$row = mysqli_fetch_array($result);
				for ($iCol = 0; $iCol < $iCountCols; ++$iCol) {
					if ($row[$iCol] != null) {
						echo '<td>'.$row[$iCol].'</td>';
					} else {
						echo '<td>NULL</td>';
					}					
				}
				echo '</tr>';
			}
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