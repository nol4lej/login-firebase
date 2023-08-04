import "../../components/forms/forms.js"
import "../../components/footer/footer.js"

export const Main = (path) => {
    return `
        <user-forms path="${path}"></user-forms>
        <footer-component></footer-component>
    `
}