window.onload = function(){
	var oC = document.getElementById('c1'),
	    oGC = oC.getContext('2d'),
	    i = 0,
	    oImg = new Image();
	oImg.src = "./image/pet.png";
	var startTime = (new Date()).getTime(),
	    saveTime = document.getElementById('saveTime');
	//游戏进行过程中的记时
	function getTime() {
		var now = new Date();
		var gameTime = (now.getTime() - startTime)/1000;
		return gameTime;
	}
	setInterval(function() {
		saveTime.innerHTML = getTime();
	},100);

	oImg.onload = function(){
		
		setInterval( function(){
		oGC.clearRect(0,0,oC.width,oC.height);

		//小球经过的路径，非闭合外圆
		oGC.beginPath();
		oGC.arc(300,200,200,-90*Math.PI/180,180*Math.PI/180,false);
		oGC.stroke();

		//小球经过的路径，非闭合内圆
		oGC.beginPath();
		oGC.arc(250,200,150,180*Math.PI/180,360*Math.PI/180,false);
		oGC.stroke();
		
		//终点上的固定小圆
		oGC.beginPath();
		oGC.arc(400,200,20,0*Math.PI/180,360*Math.PI/180,false);
		oGC.stroke();

		//产生运动的黑球
		for(i = 0; i < ball.length; i++){
			oGC.beginPath();
			oGC.moveTo(ball[i].x,ball[i].y);
			oGC.arc(ball[i].x,ball[i].y,20,0*Math.PI/180,360*Math.PI/180,false);
			oGC.fill();
		}
			//translate每次平移之后会累加，通过save()，restore()将它保存在独立的空间，相当于局部变量
			oGC.save();
			oGC.translate(300,200);
			oGC.rotate(iRotate);
			//让中间的萌宠围绕中心点旋转
			oGC.translate(-40,-40);
			//将萌宠图片添加进canvas画布里
			oGC.drawImage(oImg,0,0);
			oGC.restore();
			//创建子弹
			for(var i = 0;i < bullet.length; i++){
			oGC.save();
			oGC.fillStyle = 'red';
			oGC.beginPath();
			oGC.moveTo(bullet[i].x,bullet[i].y);
			oGC.arc(bullet[i].x,bullet[i].y,20,0*Math.PI/180,360*Math.PI/180,false);
			oGC.fill();
			oGC.restore();
		}
			
	},1000/60);

	//让产生的小球沿着圆的路径做圆周运动
	setInterval(function(){
			for(var i = 0; i < ball.length; i++){
			ball[i].num++;
			//当小球运动到270度时，改变路径（从大圆转到小圆）
			if(ball[i].num == 270){
					ball[i].r = 150;
					ball[i].startX = 250;
					ball[i].startY = 50;
				}
			//当小球到达终点时，游戏结束并跳转到结束页面	
			if(ball[i].num == 270+180){
				//timeStamp定义时间戳用于存储每一个时间记录
				var timeStamp = (new Date()).getTime();
				var keeptimes = getTime();
				//用localstorage来存储玩的时间
				localStorage.setItem('gameTime'+ timeStamp, keeptimes);
				localStorage.setItem('keepTimes',keeptimes);
				window.location.href = './gameEnd.html';
			}
			//小球运动过程的坐标		
			ball[i].x = ball[i].r*Math.sin(ball[i].num*Math.PI/180) + ball[i].startX;
			ball[i].y = ball[i].r - ball[i].r*Math.cos(ball[i].num * Math.PI/180) + ball[i].startY;}
			//子弹运动过程的坐标
			for(var i = 0; i < bullet.length; i++){
			bullet[i].x = bullet[i].x + bullet[i].sX;
			bullet[i].y = bullet[i].y + bullet[i].sY;
		}
		//碰撞成功即删除发生碰撞的两个小球
		for(var i = 0; i<bullet.length; i++){
			for(var j = 0;j < ball.length; j++){
				if( pz(bullet[i].x,bullet[i].y,ball[j].x,ball[j].y) ){
					bullet.splice(i,1);
					ball.splice(j,1);
					break;
				}
			}
		}
		},30);
	
	var ball = [];
	//每隔350毫秒就向ball数组添加一个小球
	//实现路径起点连续产生小球功能
	setInterval(function(){
			ball.push({
				x : 300, //小球在运动过程中的坐标x
				y : 0, // 小球在运动过程中的坐标y
				r : 200, //小球围绕圆的半径
				num : 0, //通过num的自增控制小球运动过程中的角度
				startX : 300, //初始坐标x
				startY : 0}); //初始坐标y
		},350);
		
	var iRotate = 0;
	
	oC.onmousemove = function(ev){
		var ev = ev || window.event;
		//取得鼠标相对于画布的坐标
		var x = ev.clientX - oC.offsetLeft;
		var y = ev.clientY - oC.offsetTop;
		
		var a = x - 300;
		var b = y - 200;
		
		var c = Math.sqrt(a*a + b*b);
		//判断鼠标位于中央图片的哪个方向，得到旋转的弧度
		if(a > 0 && b > 0){
			iRotate = Math.asin(b/c) + 90*Math.PI/180;
		}
		else if(a > 0){
			iRotate = Math.asin(a/c);
		}
		
		if(a < 0 && b > 0){
			iRotate = -(Math.asin(b/c) + 90*Math.PI/180);
		}
		else if(a < 0){
			iRotate = Math.asin(a/c);
		}
		
	};
	
	var bullet = [];
	//按下鼠标即发射鼠标方向的子弹
	oC.onmousedown = function(ev){
		var ev = ev || window.event;
		
		var x = ev.clientX - oC.offsetLeft;
		var y = ev.clientY - oC.offsetTop;
		
		var a = x - 300;
		var b = y - 200;
		
		var c = Math.sqrt(a*a + b*b);
		
		var speed = 5;
		
		var sX = speed * a/c;
		var sY = speed * b/c;
		
		bullet.push({
			x : 300,
			y : 200,
			sX : sX,
			sY : sY
		});
		
	};
	
};
//小球与子弹的碰撞检测
function pz(x1,y1,x2,y2){
	
	var a = x1 - x2;
	var b = y1 - y2;
	
	var c = Math.sqrt(a*a + b*b);
	
	if(c < 40){
		return true;
	}
	else{
		return false;
	}
	
};
};