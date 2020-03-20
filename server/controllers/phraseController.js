const { db } = require('../../server');

exports.phraseIndex = (req, res) => {
  db('phrases').select().orderBy('id', 'desc')
  .then(phrases => res.status(200).json({ phrases }))
  .catch(error => res.status(500).json({ error }));
};

exports.getSinglePhrase = (req, res) => {
  const { id } = req.params;
  db('phrases').select().where({ id })
    .then((phrase) => {
      return res.status(200).json(phrase);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.addPhrase = (req, res) => {
  const newPhrase = req.body;
  console.log(newPhrase);
  return db('phrases')
    .insert(newPhrase, '*')
    .then(phrase => res.status(201).json(phrase))
    .catch(error => res.status(500).json({ error }));
};

exports.updatePhrase = (req, res) => {
  const { id } = req.params;
  const patchedPhrase = req.body;
  return db('phrases')
    .where({ id })
    .select()
    .update(patchedPhrase, '*')
    .then(phrase => res.status(200).json(phrase))
    .catch(error => res.status(500).json({ error }));
};

exports.deletePhrase = (req, res) => {
  const { id } = req.params;
  return db('phrases')
    .where({ id })
    .del()
    .then(() => res.status(200).json('You have deleted the phrase and associated word list.'))
    .catch(error => res.status(500).json({ error }));
};

