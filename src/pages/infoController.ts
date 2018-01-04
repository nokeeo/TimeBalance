import template from "./infoListItem.handlebars";
console.log(template({}));

window.onload = () => {
  const infoList = document.getElementById("info-list");
  infoList.innerHTML = template({});
};
