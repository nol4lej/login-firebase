import { handleUrl } from "../../router/router.js";
import firebaseLogo from '../../img/firebase_icon.png';
import { userObservable } from "../../observable/users-observable.js"

export class NavBar extends HTMLElement{

    connectedCallback(){
        this.render()
        this.handleActiveUser()
    }

    render(){
        this.innerHTML = `
            <div class="navbar" id="nav-bar">
                <h1 class="nav__title">
                    Manejo de usuarios con
                    <a class="firebase__anchor" href="https://firebase.google.com/">
                        <img src=${firebaseLogo}>
                        Firebase
                    </a>
                </h1>
                <ul id="nav-list"></ul>
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

    handleActiveUser(){
        userObservable.subscribe((data) => {
            const navList = this.querySelector("#nav-list")
            navList.classList.add("nav__list")
            navList.innerHTML = `
                <button id="logout-btn" class="logout__button">Desconecar</button>
            `
            navList.querySelector("#logout-btn").addEventListener("click", () => {
                userObservable.Logout()
                navList.innerHTML = ""
                navList.classList.remove("nav__list")
            })
        })
    }

}

customElements.define("nav-bar", NavBar)