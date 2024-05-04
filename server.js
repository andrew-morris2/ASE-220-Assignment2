const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const url='mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

async function importUsers(credentialsFilename, collectionName) {
    try {
        // adding the credentials from credentials.json into Mongodb
        const credentialsData = fs.readFileSync(credentialsFilename, 'utf8');
        const credentials = JSON.parse(credentialsData);

        
        const users = Object.entries(credentials).map(([username, password]) => ({ username, password }));

        
        const dbName = 'mydatabase';
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        
        const result = await collection.insertMany(users);
        console.log(`${result.insertedCount} users inserted into ${collectionName} collection`);
    } catch (error) {
        console.error('Error importing users from JSON:', error);
    }
};

main();
const credentials = 'credentials';
importUsers("credentials.json", credentials);

// ------------------------------------------------------------------------------------------------------------------------------------------------------
const app=express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    } 
}));


const PORT = process.env.PORT || 3000;

function generateBlobID(callback){
    const blobPath = './blobs';
    fs.readdir(blobPath, (err, files) => {
        if (err){
            console.error('Error retrieving blobs.');
            callback(err, null);
        } else{
            const blobCount = files.length
            const newBlobID = blobCount + 1;
            callback(null, newBlobID);
        }
    })
    
};

app.get('/api/blobs/:id', (req, res) =>{ //get requests
    const blobID = req.params.id;
    const blobPath = `./blobs/${blobID}`;

    fs.access(blobPath, fs.constants.F_OK, (err) =>{ //will check to see if blob exists via blob id within the blobs folder first
        if (err){
            res.status(404).json({error: 'BLOB not found.'});
        } else {
            fs.readFile(blobPath, 'utf8', (err, data) => {
                if (err){
                    res.status(500).json({error: 'Server error while getting data.'})
                } else{
                    const blobData = JSON.parse(data);
                    res.json(blobData);
                }
            })
        }
    })
});

app.post('/api/blobs', (req, res) => { //post requests
    const blobData = req.body;
    generateBlobID((err, blobID) => {
        if (err){
            console.error('Error generating blob ID:', err);
            res.status(500).json({error: 'Server error'});
        } else{
            console.log('Generated new blob ID:', blobID);
            const blobFilePath = `./blobs/${blobID}.json`;
            fs.writeFile(blobFilePath, JSON.stringify(blobData), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing blob file:', writeErr);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    console.log('Blob file saved:', blobFilePath);
                    res.status(201).json({ id: blobID });
                }
            })
        }
    });
});

app.put('/api/blobs/:id', (req, res) =>{ //put requests
    const blobData = req.body;
    const blobID = req.params.id;
    const blobPath = `./blobs/${blobID}`;
    fs.writeFile(blobPath, JSON.stringify(blobData), (err) =>{
        if (err){
            console.error('Error updating blob file:', err);
            res.status(500).JSON({error: 'Server error.'});
        } else{
            console.log('Blob file updated:', blobPath);
            res.status(200).JSON({message: 'Blob updated succesfully'});
        }
    })
});

app.delete('/api/blobs/:id', (req, res) =>{ //delete requests
    const blobID = req.params.id;
    const blobPath = `./blobs/${blobID}`;

    fs.access(blobPath, fs.constants.F_OK, (err) =>{
        if (err){
            console.error('Blob not found.');
            res.status(404).JSON({error: 'Blob not found'});
        } else{
            fs.unlink(blobPath, (err) =>{
                if (err){
                    console.error('Error deleting blob.');
                    res.status(500).json({error: 'Error deleting blob'});
                } else{
                    console.log('Blob deleted successfully.');
                    res.json({message: 'Deleted blob successfully.'});
                }
            })
        }
    });
});



app.post('/api/signin', async (req, res) =>{
    const { email, password} = req.body;
    
        try {
            const dbName = 'mydatabase';
            const db = client.db(dbName);
            const collection = db.collection('credentials');
    
            const user = await collection.findOne({ email: email, password: password });
    
            if (user) {
                // User authenticated
                res.status(200).json({ status: 'success', message: 'Authentication successful' });
                console.log('User authenticated:', email);
            } else {
                // User not found or invalid credentials
                res.status(401).json({ status: 'error', message: 'Invalid email or password' });
                console.log('Invalid email or password');
            }
        } catch (error) {
            console.error('Error handling sign-in:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})