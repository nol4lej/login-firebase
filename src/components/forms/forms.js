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
                    <a href="/" class="login__button" data-link>Iniciar sesión</a>
                    <a href="/register" class="register__button" data-link>Crear cuenta</a>
                </div>
                <div id="form-root" class="form__root"></div>
            </div>
        `
    }

    handleButtons(){
        const anchors = this.querySelectorAll("a[data-link]")
        anchors.forEach(a => {
            a.addEventListener("click", (event) => {
                event.preventDefault()
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

        this.handleActiveClass(path)

    }

    login(){
        const container = `
            <h2>Inicio de sesión para usuarios existentes</h2>
            <form class="form" id="login-form">
                <div class="input__container">
                    <label>Nombre de usuario o email:</label>
                    <input type="text" id="login-input" required>
                </div>
                <div class="input__container">
                    <label>Contraseña:</label>
                    <input type="password" id="password-input" required>
                    <div class="password__checkbox">
                        <input type="checkbox" id="show-password-cbox" value="password_checkbox"/>
                        <label for="show-password-cbox">Mostrar contraseña</label>
                    </div>
                </div>
                <button type="submit" class="form__button">Iniciar sesión</button>
            </form>
            <span id="login-info" class="login__info"></span>
            <hr>
            <div class="extra__info">
                <a href="/">¿Olvidó su contraseña?</a>
            </div>
        `
        return container
    }

    handleLogin(){
        const form = this.querySelector("#login-form")
        const info = this.querySelector("#login-info")
        const passwordInput = this.querySelector("#password-input")
        const cbox = this.querySelector("#show-password-cbox")

        cbox.addEventListener("change", () => {
            if (cbox.checked) {
                passwordInput.type = "text";
            } else {
                passwordInput.type = "password";
            }
        })

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
            <h2>Registro de nuevo usuario</h2>
            <form class="form register" id="register-form">
                <div class="input__container">
                    <label>Ingrese un nuevo nombre de usuario:</label>
                    <input id="username-input">
                </div>
                <div class="input__container">
                    <label>Ingrese su email:</label>
                    <input id="email-input">
                </div>
                <div class="input__container passwords">
                    <div class="input__container__passwords">
                        <label>Ingrese su contraseña:</label>
                        <input type="password" id="password-input">
                    </div>
                    <div class="input__container__passwords">
                        <label>Reingrese su contraseña:</label>
                        <input type="password" id="repeat-password-input">
                    </div>
                </div>
                <button type="submit" class="form__button register">Registrar usuario</button>
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

    handleActiveClass(path){
        // Agregar la clase "active" al anchor correspondiente según la ruta actual
        const anchors = this.querySelectorAll("a[data-link]");
        anchors.forEach((anchor) => {
            if (anchor.getAttribute("href") === path) {
                anchor.classList.add("active");
            } else {
                anchor.classList.remove("active");
            }
        });
    }

}

customElements.define("user-forms", LoginForm)