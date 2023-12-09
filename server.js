const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const _ = require('lodash');
const app = express();
const cors = require('cors');
const MonthlyExpense = require('./models/monthlyExpenseModel');
const port = 3001;
const tls = require('tls');
const compression = require('compression');
console.log('TLS module is available.');

require('dotenv').config();

const corsOptions = {
  origin: 'http://159.203.113.177:3000', // Replace with the origin of your React app
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
//app.use(cors());
app.use(bodyParser.json());

//mongoose.set('debug', true); 
mongoose.connect('mongodb+srv://doadmin:Av5Zh917P6NB24q3@db-mongodb-nyc3-00339-fcfc13b6.mongo.ondigitalocean.com/expenses?replicaSet=db-mongodb-nyc3-00339&tls=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




// User signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3m' });
    res.json({user, token});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User signin
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.sendStatus(401);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3m' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new expense with user authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  //console.log(token)
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  //console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log(err)
    //console.log(user)
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

app.post('/renewToken', authenticateToken, (req, res) => {
  // Logic to generate a new token
  const userId = req.header('X-User-ID');
  const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1m',
  });
  res.json({ token: newToken });
});

app.post('/confBudget', authenticateToken, async (req, res) => {
  try {
    const { description, amount, user } = req.body;
    console.log(req.body);
    const id = user._id;
    const newExpense = await Expense.create({
      description,
      amount,
      user: id,
    });
    //console.log(res);
    res.json(newExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});


// Get all expenses
// Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await Expense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/expenditure', authenticateToken, async (req, res) => {
  try {
    const { expense, amount, date, user } = req.body;
    console.log('sdafasd')
    console.log(req.body);
    const id = user._id;
    const newMonthlyExpense = await MonthlyExpense.create({
      expense,
      amount,
      date,
      user: id,
    });
    //console.log(res);
    res.json(newMonthlyExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

app.get('/montlyExpenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await MonthlyExpense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, '159.203.113.177', () => {
  console.log(`Server is running on port ${port}`);
});
