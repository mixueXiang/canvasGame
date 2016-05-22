//main.js
/*
	包括游戏结束、游戏排名两个页面的js
 */
window.onload = function() {
	var regEnd = /gameEnd/,
	    regRank = /gameRank/;
	//取出当前游戏界面玩的时间(分数)
	var keepTime = localStorage.getItem('keepTimes'),
	    storageLen = localStorage.length;
	// scores用于存储localStorage中每条游戏时间的记录
	var scores = []; //[12.33,13.44,25.44,12.33]
	for (var i = 0; i < storageLen; i++) {
		var name = localStorage.key(i);
		//正则匹配localstorage对象中每条游戏时间的记录并保存在数组scores中
		var pattern = /gameTime/;
		if (pattern.test(name)) {
			scores.push(localStorage.getItem(name));
		}
	}
	/*scores = [12.33,13.44,14.464,15.889,14.464,12.33];*/
	//对数组以从大到小的顺序排序
	scores.sort(function(a,b){
			return b - a;
	    });
	//取出当前分数的排名
	function getRank(score) {
	    for (var m = 0; m < scores.length; m++) {
	    	if (scores[m] == score) {
	    		return m + 1;
	    	}
	    }
	}  
	//对scores数组进行去重处理
	function deleteRepeat() {
		var noRepeat = []; //保存去重后的数组
		var hash = {};
		for (var i = 0; i < scores.length; i++) {
			if (!hash[scores[i]]) {
				hash[scores[i]] = true;
				noRepeat.push(scores[i]);
			}
		}
		return noRepeat;
	}
	//判断是否是游戏结束页面
	if(regEnd.test(window.location.href)){
		var grade = document.getElementById('grade'),
			e_scoreRank = document.getElementById('rank');
		//将得到的当前玩的时间写入游戏结束页面
		grade.innerHTML = keepTime + '秒';
		e_scoreRank.innerHTML = '您当前的排名为：'+ getRank(keepTime);
	}
	//判断是否是游戏排名页面
	if(regRank.test(window.location.href)){
	    var r_scoreRank = document.getElementById('scoreRank'),
	        rankList = document.getElementById('rankInfo')
	    			   .getElementsByTagName('li'),
	        rankListLen = rankList.length;
	    // 将当前排名展示在游戏排名页面    
	    r_scoreRank.innerHTML = '您当前的排名为：'+ getRank(keepTime);

	    //iShowRank：去重后的每一条游戏分数记录
	    var iShowRank = deleteRepeat(); 
	    //遍历排行榜上的每一个列表，并将排名结果显示在列表中
	    for (var j = 0; j < rankListLen; j++) {
	    	var curentScore = iShowRank[j];
	        rankList[j].getElementsByClassName('score')[0].innerHTML = curentScore;
	        //将当前排名的列表高亮显示
	        rankList[getRank(keepTime)-1].style.backgroundColor = '#00FF00';
	    }

	}	
		
};
	
	