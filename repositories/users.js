const fs = require("fs");
const crypto = require("crypto");
const util = require("util"); //for util.promisify()

const scryptPromise = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename); //check if file exists
    } catch (err) {
      //if file !exists: create file with given name
      //and [] in it written
      fs.writeFileSync(this.filename, "[]");
    }
  }
  //methods
  //get all of records
  async getAll() {
    // open the file, parse it, and return the parsed data, will arr of objs
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }
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
  //to write records into repo
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) //2 for indentation in json file
    );
  }
  //to generate random id using nodes crypto module
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
  //to delete om records filtered by id
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords); //write new filtered records into a file
  }
  async update(id, attrs) {
    const records = await this.getAll();
    const recordToUpdate = records.find((record) => record.id === id);
    if (!recordToUpdate) {
      throw new Error(`record with id ${id} not found`);
    }

    Object.assign(recordToUpdate, attrs);

    await this.writeAll(records);
  }
  async getOneBy(filters) {
    const records = await this.getAll();
    //terate over records array
    for (let record of records) {
      let found = true; //set found var as default at each iteration

      //iterate over keys of filtersObj to find match
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          //if key-vaule of them dont match
          found = false; //flip found to false
        }
        //if no flipping of found to false, and found is still true in this iteration:
      }
      if (found) {
        //return the record in Records array
        return record;
      }
    }
  }
}

//import instance of a class
module.exports = new UsersRepository("users.json");
