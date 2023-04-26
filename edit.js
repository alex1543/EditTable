
let aSett = ['tBase', 'tServ', 'tPort', 'tLogin', 'tPassword', 'tLanguage', 'tTop'];
// установка порта по умолчанию.
tBase.addEventListener('change', function () {
	var aPorts = [3306,1433];
	tPort.value = aPorts[tBase.selectedIndex];
});
let aLangFile = ['pdo.php','mysqli.php','dbi.pl','python.py', 'ruby.rb'];
let aLangColor = ['php_bt','php_bt','perl_bt','python_bt','ruby_bt'];
let aLangColorTable = ['php','php','perl','python','ruby'];
// установка индикатора цвета справа от языка независимо ни от чего.
SetColorIndicator();
function SetColorIndicator() {
	var inxLang = tLanguage.selectedIndex;
	var lang_color = aLangColor[inxLang];

	tColor.classList = '';
	tColor.classList.add(lang_color);
}
tLanguage.addEventListener('change', function () {
	SetColorIndicator();
});
function GetLangFile() {
	return aLangFile[tLanguage.selectedIndex];
}

// одна фукция для получения списка баз данных и таблиц.
let iActBase=0;
function GetListHTML(oListNew, sRequest, fOut) {
	var iframe = document.createElement('iframe');
	oListNew.after(iframe);
	iframe.src = sRequest;
console.log(iframe.src);

	var innerDoc = iframe.contentDocument;
	
	var iLoadPos=0;
	LoadListBase();
	function LoadListBase() {
		setTimeout(() => {
			var innerDoc = iframe.contentDocument;
			if ((innerDoc != undefined) && (innerDoc.getElementById('iListStatus') != undefined)) {
				var iTableGet = innerDoc.getElementById('iTableGet');
				oListNew.innerHTML = iTableGet.innerHTML;
				iframe.remove();
				fOut();
			} else {

				if (iLoadPos >= 1500) {
					oListNew.innerHTML = 'Данные не были получены за отведенное время (5 сек.). Проверьте связь в локальной сети. Повторите попытку позже. Обратитесь к системному администратору.';
					iframe.remove();
				} else {
					iLoadPos++;
					LoadListBase();
				}
			}
		}, 1);	
	}
	
}
// подгрузка списка баз данных по кнопке Check.
tCheck.addEventListener('click', function () {
	var iListBaseHead = document.getElementById('iListBaseHead');
	iListBaseHead.style.display = 'block';
	iListBaseHead.innerHTML = 'Loading...';

	sRequest = './'+GetLangFile()+'?bases=yes&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
	GetListHTML(iListBaseHead, sRequest, GetListTable);
	
	function GetListTable() {
		var nBase = 0;
		var mBase = iListBaseHead.childNodes;
		for (var i = 0; i < mBase.length; ++i) {
			if (mBase[i].tagName == 'DIV') {
				nBase++;
				mBase[i].id = 'iBase'+nBase;
				mBase[i].onclick = function(i){
				return function() {
					iActBase = i+1;
					console.log(mBase[i].innerHTML);
					iListTableUL = document.getElementsByTagName('UL')[0];

					sRequest = './'+GetLangFile()+'?tables='+mBase[i].innerHTML+'&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
					GetListHTML(iListTableUL, sRequest, GetShowTables);

				}
				}(i);
			}
		
		}
	
	}
});

/*
function GetFreeID(sPref) {
	
		alert(document.getElementById(sPref+20));

	var lastID=0;
	for (var posID=0; document.getElementById(sPref+String(posID)) != null; ++posID) {
		console.log(document.getElementById(sPref+posID));
		lastID = posID;
	}
	alert(lastID);
	return lastID;
}
*/

let nBlock = 0;

// открытие таблиц справа.
function GetShowTables() {
	iListTableUL = document.getElementsByTagName('UL')[0];
	iListTableUL.innerHTML = '<li><a href="index.html">Settings</a></li><hr />' + iListTableUL.innerHTML;
console.log(iActBase);
	var mNav = document.getElementsByClassName('nav_point');
	for (var i = 0; i < mNav.length; ++i) {
		mNav[i].onclick = function(i, iActBase){
		return function() {
			var mBlock = document.getElementsByClassName('block');
			var artBlock = document.getElementsByClassName('block')[mBlock.length-1];
			var newDiv = document.createElement('div');
			newDiv.classList.add('point');
		//	nBlock = GetFreeID('block');
			console.log('Free is '+nBlock);
			newDiv.id = 'block'+nBlock;
			artBlock.after(newDiv);
				
			var actNav = document.getElementsByClassName('nav_point')[i];
			sTable = actNav.innerHTML;
			sBase = document.getElementById('iBase'+iActBase).innerHTML;
			newDiv.innerHTML = '<p id="tblHeader'+nBlock+'">'+tLanguage.value+': '+sBase+'.'+sTable+' (Loading...)</p>';

			sRequest = './'+GetLangFile()+'?rows='+sBase+'.'+sTable+'&base='+sBase+'&top='+tTop.value+'&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
			newDiv.innerHTML += '<table id="table'+nBlock+'">&nbsp;</table>';
			
			// жесткая привязка настроек к каждой таблице для UPDATE.
			var sSett = '<div class="dynamic">';
			sSett += '<div id="nmLangFile'+nBlock+'">'+GetLangFile()+'</div>';
			sSett += '<div id="nmBase'+nBlock+'">'+sBase+'</div>';
			sSett += '<div id="nmTable'+nBlock+'">'+sTable+'</div>';
			for (var iSett = 0; iSett < aSett.length; ++iSett) {
				oneSett = document.getElementById(aSett[iSett]).value;
				sSett += '<div id="'+aSett[iSett]+nBlock+'">'+oneSett+'</div>';
				
			}
			sSett += '</div>';
			
			newDiv.innerHTML += sSett;
			
			GetDyncArray(sRequest, nBlock);

			CloseButtonBlock(nBlock);
			newTable = document.getElementById('table'+nBlock);
			newTable.classList = '';
			var inxLang = tLanguage.selectedIndex;
			newTable.classList.add(aLangColorTable[inxLang]);
			
			nBlock++;
		}
		}(i, iActBase);
	}

}

function GetDyncArray(sRequest, iTable) {
	var timeIn = new Date();
	var iframe = document.createElement('iframe');
	document.getElementsByTagName('body')[0].after(iframe);
	iframe.src = sRequest;
	console.log(iframe.src);

	var innerDoc = iframe.contentDocument;
				
	var iLoadPos=0;
	LoadListBase();
	function LoadListBase() {
		setTimeout(() => {
			var innerDoc = iframe.contentDocument;
			if ((innerDoc != undefined) && (innerDoc.getElementById('iListStatus') != undefined)) {
				var newTable = document.getElementById('table'+iTable);
				newTable.innerHTML = innerDoc.getElementById('iTableGet').innerHTML;
				var iCountCols = innerDoc.getElementById('iCountCols').innerHTML;
				var iCountRows = innerDoc.getElementById('iCountRows').innerHTML;
				console.log(iCountCols+'x'+iCountRows);
				iframe.remove();

				for (const child of newTable.children[0].children[0].children) {
					if (~child.innerHTML.toLowerCase().indexOf("id")) {
						child.classList.add('id');
						console.log(child.innerHTML);
					}
				}
				
				function HtmlEncode(s) {
					var el = document.createElement("div");
					el.innerText = el.textContent = s;
					s = el.innerHTML;
					return s;
				}
				
				// перебор каждой ячейки в таблице на экране.
				for (var iRow = 1; iRow < newTable.children[0].children.length; ++iRow) {
					child = newTable.children[0].children[iRow];
					iCol = -1;
					for (const grandchild of child.children) {
						iCol++;
						grandchild.onclick = function(iTable, iRow, iCol){
						return function() {
							// ячейка может быть отредактирована.
							var newTable = document.getElementById('table'+iTable);
							var sValue = newTable.children[0].children[iRow].children[iCol].innerHTML;
							document.getElementsByTagName('textarea')[0].value = sValue;
							document.getElementsByClassName('WindowHidden')[0].style.display = 'block';
							//alert(iTable+'-'+iRow+'-'+iCol);

							tUpdate.onclick = function(iTable, iRow, iCol){
							return function() {
								var newTable = document.getElementById('table'+iTable);
								var sValue = document.getElementsByTagName('textarea')[0].value;

								// формирование строки для запроса.
								var sRqPlus = '&pmP='+newTable.children[0].children[0].children[iCol].innerHTML;
								sRqPlus += '&pmV='+sValue;
								for (var i = 0; i < newTable.children[0].children[0].children.length; ++i) {
									sRqPlus += '&pP'+i+'='+newTable.children[0].children[0].children[i].innerHTML;
									sRqPlus += '&pV'+i+'='+newTable.children[0].children[iRow].children[i].innerHTML;
								}
								//alert(sRqPlus);
								
								var updNmLangFile = document.getElementById('nmLangFile'+iTable).innerHTML;
								var updNmBase = document.getElementById('nmBase'+iTable).innerHTML;
								var updNmTable = document.getElementById('nmTable'+iTable).innerHTML;
								var updBase = document.getElementById(aSett[0]+iTable).innerHTML;
								var updServ = document.getElementById(aSett[1]+iTable).innerHTML;
								var updPort = document.getElementById(aSett[2]+iTable).innerHTML;
								var updLogin = document.getElementById(aSett[3]+iTable).innerHTML;
								var updPassword = document.getElementById(aSett[4]+iTable).innerHTML;

								sRequest = './'+updNmLangFile+'?update='+updNmBase+'.'+updNmTable+'&base='+updNmBase+'&type='+updBase+'&address='+updServ+'&port='+updPort+'&login='+updLogin+'&password='+updPassword+sRqPlus;
								var iframe = document.createElement('iframe');
								document.getElementsByTagName('body')[0].after(iframe);
								iframe.src = sRequest;

								// визуальное присваивание в таблице на экране.
								oCellEdit = newTable.children[0].children[iRow].children[iCol];
								oCellEdit.innerHTML = sValue;
								oCellEdit.classList.add('edit');
								document.getElementsByClassName('WindowHidden')[0].style.display = 'none';
								//alert(sValue);

							}
							}(iTable, iRow, iCol);
						
						}
						}(iTable, iRow, iCol);				
					//console.log(grandchild.innerHTML);
						grandchild.innerHTML = HtmlEncode(grandchild.innerHTML);
					}
				}
				
			//	iCountRows = newTable.children[0].children.length-1;
			//	iCountCols = newTable.children[0].children[0].children.length;
				oStr = document.getElementById('tblHeader'+iTable);
				
				var timeOut = new Date();
				var timeDiff = timeOut - timeIn;
				nwstr = oStr.innerHTML.replace(' (Loading...)', ' ('+iCountRows+'x'+iCountCols+', '+timeDiff+' ms.)');
				oStr.innerHTML = nwstr;
			//	alert(document.getElementById('tblHeader'+iTable).innerHTML);

				
			} else {
			if (iLoadPos >= 1500) {
				//	document.getElementById('table'+iTable).innerHTML = 'Данные не были получены за отведенное время (5 сек.). Проверьте связь в локальной сети. Повторите попытку позже. Обратитесь к системному администратору.';
					iframe.remove();
				} else {
					iLoadPos++;
					LoadListBase();
				}
			}
		}, 1);	
	}
}

// окно закроется, если кликнуть на любую область вокруг окна.
var iWindowHidden = document.getElementsByClassName('WindowHidden')[0];
iWindowHidden.addEventListener('click', function () {
	var iWindowUpdate = document.getElementsByClassName('WindowUpdate')[0];
	var iWindowHidden = document.getElementsByClassName('WindowHidden')[0];
	// проверка области окна.
	e = event || window.event;
	oRect = iWindowUpdate.getBoundingClientRect();
	if (((e.clientX-window.pageXOffset > oRect.left-window.pageXOffset) && (e.clientX-window.pageXOffset < oRect.left+oRect.width-window.pageXOffset)) &&
		((e.clientY-window.pageYOffset > oRect.top-window.pageYOffset) && (e.clientY-window.pageYOffset < oRect.top+oRect.height-window.pageYOffset))) return;

	iWindowHidden.style.display = 'none';
});

// кретик для закрытия таблицы.
function CloseButtonBlock(nTable) {
	oCanvas = document.createElement('canvas');
	document.getElementById('table'+nTable).before(oCanvas);
	oCanvas.innerHTML = '&nbsp;';
	oCanvas.title = 'Close';
	oCanvas.width = 25;
	oCanvas.height = 25;
	
	var ctx = oCanvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(5, 20);
	ctx.lineTo(20, 5);
	ctx.moveTo(5, 5);
	ctx.lineTo(20, 20);
	ctx.lineWidth = "2";
	ctx.strokeStyle = "#000";
	ctx.stroke();
	
	oCanvas.onclick = function(nTable){
	return function() {
		oTable = document.getElementById('block'+nTable);
		oTable.remove();
	}
	}(nTable);
	oCanvas.addEventListener('mouseover', function () {
		ctx.strokeStyle = "#fff";
		ctx.stroke();
	});
	oCanvas.addEventListener('mouseout', function () {
		ctx.strokeStyle = "#000";
		ctx.stroke();
	});
}

// доп. настройки.
document.querySelector('body').classList.add('noselect');
