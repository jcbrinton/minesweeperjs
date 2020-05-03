//builds game board when start button is clicked
function buildGame(){

	 height = document.getElementById('input1').value;
	 width = document.getElementById('input2').value;
	 mines = document.getElementById('input3').value;
	
	//check for proper inputs in fields
	if(height>0 && width>0 && height * width > mines && mines > 0 && height%1==0 && width%1==0 && mines%1==0) {

		document.getElementsByTagName('form')[0].style.display='none';
		
		var m = document.getElementById('minesweeper');

		var s = document.createElement('div');
		s.id = "scoreboard";
		
		var t = document.createElement('table');
		t.setAttribute('oncontextmenu','return false');
		
		m.appendChild(s);
		m.appendChild(t);
		
		s.innerHTML = '<span>Score:</span><span id="score">0</span><span>Mines Left:</span><span id="minesleft">'+mines+'</span>';

		for(var i = 0 ;i<height ;i++ ){
		
			var tr = t.insertRow(i);

			for(var j = 0 ;j<width ;j++ ){
			
				var td = tr.insertCell(j)
				td.innerHTML = '<div class="untouched" id=row'+(i+1)+'col'+(j+1)+' onclick="openCell(this)" oncontextmenu="markFlag(this)"></div>';

			}
		}
	}
	
	else{
	
		alert('You must type in positive whole numbers only.')

	}
}

//plants the mines randomly once the first tile is clicked
function plantMines(ele){

	var arr = document.getElementsByTagName('td');

	for(var i = 0 ;i<mines ;i++ ){

		var b = Math.floor((Math.random() * arr.length));

		var cell = arr[b].getElementsByTagName('div')[0];

		if(cell.bomb!=true&&cell!=ele){
			cell.bomb = true;

			cell.innerHTML = '<div class="uncover" num="b" >b</div>';

		}
		else{
			i--;
		}


	}
	for(var i = 0 ;i<height ;i++ ){

		for(var j = 0 ;j<width ;j++ ){

			var cell = document.getElementById('row'+(i+1)+'col'+(j+1));

			if(cell != null){
				if(cell.bomb != true){

					var count = 0;
					for(var k = -1 ;k<2 ;k++ ){ 

						for(var l = -1 ;l<2 ;l++ ){ 
							 var neighbor = document.getElementById('row'+(i+1+k)+'col'+(j+1+l));
							if(neighbor != null){ 
								if(neighbor.bomb == true ){

 									count++;
 								}

							 }
						}
					
					if(count!=0){
						cell.innerHTML='<div class="uncover" num="'+count+'" >'+count+'</div>';
					}
					else{
						cell.innerHTML='<div class="uncover" num="'+count+'" ></div>';

					}
				}

			}

		}


	}
}

}

//function called every time a cell is clicked
function openCell(ele) {
	
	//for first cell in game run plantMines function
	if(ele.getElementsByClassName('uncover')[0]== null){
		plantMines(ele);
	}

	uncoverCell(ele);
	var neighborarr = new Array ();
	
	if(ele.bomb== true){
		gameEnd(false);
	}
	
	else{
	
		function expandCells(c){

			var cell = c.getElementsByClassName('uncover')[0];

			if(cell != null){
				var n = cell.getAttribute('num');
				if(n == '0'){

					var string = c.id ; 
						//regex to parse cell id
					var stringarr = string.match(/[a-zA-Z]+|[0-9]+/g);

					var i = parseInt(stringarr[1]);
					var j = parseInt(stringarr[3]);

					//2 for loops to go through each neighboring cell 
					for(var k = -1 ;k<2 ;k++ ){ 
						for(var l = -1 ;l<2 ;l++ ){ 
							var neighbor = document.getElementById('row'+(i+k)+'col'+(j+l));
  
 							if(neighbor != null && neighbor.className !="touched" && (k!=0 ||l!=0 )){
 							
 								uncoverCell(neighbor);
								
								var neighborN =ele.getElementsByClassName('uncover')[0];

								if(neighborN !=null && neighborN.getAttribute('num')=='0'){
									neighborarr.push(neighbor);

 								}
							 }
						 }
					}
				}
			}
		}
		
		expandCells(ele);

		for(var m = 0; m<neighborarr.length;m++){
			expandCells(neighborarr[m]);
		}
		var touched = document.getElementsByClassName('touched');
			document.getElementById('score').innerHTML = touched.length;
		
		var spacesleft = document.getElementsByClassName('untouched');
		
		if(spacesleft.length == mines){
				gameEnd(true);
			
		}	
		
	}
}

//presets for easy game
function easyGame() {
	document.getElementById('input1').value = 10 ;
	document.getElementById('input2').value = 10 ;
	document.getElementById('input3').value = 8 ;

}

//presets for med game
function mediumGame() {
	document.getElementById('input1').value = 15 ;
	document.getElementById('input2').value = 20 ;
	document.getElementById('input3').value = 30 ;

}

//presets for hard game
function hardGame() {
	document.getElementById('input1').value = 20 ;
	document.getElementById('input2').value = 30 ;
	document.getElementById('input3').value = 100 ;

}

//called when button to play again is selected to go back to menu
function playAgain() {
	document.getElementsByTagName('form')[0].style.display='initial';
	var m = document.getElementById('minesweeper');
	var e = document.getElementById('end');
	var t = document.getElementsByTagName('table')[0];
	var s = document.getElementById('scoreboard');

	m.removeChild(s);
	m.removeChild(t);
	m.removeChild(e);
	

}

//Marks bombs by right-clicking on tile

function markFlag(ele){

	var minesLeft = document.getElementById('minesleft').innerHTML;


	var name = ele.className;

		if(name == 'untouched flagged'){
			ele.className = 'untouched';
			minesLeft++;
		}
		if(minesLeft>0){
			if(name == 'untouched'){
				ele.className = 'untouched flagged';
				minesLeft--;
			}
		}
	document.getElementById('minesleft').innerHTML = minesLeft;
	

}

function uncoverCell(ele){
	if(ele.className=="untouched flagged"){
 							
 		var minesLeft = document.getElementById('minesleft').innerHTML;
 		minesLeft++;
		document.getElementById('minesleft').innerHTML = minesLeft;
 							
 	}
	ele.className = "touched";
	var element =ele.getElementsByClassName('uncover')[0];
	if(element!=null){
		element.style.display = 'inherit';
	}

}

function gameEnd(win){
	var d = document.createElement('div');
	d.id = 'end';
	if(win==true){
		d.innerHTML ="<div>Congratulations, You win!<button type='button' onclick='playAgain()'>Play Again?</button></div>"
	}
	else{
		d.innerHTML ="<div>Sorry, you lose.<button type='button' onclick='playAgain()'>Play Again?</button></div>"
	}
	var remaining = document.getElementsByClassName('untouched');
	for(var z=0 ;z<remaining.length;z++){
		var r =remaining[z].getElementsByClassName('uncover')[0];

		if(r.getAttribute('num')=='b'){
			remaining[z].innerHTML = 'b';

		}	
			
	var t = document.getElementsByTagName('table')[0];
	document.getElementById('minesweeper').insertBefore(d,t);
	}
}



