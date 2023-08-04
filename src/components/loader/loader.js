export class LoaderComponent extends HTMLElement{

    connectedCallback(){
        this.render()
    }

    render(){
        const width = this.getAttribute("width")
        const height = this.getAttribute("height")

        this.innerHTML = `
        <div class="loader__container">
            <div class="loader ${this.getAttribute("sizeScreen") || "" }" style="width:${width}px; height:${height}px;"></div>
        </div>
        `
    }

}

customElements.define("loader-component", LoaderComponent)