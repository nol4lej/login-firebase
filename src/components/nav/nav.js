import { handleUrl } from "../../router/router.js";
import firebaseLogo from '../../img/firebase_icon.png';

export class NavBar extends HTMLElement{

    connectedCallback(){
        this.render()
        this.handleButtons()
    }

    render(){
        this.innerHTML = `
            <div class="navbar">
                <h1 class="nav__title">
                    Login with 
                    <a class="firebase__anchor" href="https://firebase.google.com/">
                        <img src=${firebaseLogo}>
                        Firebase
                    </a>
                </h1>
                <ul class="nav__list">
                    <li><a href="/" data-link>Inicio</a></li>
                    <li><a href="/panel" data-link>Panel</a></li>
                </ul>
            </div>
        `
    }

    handleButtons(){
        const links = document.querySelectorAll('a[data-link]');

        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault()
                const url = event.target.href;
                handleUrl(url); // envio la url al manejador de la URL que se encuentra en el Router
            });
        });
    }

}

customElements.define("nav-bar", NavBar)