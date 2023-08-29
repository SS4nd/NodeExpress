// Hent pakker
const express = require('express');
const fs = require('fs/promises');
const httpStatus = require('http-status');
const path = require('path');

// Definer port og database
const app = express();
const PORT = 3000;
const DATABASE_FILE = path.join(__dirname, 'database.json');

app.use(express.json());
app.use(express.static('public'));

let items = {};

// readData læser databasen for at få info
async function readData() {
    try {
        const data = await fs.readFile(DATABASE_FILE, 'utf-8');
        items = JSON.parse(data || '{}');
    } catch (error) {
        console.error('Error reading data from the database:', error);
    }
}
readData();

// Funktion til at genere id
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Hvis funktionen bliver kaldt gemmer den json filen
async function saveData() {
    try {
        await fs.writeFile(DATABASE_FILE, JSON.stringify(items, null, 2));
    } catch (error) {
        console.error('Error saving data to the database:', error);
    }
}

// Finder kunstner udfra id
function getItemById(id) {
    const item = items[id];
    if (!item) {
        throw new Error('Item not found');
    }
    return item;
}

// POST call til at lave ny kunstner
app.post('/items', async(req, res) => {
    // tjekker om alle værdier giver mening og om de findes
    const { body } = req;

    if (!validateFields(body)) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Missing required fields' });
    }

    // laver id og favorite tag og tilføjer det til kunstnerens data
    const newItemId = generateUniqueId();
    body.id = newItemId;
    body.favorite = false;
    items[newItemId] = body;

    // gemmer data og sender status
    await saveData();
    res.status(httpStatus.CREATED).json(body);
});

// PUT call til at ændre en kunstner ud fra id
app.put('/items/:id', async(req, res) => {
    const id = req.params.id;

    try {
        // tjekker om alle værdier giver mening og om de findes

        const updatedItem = req.body;

        if (!validateFields(updatedItem)) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Missing required fields' });
        }

        getItemById(id);
        items[id] = updatedItem;

        // gemmer data og sender status
        await saveData();
        res.status(httpStatus.OK).json(updatedItem);
    } catch (error) {
        res.status(httpStatus.NOT_FOUND).json({ message: 'Item not found' });
    }
});

// Funktion til at validere om dataen er god nok, den har krav og tjekker om de er med i dataen
function validateFields(item) {
    const requiredFields = ['name', 'birthdate', 'activeSince', 'genres', 'labels', 'website', 'image', 'shortDescription'];
    return requiredFields.every(field => item[field]);
}

// GET call til at hente alle brugere
app.get('/items', (req, res) => {
    res.json(Object.values(items));
});

// GET call til at hente bruger ud fra id
app.get('/items/:id', (req, res) => {
    const id = req.params.id;

    try {
        const item = getItemById(id);
        res.json(item);
    } catch (error) {
        res.status(httpStatus.NOT_FOUND).json({ message: 'Item not found' });
    }
});

// DELETE call til at delete ud fra id
app.delete('/items/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const item = getItemById(id);
        delete items[id];

        await saveData();
        res.status(httpStatus.OK).json(item);
    } catch (error) {
        res.status(httpStatus.NOT_FOUND).json({ message: 'Item not found' });
    }
});

// Funktion og kode til at sikre at dataen er gemt ved fra ctrl + c eller et crash
async function exitHandler() {
    console.log('Saving data...');
    await saveData();
    process.exit(0);
}

process.on('beforeExit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('uncaughtException', async error => {
    console.error('Uncaught Exception:', error);
    await saveData();
    process.exit(1);
});

// Printer porten den kører på
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});