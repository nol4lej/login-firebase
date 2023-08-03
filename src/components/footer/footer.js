export class FooterComponent extends HTMLElement{

    connectedCallback(){
        this.render()
    }

    render(){
        this.innerHTML = `
            <p>Creado por Nolasco Medina</p>
        `
    }



}

customElements.define("footer-component", FooterComponent)