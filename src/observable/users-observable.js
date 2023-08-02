import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import { Subject } from "../helpers/subject.js";

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
        try {
            onAuthStateChanged(auth, (user) => {
                console.log(user)
                this.notify(user)
            })
        } catch (error) {
            
        }
    }

    async Logout(){
        await signOut(auth)
    }

    async loginUser(login, password){
        try {
            await signInWithEmailAndPassword(auth, login, password)
            .then((userCredential) => console.log(userCredential))
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    throw "Invalid email."
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