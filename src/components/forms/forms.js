import { userObservable } from "../../observable/users-observable.js"
import { handleUrl } from "../../router/router.js"

export class LoginForm extends HTMLElement{

    connectedCallback(){
        this.render()
        this.handlePath()
        this.handleButtons()
    }

    render(){
        this.innerHTML = `
            <div class="form__content">
                <div class="form__buttons">
                    <a href="/" class="login__button" data-link>Login</a>
                    <a href="/register" class="register__button" data-link>Register</a>
                </div>
                <div id="form-root" id="form__root">
                </div>
            </div>
        `
    }

    handleButtons(){
        const anchors = this.querySelectorAll("a[data-link]")
        anchors.forEach(a => {
            a.addEventListener("click", (event) => {
                event.preventDefault()
                const attr = a.getAttribute("href")
                const url = event.target.href;
                handleUrl(url); // envio la url al manejador de la URL que se encuentra en el Router
            })
        })
    }

    handlePath(){
        const path = this.getAttribute("path")
        const form_root = this.querySelector("#form-root")

        switch (path) {
            case "/":
                form_root.innerHTML = this.login()
                this.handleLogin()
                break;
            case "/register":
                form_root.innerHTML = this.register()
                this.handleRegister()
                break;
            default:
                break;
        }
    }

    login(){
        const container = `
            <form class="form" id="login-form">
                <div class="input__container">
                    <label>Ingrese su nombre de usuario o email:</label>
                    <input type="text" id="login-input" required>
                </div>
                <div class="input__container">
                    <label>Ingrese su password:</label>
                    <input type="password" id="password-input" required>
                </div>
                <button type="submit" class="form__button">Iniciar sesión</button>
            </form>
            <span id="login-info" class="login__info"></span>
        `
        return container
    }

    handleLogin(){
        const form = this.querySelector("#login-form")
        const info = this.querySelector("#login-info")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            const login = this.querySelector("#login-input").value
            const password = this.querySelector("#password-input").value
            try {
                await userObservable.loginUser(login, password)
            } catch (error) {
                info.innerHTML = error
            }
            
        })
    }

    register(){
        const container = `
            <form class="form" id="register-form">
                <div class="input__container">
                    <label>Ingresa un nombre de usuario:</label>
                    <input id="username-input">
                </div>
                <div class="input__container">
                    <label>Ingrese su email:</label>
                    <input id="email-input">
                </div>
                <div class="input__container">
                    <label>Ingrese su password:</label>
                    <input type="password" id="password-input">
                    <label>Reingresa tu contraseña:</label>
                    <input type="password" id="repeat-password-input">
                </div>
                <button type="submit" class="form__button">Registrar usuario</button>
            </form>
            <span id="register-info" class="register__info"></span>
        `
        return container
    }

    handleRegister(){
        const form = this.querySelector("#register-form")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            const username = this.querySelector("#username-input").value
            const email = this.querySelector("#email-input").value

            const password = this.querySelector("#password-input").value
            const repeatPassword = this.querySelector("#repeat-password-input").value
            if(password !== repeatPassword){
                const info = this.querySelector("#register-info")
                return info.innerHTML = "La contraseña no coincide."
            }

            try {
                userObservable.registerUser(email, password, username)
            } catch (error) {
                console.log(error)
            }

        })
    }


}

customElements.define("user-forms", LoginForm)