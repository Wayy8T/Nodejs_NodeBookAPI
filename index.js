const express = require('express')
const cors = require('cors')
// .config() để có thể sử dụng được file môi trường env ( cụ thể là nó sẽ nạp các biến môi trường từ file.env vào process.env )
require('dotenv').config()
// inject class DBconnection de connect database
require('./DBconnection.js')
// import routes
const initToutes = require('./src/routes/index.js')
// create app
const app = express()

// config ( cau hinh )
app.use(cors({
    // origin (nguon goc) : URL muon cho vao sever de get data
    // process.env: get data in .env 
    origin: process.env.CLIENT_URL,
    // quan ly method chi cho GET co the connect vao 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

// CRUD lien quan den 4 phuong thuc nay 
// create, read, update, delete


// cau hinh, giup server co the read date client push len
// convert sang Json 
// chi doc duoc json 
app.use(express.json())
// Nếu client push lên ko phải là string, json mà là mảng ... thì nó có thể convert qua json rồi đọc
app.use(express.urlencoded({ extended: true }))


// create routes
initToutes(app)

const PORT = process.env.PORT || 7777

const listener = app.listen(PORT, () => {
    console.log('Server is running on the port ' + listener.address().port)
})