const express = require("express");
const app = express();
var mysql = require('mysql');

app.use(express.json());

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 

// Conexion MySql
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: '3306',
    database: 'escuela'
});

// Conecta a base de datos
conexion.connect(function(error) {
    if (error) throw error;
    console.log("Conectado!");
  });


// Mensaje por defecto de apis
app.get('/', (raq, res) => {
    res.send('Hola mundo')
})

// Trae todos los estudiantes
app.get('/api/students/getAll', (req, res) => {

    conexion.query('SELECT * FROM Students', function(error,results,fields){
        res.send(results);
    }) 
});

// Trae un estudiante correspondiente a un id
app.get('/api/students/get/:id', (req, res) => {
    conexion.query(`SELECT * FROM Students where id =  ${req.params.id}`, function(error,results,fields){
        console.log(results)
        res.send(results);
    }) 
});

// Crea un estudiante
app.post('/api/students/create', (req, res) => {
    console.log(req.body)
    conexion.query(`INSERT INTO students (Name,Email,Year,Age,Gender) VALUES ('${req.body.name}', 
    '${req.body.email}','${req.body.year}', '${req.body.age}', '${req.body.gender}')`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Estudiante creado correctamente...')
    });

});

// Actualiza un estudiante
app.put('/api/students/update', (req, res) => {
    console.log(req.body)
    conexion.query(`update students set name = '${req.body.name}', email = '${req.body.email}', year = '${req.body.year}',
     age = '${req.body.age}', gender = '${req.body.gender}' where id = ${req.body.id}`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Estudiante actualizado correctamente...')
    });

});

// Elimina un estudiante
app.delete('/api/students/delete', (req, res) => {
    console.log(req.body)
    conexion.query(`delete from notesStudents where student = ${req.body.id}`, (error, results) => {
    });
    conexion.query(`delete from students where id = ${req.body.id}`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Estudiante eliminado correctamente...')
    });

});

// Crea una nota de un estudiante
app.post('/api/notesStudents/create', (req, res) => {
    console.log(req.body)
    conexion.query(`INSERT INTO notesStudents (Student,Value,Fecha) VALUES ('${req.body.student}', 
    '${req.body.value}',now())`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Nota registrada correctamente...')
    });

});

// Trae todas las notas de un estudiante
app.get('/api/notesStudents/get/:id', (req, res) => {
    console.log("id: "+req.params.id)
    conexion.query(`SELECT n.id, s.name,n.value,n.fecha FROM notesStudents as n inner join students as s ON s.id = n.student
     where n.student =  ${req.params.id}`, function(error,results,fields){
        res.send(results);
    }) 
});

// Actualiza una nota
app.put('/api/notesStudents/update', (req, res) => {
    conexion.query(`update notesStudents set value = ${req.body.value}, fecha = now() where id = ${req.body.id}`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Nota actualizada correctamente...')
    });

});

// Elimina una nota
app.delete('/api/notesStudents/delete', (req, res) => {
    conexion.query(`delete from notesStudents where id = ${req.body.id}`, (error, results) => {
        if (error) {
          throw error
        }
        res.send('Nota eliminada correctamente...')
    });

});

// Trae el promedio de todos los estudiantes
app.get('/api/notesStudents/getAvaranges', (req, res) => {
    conexion.query(`SELECT s.name as nombre ,AVG(n.value) as promedio ,  '#c43a31'   as color  FROM notesStudents as n inner join students as s ON s.id = n.student
    GROUP BY s.id`, function(error,results,fields){
        console.log(results)
        res.send(results);
    }) 
});

// Trae el promedio de un estudiante en especifico
app.get('/api/notesStudents/getAvarange/:students', (req, res) => {

    conexion.query(`SELECT n.id, s.name ,AVG(n.value) as avarange FROM students as s left join notesStudents as n ON s.id = n.student
    where s.id =  ${req.params.students} GROUP BY s.id`, function(error,results,fields){
      
        res.send(results);
    }) 
});

// Trae la nota maxima
app.get('/api/notesStudents/getMaxNote', (req, res) => {
    conexion.query(`SELECT s.name ,count(n.id) as value   FROM notesStudents as n inner join students as s ON s.id = n.student
    GROUP BY s.id  order by value desc limit 1`, function(error,results,fields){
        console.log(results)
        res.send(results);
    }) 
});

// Asigna y activa el puerto
const port = process.env.port || 5900
app.listen(port,() => console.log(`Escuchando en el puerto ${port}`));