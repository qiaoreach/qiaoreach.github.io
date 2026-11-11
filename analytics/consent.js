/*!
 * First-party analytics consent for qiaoreach.github.io.
 * localStorage only. No cookies. No third-party code.
 * /analytics/umami.js is inserted only after an explicit accept.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "qiaoreach.analytics-consent";
  var ACCEPTED = "accepted";
  var DECLINED = "declined";

  function readChoice() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function writeChoice(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {}
  }

  function loadTracker() {
    if (document.querySelector('script[src="/analytics/umami.js"]')) return;
    var script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-website-id", "213c8997-db75-4355-b258-dd3afd8083a5");
    script.setAttribute("data-host-url", "https://gateway.umami.is");
    script.setAttribute("data-domains", "qiaoreach.github.io");
    script.src = "/analytics/umami.js";
    document.body.appendChild(script);
  }

  function hideBanner() {
    var banner = document.getElementById("analytics-banner");
    if (banner) banner.remove();
    document.body.classList.remove("has-analytics-banner");
  }

  function showBanner() {
    if (document.getElementById("analytics-banner")) return;

    var banner = document.createElement("div");
    banner.id = "analytics-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "analytics-banner-title");

    var title = document.createElement("p");
    var titleText = document.createElement("strong");
    title.id = "analytics-banner-title";
    titleText.textContent = "访问统计 / Analytics";
    title.appendChild(titleText);

    var zh = document.createElement("p");
    zh.textContent = "本站默认不进行访问统计。只有您同意后，统计才会发往中国大陆以外（欧盟）的服务器。不同意不影响浏览。";

    var en = document.createElement("p");
    en.textContent = "This site does not collect analytics unless you agree. If you accept, statistics are sent to servers outside mainland China (EU). Declining does not affect browsing.";

    var more = document.createElement("p");
    var link = document.createElement("a");
    link.href = "privacy.html";
    link.textContent = "访问统计说明 / Analytics notice";
    more.appendChild(link);

    var actions = document.createElement("div");
    actions.className = "analytics-actions";

    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "accept";
    accept.textContent = "同意统计 / Accept analytics";

    var decline = document.createElement("button");
    decline.type = "button";
    decline.className = "decline";
    decline.textContent = "不同意 / Decline";

    accept.addEventListener("click", function () {
      writeChoice(ACCEPTED);
      localStorage.removeItem("umami.disabled");
      hideBanner();
      loadTracker();
    });

    decline.addEventListener("click", function () {
      writeChoice(DECLINED);
      localStorage.setItem("umami.disabled", "1");
      var existing = document.querySelector('script[src="/analytics/umami.js"]');
      if (existing) existing.remove();
      hideBanner();
    });

    actions.appendChild(accept);
    actions.appendChild(decline);
    banner.appendChild(title);
    banner.appendChild(zh);
    banner.appendChild(en);
    banner.appendChild(more);
    banner.appendChild(actions);
    document.body.classList.add("has-analytics-banner");
    document.body.appendChild(banner);
  }

  document.addEventListener("click", function (event) {
    var node = event.target && event.target.closest
      ? event.target.closest("[data-analytics-settings]")
      : null;
    if (!node) return;
    event.preventDefault();
    showBanner();
  });

  if (readChoice() === ACCEPTED) loadTracker();
  else if (readChoice() !== DECLINED) showBanner();
})();
