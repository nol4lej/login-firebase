import { Router } from "../src/router/router.js"

window.addEventListener("DOMContentLoaded", () => {
    Router();
    import("./components/nav/nav.js")
    import("./components/loader/loader.js")
    import("./components/panel/panel.js")
})