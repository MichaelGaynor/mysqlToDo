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
    } else if (message == "edited"){
        message = "Your task was edited!"
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
    var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES (?,?)";
    // res.send(insertQuery);
    connection.query(insertQuery, [newTask,dueDate], (error, results)=>{
        if(error) throw error;
        res.redirect('/?msg=added');
    })
});

router.get('/edit/:id', function(req, res){
    var idToEdit = req.params.id;
    var selectQuery = "SELECT * FROM tasks WHERE id = ?";
    connection.query(selectQuery, [idToEdit], (error,results)=>{
        if (error) throw error;
        res.render('edit',{
            task: results[0]
        });
    });
});

router.post('/editItem', (req,res)=>{
    // res.json(req.body);
    var newTask = req.body.newTask;
    var taskDate = req.body.newTaskDate;
    var taskId = req.query.id;
    var updateQuery = "UPDATE tasks SET taskName = ?, taskDate = ? WHERE id = ?";
    connection.query(updateQuery, [newTask,taskDate,taskId], (error, results)=>{
        if (error) throw error;
        res.redirect('/?msg=edited')
    })
});

router.get('/delete/:id', function(req,res){
    var idToDelete = req.params.id;
    var deleteQuery = "DELETE FROM tasks WHERE id = ?";
    // res.send(idToDelete);
    connection.query(deleteQuery, [idToDelete], (error, results)=>{
        if (error) throw error;
        res.redirect('/?msg=deleted')
    });
});

module.exports = router;
