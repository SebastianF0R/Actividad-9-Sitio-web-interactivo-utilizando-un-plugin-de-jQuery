"use strict";

// Eventos y animaciones jQuery: filtro del menú con fadeIn/fadeOut.
jQuery(function ($) {
    $("[data-filter]").on("click", function () {
        const category = $(this).attr("data-filter");

        $("[data-filter]")
            .removeClass("selected")
            .attr("aria-pressed", "false");

        $(this)
            .addClass("selected")
            .attr("aria-pressed", "true");

        $(".card").each(function () {
            const show =
                category === "todos" ||
                $(this).attr("data-category") === category;

            $(this).stop(true, true);

            show
                ? $(this).fadeIn(180)
                : $(this).fadeOut(180);
        });
    });

    // Evento delegado y manipulación del DOM al agregar un platillo.
    $("#platillos").on("click", ".agregar", function () {
        const i = Number($(this).attr("data-index"));

        cart.set(
            i,
            Math.min(20, (cart.get(i) || 0) + 1)
        );

        renderCart();

        const button = $(this);

        button.text("Agregado ✓");

        setTimeout(
            () => button.text("Agregar a mi cálculo"),
            900
        );
    });

    // Acordeón con slideToggle y estado accesible sincronizado.
    $(".faq button").on("click", function () {
        const open = $(this).attr("aria-expanded") === "true";

        $(this).attr("aria-expanded", String(!open));

        const answer = $(this).next("div");

        if (answer.prop("hidden")) {
            answer
                .prop("hidden", false)
                .hide();
        }

        answer
            .stop(true, true)
            .slideToggle(220);
    });
});