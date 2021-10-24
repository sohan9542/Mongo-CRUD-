const express = require('express')
const app = express();
const password = '0Pea06uOWg35ctjP'
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://sohanDB:0Pea06uOWg35ctjP@cluster0.rotoa.mongodb.net/sohanDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

client.connect(err => {
    const collection = client.db("crudDB").collection("products");
    // adding product 
    app.post('/addproduct', (req, res) => {
            const product = req.body;
            // console.log(product);
            collection.insertOne(product)
            res.redirect('/')
        })
        // update product
    app.get('/product/:id', (req, res) => {
            const id = req.params.id;
            collection.find({ _id: ObjectId(id) })
                .toArray((err, document) => {
                    res.send(document[0])
                })
        })
        // save update
    app.patch('/update/:id', (req, res) => {
            const id = req.params.id;
            // console.log(req.body.price, id);
            collection.updateOne({ _id: ObjectId(id) }, {
                    $set: {
                        price: req.body.price,
                        quantity: req.body.quantity
                    }
                })
                .then(responses => {
                    responses.acknowledged ? res.send(JSON.stringify({ success: true, message: 'successfully updated' })) : res.send(JSON.stringify({ success: false, message: 'not updated' }))
                })

        })
        // reading product 
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    // deleteing product
    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        collection.deleteOne({
                _id: ObjectId(id)
            })
            .then(respo => {
                respo.acknowledged ? res.send(JSON.stringify({ success: true, message: 'Successfully Deleted' })) : res.send(JSON.stringify({ success: false, message: 'Successfully Deleted' }))
            })

    })


})


app.listen(3000)