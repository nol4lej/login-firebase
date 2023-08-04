import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import { Subject } from "../helpers/subject.js";
import { handleUrl } from "../router/router.js";

class UsersObservable extends Subject{

    constructor(){
        super()
        this.authState()
        this.currentUser = []
    }

    notify(user){
        this.currentUser = []
        this.currentUser.push(user)
        super.notify(this.currentUser)
    }   

    async authState(){
        onAuthStateChanged(auth, async (user) => {
            if(user){
                this.notify(user)
                handleUrl(`${window.location.protocol}//${window.location.host}/panel`) // redirijo a la vista panel
            }
        })
    }

    async Logout(){
        this.notify()
        await signOut(auth)
        handleUrl(`${window.location.protocol}//${window.location.host}/`)
    }

    async loginUser(login, password){
        try {
            await signInWithEmailAndPassword(auth, login, password)
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
            console.log(error)
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

    async GetUsersDataFromFirestore(currentUserId){
        const querySnapshot = await getDocs(collection(db, "users"));
        let userData;
        querySnapshot.forEach((doc) => {
            const { displayName, email, role, uid } = doc._document.data.value.mapValue.fields
            if (uid.stringValue === currentUserId){
                userData = doc._document.data.value.mapValue.fields;
            }
        });
        return userData;
    }

}

export const userObservable = new UsersObservable()