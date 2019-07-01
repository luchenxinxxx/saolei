// 1.点击开始游戏 在.box的盒子中动态生成一百个小格 -->100个div
// 2.leftclick 没有雷-->显示数字 （代表以当前小格为中心周围8个小格的雷数）
//                               数字为0 扩散（当前八个小格没有雷 
//                                            直到以任何周围八个小格为中心的周围格子数字不为0也就是有雷时停止）
//             有雷-->game over
//3.rightclick 【游戏界面取消右键默认事件】没有标记并且没有数字-->进行标记；有标记-->取消标记；有数字-->无效果
//             判断标记是否正确
var box = document.getElementById('box');
var start = document.getElementById('startBtn');
var textBox = document.getElementById('textBox');
var alertBox = document.getElementById('alertBox');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');

var minesNum;
var minesOver;
var games;
var minesIndex;
var minesMap = [];
var bombs;
var flags;
var startGameBool = true;
bindEvent();
//鼠标点击事件集中放在一起
function bindEvent() { 

	 // box.oncontextmenu = function(e) {
	 // 	return false;
	 // }
	 box.addEventListener('contextmenu',function(e) {
	 	e.preventDefault();
	 },false); //取消右键默认事件

    start.onclick = function() {
    	if (startGameBool) {
    		box.style.display='block';
            textBox.style.display='block';
            init();
            startGameBool = false;
    	}   
    }

    box.onmousedown = function(e) {
    	var event = e.target;  //通过事件委托机制获得游戏当前用户点击的小格
    	var btnNum = e.button;
    	if(e.which == 1) {
    		leftClick(event);
    	}else {
    		rightClick(event);
    	}
    }
    closeBtn.onclick = function() {
    	alertBox.style.display = 'none';
    	box.style.display = 'none';
    	textBox.style.display = 'none';
    	box.innerHTML = '';
    	startGameBool = true;
    } 
   
}

//生成100个小格 并且插入到box当中
//随机生成10个雷
function init() {
    minesNum = 10; //总共的雷数
    minesOver = 10; //游戏进行时 剩余的雷的数量
	for(var i=0; i<10; i++) {
		for(var j=0; j<10; j++) {
			var con = document.createElement('div'); //生成小格 div盒子
			con.classList.add('games');//classlist() 添加类名
			con.setAttribute('id' , i+'-'+j); //setAttribute() 添加id名
			box.appendChild(con);
			minesMap.push({mine : 0}) ;
		}
	} 
	games = document.getElementsByClassName('games');
	while(minesNum){
		minesIndex = Math.floor(Math.random()*100);
		if (minesMap[minesIndex].mine === 0) {
			minesMap[minesIndex].mine = 1;
	        games[minesIndex].classList.add('isLei');
	        minesNum --;
		}
	}
	
}

function leftClick(dom) {
   if(dom&&dom.classList.contains('isLei')) {
   	    bombs= document.getElementsByClassName('isLei');
   	    for(var i = 0; i < bombs.length;i ++ ){
   	    	bombs[i].classList.add('showLei');//把所有有雷的小格选出来 通过css样式显示雷
   	    }
   	    //延迟一会儿弹出游戏失败
   	    setTimeout(function(){
   	    	alertBox.style.display = 'block';
   	    	alertImg.style.backgroundImage = 'url(img/over.jpg)';
   	        alertImg.style.backgroundSize = '50% 50%';
   	    },2000)
   }else {//该小格没有雷
        var n = 0;
        var posArr = dom.getAttribute('id').split('-'); //获得该小格的位置 以判断他周围的校歌有没有雷 从而显示相应的数字
        var posX = +posArr[0];
        var posY = +posArr[1];
        dom.classList.add('num');//补充num的css样式
        for(var i = posX-1; i < posX+1;i ++) {
        	for(var j = posY-1; j < posY+1;j ++) {
        		var aroundBox = document.getElementById(i+'-'+j);
        		if (aroundBox&&aroundBox.classList.contains('isLei')) {
        			n++;
        		}
        	}
        }
        if (dom && !dom.classList.contains('flag')) {
        	dom.innerText = n;
	    }
        
        if (n === 0) {
        	for(var i = posX-1; i < posX+1;i ++) {
        	    for(var j = posY-1; j < posY+1;j ++) {
        		    var nearBox = document.getElementById(i+'-'+j);
        		    if (nearBox&&!nearBox.classList.contains('check')) {
        		    	nearBox.classList.add('check');
        		    	leftClick(nearBox);
        		    }
        		    
        		}
        	}
        }
   }
}

function rightClick(dom) {
	// flags = 9;
	if (dom.classList.contains('num')) {
		return;
	}
	dom.classList.add('flag');
	// flags --;
	if (dom.classList.contains('flag')&&dom.classList.contains('isLei')) {
		minesOver --;
	}
	score.innerText = minesOver;
	if (minesOver === 0) {
		alertBox.style.display = 'block';
		alertImg.style.backgroundImage = 'url(img/win.jpg)';
		alertImg.style.backgroundSize = '100% 100%';
	}
	// if (flags === 0 && !minesOver === 0) {
	// 	bombs= document.getElementsByClassName('isLei');
 //   	    for(var i = 0; i < bombs.length;i ++ ) {
 //   	    	bombs[i].classList.add('showLei');//把所有有雷的小格选出来 通过css样式显示雷
 //   	    }
 //   	    //延迟一会儿弹出游戏失败
 //   	    setTimeout(function() {
 //   	    	alertBox.style.display = 'block';
 //   	    	alertImg.style.backgroundImage = 'url(img/over.jpg)';
 //   	        alertImg.style.backgroundSize = '50% 50%';
 //   	    },2000)
 //   	}
}

