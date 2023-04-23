#!C:\Ruby32-x64\bin\ruby.exe
puts "Content-type: text/html; charset=utf-8\n\n"
# обработка значений из формы.
require "cgi"
cgi = CGI.new
# создание един. объекта подключения.
require 'mysql2'
client = Mysql2::Client.new(
	:host     => cgi['address'],
	:port     => cgi['port'],
	:username => cgi['login'],
	:password => cgi['password'],
	:encoding => 'utf8'
	)

if cgi['tables'] != ''
	client.query('USE '+cgi['tables']);
end
if cgi['base'] != ''
	client.query('USE '+cgi['base']);
end
if cgi['update'] != ''
	sql = "UPDATE "+cgi['update']+" SET "+cgi['pmP']+"='"+cgi['pmV']+"' WHERE ";
	
	i=0;
	while cgi['pP'+i.to_s] != ''
		sql += cgi['pP'+i.to_s]+"= '"+cgi['pV'+i.to_s]+"' AND "
		i+=1
	end
	sql += "1=1";
puts sql
	
	client.query(sql);
end
# список баз на одном экз. сервера.
if cgi['bases'] != ''
	sOut = ''
	results = client.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA")
	results.each do |row|
	  sOut += '<div>'+row['SCHEMA_NAME'].to_s+'</div>'
	end
	sOut = "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>"+sOut+"</div><div id='iListStatus'>good</div></body></html>"
	puts sOut
end
# список таблиц.
if cgi['tables'] != ''
	puts "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>"
	results = client.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='"+cgi['tables']+"'")
	results.each do |row|
		print '<li><div class="nav_point">'+row['TABLE_NAME'].to_s+'</div></li>'
	end
	puts "</div><div id='iListStatus'>good</div></body></html>"
end
# список столбцов и строк.
if cgi['rows'] != ''
	puts "<!DOCTYPE html><html><head></head><body><div id='iTableGet'>"
	results = client.query("SHOW COLUMNS FROM "+cgi['rows'])
	puts "<table><tr>"
	iCountCols=0
	results.each do |row|
		iCountCols+=1
		print '<td>'+row['Field'].to_s+'</td>'
	end
	puts "</tr>"
	
	results = client.query("SELECT COUNT(*) AS Cnt FROM "+cgi['rows'])
	iCountRows=0
	results.each do |row|
	  iCountRows = row['Cnt'].to_i
	end	

	if iCountRows > 0
		results = client.query("SELECT * FROM "+cgi['rows']+" LIMIT "+cgi['top'])
		results.each_with_index {|val| "#{puts "<tr>"
			val.each_with_index {|val2| puts "<td>#{val2[1]}</td>"}
			puts "</tr>"
		}"}
	end
	
	puts "</table>"
	puts "</div><div id='iCountCols'>"+iCountCols.to_s+"</div>"
	puts "<div id='iCountRows'>"+iCountRows.to_s+"</div>"
	puts "<div id='iListStatus'>good</div></body></html>"
end