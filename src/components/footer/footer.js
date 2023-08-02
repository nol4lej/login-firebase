export class FooterComponent extends HTMLElement{

    connectedCallback(){
        this.render()
    }

    render(){
        this.innerHTML = `
            <div>
                <h2>Footer</h2>
            </div>
        `
    }



}

customElements.define("footer-component", FooterComponent)