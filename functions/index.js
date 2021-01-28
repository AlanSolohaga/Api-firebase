const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

//settings
const app = express();
admin.initializeApp({
    credential: admin.credential.cert("./permissions.json"),
    databaseURL: "https://fire-base-api-a22c7.firebaseio.com"    
});

//prueba
app.get("/hello",(req,res)=>{
    try {
        return res.status(200).json({respose:"salio joya"});
    } catch (error) {
        return res.status(500).send("to mal: "+error)
    }
});

const db = admin.firestore();
//ingreso un nuevo producto
app.post("/api/products", async (req,res)=>{
    try {
        await db.collection("productos")
        .doc("/"+req.body.id+"/")
        .create({name:req.body.name});
        return res.json();
    } catch (error) {
        return res.send(error);
    }
});

//busco un producto por su id
app.get("/api/products/:id", async (req,res)=>{
    try {
        const doc = db.collection("productos").doc(req.params.id);
        const name = await doc.get();
        const response = name.data();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//obtengo todos los productos
app.get("/api/products",async (req,res)=>{
    try {
        const query = db.collection("productos");
        const collec = await query.get();
        const datos = collec.docs;
        
        const response = datos.map((doc) =>({
            id:doc.id,
            name:doc.data().name
        }));
        
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//elimino un producto por su id
app.delete("/api/products/:id", async (req,res)=>{
    try {
        const prod = db.collection("productos").doc(req.params.id);
        await prod.delete();
        return res.status(200).send("todo ok");
    } catch (error) {
        return res.status(500).send(error); 
    }
});

//modifico un producto
app.put("/api/products/:id",async(req,res)=>{
    try {
        const prod = db.collection("productos").doc(req.params.id);
        const response = await prod.update({
            name: req.body.name,
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send("to mal: "+error)
    }
});
exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
