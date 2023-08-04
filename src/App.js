import { Router } from "../src/router/router.js"

export const App = () => {
    import("./components/loader/loader.js")
    import("./components/nav/nav.js")
    import("./components/panel/panel.js")
    import("./components/reset-password/reset-password.js")
    Router();
}