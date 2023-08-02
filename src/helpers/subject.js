export class Subject{

    constructor(){
        this.observers = []
    }

    notify(event){
        this.observers.forEach(observer => {
            observer.notify(event)
        })
    }

    subscribe(suscriptor){
        this.observers.push(suscriptor)
    }

    unsubscribe(suscriptor){
        this.observers = this.observers.filter(observer => observer !== suscriptor)
    }

}