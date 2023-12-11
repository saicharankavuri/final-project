import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';

const ConfBudget = ({ userData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [formData, setFormData] = useState({
    expense: '',
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = userData;
      console.log(userData)

      if (!token) {
        console.error('No token available');
        return;
      }
  

      // Call your backend API to create a new expense
      const response = await fetch('http://localhost:3001/confBudget', {
        method: 'POST',
        body: JSON.stringify({ description, amount, user }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log(response)

      if (response.ok) {
        const newExpense = await response.json();
        alert('The budget has been created , go to home page to check out the visualizations');
        console.log(newExpense); // Update the user state or perform any necessary actions
      } else {
        // Handle server-side error
        const errorData = await response.json();
        console.error(errorData.error);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error creating new expense:', error);
      // Handle other errors (e.g., network issues)
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = userData;
      console.log(userData)

      if (!token) {
        console.error('No token available');
        return;
      }
  
      console.log(formData.expense);
      // Call your backend API to create a new expense
      const response = await fetch('http://localhost:3001/delBudget', {
        method: 'POST',
        body: JSON.stringify({ expense: formData.expense }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log(response)

      if (response.ok) {
        const newExpense = await response.json();
        alert('The budget has been deleted, go to home page to check out the visualizations');
        console.log(newExpense); // Update the user state or perform any necessary actions
      } else {
        // Handle server-side error
        const errorData = await response.json();
        console.error(errorData.error);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error creating new expense:', error);
      // Handle other errors (e.g., network issues)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // Fetch description options from the database
    axios.get('http://localhost:3001/expenses', {
        headers: {
          'X-User-ID': userData.user._id,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Assuming the response.data is an array of objects with 'description' field
        setDescriptionOptions(response.data.map(option => ({
          label: option.description,
          value: option._id,
        })));
      })
      .catch((error) => {
        console.error('Error fetching description options:', error);
      });

   
  }, []);

  return (
    <div>
      <div className="SignInContainer">
        <h2>Add new Expense</h2>
        <form className="SignInForm" onSubmit={handleSubmit}>
          <label>Expense</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <br />
          <label>Budget</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="SignInContainer">
      <h2>Remove an Expense</h2>
      <form className="SignInForm" onSubmit={handleSubmit2}>
      <label>
          Description:
          <select name="expense" value={formData.expense} onChange={handleChange}>
            <option value="">Select Description</option>
            {descriptionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </label>
        </form>
      </div>
    </div>
  );
}

export default ConfBudget;
