import "../../components/forms/forms.js"
import "../../components/footer/footer.js"

export const Main = () => {
    return `
        <section class="main">
            <div class="overmain"></div>
            <div class="main__content">
                <user-forms></user-forms>
            </div>
        </section>
        <footer-component></footer-component>
    `
}