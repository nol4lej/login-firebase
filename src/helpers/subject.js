export class Subject{

    constructor(){
        this.observers = []
    }

    notify(event){
        this.observers.forEach(observer => {
            if(typeof observer === "function"){
                observer(event)
            }
            if(typeof observer === "object"){
                observer.notify(event)
            }
        })
    }

    subscribe(suscriptor){
        this.observers.push(suscriptor)
    }

    unsubscribe(suscriptor){
        this.observers = this.observers.filter(observer => observer !== suscriptor)
    }

}