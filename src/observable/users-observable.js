import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, browserLocalPersistence, setPersistence } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import { Subject } from "../helpers/subject.js";
import { handleUrl } from "../router/router.js";

class UsersObservable extends Subject{

    constructor(){
        super()
        this.currentUser = []
    }

    notify(user){
        this.currentUser = user
        super.notify(this.user)
    }

    async authState(){
        onAuthStateChanged(auth, async (user) => {
            if(user){
                console.log(user)
            } else {
                console.log(user)
            }
            
            this.notify(user)
        })
    }

    async Logout(){
        await signOut(auth)
    }

    async loginUser(login, password){
        try {
            await signInWithEmailAndPassword(auth, login, password)
            // this.persistence(login, password)
            .then((userCredential) => {
                console.log(userCredential)
                handleUrl(`${window.location.href}/panel`) // redirijo a la vista panel
            })
            
        } catch (error) {
            console.log(error)
            switch (error.code) {
                case "auth/invalid-email":
                    throw "El email ingresado no está asociado a una cuenta."
                case "auth/wrong-password":
                    throw "La contraseña ingresada no es correcta."
                case "auth/too-many-requests":
                    throw "El acceso a esta cuenta se ha inhabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puede restaurarlo inmediatamente restableciendo su contraseña o puede volver a intentarlo más tarde."
                default:
                    break;
            }
        }
    }

    async registerUser(email, password, username){
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                await this.UpdateUsername(userCredential, username)
                await this.AddingUserToFirestore(userCredential)
            })
        } catch (error) {
            console.log(error.code)
            switch (error.code) {
                case "auth/invalid-email":
                    throw "Invalid email."
                case "auth/weak-password":
                    throw "Password should be at least 6 characters."
                case "auth/email-already-in-use":
                    throw "Email already in use."
                default:
                    break;
            }
        }
    }

    async UpdateUsername(userCredential, username){
        const user = userCredential.user;
        try {
            return updateProfile(user, {
                displayName: username
            })
        } catch (error) {
            console.log(error)
        }
    }

    async AddingUserToFirestore(userCredential){
        const user = userCredential.user
        const { email, displayName , uid} = user
        try {
            await addDoc(collection(db, "users"), {
                email: email,
                displayName: displayName,
                uid: uid,
                role: "user"
            })
        } catch (error) {
            console.log(error)
        }
    }

    async GetUsersRole(currentUser){
        const querySnapshot = await getDocs(collection(db, "users"));
        let userRole;
        querySnapshot.forEach((doc) => {
            const { displayName, email, role, uid } = doc._document.data.value.mapValue.fields
            if (uid.stringValue === currentUser.uid){
                userRole = role.stringValue;
            }
        });
        return userRole;
    }

}



export const userObservable = new UsersObservable()

userObservable.authState()