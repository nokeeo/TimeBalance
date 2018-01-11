import StatGenerator from "../shared/StatGenerator";
import TimeStore from "../shared/TimeStore";
import template from "./infoListItem.handlebars";

window.onload = () => {
  const infoList = document.getElementById("info-list");
  TimeStore.getData(null, (data) => {
    const siteStats = StatGenerator.getStatsForSites(data);
    infoList.innerHTML = template({
      sites: Object.keys(siteStats).sort(),
    });
  });
  infoList.innerHTML = template({});
};
