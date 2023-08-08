import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
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
        handleUrl(`${window.location.protocol}//${window.location.host}/`)
        this.notify()
        await signOut(auth)
        
    }

    async loginUser(login, password){
        try {

            // almaceno el login
            let actualLogin = login

            const respValidateEmail = await this.ValidateUsername(login)
            console.log(respValidateEmail)

            if(!respValidateEmail){
                throw "El nombre de usuario no existe."
            }

            // si respValidateEmail es una cuenta valida actualizo a actualLogin
            actualLogin = respValidateEmail

            await signInWithEmailAndPassword(auth, actualLogin, password)
        } catch (error) {
            console.log(error)
            switch (error.code || error) {
                case "El nombre de usuario no existe.":
                    throw "El nombre de usuario no existe."
                case "auth/user-not-found":
                    throw "El usuario no existe."
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
            const respValidate = await this.ValidateUsername(username)
            console.log(respValidate)
            if(respValidate){
                throw "El nombre de usuario no está disponible."
            }

            await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                await this.UpdateUsername(userCredential, username)
                await this.AddingUserToFirestore(userCredential)
            })
        } catch (error) {
            switch (error.code || error) {
                case "auth/invalid-email":
                    throw "Invalid email."
                case "auth/weak-password":
                    throw "Password should be at least 6 characters."
                case "auth/email-already-in-use":
                    throw "Email already in use."
                case "El nombre de usuario no está disponible.":
                    throw "El nombre de usuario no está disponible."
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

    async ValidateUsername(loginInput){
        try {
            let key = "displayName";
            if(loginInput.includes("@")){
                key = "email";
            }

            const q = query(collection(db, "users"), where(key, "==", loginInput));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.empty){
                throw "Usuario no encontrado." // retorna este msj como error si no existe el usuario
            };

            // Iterar a través de los resultados y verificar si el nombre de usuario ya existe
            for (const userDoc of querySnapshot.docs) {
                if (userDoc.data()[key] === loginInput) {
                    return userDoc.data().email // devuelve el email del username para validar en el login
                }
            };

        } catch (error) {
            console.log(error)
        }
    };

    async GetUsersDataFromFirestore(currentUserId){
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            let userData;
            querySnapshot.forEach((doc) => {
                const { displayName, email, role, uid } = doc._document.data.value.mapValue.fields
                if (uid.stringValue === currentUserId){
                    userData = doc._document.data.value.mapValue.fields;
                }
            });
            return userData;
        } catch (error) {
            console.log(error)
        }
    }

    async resetPassword(email){
        try {
            await sendPasswordResetEmail(auth, email)
            
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    throw "Correo electrónico no encontrado."
                    break;
                default:
                    break;
            }
        }
    }

}

export const userObservable = new UsersObservable()