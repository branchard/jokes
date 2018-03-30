const crypto = require('crypto');

class Db {
    constructor(dynamoDbInstance, dbName) {
        this.dbName = dbName;
        this.dynamoDbInstance = dynamoDbInstance;
    }

    async saveNewJoke(joke) {
        return new Promise((resolve, reject) => {
            this.dynamoDbInstance.putItem({
                TableName: this.dbName,
                Item: {
                    'ID': {
                        // timestamp
                        S: new Date().getTime().toString()
                    },
                    'JOKE': {
                        S: joke
                    }
                }
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
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

    async getJokes() {
        return new Promise((resolve, reject) => {
            this.dynamoDbInstance.scan({
                TableName: this.dbName
            }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Items);
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

    async deleteJoke(id) {
        return new Promise((resolve, reject) => {
            this.dynamoDbInstance.deleteItem({
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
