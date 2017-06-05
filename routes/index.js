var express = require('express');
var router = express.Router();

var config = require('../config/config');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.host,
    user: config.userName,
    password: config.password,
    database: config.database
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
    var message = req.query.msg;
    if (message == "added"){
        message = "Your task was added!";
    }
    var selectQuery = "SELECT * FROM tasks ORDER BY taskDate ASC";
    connection.query(selectQuery, (error,results)=>{
        res.render('index', { 
            message: message,
            taskArray: results
        });
    });
});
router.post('/addItem', function(req, res){
    // res.json(req.body);
    var newTask = req.body.newTask;
    var dueDate = req.body.newTaskDate;
    var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES ('"+newTask+"','"+dueDate+"')";
    // res.send(insertQuery);
    connection.query(insertQuery, (error, results)=>{
        if(error) throw error;
        res.redirect('/?msg=added');
    })
});
router.get('/delete/:id', function(req,res){
    var idToDelete = req.params.id;
    var deleteQuery = "DELETE FROM tasks WHERE id = "+idToDelete;
    // res.send(idToDelete);
    connection.query(deleteQuery, (error, results)=>{
        if (error) throw error;
        res.redirect('/?msg=deleted')
    });
});

module.exports = router;
