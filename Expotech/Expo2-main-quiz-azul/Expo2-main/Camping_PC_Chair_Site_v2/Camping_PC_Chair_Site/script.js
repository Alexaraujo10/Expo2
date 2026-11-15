const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

/* Checklist da página Dicas (salvo no navegador) */
const checks = document.querySelectorAll("#check input");
if (checks.length) {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem("cpc-check") || "[]"); } catch (e) {}
  const counter = document.getElementById("checkCount");
  const update = () => {
    counter.textContent = `${[...checks].filter((c) => c.checked).length} de ${checks.length} itens separados`;
    try { localStorage.setItem("cpc-check", JSON.stringify([...checks].map((c) => c.checked))); } catch (e) {}
  };
  checks.forEach((c, i) => { c.checked = !!saved[i]; c.addEventListener("change", update); });
  update();
}
