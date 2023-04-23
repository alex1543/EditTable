#!perl
print "Content-type: text/html; charset=utf-8\n\n";
# обработка полученных параметров в строке GET.
if($ENV{'REQUEST_METHOD'} eq 'GET') {
	$query=$ENV{'QUERY_STRING'};
} elsif($ENV{'REQUEST_METHOD'} eq 'POST') {
	sysread(STDIN,$query,$ENV{'CONTENT_LENGTH'});
}
@pairs = split(/&/, $query);
foreach $pair (@pairs) {
    ($name, $value) = split(/=/, $pair);
    $value =~ tr/+/ /;
    $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex())/eg;
    $value =~ s/<!--(.| )*-->//g;
    $input{$name} = $value;
}

use DBI;
$dbh = DBI->connect("DBI:mysql::$input{'address'}:$input{'port'}",$input{'login'},$input{'password'});
$sth = $dbh->prepare("SET NAMES utf8");
$sth->execute;
	
if ($input{'update'} ne '') {
	my $sql = "UPDATE ".$input{'update'}." SET ".$input{'pmP'}."='".$input{'pmV'}."' WHERE ";
	
	for (my $i=0; $input{'pP'.$i} ne ""; ++$i) {
		my $spV = $input{'pP'.$i}."= '".$input{'pV'.$i}."'";
		if ($input{'pV'.$i} eq 'NULL') {$spV = '('.$input{'pP'.$i}.' IS NULL OR '.$input{'pV'.$i}.'=\'\')';}
		
		$sql .= $spV." AND ";
	}
	$sql .= "1=1";
	
	print $sql;
	$sth = $dbh->prepare($sql);
	$sth->execute;	
}

if ($input{'bases'} ne "") {
	print "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>";
	$sth = $dbh->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA");
	$sth->execute;
	while ($ref = $sth->fetchrow_arrayref) {
		print "<div>".$$ref[0]."</div>";
	}
	print "</div><div id='iListStatus'>good</div></body></html>";
}
if ($input{'tables'} ne "") {
	print "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>";
	$sth = $dbh->prepare("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='".$input{'tables'}."'");
	$sth->execute;
	while ($ref = $sth->fetchrow_arrayref) {
		print '<li><div class="nav_point">'.$$ref[0].'</div></li>';
	}
	print "</div><div id='iListStatus'>good</div></body></html>";
}

if ($input{'rows'} ne "") {
	print "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>";
	$sth = $dbh->prepare("SHOW COLUMNS FROM ".$input{'rows'});
	$sth->execute;
	print "<table><tr>";
	my $iCountCols=0;
	while ($ref = $sth->fetchrow_arrayref) {
		$iCountCols++;
		print "<td>".$$ref['Field']."</td>";
	}
	$sth = $dbh->prepare("SELECT COUNT(*) FROM ".$input{'rows'});
	$sth->execute;
	$ref = $sth->fetchrow_arrayref;
	my $iCountRows = $$ref[0];
	if ($iCountRows > 0) {
		$sth = $dbh->prepare("SELECT * FROM ".$input{'rows'}." LIMIT ".$input{'top'});
		$sth->execute;
		while ($ref = $sth->fetchrow_arrayref) {
			print "<tr>";
			for (my $i=0; $i < $iCountCols; $i++) {
				if (defined $$ref[$i] && $$ref[$i] ne '') {print "<td>".$$ref[$i]."</td>";} else
					{print "<td>NULL</td>";}
			}
			print "</tr>";
		}
	}
	print "</table>";
	print "</div><div id='iCountCols'>".$iCountCols."</div>";
	print "<div id='iCountRows'>".$iCountRows."</div>";
	print "<div id='iListStatus'>good</div></body></html>";
}

$sth->finish;
$dbh->disconnect;
