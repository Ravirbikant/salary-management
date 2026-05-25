const db = require('../db/database');

const getCountryInsights = (req, res) => {
    const { country } = req.params;

    const insights = db.prepare(`
    SELECT 
      MIN(salary) as min,
      MAX(salary) as max,
      AVG(salary) as average,
      COUNT(*) as total_employees
    FROM employees
    WHERE country = ?
  `).get(country);

    if (!insights.total_employees) {
        return res.status(404).json({ error: 'No employees found for this country' });
    }

    res.json(insights);
};

module.exports = { getCountryInsights };