import jwt from 'jsonwebtoken'
import { secretKey } from '../secrets.js'

export function isUserReallyUser(req, res, next) {
   const token = req.headers.authorization
   //verify token and decode it
   const decodedToken = jwt.verify(token, secretKey)
   //now check the uid they are trying to patch is one in token
   const requestedUid = req.params.uid
   if(decodedToken.uid !== requestedUid) {
    res.status(401).send({ message: 'Not Authorized' })
    return
   }
   req.decoded = decodedToken
    next() //if we get here, we are good to go
}