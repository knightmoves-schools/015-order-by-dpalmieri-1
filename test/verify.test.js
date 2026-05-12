const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const orderLocationAscSalaryDesc = (a, b) => {
  if (a.LOCATION === b.LOCATION) {
    if(a.SALARY < b.SALARY) {
      return 1;
    } else {
      return -1;
    }
  } else if (a.LOCATION > b.LOCATION) { 
    return 1;
  } else if (a.LOCATION < b.LOCATION) {
    return -1;
  }
  return 0;
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson15.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

it('Should order the `Employee` table by `LOCATION` in descending order and `SALARY` in ascending order', async () => {
    const results = await runScript(db, scriptPath);
    const sorted = [...results].sort(orderLocationAscSalaryDesc);

    expect(results).toEqual(sorted);
  });
});
