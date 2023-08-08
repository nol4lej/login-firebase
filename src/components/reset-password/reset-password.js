import { userObservable } from "../../observable/users-observable.js"
import { handleUrl } from "../../router/router.js"

class ResetPasswordComponent extends HTMLElement{

    connectedCallback(){
        this.render()
        this.handleForm()
        this.handleBackButton()
    }

    render(){
        this.innerHTML = `
            <a href="/" class="back__button" id="back-button">
                <i class="material-icons">arrow_back</i>
                Volver
            </a>

            <div class="reset__content" id="reset-content">               
                <h2>Recupera tu cuenta</h2>
                <p class="reset__info"><i class="material-icons">help</i>Se te enviará un correo electrónico con el link para reestablecer la contraseña de tu cuenta.</p>
                <div class="reset__container">
                    <p>Introduce tu dirección de correo electrónico que deseas recuperar:</p>
                    <form class="reset__form" id="reset">
                        <input type="email" id="reset__input">
                        <span id="error-info" class="error__info"></span>
                        <button class="reset__button" type"submit" id="reset-button">Reestablecer contraseña</button>
                    </form>
                </div>
            </div>

        `
    }

    handleForm(){
        const form = this.querySelector("#reset")
        const input = this.querySelector("#reset__input")
        const errorSpan = this.querySelector("#error-info")
        const resetButton = this.querySelector("#reset-button")

        form.addEventListener("submit", async (event) => {
            event.preventDefault()

            resetButton.innerHTML = `<loader-component width="5" height="5"></loader-component>`

            try {
                await userObservable.resetPassword(input.value)
                
                this.successfulReset()
            } catch (error) {
                resetButton.innerHTML = "Reestablecer contraseña"
                this.handleInputInvalid(input)
                errorSpan.innerHTML = `<i class="material-icons">info</i> ${error}`

                input.addEventListener("input", (event) => {
                    if(event.target.value){
                        errorSpan.innerHTML = ""
                    }
                })
            }

        })
    }

    handleInputInvalid(input){
        input.classList.add("invalid")
        input.addEventListener('blur', () => {  
            input.classList.remove('invalid');
        });
    }

    successfulReset(){
        const container = this.querySelector("#reset-content")
        container.innerHTML = `
            <div class="success__container">
                <h2>Te hemos enviado un correo electrónico para reestablecer tu cuenta.</h2>
                <i class="material-icons icon__successful">mark_email_read</i>
            </div>
        `
    }

    handleBackButton(){
        const button = this.querySelector("#back-button")
        button.addEventListener("click", (event) => {
            event.preventDefault()
            const url = event.target.href;
            handleUrl(url);
        })
    }
}

customElements.define("reset-password", ResetPasswordComponent)