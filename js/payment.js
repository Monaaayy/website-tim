const order = JSON.parse(localStorage.getItem("currentOrder") || "null");

const orderBox = document.getElementById("orderBox");
const methodBadge = document.getElementById("methodBadge");
const countdownEl = document.getElementById("countdown");
const saveQrBtn = document.getElementById("saveQrBtn");
const refreshBtn = document.getElementById("refreshBtn");
const csBtn = document.getElementById("csBtn");

const CS_WA = "62895422945626";

if (csBtn) {
  csBtn.href = `https://wa.me/${CS_WA}?text=${encodeURIComponent("Halo CS, saya butuh bantuan transaksi TopUp In Aja.")}`;
}

if (!order) {
  orderBox.innerHTML = `<p style="color:#ffb3b3">Data pesanan tidak ditemukan. Balik ke beranda.</p>`;
  if (refreshBtn) refreshBtn.disabled = true;
  if (saveQrBtn) saveQrBtn.disabled = true;
} else {
  if (methodBadge) methodBadge.textContent = order.method || "-";

  if (order.method !== "QRIS") {
    orderBox.innerHTML = `
      <p style="color:#ffb3b3"><b>Metode ${order.method}</b> belum tersedia.</p>
      <p class="muted">Silakan kembali dan pilih metode <b>QRIS</b>.</p>
      <button class="btn btn-primary" onclick="location.href='game.html?game=${order.gameKey}'">Kembali</button>
    `;
    const qrImg = document.getElementById("qrImg");
    if (qrImg) qrImg.style.display = "none";
    if (saveQrBtn) saveQrBtn.style.display = "none";
    if (refreshBtn) refreshBtn.style.display = "none";
  } else {
    const serverText = order.server ? ` / ${order.server}` : "";
    orderBox.innerHTML = `
      <div class="row"><span>Game</span><b>${order.game}</b></div>
      <div class="row"><span>User ID</span><b>${order.userId}${serverText}</b></div>
      <div class="row"><span>Item</span><b>${order.item}</b></div>
      <div class="row"><span>Metode</span><b>${order.method}</b></div>
      <div class="row total"><span>Total</span><b>Rp ${Number(order.price).toLocaleString("id-ID")}</b></div>
    `;
  }
}

let sisaDetik = 5 * 60;

function renderCountdown() {
  const menit = String(Math.floor(sisaDetik / 60)).padStart(2, "0");
  const detik = String(sisaDetik % 60).padStart(2, "0");
  if (countdownEl) countdownEl.textContent = `${menit}:${detik}`;
}

renderCountdown();

const timer = setInterval(() => {
  if (!order || order.method !== "QRIS") return;

  if (sisaDetik <= 0) {
    clearInterval(timer);
    if (countdownEl) {
      countdownEl.textContent = "00:00";
      countdownEl.style.color = "#ffb3b3";
    }
    if (refreshBtn) refreshBtn.disabled = true;
    if (saveQrBtn) saveQrBtn.disabled = true;
    return;
  }

  sisaDetik--;
  renderCountdown();
}, 1000);

if (saveQrBtn) {
  saveQrBtn.addEventListener("click", () => {
    const img = document.getElementById("qrImg");
    if (!img) return;

    const a = document.createElement("a");
    a.href = img.src;
    a.download = "qris-topup-in-aja.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    const cur = JSON.parse(localStorage.getItem("currentOrder") || "null");
    if (!cur) return;
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.unshift({ ...cur, status: "PAID" });
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("lastPaidOrder", JSON.stringify({ ...cur, status: "PAID" }));
    localStorage.removeItem("currentOrder");

    location.href = "success.html";
  });
}