import TimeStore from "../shared/TimeStore";
import template from "./infoListItem.handlebars";
console.log(template({}));

const timeStore = new TimeStore();

window.onload = () => {
  const infoList = document.getElementById("info-list");
  infoList.innerHTML = template({});
};
