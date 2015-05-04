/**
 * 初始化 注册ymtapptools
 */
function initTools(){

	window.ymtappTools = {
		//解析url成对象
		parseUrl: function(str) {
			var arr, 
				part,
				url = {};
			if(!(str||"").replace(/^\s+|\s+$/,"")){
				return {};
			}
			arr = str.substring(1, str.length).split('&');
			for (var i in arr) {
				part = arr[i].split('=');
				url[part[0]] = part[1];
			}
			return url;
		}
	}
}
/**
 * 在当前tab执行脚本
 * @param  {strig} code  需要执行的代码
 */
function tabsExecute(code,param){
	param = param || "";
	chrome.tabs.executeScript(null,{code:"("+String(code)+")("+param+")"});
}

//去tab中注册方法
tabsExecute(initTools.toString());

$("#login").click(function(){
	var data = {};
	data.UserName = $("[name=Username]").val();
	data.Password = $("[name=Password]").val();
	$.ajax({
		url:'http://api.alpha.ymatou.com/api/User/LoginAuth',
		method:'post',
		data:data,
		contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		success:function(data){
			if(data.Code == 200){
				tabsExecute(function(data){
					var search = window.location.search,
						parseUrl = function(str) {
							var arr, 
								part,
								url = {};
							if(!(str||"").replace(/^\s+|\s+$/,"")){
								return {};
							}
							arr = str.substring(1, str.length).split('&');
							for (var i in arr) {
								part = arr[i].split('=');
								url[part[0]] = part[1];
							}
							return url;
						};
					var obj = parseUrl(search);
					obj.UserId = data.UserId;
					obj.AccessToken = data.AccessToken;
					var queryStr="?";
					for(var i in obj){
						queryStr += (i+"="+obj[i]+"&");
					}
					window.location.search = queryStr.substring(1,queryStr.length-1);
				},JSON.stringify(data.Data))
				//window.close();
			}else{
				alert(data.Msg)
			}
		}

	})
});

$("#logout").click(function(){	
	tabsExecute(function(){
		//window.location.href = 'http://'+window.location.host+'/forYmatouApp/updateLogin?UserId=nil&AccessToken=nil';

		document.createElement('img').src='http://'+window.location.host+'/forYmatouApp/updateLogin?UserId=nil&AccessToken=nil';
		var search = window.location.search,
			parseUrl = function(str) {
				var arr, 
					part,
					url = {};
				if(!(str||"").replace(/^\s+|\s+$/,"")){
					return {};
				}
				arr = str.substring(1, str.length).split('&');
				for (var i in arr) {
					part = arr[i].split('=');
					url[part[0]] = part[1];
				}
				return url;
			};
		var obj = parseUrl(search);
		delete obj.UserId;
		delete obj.AccessToken;
		var queryStr="?";
		for(var i in obj){
			queryStr += (i+"="+obj[i]+"&");
		}
		window.location.search = queryStr.substring(1,queryStr.length-1);
	})
})

$(".jump").click(function(){
	var me = $(this),
		path = me.attr("data-path");
	tabsExecute((function(path){
		var host = window.location.host;
		window.location.href= "http://"+host+"/forYmatouApp/"+path;
	}),"\""+path+"\"");	
})

var data = chrome.extension.getBackgroundPage();
data.sendMessage()