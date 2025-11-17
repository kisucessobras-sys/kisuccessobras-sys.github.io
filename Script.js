/* script.js - Ki-Sucesso */

/* ---------- CARRINHO (localStorage) ---------- */
if (!localStorage.getItem("carrinho")) {
    localStorage.setItem("carrinho", JSON.stringify([]));
}

function adicionarCarrinho(nome, preco, img, qtd) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // valida qtd
    qtd = Number(qtd) || 1;
    if (qtd < 1) qtd = 1;

    // procura por nome (único identificador por enquanto)
    let item = carrinho.find(p => p.nome === nome);

    if (item) {
        item.qtd = Number(item.qtd) + qtd;
    } else {
        carrinho.push({
            nome: nome,
            preco: Number(preco),
            img: img,
            qtd: qtd
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    // feedback simples
    toast(`${qtd}x ${nome} adicionado ao carrinho`);
}

/* ---------- EVENTOS: botões "Adicionar" ---------- */
document.addEventListener("click", function (e) {
    // delegação: botão com classe add
    if (e.target && e.target.classList && e.target.classList.contains("add")) {
        const botao = e.target;
        const nome = botao.dataset.nome;
        const preco = Number(botao.dataset.preco.replace(",", "."));
        const img = botao.dataset.img || "";
        // pega input irmão dentro do produto (se existir)
        const container = botao.closest(".produto");
        let qtd = 1;
        if (container) {
            const input = container.querySelector("input[type='number']");
            if (input) qtd = Number(input.value) || 1;
        }
        adicionarCarrinho(nome, preco, img, qtd);
    }
});

/* ---------- TOAST SIMPLES ---------- */
function toast(msg, ms = 1400) {
    let el = document.createElement("div");
    el.textContent = msg;
    Object.assign(el.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        zIndex: 2000,
        fontSize: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
    });
    document.body.appendChild(el);
    setTimeout(() => el.style.opacity = "0.0", ms - 250);
    setTimeout(() => el.remove(), ms);
}

/* ---------- MENU LATERAL ---------- */
(function menuInit(){
    const btnMenu = document.getElementById("btnMenu");
    const btnClose = document.getElementById("btnClose");
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("backdrop");

    if (!btnMenu || !menu || !backdrop) return;

    btnMenu.addEventListener("click", () => {
        menu.classList.add("open");
        backdrop.classList.add("show");
    });

    btnClose && btnClose.addEventListener("click", () => {
        menu.classList.remove("open");
        backdrop.classList.remove("show");
    });

    backdrop.addEventListener("click", () => {
        menu.classList.remove("open");
        backdrop.classList.remove("show");
    });
})();

/* ---------- CARROSSEL SIMPLES ---------- */
(function carouselInit(){
    const wrapper = document.querySelector(".carousel-inner");
    if (!wrapper) return;
    const slides = Array.from(wrapper.children);
    let idx = 0;
    let width = wrapper.clientWidth;

    function goTo(i) {
        if (i < 0) i = slides.length - 1;
        if (i >= slides.length) i = 0;
        idx = i;
        const offset = slides[0].getBoundingClientRect().width + 12; // gap
        wrapper.style.transform = `translateX(-${i * offset}px)`;
        updateIndicators();
    }

    // create indicators
    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";
    slides.forEach((s, i) => {
        const b = document.createElement("button");
        b.addEventListener("click", () => goTo(i));
        indicators.appendChild(b);
    });
    wrapper.parentElement.appendChild(indicators);

    function updateIndicators(){
        Array.from(indicators.children).forEach((b, i) => {
            b.classList.toggle("active", i === idx);
        });
    }

    // autoplay
    let autoplay = setInterval(() => goTo(idx + 1), 3800);

    // pause on hover
    wrapper.parentElement.addEventListener("mouseenter", () => clearInterval(autoplay));
    wrapper.parentElement.addEventListener("mouseleave", () => {
        clearInterval(autoplay);
        autoplay = setInterval(() => goTo(idx + 1), 3800);
    });

    // init
    window.addEventListener("resize", () => {
        // reset transform (simple)
        wrapper.style.transform = `translateX(0px)`;
        idx = 0;
        updateIndicators();
    });
/* ---------- TOUCH / DESLIZE ---------- */
    let startX = 0;
    let isDown = false;

    wrapper.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDown = true;
    });

    wrapper.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        let diff = e.touches[0].clientX - startX;

        // se arrastou mais de 50px → troca slide
        if (Math.abs(diff) > 50) {
            if (diff < 0) goTo(idx + 1);   // arrastou para esquerda → próximo
            else goTo(idx - 1);           // arrastou para direita → anterior
            isDown = false; // evita troca múltipla
        }
    });

    wrapper.addEventListener("touchend", () => {
        isDown = false;
    });
    
document.addEventListener("click", function(e) {
    
    // Botão de aumentar quantidade
    if (e.target.classList.contains("btn-mais")) {
        let input = e.target.parentElement.querySelector(".qtd-input");
        input.value = Number(input.value) + 1;
    }

    // Botão de diminuir quantidade
    if (e.target.classList.contains("btn-menos")) {
        let input = e.target.parentElement.querySelector(".qtd-input");
        if (Number(input.value) > 1) {
            input.value = Number(input.value) - 1;
        }
    }

});
    goTo(0);
})();
