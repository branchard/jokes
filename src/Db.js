const crypto = require('crypto');

class Db {
    constructor(dynamoDbInstance, dbName) {
        this.dbName = dbName;
        this.dynamoDbInstance = dynamoDbInstance;
    }

    saveNewJoke(joke) {
        this.dynamoDbInstance.putItem({
            TableName: this.dbName,
            Item: {
                'ID': {
                    // generate random key
                    S: crypto.randomBytes(20).toString('hex')
                },
                'JOKE': {
                    S: joke
                }
            }
        }, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
    }

    async getRandomJoke() {
        return new Promise((resolve, reject) => {
            this.dynamoDbInstance.scan({
                TableName: this.dbName
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    let item = data.Items[Math.floor(Math.random() * data.Items.length)];
                    resolve(item);
                }
            });
        });
    }

    async getJokeFromId(id) {
        return new Promise((resolve, reject) => {
            this.dynamoDbInstance.getItem({
                TableName: this.dbName,
                Key: {
                    'ID': {
                        S: id
                    }
                }
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item);
                }
            });
        });
    }
}

module.exports = Db;
