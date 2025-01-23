const { error } = require("console");
const express=require("express");
const app=express();
const mysql=require("mysql2");
var methodOverride = require('method-override');



app.use(methodOverride('_method'));
const path=require("path");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"/views"));


app.use(express.json());


app.use(express.urlencoded({ extended: true }));
let port=8080;

app.listen(port,()=>{
    console.log("I am responding from this port 8080");
    
})

const connection= mysql.createConnection({

    host:'localhost',
    user:'root',
    database:'userDB',
    password:'shishir21'

});



app.get("/home",(req,res)=>{
  

  try{

    connection.query("select * from users ",(error,result)=>{

      if(error) throw error;
      let userData=result;
      
     
     res.render("home.ejs",{userData});
    })
  }
  catch (error){
    console.log("Something wrong in your DB");
  }
})

app.get("/edit/:id",(req,res)=>{

  let {id}=req.params;
  let q="select id,name,password from users where id=?";


  try{
    connection.query(q,[id],(error,result)=>{

      if (error) throw error;
     
      let userData=result[0];
      // console.log(userData);
      res.render("edit.ejs",{userData});
      
    }
  );
  }

  catch(error) {
    console.log("DB error");
  }

  


  // res.render("edit.ejs");

})

app.patch("/edit/:id", (req, res) => {
  let { id } = req.params; // Extract `id` from URL parameters
  let { usename: newName, password: userPassword } = req.body; // Extract form data

  let fetchQuery = "SELECT id, name, password FROM users WHERE id = ?";
  let updateQuery = "UPDATE users SET name = ? WHERE id = ?";

  try {
    // Fetch the user details from the database
    connection.query(fetchQuery, [id], (error, result) => {
      if (error) {
        console.error("Query Error:", error); // Log query error
        res.status(500).send("Database query error.");
        return;
      }

      // Check if the result is empty
      if (result.length === 0) {
        console.warn("No user found with the given ID:", id); // Log no user found
        res.status(404).send("User not found.");
        return;
      }

      // Extract the user data
      let userData = result[0];
      console.log("Fetched User Data:", userData); // Debug log

      // Check if the entered password matches the stored password
      if (userPassword === userData.password) {
        // If the password matches, update the username
        connection.query(updateQuery, [newName, id], (updateError, updateResult) => {
          if (updateError) {
            console.error("Update Error:", updateError); // Log update error
            res.status(500).send("Failed to update username.");
            return;
          }

          console.log(`Username updated to ${newName} for user ID ${id}`);
          res.status(200).send(`Username updated successfully to ${newName}`);
          res.redirect("/home");
        });
      } else {
        // If the password doesn't match, send an error response
        console.warn("Incorrect password provided.");
        res.status(403).send("Incorrect password. Username not updated.");
      }
    });
  } catch (error) {
    console.error("Database Error:", error); // Log database error
    res.status(500).send("Database error occurred.");
  }
});






// app.patch("/edit/:id", (req, res) => {
//   let { id } = req.params; // Get the user ID from the URL parameters
//   let q = "SELECT id, name, password FROM users WHERE id = ?"; // Query to fetch the user data

//   try {
//     // Execute the query
//     connection.query(q, [id], (error, result) => {
//       if (error) {
//         console.error("Query Error:", error); // Log the query error
//         res.status(500).send("Database query error.");
//         return;
//       }

//       // Check if the result is empty (no user found for the given ID)
//       if (result.length === 0) {
//         console.warn("No user found with the given ID:", id); // Log no user found
//         res.status(404).send("User not found.");
//         return;
//       }

//       // Extract the user data
//       let userData = result[0];
//       console.log("User Password:", userData.password); // Print the password to the console

//       // Send the user data back in the response
//       res.status(200).send(userData);
//     });
//   } catch (error) {
//     console.error("Database Error:", error); // Log any database connection or query error
//     res.status(500).send("Database error occurred.");
//   }
// });









// app.get("/users",(req,res)=>{

//     try{

 
//         connection.query("Select * from users",(err,result)=>{
//             if (err) throw err;
    
//             console.log(result);
//             res.send(result);
//         })
        
//     }
//     catch(err){
//         console.log(err);
//     }
    

// })







