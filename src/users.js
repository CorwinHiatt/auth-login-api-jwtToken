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
 const token = jwt.sign(users, secretKey)
 user.password = undefined
 res.send(user)
}

export async function addNewUser(req, res){
    const {email, password} = req.body 
    const db = dbConnect()
    //we should check to see if email already being used 
    await db.collection('users').add({email: email.toLowerCase(), password}) 
    userLogin(req, res) // this order logs user in after done signing up
}