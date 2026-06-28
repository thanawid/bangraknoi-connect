(() => {
  "use strict";

  const data = window.BC_DATA;
  const W = data.meta.sceneSize.width;
  const H = data.meta.sceneSize.height;

  const els = {
    body: document.body,
    hotspotMap: document.getElementById("hotspotMap"),
    markerLayer: document.getElementById("markerLayer"),
    sceneTransform: document.getElementById("sceneTransform"),
    sceneStage: document.getElementById("sceneStage"),
    dockToggle: document.getElementById("dockToggle"),
    dockList: document.getElementById("dockList"),
    guide: document.getElementById("guide"),
    guideBubble: document.getElementById("guideBubble"),
    infoTray: document.getElementById("infoTray"),
    trayClose: document.getElementById("trayClose"),
    trayIcon: document.getElementById("trayIcon"),
    trayCategory: document.getElementById("trayCategory"),
    trayTitle: document.getElementById("trayTitle"),
    traySummary: document.getElementById("traySummary"),
    factList: document.getElementById("factList"),
    focusAgain: document.getElementById("focusAgain"),
    copyPlaceLink: document.getElementById("copyPlaceLink"),
    resetCity: document.getElementById("resetCity"),
    timeBadge: document.getElementById("timeBadge"),
    seasonBadge: document.getElementById("seasonBadge"),
    hint: document.getElementById("hint"),
    toast: document.getElementById("toast")
  };

  let activePlace = null;
  let toastTimer = null;

  function byId(id) {
    return data.places.find((place) => place.id === id) || null;
  }

  function createSvgEl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  function renderHotspots() {
    const fragment = document.createDocumentFragment();

    data.places.forEach((place) => {
      const polygon = createSvgEl("polygon");
      polygon.setAttribute("points", place.hotspot);
      polygon.setAttribute("class", "hotspot");
      polygon.setAttribute("data-place", place.id);
      polygon.setAttribute("tabindex", "0");
      polygon.setAttribute("role", "button");
      polygon.setAttribute("aria-label", `เปิดข้อมูล ${place.title}`);

      const title = createSvgEl("title");
      title.textContent = place.title;
      polygon.appendChild(title);

      polygon.addEventListener("click", () => selectPlace(place.id, { updateHash: true }));
      polygon.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPlace(place.id, { updateHash: true });
        }
      });
      fragment.appendChild(polygon);
    });

    els.hotspotMap.appendChild(fragment);
  }

  function renderMarkers() {
    const fragment = document.createDocumentFragment();

    data.places.forEach((place) => {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "marker";
      marker.dataset.place = place.id;
      marker.style.setProperty("--mx", `${(place.point[0] / W) * 100}%`);
      marker.style.setProperty("--my", `${(place.point[1] / H) * 100}%`);
      marker.setAttribute("aria-label", `ไปยัง ${place.title}`);

      const label = document.createElement("span");
      label.textContent = place.label;
      marker.appendChild(label);

      marker.addEventListener("click", () => selectPlace(place.id, { updateHash: true }));
      fragment.appendChild(marker);
    });

    els.markerLayer.appendChild(fragment);
  }

  function renderDock() {
    const fragment = document.createDocumentFragment();

    data.places.forEach((place) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "dock-item";
      item.dataset.place = place.id;
      item.textContent = place.label;
      item.addEventListener("click", () => {
        selectPlace(place.id, { updateHash: true });
        closeDockOnSmallScreen();
      });
      fragment.appendChild(item);
    });

    els.dockList.appendChild(fragment);
    els.dockList.hidden = true;
  }

  function setActiveVisuals(id) {
    document.querySelectorAll("[data-place]").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.place === id);
    });
  }

  function updateGuide(place) {
    els.guide.classList.add("is-compact");
    els.guideBubble.innerHTML = `<strong>${escapeHTML(place.label)}</strong><span>${escapeHTML(place.category)}</span>`;
  }

  function renderTray(place) {
    els.infoTray.hidden = false;
    els.trayIcon.src = place.icon;
    els.trayIcon.alt = `มาสคอตหมวด ${place.label}`;
    els.trayCategory.textContent = place.category;
    els.trayTitle.textContent = place.title;
    els.traySummary.textContent = place.summary;
    els.factList.innerHTML = "";

    place.facts.forEach((fact) => {
      const li = document.createElement("li");
      li.textContent = fact;
      els.factList.appendChild(li);
    });

    requestAnimationFrame(() => els.infoTray.classList.add("is-open"));
  }

  function focusCity(place) {
    const scale = clamp(place.view?.scale || 1.18, 1, 1.3);
    const x = place.view?.x ?? place.point[0];
    const y = place.view?.y ?? place.point[1];

    els.sceneTransform.style.setProperty("--origin-x", `${(x / W) * 100}%`);
    els.sceneTransform.style.setProperty("--origin-y", `${(y / H) * 100}%`);
    els.sceneTransform.style.setProperty("--scene-scale", String(scale));
  }

  function selectPlace(id, options = {}) {
    const place = byId(id);
    if (!place) return;

    activePlace = place;
    setActiveVisuals(place.id);
    renderTray(place);
    updateGuide(place);
    focusCity(place);
    els.hint.textContent = "ข้อมูลมาจาก data.js — เปลี่ยนข้อมูลตรงนั้น เมืองจะเปลี่ยนตาม";

    if (options.updateHash) {
      history.replaceState(null, "", `#${place.id}`);
    }
  }

  function resetCityView() {
    activePlace = null;
    setActiveVisuals("");
    els.sceneTransform.style.setProperty("--origin-x", "50%");
    els.sceneTransform.style.setProperty("--origin-y", "50%");
    els.sceneTransform.style.setProperty("--scene-scale", "1");
    history.replaceState(null, "", location.pathname + location.search);
    els.hint.textContent = "แตะอาคาร ป้าย หรือจุดเรืองแสง — เมืองจะเล่าเรื่องเอง";
  }

  function closeTray() {
    els.infoTray.classList.remove("is-open");
    window.setTimeout(() => {
      if (!els.infoTray.classList.contains("is-open")) {
        els.infoTray.hidden = true;
      }
    }, 430);
    resetCityView();
  }

  async function copyActiveLink() {
    if (!activePlace) return;
    const url = new URL(location.href);
    url.hash = activePlace.id;

    try {
      await navigator.clipboard.writeText(url.toString());
      showToast(`คัดลอกลิงก์ ${activePlace.label} แล้ว`);
    } catch (error) {
      showToast("คัดลอกอัตโนมัติไม่ได้ ลองคัดลอกจากแถบที่อยู่แทนครับ");
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-show");
    toastTimer = window.setTimeout(() => els.toast.classList.remove("is-show"), 2600);
  }

  function updateTimeSystem() {
    const hour = new Date().getHours();
    let phase = "day";
    let label = "กลางวัน · เมืองกำลังคึกคัก";

    if (hour >= 5 && hour < 10) {
      phase = "morning";
      label = "เช้า · เมืองเริ่มตื่น";
    } else if (hour >= 10 && hour < 16) {
      phase = "day";
      label = "กลางวัน · เมืองกำลังคึกคัก";
    } else if (hour >= 16 && hour < 19) {
      phase = "evening";
      label = "เย็น · แสงริมคลองกำลังสวย";
    } else {
      phase = "night";
      label = "กลางคืน · เมืองพัก แต่ข้อมูลยังเปิด";
    }

    els.body.dataset.time = phase;
    els.timeBadge.textContent = label;
  }

  function updateSeasonSystem() {
    const month = new Date().getMonth() + 1;
    const season = data.seasons.find((item) => item.months.includes(month));
    els.seasonBadge.textContent = season ? season.label : "ฤดูกาลชุมชน";
  }

  function openDock() {
    els.dockToggle.setAttribute("aria-expanded", "true");
    els.dockList.hidden = false;
  }

  function closeDock() {
    els.dockToggle.setAttribute("aria-expanded", "false");
    els.dockList.hidden = true;
  }

  function closeDockOnSmallScreen() {
    if (window.matchMedia("(max-width: 860px)").matches) closeDock();
  }

  function bindControls() {
    els.trayClose.addEventListener("click", closeTray);
    els.focusAgain.addEventListener("click", () => activePlace && focusCity(activePlace));
    els.copyPlaceLink.addEventListener("click", copyActiveLink);
    els.resetCity.addEventListener("click", resetCityView);

    els.dockToggle.addEventListener("click", () => {
      const isOpen = els.dockToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeDock() : openDock();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTray();
    });

    window.addEventListener("hashchange", () => {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      if (id) selectPlace(id, { updateHash: false });
    });
  }

  function selectInitialPlaceFromHash() {
    const id = decodeURIComponent(location.hash.replace("#", ""));
    if (id && byId(id)) {
      window.setTimeout(() => selectPlace(id, { updateHash: false }), 350);
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function init() {
    renderHotspots();
    renderMarkers();
    renderDock();
    bindControls();
    updateTimeSystem();
    updateSeasonSystem();
    selectInitialPlaceFromHash();
    window.setInterval(updateTimeSystem, 60_000);
  }

  init();
})();
