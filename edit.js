
// установка порта по умолчанию.
tBase.addEventListener('change', function () {
	var aPorts = [3306,1433];
	tPort.value = aPorts[tBase.selectedIndex];
});
// установка индикатора цвета справа от языка независимо ни от чего.
SetColorIndicator();
function SetColorIndicator() {
	var lang_color = '';
	var inxLang = tLanguage.selectedIndex;
	if (inxLang <= 1) lang_color = 'php_bt';
	if (inxLang == 2) lang_color = 'perl_bt';
	if (inxLang == 3) lang_color = 'python_bt';

	tColor.classList = '';
	tColor.classList.add(lang_color);
}
tLanguage.addEventListener('change', function () {
	SetColorIndicator();
});

// подгрузка списка баз данных по кнопке Check.
tCheck.addEventListener('click', function () {

	var iListBaseHead = document.getElementById('iListBaseHead');
	iListBaseHead.style.display = 'block';
	iListBaseHead.innerHTML = 'Loading...';

	var iframe = document.createElement('iframe');
	iListBaseHead.after(iframe);
	iframe.src = './dync.php?bases&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
console.log(iframe.src);

	var innerDoc = iframe.contentDocument;
	
	var iLoadPos=0;
	LoadListBase();
	function LoadListBase() {
		setTimeout(() => {
			var innerDoc = iframe.contentDocument;
			if ((innerDoc != undefined) && (innerDoc.getElementById('iListStatus') != undefined)) {
				var iTableGet = innerDoc.getElementById('iTableGet');
				iListBaseHead.innerHTML = iTableGet.innerHTML;
				iframe.remove();
				GetListTable();
			} else {

				if (iLoadPos >= 1500) {
					iListBaseHead.innerHTML = 'Данные не были получены за отведенное время (5 сек.). Проверьте связь в локальной сети. Повторите попытку позже. Обратитесь к системному администратору.';
					iframe.remove();
				} else {
					iLoadPos++;
					LoadListBase();
				}
			}
		}, 1);	
	}
	
	
	function GetListTable() {
		var nBase = 0;
		var mBase = iListBaseHead.childNodes;
		for (var i = 0; i < mBase.length; ++i) {
			if (mBase[i].tagName == 'DIV') {
				nBase++;
				mBase[i].id = 'iBase'+nBase;
				mBase[i].onclick = function(i){
				return function() {
				console.log(mBase[i].innerHTML);
				iListTableUL = document.getElementsByTagName('UL')[0];
				iListTableUL.innerHTML = '<li><a href="index.html">Settings</a></li><hr />';

				var iframe = document.createElement('iframe');
				iListTableUL.after(iframe);
				iframe.src = './dync.php?tables='+mBase[i].innerHTML+'&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
				console.log(iframe.src);

				var innerDoc = iframe.contentDocument;
				
				var iLoadPos=0;
				LoadListBase();
				function LoadListBase() {
					setTimeout(() => {
						var innerDoc = iframe.contentDocument;
						if ((innerDoc != undefined) && (innerDoc.getElementById('iListStatus') != undefined)) {
							var iTableGet = innerDoc.getElementById('iTableGet');
							iListTableUL.innerHTML += iTableGet.innerHTML;
							iframe.remove();
							GetShowTables(i+1);
				//
						} else {

							if (iLoadPos >= 1500) {
							//	iListTableUL.innerHTML += 'Данные не были получены за отведенное время (5 сек.). Проверьте связь в локальной сети. Повторите попытку позже. Обратитесь к системному администратору.';
								iframe.remove();
							} else {
								iLoadPos++;
								LoadListBase();
							}
						}
					}, 1);	
				}
	
	//

				}
				}(i);
			}
		
		}
	
	}
});


// открытие таблиц справа.
function GetShowTables(iActBase) {
console.log(iActBase);
	let nBlock = 0;
	var mNav = document.getElementsByClassName('nav_point');
	for (var i = 0; i < mNav.length; ++i) {
		mNav[i].onclick = function(i, iActBase){
		return function() {
			var mBlock = document.getElementsByClassName('block');
			var artBlock = document.getElementsByClassName('block')[mBlock.length-1];
			var newDiv = document.createElement('div');
			newDiv.classList.add('point');
			newDiv.id = 'block'+nBlock;
			artBlock.after(newDiv);
				
			var actNav = document.getElementsByClassName('nav_point')[i];
			sTable = actNav.innerHTML;
			sBase = document.getElementById('iBase'+iActBase).innerHTML;

			newDiv.innerHTML = '<p id="tblHeader'+nBlock+'">'+tLanguage.value+': '+sBase+'.'+sTable+' (Loading...)</p>';
	
////	

	sRequest = './dync.php?rows='+sBase+'.'+sTable+'&base='+sBase+'&top='+tTop.value+'&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value;
	newDiv.innerHTML += '<table id="table'+nBlock+'">&nbsp;</table>';
	GetDyncArray(sRequest, nBlock);
////

			CloseButtonBlock(nBlock);
			newTable = document.getElementById('table'+nBlock);
			newTable.classList = '';
			var inxLang = tLanguage.selectedIndex;
			if (inxLang <= 1) newTable.classList.add('php');
			if (inxLang == 2) newTable.classList.add('perl');
			if (inxLang == 3) newTable.classList.add('python');
			
			
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
				var iRow = -1;
				for (const child of newTable.children[0].children) {
					iRow++;
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

								sRequest = './dync.php?update='+sBase+'.'+sTable+'&base='+sBase+'&type='+tBase.value+'&address='+tServ.value+'&port='+tPort.value+'&login='+tLogin.value+'&password='+tPassword.value+sRqPlus;
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
				
				cRows = newTable.children[0].children.length-1;
				cCols = newTable.children[0].children[0].children.length;
				oStr = document.getElementById('tblHeader'+iTable);
				
				var timeOut = new Date();
				var timeDiff = timeOut - timeIn;
				nwstr = oStr.innerHTML.replace(' (Loading...)', ' ('+cRows+'x'+cCols+', '+timeDiff+' ms.)');
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
