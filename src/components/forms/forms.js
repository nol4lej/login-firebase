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

    // capturo los botones para manejar el login y register, luego notifico al router que estoy cambiando de vista
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
        switch (path) {
            case "/":
                this.login()
                this.handleLogin()
                this.showPassword()
                break;
            case "/register":
                this.register()
                this.handleRegister()
                break;
            default:
                break;
        }

        this.handleActiveClass(path)

    }

    // ---------- LOGIN  ----------

    login(){
        const root = this.querySelector("#form-root")
        root.innerHTML = `
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
                <button type="submit" class="form__button" id="login-button">Iniciar sesión</button>
            </form>
            <span id="login-info" class="login__info"></span>
            <hr>
            <div class="extra__info">
                <a href="/reset-password" data-reset-password>¿Olvidó su contraseña?</a>
            </div>
        `
        this.handleResetPasswordButton()
    }

    handleLogin(){
        const form = this.querySelector("#login-form")
        const loginButton = this.querySelector("#login-button")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            // agrego el loader en el boton mientras espero la respuesta del login
            loginButton.innerHTML = `<loader-component width="5" height="5"></loader-component>`

            const login = this.querySelector("#login-input").value
            const password = this.querySelector("#password-input").value

            try {
                await userObservable.loginUser(login, password)
            } catch (error) {
                const info = this.querySelector("#login-info")
                if(error.includes("email")){
                    const input = this.querySelector("#login-input")
                    this.handleInputInvalid(input, info)
                }

                if(error.includes("usuario")){
                    const input = this.querySelector("#login-input")
                    this.handleInputInvalid(input, info)
                }

                if(error.includes("contraseña")){
                    const input = this.querySelector("#password-input")
                    this.handleInputInvalid(input, info)
                }

                loginButton.innerHTML = "Iniciar sesión" // como hubo error, quito el loader y agrego nuevamente el nombre del boton
                info.classList.add("error")
                info.innerHTML = `<i class="material-icons">error</i>${error}`
            }
        })
    }

    showPassword(){
        const passwordInput = this.querySelector("#password-input")
        const cbox = this.querySelector("#show-password-cbox")
        cbox.addEventListener("change", () => {
            if (cbox.checked) {
                passwordInput.type = "text";
            } else {
                passwordInput.type = "password";
            }
        })
    }

    handleResetPasswordButton(){
        const btn = this.querySelector("a[data-reset-password")
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            const url = event.target.href;
            handleUrl(url);
        })
    }

    // ---------- LOGIN  ----------


    // ---------- REGISTER  ----------

    register(){
        const root = this.querySelector("#form-root")
        root.innerHTML = `
            <h2>Registro de nuevo usuario</h2>
            <form class="form register" id="register-form">
                <div class="input__container">
                    <label>Ingrese un nuevo nombre de usuario:</label>
                    <input id="username-input" required>
                    <p class="username__info"><i class="material-icons">info</i>El nombre de usuario solo permite letras minúsculas y mayúsculas.</p>
                </div>
                <div class="input__container">
                    <div class="input__container">
                        <label>Ingrese su email:</label>
                        <input type="email" id="email-input" required>
                    </div>
                    <div class="input__container">
                        <label>Reingrese su email:</label>
                        <input type="email" id="repeat-email-input" required>
                    </div>
                </div>

                <div class="input__container">
                    <div class="input__container">
                        <label>Ingrese su contraseña:</label>
                        <input type="password" id="password-input" required>
                    </div>
                    <div class="input__container">
                        <label>Reingrese su contraseña:</label>
                        <input type="password" id="repeat-password-input" required>
                    </div>
                </div>
                <button type="submit" class="form__button" id="register-button">Registrar usuario</button>
            </form>
            <span id="register-info" class="register__info"></span>
        `
    }

    handleRegister(){
        const form = this.querySelector("#register-form")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            const info = this.querySelector("#register-info")
            const registerButton = this.querySelector("#register-button")
            const username = this.querySelector("#username-input")

            const email = this.querySelector("#email-input")
            const repeatEmail = this.querySelector("#repeat-email-input")

            const password = this.querySelector("#password-input")
            const repeatPassword = this.querySelector("#repeat-password-input")

            registerButton.innerHTML = `<loader-component width="5" height="5"></loader-component>`

            // el método test se invoca en una expresión regular y se le pasa la cadena que se quiere verificar.
            if(!/^[A-Za-z]+$/.test(username.value)){
                this.handleInputInvalid(username, info)
                info.innerHTML = `<i class="material-icons">error</i> El nombre de usuario contiene carácteres inválidos.`
                return
            }

            if(password.value !== repeatPassword.value){
                this.handleInputInvalid(password, info)
                info.innerHTML = `<i class="material-icons">error</i> La contraseña ingresada no coincide.`
                return
            }

            if(email.value !== repeatEmail.value){
                this.handleInputInvalid(email, info)
                info.innerHTML = `<i class="material-icons">error</i> El email ingresado no coincide.`
                return
            }

            try {
                await userObservable.registerUser(email.value, password.value, username.value)
            } catch (error) {
                if(error.includes("email")){
                    this.handleInputInvalid(password, info)
                }

                if(error.includes("contraseña")){
                    this.handleInputInvalid(email, info)
                }

                registerButton.innerHTML = "Registrar usuario" // como hubo error, quito el loader y agrego nuevamente el nombre del boton
                info.classList.add("error")
                info.innerHTML = `<i class="material-icons">error</i>${error}`
            }

        })
    }

    // ---------- REGISTER  ----------

    // Agrega la clase "active" al anchor correspondiente según la ruta actual
    handleActiveClass(path){
        const anchors = this.querySelectorAll("a[data-link]");
        anchors.forEach((anchor) => {
            if (anchor.getAttribute("href") === path) {
                anchor.classList.add("active");
            } else {
                anchor.classList.remove("active");
            }
        });
    }

    // Agrega la clase "invalid" al input en caso de error y se maneja la clase con el evento blur
    handleInputInvalid(input, info){
        input.classList.add("invalid")
        info.classList.add("error")
        input.addEventListener('blur', () => {  
            input.classList.remove('invalid');
        });

        input.addEventListener("input", () => {
            info.innerHTML = ""
        })
    }

}

customElements.define("user-forms", LoginForm)