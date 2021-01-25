const fs = require("fs");
const crypto = require("crypto");
const util = require("util"); //for util.promisify()
const Repository = require("./repository"); //parent class

const scryptPromise = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  //methods

  //create a record in repo
  async create(attrs) {
    // {email: 'ajaj@gmai.co', pass: 'skssjsjs', name: 'aajaj'}
    attrs.id = this.randomId(); //assign a random id to attrs obj
    //generate a salt
    const salt = crypto.randomBytes(8).toString("hex");
    // generate hashed password
    const buffer = await scryptPromise(attrs.password, salt, 64);
    const hashed = buffer.toString("hex");
    //create new record with hashed password:(password + salt)
    const recordToSave = {
      ...attrs,
      password: `${hashed}.${salt}`,
    };
    //get all records from db
    const records = await this.getAll();
    //save new record to db
    records.push(recordToSave);
    await this.writeAll(records);
    //return newly created full usr obj with ID included, and hashed pass
    return recordToSave;
  }
  async comparePasswords(savedPass, suppliedPass) {
    //savedPass-> "hashed.salt" , suppliedPass-> password entered by user
    const [hashed, salt] = savedPass.split(".");
    //hash suppliedPass to compare
    const buffer = await scryptPromise(suppliedPass, salt, 64);
    const hashedSuppliedPass = buffer.toString("hex");
    //comare and return booelan
    return hashed === hashedSuppliedPass;
  }
}

//import instance of a class
module.exports = new UsersRepository("users.json");
