const orderList = document.getElementById("orderList");
const emptyText = document.getElementById("emptyText");
const clearBtn = document.getElementById("clearOrders");

function rupiah(n){
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(n);
}

function loadOrders(){
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  orderList.innerHTML = "";

  if(orders.length === 0){
    emptyText.style.display = "block";
    return;
  }

  emptyText.style.display = "none";

  orders.forEach(o => {
    const card = document.createElement("div");
    card.className = "order-card";

    const serverText = o.server ? ` (${o.server})` : "";

    card.innerHTML = `
      <div class="order-top">
        <div>
          <div class="order-title">${o.game} - ${o.item}</div>
          <div class="order-meta">${o.time}</div>
        </div>
        <div class="order-title">${rupiah(o.price)}</div>
      </div>

      <div class="order-row">
        <span class="chip">User ID: ${o.userId}${serverText}</span>
        <span class="chip">Metode: ${o.method}</span>
        <span class="chip">WA: ${o.wa}</span>
        ${o.email ? `<span class="chip">Email: ${o.email}</span>` : ""}
        <span class="chip">Status: ${o.status || "PAID"}</span>
      </div>
    `;

    orderList.appendChild(card);
  });
}

if(clearBtn){
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("orders");
    loadOrders();
  });
}

loadOrders();