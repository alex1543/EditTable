#!c:/Users/днс/AppData/Local/Programs/Python/Python38/python.exe
print("Content-type: text/html; charset=utf-8\n\n")
# разбор параметров GET.
import os
query_string = os.environ['QUERY_STRING']
if query_string is not None:
    import urllib.parse
    d = urllib.parse.parse_qs(query_string)
    address = d.get('address', [''])[0]
    port = d.get('port', [''])[0]
    login = d.get('login', [''])[0]
    password = d.get('password', [''])[0]
    isGetBases = d.get('bases', [''])[0]
    base = d.get('tables', [''])[0]
    rows = d.get('rows', [''])[0]
    top = d.get('top', [''])[0]
    update = d.get('update', [''])[0]
    
    # параметры для ред. ячейки.
    pmP = d.get('pmP', [''])[0]
    pmV = d.get('pmV', [''])[0]
    pP = []
    pV = []
    i=0
    while d.get('pP'+str(i), [''])[0] != '':
        s = d.get('pP'+str(i), [''])[0]
        pP.append(s)
        s = d.get('pV'+str(i), [''])[0]
        pV.append(s)
        i+=1
    
# работа с базой данных.
import mysql.connector
myconn = mysql.connector.connect(host = address, port = port, user = login, passwd = password, db = '', charset='cp1251', use_unicode = True)
cur = myconn.cursor()
cur.execute("SET NAMES utf8")
cur.execute("USE test")

# обновление одной ячейки.
if update != '':
    try:
        sql="UPDATE "+update+" SET "+pmP+"='"+pmV+"' WHERE ";

        i=0 
        while i<len(pP):
            sql += pP[i]+"='"+pV[i]+"' AND "
            i+=1
        sql += "1=1"
        print(sql)
        
        cur.execute(sql)
        myconn.commit()
    except: 
        myconn.rollback() 
# список баз данных на 1 экз. сервера.
if isGetBases != '':
    try:
        sOut="<!DOCTYPE html><html><head></head><body><div id='iTableGet'>"
        cur.execute("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA")
        result = cur.fetchall()
        for line in result:
            for cell in line:
                sOut+='<div>'+str(cell)+'</div>'
        print(sOut+"</div><div id='iListStatus'>good</div></body></html>")
    except: 
        myconn.rollback() 
# список таблиц.
if base != '':
    try:
        print("<!DOCTYPE html><html><head></head><body><div id='iTableGet'>")
        cur.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='"+base+"'")
        result = cur.fetchall()
        for line in result:
            for cell in line:
                print('<li><div class="nav_point">'+str(cell)+'</div></li>')
        print("</div><div id='iListStatus'>good</div></body></html>")
    except: 
        myconn.rollback() 
# список столбцов и строк.
if rows != '':
    try:
        print("<!DOCTYPE html><html><head></head><body><div id='iTableGet'>")
        cur.execute("SHOW COLUMNS FROM "+rows)
        print("<table><tr>")
        iCountCols=0
        result = cur.fetchall()
        for line in result:
            iCountCols+=1
            print('<td>'+str(line[0])+'</td>')
        print("</tr>")
        
        cur.execute("SELECT COUNT(*) AS Cnt FROM "+rows)
        iCountRows=0
        result = cur.fetchall()
        for line in result:
            iCountRows = int(line[0])

        if iCountRows > 0:
            cur.execute("SELECT * FROM "+rows+" LIMIT "+top)
            result = cur.fetchall()
            for line in result:
                print('<tr>')
                for cell in line:
                    print('<td>'+str(cell)+'</td>')
                print('<tr>')

        print("</table>")
        print("</div><div id='iCountCols'>"+str(iCountCols)+"</div>")
        print("<div id='iCountRows'>"+str(iCountRows)+"</div>")
        print("<div id='iListStatus'>good</div></body></html>")
    except:
        myconn.rollback()
myconn.close()