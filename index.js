import { userLogin, addNewUser} from './src/users.js'
import express from 'express'
import cors from 'cors'

const PORT = 3030
const app = express()
app.use(cors())
app.use(express.json())

app.post('/login', userLogin)
app.post('/users', addNewUser )

app.listen(PORT,() => console.log(`Listening to http://localhost:${PORT}....`))