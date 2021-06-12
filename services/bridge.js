/** This file acts as the bridge between the routes and the database */
const db = require('./db');
const helper = require('./helper');
const config = require('../config/dbconfig');

/**
 *  Function selects multiple rows in table and returns all the results
 * @param {string} query 
 * @param {number} page 
 */
async function getMultiple(query,page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(query, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}


async function insert(query,insertArr){
    // transforms object values into array
    const result = await db.query(
      query, 
      insertArr
    );
  
    let returnObj = {message: 'Error in insert query'};
  
    if (result.affectedRows) {
      returnObj.message = 'Added successfully';

      // the first element in the insertArr will be allways the id of the inserted row so if successfully
      returnObj.id = insertArr[0]
    }
  
    return returnObj;
  }

module.exports = {
  getMultiple,
  insert
}