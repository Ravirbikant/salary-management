const db = require('../db/database');

describe('Database setup', () => {
  it('should have employees table', () => {
    const table = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='employees'
    `).get();
    
    expect(table).toBeDefined();
    expect(table.name).toBe('employees');
  });
});