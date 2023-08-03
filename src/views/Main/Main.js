import "../../components/forms/forms.js"
import "../../components/footer/footer.js"

export const Main = (path) => {
    return `
        <section class="main">
            <user-forms path="${path}"></user-forms>
        </section>
        <footer-component></footer-component>
    `
}