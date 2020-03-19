const bcrypt = require('bcrypt'); // bcrypt will encrypt passwords to be saved in db
const crypto = require('crypto'); // built-in encryption node module
const { db } = require('../../server');

const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync('customerpass', salt);

const hashPassword = (password) => {
  return new Promise((resolve, reject) => bcrypt.hash(password, 10, (err, hash) => {
    err ? reject(err) : resolve(hash);
  }));
};

const findUser = (userReq, res) => {
  return db('users')
    .where({ email: userReq.username })
    .then((data) => {
        if (data.length > 0) {
          Object.assign(data[0], { database: 'users' });
        }
        return data;
    })
    .catch(error => res.status(401).json(error));
};

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) => bcrypt.compare(reqPassword, foundUser[0].password_digest,
    (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        resolve(response);
      } else {
        reject(new Error('Passwords do not match.'));
      }
    }));
};

exports.signin = (req, res) => {
  const userReq = req.body;
  let user;

  findUser(userReq)
    .then((foundUser) => {
      user = foundUser;
      return checkPassword(userReq.password, foundUser);
    })
    .then(() => {
      delete user[0].password_digest;
      res.status(200).json(user);
    })
    .catch(error => res.status(401).json({ error: 'Incorrect Username or Password' }));
};

// user will be saved to db
// we're explicitly asking postgres to return back helpful info from the row created
const createUser = (user) => {
  return db('users')
    .insert(user, '*')
    .then(data => data);
};

exports.signup = (req, res) => {
  const user = req.body;
  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password;
      user.password_digest = hashedPassword;
    })
    .then(() => createUser(user))
    .then(() => {
      delete user[0].password_digest;
      res.status(201).json({ user });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.resetPassword = (req, res) => {
  const userReq = req.body;

  findUser(userReq, res)
    .then((user) => {
      if (!user) {
        return res.status(500).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.updateUserPass = (req, res) => {
  const userReq = req.body;

  findUser(userReq)
    .then((userData) => {
      return db(`${userData[0].database}`)
        .where({ id: userData[0].id })
        .select()
        .then(() => {
          return hashPassword(userReq.newPassword)
            .then((hashedPassword) => {
              delete userReq.newPassword;
              userReq.password_digest = hashedPassword;
            })
            .then(() => {
              return db(`${userData[0].database}`)
                .where({ id: userData[0].id })
                .select()
                .update({ password_digest: userReq.password_digest }, '*')
                .then((user) => {
                  return res.status(200).json(user);
                })
                .catch(error => res.status(500).json({ error }));
            });
        });
    });
};

exports.userIndex = (req, res) => {
  db('users').select().orderBy('id', 'desc')
    .then(users => res.status(200).json(users))
    .catch(error => res.status(500).json({ error }));
};


exports.addUser = (req, res) => {
  const newUser = req.body;
  return db('users')
    .insert(newUser, '*')
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json({ error }));
};


exports.addCustomer = (req, res) => {
  const customer = req.body;
  
  console.log(customer);
  hashPassword(customer.password)
    .then((hashedPassword) => {
      delete customer.password;
      customer.password_digest = hashedPassword;
    })
    .then(() => createCustomer(customer))
    .then((customerData) => {
      delete customerData[0].password_digest; //eslint-disable-line
      res.status(201).json({ customerData: customerData[0] });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.editUser = (req, res) => {
  const { id } = req.params;
  const patchedUser = req.body;
  db('users')
    .where({ id })
    .select()
    .update(patchedUser, '*')
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db('users')
    .where({ id })
    .del()
    .then(() => res.status(200).json('You have removed the user'))
    .catch(error => res.status(500).json({ error }));
};
