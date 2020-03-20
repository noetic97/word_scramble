const { db } = require('../../server');

exports.wordListIndex = (req, res) => {
  db('wordlists').select().orderBy('id', 'desc')
  .then(wordLists => res.status(200).json({ wordLists }))
  .catch(error => res.status(500).json({ error }));
};

exports.getSingleWordList = (req, res) => {
  const { id } = req.params;
  db('wordlists').select().where({ id })
    .then((wordList) => {
      return res.status(200).json(wordList[0]);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.addWordList = (req, res) => {
  const newWordlist = req.body;
  newWordlist.words = JSON.stringify(newWordlist.words);
  
  console.log(newWordlist);
  return db('wordlists')
    .insert(newWordlist, '*')
    .then(wordList => res.status(201).json(wordList))
    .catch(error => res.status(500).json({ error }));
};

exports.updateWordList = (req, res) => {
  const { id } = req.params;
  const patchedWordList = req.body;
  patchedWordList.words = JSON.stringify(patchedWordList.words)
  return db('wordlists')
    .where({ id })
    .select()
    .update(patchedWordList, '*')
    .then(wordList => res.status(200).json(wordList))
    .catch(error => res.status(500).json({ error }));
};

exports.deleteWordList = (req, res) => {
  const { id } = req.params;
  return db('wordlists')
    .where({ id })
    .del()
    .then(() => res.status(200).json('You have deleted the word list'))
    .catch(error => res.status(500).json({ error }));
};

