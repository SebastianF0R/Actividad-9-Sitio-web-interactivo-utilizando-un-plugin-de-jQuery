"use strict";

// Preferencia de tema y navegación responsive con JavaScript nativo.
const themeButton = document.getElementById("tema");

function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);

    themeButton.textContent = dark ? "Tema claro" : "Tema oscuro";

    themeButton.setAttribute(
        "aria-label",
        dark ? "Activar tema claro" : "Activar tema oscuro"
    );
}

try {
    applyTheme(localStorage.getItem("brasa-theme") === "dark");
} catch (_) {
    applyTheme(false);
}

themeButton.addEventListener("click", () => {
    const dark = !document.body.classList.contains("dark");

    applyTheme(dark);

    try {
        localStorage.setItem("brasa-theme", dark ? "dark" : "light");
    } catch (_) {}
});

document.getElementById("abrir-menu").addEventListener("click", event => {
    const open = document
        .getElementById("navegacion")
        .classList.toggle("open");

    event.currentTarget.setAttribute("aria-expanded", String(open));
});

// Calculadora de consumo: cantidades, subtotal y propina opcional.
const dishes = [
    {
        name: "Ensalada mediterránea",
        price: 145,
        category: "entrada",
        desc: "Hojas verdes, tomate, aceitunas y queso feta."
    },
    {
        name: "Bruschettas",
        price: 110,
        category: "entrada",
        desc: "Pan tostado con tomate, albahaca y aceite de oliva."
    },
    {
        name: "Pizza margarita",
        price: 220,
        category: "principal",
        desc: "Salsa de tomate, mozzarella y albahaca fresca."
    },
    {
        name: "Pasta de la casa",
        price: 195,
        category: "principal",
        desc: "Fettuccine con salsa de tomate y parmesano."
    },
    {
        name: "Tiramisú",
        price: 115,
        category: "postre",
        desc: "Capas de café, mascarpone y cacao."
    },
    {
        name: "Panna cotta",
        price: 95,
        category: "postre",
        desc: "Postre cremoso con salsa de frutos rojos."
    }
];

const cart = new Map();
const dishContainer = document.getElementById("platillos");

if (dishContainer) {
    dishContainer.innerHTML = dishes
        .map((d, i) =>
            `<article class="card" data-category="${d.category}"><span class="category">${d.category}</span><h3>${d.name}</h3><p>${d.desc}</p><p class="price">$${d.price} MXN</p><button class="agregar" data-index="${i}">Agregar a mi cálculo</button></article>`
        )
        .join("");

    document
        .getElementById("propina")
        .addEventListener("change", updateTotal);

    document.getElementById("vaciar").addEventListener("click", () => {
        cart.clear();
        renderCart();
    });
}

function money(value) {
    return value.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

function renderCart() {
    const order = document.getElementById("pedido");

    order.innerHTML = cart.size
        ? [...cart]
            .map(([i, qty]) =>
                `<div class="order-row"><span>${dishes[i].name}</span><label for="cantidad-${i}">Cantidad</label><input id="cantidad-${i}" data-index="${i}" type="number" min="1" max="20" value="${qty}"><button data-remove="${i}" aria-label="Quitar ${dishes[i].name}">Quitar</button></div>`
            )
            .join("")
        : "<p>Aún no has agregado platillos.</p>";

    order.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {
            const qty = Math.min(
                20,
                Math.max(1, Math.trunc(Number(input.value) || 1))
            );

            input.value = qty;
            cart.set(Number(input.dataset.index), qty);

            updateTotal();
        });
    });

    order.querySelectorAll("[data-remove]").forEach(b => {
        b.addEventListener("click", () => {
            cart.delete(Number(b.dataset.remove));
            renderCart();
        });
    });

    updateTotal();
}

function updateTotal() {
    const subtotal = [...cart].reduce(
        (sum, [i, q]) => sum + dishes[i].price * q,
        0
    );

    const tip =
        subtotal * Number(document.getElementById("propina").value);

    document.getElementById("total").textContent =
        `Subtotal: ${money(subtotal)} · Propina: ${money(tip)} · Total: ${money(subtotal + tip)} MXN`;
}

// Validación del formulario: campos, correo, fecha futura,
// horario y tamaño de grupo.
const reservation = document.getElementById("reserva");

function localDate() {
    const d = new Date();

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

if (reservation) {
    document.getElementById("fecha").min = localDate();

    reservation.addEventListener("submit", event => {
        event.preventDefault();

        const result = document.getElementById("resultado");
        const data = new FormData(reservation);

        const name = data.get("nombre").trim();
        const email = data.get("correo").trim();
        const date = data.get("fecha");
        const guests = Number(data.get("personas"));
        const time = data.get("hora");

        let error = "";

        if (name.length < 3) {
            error = "Escribe tu nombre con al menos 3 caracteres.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error = "Escribe un correo electrónico válido.";
        } else if (!date || date < localDate()) {
            error = "Elige una fecha de hoy o posterior.";
        } else if (new Date(date + "T12:00:00").getDay() === 1) {
            error = "Los lunes estamos cerrados. Elige otro día.";
        } else if (new Date(date + "T" + time) <= new Date()) {
            error = "Elige un horario que aún no haya pasado.";
        } else if (
            !Number.isInteger(guests) ||
            guests < 1 ||
            guests > 12
        ) {
            error = "El número de personas debe ser un entero entre 1 y 12.";
        }

        result.className = error ? "error" : "success";

        result.textContent = error ||
            `Solicitud de demostración generada para ${name}: ${guests} personas, ${date} a las ${time}. Correo: ${email}. No se ha enviado ni confirmado una reservación real.`;
    });
}

// Galería ampliada accesible; Escape y botón Cerrar cierran el diálogo.
const viewer = document.getElementById("visor");

if (viewer) {
    document.querySelectorAll(".photo").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("pie-foto").textContent =
                button.querySelector("span").textContent;

            viewer.showModal();
        });
    });

    document
        .getElementById("cerrar-visor")
        .addEventListener("click", () => viewer.close());

    viewer.addEventListener("click", e => {
        if (e.target === viewer) {
            viewer.close();
        }
    });
}