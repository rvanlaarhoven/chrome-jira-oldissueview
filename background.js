/**
 * Only activate the icon on an issue detail view in Jira Cloud
 */
const displayToolbarIcon = () => {
  const rule = {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostSuffix: 'atlassian.net', pathPrefix: '/browse' },
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
  };

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
};

/**
 * Add or remove the oldIssueView query param
 */
const changeIssueView = (tab) => {
  if (tab.url.includes('?oldIssueView=true')) {
    chrome.tabs.update(tab.id, {
      url: tab.url.replace('?oldIssueView=true', '')
    });
  } else {
    chrome.tabs.update(tab.id, {
      url: `${tab.url}?oldIssueView=true`
    }, () => {
      // Triggering the page script requires a delay, since
      // Jira usually needs a while to load the issue view.
      setTimeout(() => {
        chrome.tabs.executeScript(null, {file: 'page.js'});
      }, 2000);
    });
  }
};

chrome.runtime.onInstalled.addListener(displayToolbarIcon);
chrome.pageAction.onClicked.addListener(changeIssueView);
