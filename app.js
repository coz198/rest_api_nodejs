const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(morgan('short'))


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydata',
    insecureAuth : true
})

const queryString = "SELECT * FROM users"
const insertString = "INSERT INTO users (name) VALUE (?)"

app.get('/', (req, res) => {
    console.log('Responding to root route')
    res.send('Hello ROOOOT')
})

app.get('/users', (req, res) => {
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            throw err
        }
        res.json(rows)
        res.end()
    })
})

app.get('/user/:id', (req, res) => {
    const userId = req.params.id
    connection.query(`${queryString} WHERE id = ${userId} `, (err, rows, fields) => {
        if(err){
            res.sendStatus(500)
            throw err
        }
        res.json(rows)
        res.end()
    })
})

app.post('/user_create', (req, res) => {
    console.log('Trying to create a new user')
    const name = req.body.create_name
    console.log(name)
    if(name != ''){
        connection.query("INSERT INTO users (name) VALUE (?)", [name], (err, results, fields) => {
            if(err){
                res.sendStatus(500)
                throw err
            } 
            res.send("Create Success")
            res.end()
        })
    }
})

app.listen(3003, () => {
    // console.log("Server is up and listening on 3003")
})