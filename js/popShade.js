//弹窗遮罩类
/*  
	使用方法：只需引入popShade.js、popShade.css文件(test.html用于测试)
	          使用时只需配置defaultConfig对象，
	          创建实例对象var example = new PopAndShade(defaultConfig); //实例化
	          example.init(); //调用初始化配置函数
 */

window.onload = function() {
	//初始化配置
	var defaultConfig = {
		layerType: true, // true:全屏遮罩,false:局部遮罩
		oTarget: document.getElementById('openBtn'), //局部遮罩，需要遮罩的元素
		addWidth:300, //局部遮罩时，自定义遮罩相对于被遮元素多出的宽高
		addHeight:300,
		popup: { //自定义弹窗内容
			popContent:'是否重新开始游戏',
			popClose: '重新开始',
			popSend: '继续游戏'
		},
		animationWay: 'cOpacity' //控制遮罩和弹窗出现以及消失的动画效果，可选择cOpacity/cScale
	};
	//创建遮罩弹窗类
	function PopAndShade(option) {
		this.set = option; //自定义参数配置
		this.pop = null;//弹窗层
		this.shade = null;//遮罩层	
	}
	//通过原型给构造函数添加方法
	PopAndShade.prototype = {
		init: function() {
			this.createShade(); //初始化时创建遮罩
			this.createPop(); //初始化时创建弹窗
		},
		//全屏遮罩
		fullLayer: function() {
			this.shade.style.width = document.documentElement.clientWidth + 'px';
			this.shade.style.height = document.documentElement.clientHeight + 'px';
			document.body.appendChild(this.shade);
		},
		//局部遮罩
		partLayer: function(target) {
			/*layer.style.transition = 'all' + 50 + 's' + 'ease';*/
			this.shade.style.width = target.offsetWidth + this.set.addWidth + 'px';
			this.shade.style.height = target.offsetHeight + this.set.addHeight + 'px';
			// target.offsetWidth/2：target使用了translate向左和向上平移了宽高的一半
			// 但translate平移后offsetLeft、offsetTop未改变，所以需要减去平移的部分
			this.shade.style.left = target.offsetLeft - target.offsetWidth/2 - this.set.addWidth/2 + 'px';
			this.shade.style.top = target.offsetTop - target.offsetHeight/2 - this.set.addHeight/2 + 'px';	
			document.body.appendChild(this.shade);
		},
		//创建遮罩层
		createShade: function() {
			this.shade = document.createElement('div');
			this.shade.className = 'shade';
			// 判断遮罩类型是否为全屏遮罩
			if (this.set.layerType) {
				this.fullLayer();
			} else { //判断遮罩类型是否为局部遮罩
				this.partLayer(this.set.oTarget);
			}
		},
	
		//创建弹窗层(以及里面的元素)
		createPop: function() {
			var instance = this; //保存this指向的实例，避免this改变后引起的冲突
			this.pop = document.createElement('div');
			this.pop.className = 'pop';
			var closeBtn = document.createElement('span');
			var sendBtn = document.createElement('span');
			var content = document.createElement('p');
			content.innerHTML = this.set.popup.popContent;
			content.className = 'content';
			closeBtn.className = 'closeBtn';
			sendBtn.className = 'sendBtn';
			sendBtn.innerHTML = this.set.popup.popSend;
			closeBtn.innerHTML = this.set.popup.popClose;
			this.pop.appendChild(content);
			this.pop.appendChild(sendBtn);
			this.pop.appendChild(closeBtn);
			this.shade.appendChild(this.pop);
			sendBtn.addEventListener('touchstart', function(event){
				event.preventDefault();
				instance.closeAll();
			}, false);
			closeBtn.addEventListener('touchstart', function(event) {
				event.preventDefault();
				instance.closeAll();
			}, false);

		},
		//关闭弹窗和遮罩
		closeAll: function() {
			var instance = this;
			//关闭弹窗时遮罩和弹窗的消失效果
			if (this.set.animationWay == 'cOpacity') {
				this.shade.style.backgroundColor = 'rgba(0,0,0,1)';
				this.pop.style.backgroundColor = 'rgba(0,0,0,1)';
			} else if (this.set.animationWay == 'cScale') {
				this.shade.style.transform = 'scale(0,0)';
				this.pop.style.transform = 'scale(0,0)';
			}
			//延迟移除遮罩弹窗函数的时间，保证渐隐动画之后再移除遮罩和弹窗
			setTimeout(function() {
				document.body.removeChild(instance.shade);
			}, 300);
		}
	};	

	//触发弹窗遮罩操作
	function clickEvent() {
		var openBtn = document.getElementById('openBtn');
		openBtn.addEventListener('touchstart', function(event) {
			event.preventDefault(); //阻止touchstart的默认操作，比如后续触发click
			var example = new PopAndShade(defaultConfig); //实例化
			example.init(); //调用初始化配置函数
		}, false);
	}
	clickEvent();
};