// initialilze config
var config = {
	bookmarksArr: [],
	url: '',
	settings: {
		dis_shortcut: false,
		new_tab_opened: false,
		target_new: true
	}
};

// fetch new settings
chrome.storage.sync.get({
    new_tab_opened: false,
    dis_shortcut: false,
    target_new: true
  }, function(items) {
  	console.log(items);
  	config.settings.dis_shortcut = items.dis_shortcut;
  	config.settings.new_tab_opened = items.new_tab_opened;
  	config.settings.target_new = items.target_new;
});


// update storage
chrome.storage.onChanged.addListener(function (changes) {
	for (var prop in changes) {
		config.settings[prop] = changes[prop].newValue
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	randomize();
});

// shortcut
chrome.commands.onCommand.addListener(function(command) {
	if (config.settings.dis_shortcut === false) {
		randomize();
	}
});

chrome.tabs.onCreated.addListener(function (tab) {
	if (config.settings.new_tab_opened === true && tab.url === 'chrome://newtab/') {
		// lazy trick
		chrome.bookmarks.getTree(function (bookmarks) {
			bookmarks.forEach(function (bookmark) {
				recursive(bookmark, config.bookmarksArr);	
			})
			config.url = config.bookmarksArr[getRandomInt(0, config.bookmarksArr.length - 1)].url;
			chrome.tabs.update(tab.id, { url: config.url });
		});
	}
})

function randomize (tabId) {
	chrome.bookmarks.getTree(function (bookmarks) {
		bookmarks.forEach(function (bookmark) {
			recursive(bookmark, config.bookmarksArr);	
		})
		config.url = config.bookmarksArr[getRandomInt(0, config.bookmarksArr.length - 1)].url;
		openTab(config.url, tabId);
	});
}

function openTab (url, tabId) {
	if (config.settings.target_new === true) {
		chrome.tabs.create({
			url: url,
			openerTabId: tabId
		});
	} else {
		chrome.tabs.update(tabId, { url: url });
	}
}

function recursive (src, dest) {
	if (!src.children) {
		return dest.push(src);
	} else {
		src.children.forEach(function (child) {
			recursive(child, dest);
		});
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}