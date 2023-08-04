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