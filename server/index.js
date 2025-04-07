import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Server is running!')
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('✅ Server running on port', process.env.PORT)
    )
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err))
