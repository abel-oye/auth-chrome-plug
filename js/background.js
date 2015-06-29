var isAlpha = false,
	$window; 

function getDomainFromUrl(url){
	return url.match(/^(?:([A-Za-z]+):)?(\/{0,2})([0-9.\-A-Za-z]+)/)[3];
}
function checkForValidUrl(tabId, changeInfo, tab) {
	$window = tab;
	if(!/.ymatou.com|localhost|127.0.0.1/gi.test(getDomainFromUrl(tab.url))){
		chrome.browserAction.disable(tabId);
	}
	isAlpha = /\.alpha\.ymatou.com|localhost|127.0.0.1/.test(tab.url);
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
