document.addEventListener("DOMContentLoaded", () => {
    const btnAlerta = document.getElementById("btn-alerta");
    if (btnAlerta) {
        btnAlerta.addEventListener("click", () => {
            alert("Sintonizando Radio Cocoteo FM 104.9 en Vice City.");
        });
    }

    const formPedido = document.getElementById("form-pedido");
    const inputCancion = document.getElementById("input-cancion");
    const mensajeEnviado = document.getElementById("mensaje-enviado");

    if (formPedido && inputCancion && mensajeEnviado) {
        formPedido.addEventListener("submit", (e) => {
            e.preventDefault();
            mensajeEnviado.textContent = `Pedido registrado: "${inputCancion.value}".`;
            inputCancion.value = "";
        });
    }
});