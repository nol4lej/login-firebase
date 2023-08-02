import { Main } from "../views/Main/Main.js";
import { Panel } from "../views/Panel.js";

export const Router = () => {
    const path = window.location.pathname
    const root = document.getElementById("root")

    switch (path) {
        case "/":
            root.innerHTML = Main()
            break;
        case "/panel":
            root.innerHTML = Panel()
            break;
        default:
            break;
    }
}

// Esta funcion se encarga de actualizar la URL. Recibe la URL desde el boton presionado en el navbar (components/nav/nav.js)
export const handleUrl = (url) => {
    // Primer param: 'state' - es un objeto que representa el estado asociado con la nueva entrada en el historial
    // Segundo param: 'title' - es el título que se muestra en la pestaña del navegador para la nueva página.
    // Tercer param: 'url' - especificar la nueva URL que deseas que aparezca en la barra de direcciones del navegador.
    history.pushState(null, '', url); // se utiliza para modificar la URL y el historial del navegador sin recargar la página

    // Llamo a Router para actualizar el contenido con la nueva ruta.
    Router()
}


// la forma correcta de asignar un manejador de eventos a onpopstate es proporcionando una función anónima o nombrada 
// que luego llame a Router() dentro de ella
window.onpopstate = () => {
    // Aquí también llamamos a Router() cuando se presiona "atrás" o "adelante" en el navegador
    Router();
};