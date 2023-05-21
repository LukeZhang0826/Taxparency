

export const SQLITE = require('sqlite-sync');
export const PAYMENTS_TABLE = "Payments"
export const TRANSACTION_IDS = "Transactions"
export const DB_NAME = "transactions.db"



//example of usage
//////
loadDB();
addTransaction("abc");
addTransaction("def");

let r = listTransactions();
console.log(r);
//////


/*
Takes a hash (String) and an amount (float) and adds it to the db, 
 returning a bool on whether the entry was added or not

   true: added/exists
   false: error
*/
export function addPaymentEntry(hash, amountPayable) {
    SQLITE.connect(DB_NAME);
    let statement = "INSERT INTO "+PAYMENTS_TABLE+"(id,pay) VALUES(\""+hash+"\",\""+amountPayable+"\")";
    try {
        SQLITE.run(statement);
    }
    catch (e) {
        console.log(e);
        return false;
    }
    SQLITE.close();
    return true;
    
}



/*
  Gets all of the entries in the database, returns a list in the format
    [{id: "abc", pay: "def"}, ...]
*/
export function getPaymentsEntries(){
    SQLITE.connect(DB_NAME);
    try {
    return SQLITE.run("SELECT * FROM "+PAYMENTS_TABLE);
    }
    catch (e) {
        console.log(e)
        return [];
    }
    finally {
    SQLITE.close();
    }
}



/*
  Returns a list of strings of all of the entries in the DB, 
  in the format id: pay
*/
export function formatPayments() {

    let values = getPaymentsEntries();
    let data = [];
    for (let i=0; i<values.length; i++) {
        let value = values[i];
        data.push(value.id +": "+value.pay);
    }
    return data;
}
 



/*
  Adds a transaction id hash into the db.
*/
export function addTransaction(hash){
    SQLITE.connect(DB_NAME);
    let statement = "INSERT INTO \""+TRANSACTION_IDS+"\" (\"transaction_id\") VALUES (\""+hash+"\")";
    try {
    SQLITE.run(statement);
    return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
    finally {
        SQLITE.close();
    }
}


/*
 Returns a list of all of the transaction ids hashes in the db
  in the format: [{transaction_id:'abc'},{transaction_id:'def'}] ...

*/
export function listTransactions() {
    SQLITE.connect(DB_NAME);
    let statement = "SELECT * FROM \""+TRANSACTION_IDS+"\" ORDER BY "+TRANSACTION_IDS+".transaction_id"
    try {
        let result = SQLITE.run(statement);
        return result;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        SQLITE.close();
    }
}




/*
  Loads/creates the DB. 
  Call this first each time the program starts up to ensure that the db exists.
*/
export function loadDB() {
    SQLITE.connect(DB_NAME);
    SQLITE.run("CREATE TABLE \""+PAYMENTS_TABLE+"\" (\"id\" TEXT UNIQUE,\"pay\" TEXT);");
    SQLITE.run("CREATE TABLE \""+TRANSACTION_IDS+"\" (\"transaction_id\" TEXT UNIQUE);")
    SQLITE.close();
}