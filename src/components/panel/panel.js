import {userObservable} from "../../observable/users-observable.js"

class PanelUser extends HTMLElement{

    constructor(){
        super()
        this.currentUser;
    }

    connectedCallback(){
        this.handleLoginStatus()
        this.render()
        this.handleCurrentUser()
    }

    render(){
        this.innerHTML = `
            <div class="panel__container">
                <h2>Bienvenid@ a tu perfil!</h2>
                <div class="user__info__container" id="user-info-container">
                    <loader-component width="30" height="30"></loader-component>
                </div>
            </div>
        `
    }

    handleLoginStatus(){
        if(userObservable.currentUser[0] === "undefined"){
            return handleUrl(`${window.location.protocol}//${window.location.host}`)
        }
    }

    async handleCurrentUser(){
        this.currentUser = await userObservable.GetUsersDataFromFirestore(userObservable.currentUser[0].uid)
        const container = this.querySelector("#user-info-container")
        container.innerHTML = `
            <div class="user__info">
                <h4>Nombre de usuario:</h4>
                <p id="username"></p>
            </div>
            <div class="user__info">
                <h4>Email:</h4>
                <p id="email"></p>
            </div>
            <div class="user__info">
                <h4>ID de usuario:</h4>
                <p id="id"></p>
            </div>
            <div class="user__info">
                <h4>Rol de usuario:</h4>
                <p id="role"></p>
            </div>
        `
        this.querySelector("#username").innerHTML = this.currentUser.displayName.stringValue
        this.querySelector("#email").innerHTML = this.currentUser.email.stringValue
        this.querySelector("#id").innerHTML = this.currentUser.uid.stringValue
        this.querySelector("#role").innerHTML = this.currentUser.role.stringValue
    }



}

customElements.define("panel-user", PanelUser)