import StatGenerator from "../shared/StatGenerator";
import TimeStore from "../shared/TimeStore";
import template from "./infoListItem.handlebars";

const SELECTED_CLASS_NAME = "info-list-selected";
const LIST_ID = "info-list";

let selectedListItem: Element = null;

function addClass(el: Element, className: string) {
  if (el.className !== "" && el.className !== null) {
    const classNames = el.className.split(" ");
    if (classNames.indexOf(className) === -1) {
      classNames.push(className);
      el.className = classNames.join(" ");
    }
  }
  else {
    el.className = className;
  }
}

function removeClass(el: Element, className: string) {
  const classNames = el.className.split(" ");
  const classIndex = className.indexOf(className);
  if (classIndex !== -1) {
    classNames.splice(classIndex, 1);
    el.className = classNames.join(" ");
  }
}

function hasClass(el: Element, className: string) {
  return el.className.split(" ").indexOf(className) !== -1;
}

function infoListItemClicked(event: Event) {
  const element = event.target as Element;
  addClass(element, SELECTED_CLASS_NAME);

  if (selectedListItem !== null) {
    removeClass(selectedListItem, SELECTED_CLASS_NAME);
  }
  selectedListItem = element;
}

function addListEventListeners() {
  const listElements = document.getElementById("info-list").getElementsByTagName("li");
  console.log(document.getElementById(LIST_ID));
  for (const el of listElements) {
    el.addEventListener("click", infoListItemClicked);
  }
}

window.onload = () => {
  const infoList = document.getElementById("info-list");
  TimeStore.getData(null, (data) => {
    const siteStats = StatGenerator.getStatsForSites(data);
    infoList.innerHTML = template({
      sites: Object.keys(siteStats).sort(),
    });
    addListEventListeners();
  });
};
