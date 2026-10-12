"use strict";

// Eventos y animaciones jQuery: filtro del menú con fadeIn/fadeOut.
jQuery(function ($) {
    // Plugin externo bxSlider 4.2.17, cargado después de jQuery.
    if ($(".bxslider").length && $.fn.bxSlider) {
        $(".bxslider").bxSlider({
            mode: "fade", speed: 350, auto: false, captions: true,
            adaptiveHeight: true, touchEnabled: false,
            nextText: "Siguiente", prevText: "Anterior",
            onSliderLoad: function (index) {
                $("#estado-slider").text("Imagen " + (index + 1) + " de 3 · Carrusel bxSlider");
            },
            onSlideAfter: function ($slide, oldIndex, newIndex) {
                $("#estado-slider").text("Imagen " + (newIndex + 1) + " de 3 · Carrusel bxSlider");
            }
        });
    }
    // Evento input y DOM con jQuery: contador del mensaje.
    $("#contacto-mensaje").on("input", function () {
        $("#contador-mensaje").text(this.value.length + " / 1000 caracteres");
        $("#contacto-resultado").empty();
    });

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