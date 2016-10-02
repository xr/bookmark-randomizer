// Saves options to chrome.storage
function save_options() {
  var new_tab_opened = document.getElementById('new_tab_opened').checked;
  var dis_shortcut = document.getElementById('dis_shortcut').checked;
  var target_new = document.getElementById('target_new').checked;
  chrome.storage.local.set({
    dis_shortcut: dis_shortcut,
    new_tab_opened: new_tab_opened,
    target_new: target_new
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'OK.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    new_tab_opened: false,
    dis_shortcut: false,
    target_new: true
  }, function(items) {
    document.getElementById('dis_shortcut').checked = items.dis_shortcut;
    document.getElementById('new_tab_opened').checked = items.new_tab_opened;
    document.getElementById('target_new').checked = items.target_new;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);


// i18

var shortcut = chrome.i18n.getMessage('shortcut');
var dis_shortcut_txt = chrome.i18n.getMessage('dis_shortcut_txt');
var target_new_txt = chrome.i18n.getMessage('target_new_txt');
var new_tab_opened_txt = chrome.i18n.getMessage('new_tab_opened_txt');
var feedback = chrome.i18n.getMessage('feedback');
var save = chrome.i18n.getMessage('save');

document.getElementById("shortcut").innerHTML = shortcut;
document.getElementById("dis_shortcut_txt").innerHTML = dis_shortcut_txt;
document.getElementById("target_new_txt").innerHTML = target_new_txt;
document.getElementById("new_tab_opened_txt").innerHTML = new_tab_opened_txt;
document.getElementById("feedback").innerHTML = feedback;
document.getElementById("save").innerHTML = save;
