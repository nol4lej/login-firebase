import { userObservable } from "../../observable/users-observable.js"

export class LoginForm extends HTMLElement{

    connectedCallback(){
        this.render()
        this.handleFromRouter()
    }

    render(){
        this.innerHTML = `
            <div class="form__content">
                <div class="form__buttons">
                    <a href="#" id="login-button" class="login__button">Login</a>
                    <a href="#/register" id="register-button" class="register__button">Register</a>
                </div>
                <div id="form-root" id="form__root">
                </div>
            </div>
        `
    }

    handleFromRouter(){
        const form_root = this.querySelector("#form-root")
        const hash = window.location.hash

        switch (hash) {
            case "":
            case "#":
                const btnLogin = this.querySelector("#login-button")
                btnLogin.classList.toggle("active")
                form_root.innerHTML = `
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
                this.handleLogin()
                break;

            case "#/register":
                const btnRegister = this.querySelector("#register-button")
                btnRegister.classList.toggle("active")
                form_root.innerHTML = `
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
                this.handleRegister()
                break;
            default:
                break;

        }
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