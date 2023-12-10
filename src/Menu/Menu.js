import '../App';
import '../App.css';

import {
  Link
} from "react-router-dom";
  

function Menu({ handleSignOut }) {
  return (
    <div className="menu" aria-label="Main Menu"
    role="navigation" itemScope
    itemType="https://schema.org/SiteNavigationElement"> 
        <ul>
            <li><Link itemProp ="url" to="/">Home</Link></li>
            <li><Link itemProp ="url" to="/confBudget">Configure Budget</Link></li>
            <li><Link itemProp ="url" to="/expenditure">Add Monthly Expenditure</Link></li>
            <li><Link itemProp ="url" to="/monthlyExpenses">View Montly Expenditure</Link></li>
            <li><Link itemProp="url" to='/signin' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
    </div>
  );
}

export default Menu;
