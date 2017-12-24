import tabs = browser.tabs;

function openTabWindow() {
  const tabAttrs = {
    active: true,
    url: "info.html",
  };

  tabs.create(tabAttrs);
}

window.onload = () => {
  const infoButton = document.getElementById("infoButton");
  infoButton.addEventListener("click", (e: Event) => {
    openTabWindow();
  });
};
