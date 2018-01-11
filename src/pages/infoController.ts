import TimeStore from "../shared/TimeStore";
import template from "./infoListItem.handlebars";

window.onload = () => {
  const infoList = document.getElementById("info-list");
  TimeStore.getData({
    startDate: new Date(2018, 0, 4),
    endDate: new Date(2018, 0, 7),
  }, (data) => {
    console.log(data);
  });
  infoList.innerHTML = template({});
};
