const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Połącz z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/login_app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Utwórz schemat użytkownika
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Utwórz model użytkownika
const User = mongoose.model('User', userSchema);

// Endpoint dla logowania
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Sprawdź, czy użytkownik istnieje w bazie danych
        const existingUser = await User.findOne({ username, password });
        if (existingUser) {
            res.status(200).send('Login successful!');
        } else {
            // Jeśli użytkownik nie istnieje, utwórz nowego użytkownika
            await User.create({ username, password });
            res.status(201).send('User created successfully!');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
