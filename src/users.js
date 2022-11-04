import { secretKey } from '../secrets.js';
import jwt from 'jsonwebtoken'
import dbConnect from "./dbConnect.js";

export async function userLogin(req, res) {
 const {email, password } = req.body
 const db = dbConnect()
 const matchingUsers = await db.collection('users')
    .where('email', '==', email.toLowerCase())
    .where('password', '==', password)
    .get()
 const users = matchingUsers.docs.map(doc => ({...doc.data(), uid: doc.id}))
 if(!users.length) {
    res.status(401).send({message: 'Invalid user credentials'})
    return
 }
 //if we get here we have at least one matching user
 //let user = users[0]
 let [user] =  users
 user.password = undefined
 const token = jwt.sign(user, secretKey)
 res.send({user, token})
}

export async function addNewUser(req, res){
    const {email, password} = req.body 
    const db = dbConnect()
    //we should check to see if email already being used 
    await db.collection('users').add({email: email.toLowerCase(), password}) 
    userLogin(req, res) // this order logs user in after done signing up
}
export async function updateUser(req, res) {
    const token = req.header.authorization
    const decodedToken = jwt.verify(token, secretKey)
    const {uid} = req.params // profile they want to update 
    if(uid !== decodedToken.uid) {
        res.status(401).send({message: 'invalid tok ID'})
        return
    }

    const db = dbConnect()
    await db.collection('users').doc(uid).update(req.body)
    let user =doc.data()
    user.uid = doc.id 
    user.password = undefined
    res.status(202).send({message: 'update'})
}