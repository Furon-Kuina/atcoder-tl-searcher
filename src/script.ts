const timeRange: number = 2;
const showLiveTweet: boolean = true;

const listIDs: string[] = [
  "1265268852528566273",
  "1265268943393943554",
  "1265269023278690304",
  "1265269077888479235",
  "1265269135493099526",
  "1265269191877124101",
  "1265269251641761793",
  "1265269317169340417",
];

const iconPaths: string[] = [
  "icon/red.svg",
  "icon/orange.svg",
  "icon/yellow.svg",
  "icon/blue.svg",
  "icon/cyan.svg",
  "icon/green.svg",
  "icon/brown.svg",
  "icon/gray.svg",
];

const colors: string[] = [
  " Red",
  " Orange",
  " Yellow",
  " Blue",
  " Cyan",
  " Green",
  " Brown",
  " Gray",
];

const contestFinishTime = new Date(
  document.getElementsByTagName("time")[1].textContent
);

const searchRangeStart = (): string => {
  const searchRangeStart = contestFinishTime;
  const startDate: string = searchRangeStart.toLocaleDateString("jp-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const startYear = startDate.slice(0, 4);
  const startMonth = startDate.slice(5, 7);
  const startDay = startDate.slice(8, 10);
  let startTime: string = searchRangeStart
    .toLocaleTimeString("jp-JP")
    .replace(":", "%3A");
  return `%20since%3A${startYear}-${startMonth}-${startDay}_${startTime}_JST`;
};

const searchRangeEnd = (): string => {
  const searchRangeEnd = contestFinishTime;
  searchRangeEnd.setHours(searchRangeEnd.getHours() + timeRange);
  const endDate: string = searchRangeEnd.toLocaleDateString("jp-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  let endTime: string = searchRangeEnd
    .toLocaleTimeString("jp-JP")
    .replace(":", "%3A");

  const endYear = endDate.slice(0, 4);
  const endMonth = endDate.slice(5, 7);
  const endDay = endDate.slice(8, 10);

  return `%20until%3A${endYear}-${endMonth}-${endDay}_${endTime}_JST`;
};

// Generate URLs to AtCoder TL
const generateURLs = (): string[] => {
  const queryString =
    searchRangeStart() +
    searchRangeEnd() +
    "&typed_query" +
    (showLiveTweet ? "&f=live" : "");
  const listURLs: string[] = listIDs.map((listID) => {
    return `https://twitter.com/search?q=list%3A${listID}${queryString}`;
  });

  return listURLs;
};

const generateLinkElements = (): HTMLElement => {
  const links = document.createElement("li");
  const listURLs = generateURLs();
  for (let i = 0; i < 8; ++i) {
    const link = document.createElement("a");
    link.href = listURLs[i];

    const colorIcon = document.createElement("img");
    colorIcon.src = chrome.runtime.getURL(iconPaths[i]);

    links.append(link);
    link.append(colorIcon);
    link.append(document.createTextNode(colors[i]));
  }
  return links;
};

// Add "AtCoderTL" Tab to the nav bar
window.addEventListener("load", () => {
  const tab = document.getElementsByClassName("nav nav-tabs");
  const linksToTL = generateLinkElements();

  const menu = document.createElement("ul");
  menu.className = "dropdown-menu";
  menu.append(linksToTL);

  const twitterIcon = document.createElement("img");
  twitterIcon.src = chrome.runtime.getURL("icon/twitter.svg");

  const dropDownMenu = document.createElement("a");
  const caret = document.createElement("span");
  caret.className = "caret";

  // Configure dropdown menu
  dropDownMenu.append(twitterIcon);
  dropDownMenu.append(document.createTextNode(" AtCoder TL"));
  dropDownMenu.append(caret);
  dropDownMenu.className = "dropdown-toggle";
  dropDownMenu.setAttribute("data-toggle", "dropdown");
  dropDownMenu.setAttribute("role", "button");
  dropDownMenu.setAttribute("aria-haspopup", "true");
  dropDownMenu.setAttribute("aria-expanded", "false");
  dropDownMenu.href = "#";

  const newTab = document.createElement("li");
  newTab.append(menu);
  newTab.append(dropDownMenu);

  // Insert the dropdown menu to the end of navbar
  let lastChild = tab[0].getElementsByClassName("pull-right");
  tab[0].insertBefore(newTab, lastChild[0]);
});
