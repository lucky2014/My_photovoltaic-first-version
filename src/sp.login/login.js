define(function(require,exports,module){
	var $ = require("jquery");
	var setup = require("setup");
	$("#loginBtn").click(function(){
		var me = $(this);
		var userName = $("input[name=userName]").val();
		var passWord = $("input[name=passWord]").val();
		if(!userName){
			$(".msg").html("<em>*</em>请输入用户名！").show();
		}else if(!passWord){
			$(".msg").html("<em>*</em>请输入密码！").show();
		}

		//获取参数,然后请求
		var params = setup.getParams({
			account: userName,
			pwd: passWord
		});

		setup.commonAjax("login", params, function(msg){
			//console.log(JSON.stringify(msg,null,2));
			location.href = "index.html";
			/*
			{
			  "loginName": "kxu1",
			  "userId": 458,
			  "userName": "kxu1"
			}
			*/
			sessionStorage.setItem("userName", msg.userName);
			sessionStorage.setItem("userId", msg.userId);
		});
	});

	//输入框获得焦点
	$(".inputDiv input").focus(function(){
		$(".msg").text("").hide();
	});
});