const params = new URLSearchParams(window.location.search);
const gameKey = params.get("game") || "ml";
const game = gameData[gameKey];

const $ = (id) => document.getElementById(id);

const gameTitle = $("gameTitle");
const serverLabel = $("serverLabel");
const serverIdInput = $("serverId");
const serverSelect = $("serverSelect");

const userIdInput = $("userId");
const emailInput = $("email");
const waInput = $("wa");

const nominalList = $("nominalList");
const lanjutBtn = $("lanjutBtn");

const payNotice = $("payNotice");
let metodePembayaran = null;
let selectedItem = null;

if (!game) {
  gameTitle.textContent = "Game tidak ditemukan";
  lanjutBtn.disabled = true;
  throw new Error("Game key tidak valid: " + gameKey);
}

gameTitle.textContent = game.name;

function setupServerUI() {
  serverLabel.style.display = "none";
  serverIdInput.style.display = "none";
  serverSelect.style.display = "none";

  if (game.serverType === "id_number") {
    serverLabel.textContent = "Server ID";
    serverLabel.style.display = "block";
    serverIdInput.style.display = "block";
    serverIdInput.value = "";
  }

  if (game.serverType === "region_select") {
    serverLabel.textContent = "Server";
    serverLabel.style.display = "block";
    serverSelect.style.display = "block";
    serverSelect.innerHTML = `<option value="">Pilih Server</option>`;
    game.serverOptions.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      serverSelect.appendChild(o);
    });
  }
}

function renderNominal() {
  nominalList.innerHTML = "";
  game.items.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nominal-btn";
    btn.textContent = `${item.name} - Rp ${item.price.toLocaleString("id-ID")}`;
    btn.onclick = () => {
      selectedItem = item;
      document.querySelectorAll(".nominal-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      checkForm();
    };
    nominalList.appendChild(btn);
  });
}

function getServerValue() {
  if (game.serverType === "id_number") return serverIdInput.value.trim();
  if (game.serverType === "region_select") return serverSelect.value.trim();
  return "";
}

function isServerValid() {
  if (game.serverType === "none") return true;
  return getServerValue() !== "";
}

function showPayNotice(msg) {
  if (!payNotice) return;
  payNotice.textContent = msg;
  payNotice.style.display = "block";
  clearTimeout(showPayNotice._t);
  showPayNotice._t = setTimeout(() => payNotice.style.display = "none", 2500);
}

function setupPaymentButtons() {
  document.querySelectorAll(".pay-btn").forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.method !== "QRIS") {
        showPayNotice("Metode ini belum tersedia. Tunggu update selanjutnya.");
        return;
      }
      metodePembayaran = "QRIS";
      document.querySelectorAll(".pay-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      checkForm();
    };
  });
}

function checkForm() {
  lanjutBtn.disabled = !(
    userIdInput.value.trim() &&
    waInput.value.trim() &&
    selectedItem &&
    isServerValid() &&
    metodePembayaran
  );
}

[userIdInput, emailInput, waInput, serverIdInput].forEach(el => {
  if (el) el.addEventListener("input", checkForm);
});
if (serverSelect) serverSelect.addEventListener("change", checkForm);

lanjutBtn.onclick = () => {
  const order = {
    gameKey,
    game: game.name,
    userId: userIdInput.value.trim(),
    server: getServerValue(),
    item: selectedItem.name,
    price: selectedItem.price,
    email: emailInput.value.trim(),
    wa: waInput.value.trim(),
    method: metodePembayaran,
    time: new Date().toLocaleString("id-ID")
  };
  localStorage.setItem("currentOrder", JSON.stringify(order));
  location.href = "payment.html";
};

setupServerUI();
renderNominal();
setupPaymentButtons();
checkForm();