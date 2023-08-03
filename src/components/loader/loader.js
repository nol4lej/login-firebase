export class LoaderComponent extends HTMLElement{

    connectedCallback(){
        this.render()
    }

    render(){
        const width = this.getAttribute("width")
        const height = this.getAttribute("height")
        this.innerHTML = `
            <div class="loader" style="width:${width}px; height:${height}px;"></div>
        `
    }

}

customElements.define("loader-component", LoaderComponent)