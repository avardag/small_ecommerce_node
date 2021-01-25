const fs = require("fs");
const crypto = require("crypto");

class Repository {
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
  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
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
module.exports = Repository;
