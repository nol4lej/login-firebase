export const Panel = () => {
    return `
        <style>
        .panel__perfil {
            background-color: var(--bg-blue-light);
            padding: 56px 0;
            display: flex;
            justify-content: center;
        </style>
        <section class="panel__perfil">
            <panel-user></panel-user>
        </section>
        <footer-component></footer-component>
    `
}