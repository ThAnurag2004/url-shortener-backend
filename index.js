import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.route.js'
import urlRouter from './routes/url.route.js'
const app = express();
const PORT = process.env.PORT ?? 8000
import {authenticationMiddleware} from './middlewares/auth.middleware.js'
//middlewares

app.use(express.json());
app.use(authenticationMiddleware)
//routes

app.get('/', (req,res)=>{
    return res.status(200).json({status : 'Server is up and running.'})
})

app.use('/user', userRouter);
app.use(urlRouter);

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))






