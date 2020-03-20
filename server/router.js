const express = require('express');
const user = require('./controllers/userController');
const phrase = require('./controllers/phraseController');
const wordList = require('./controllers/wordListController');
const router = express.Router();

// user register and pass reset
router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.post('/resetpass', user.resetPassword);
router.patch('/update-user-pass', user.updateUserPass);

// users
router.get('/users', user.userIndex);
router.get('/users/:id', user.getSingleUser);
router.patch('/users/:id', user.editUser);
router.delete('/users/:id', user.deleteUser);

// phrases
router.get('/phrases', phrase.phraseIndex);
router.get('/phrases/:id', phrase.getSinglePhrase);
router.post('/add-phrase', phrase.addPhrase);
router.patch('/phrases/:id', phrase.updatePhrase);
router.delete('/phrases/:id', phrase.deletePhrase);

// wordlists
router.get('/wordlists', wordList.wordListIndex);
router.get('/wordlists/:id', wordList.getSingleWordList);
router.post('/add-wordlist', wordList.addWordList);
router.patch('/wordlists/:id', wordList.updateWordList);
router.delete('/wordlists/:id', wordList.deleteWordList);

module.exports = router;