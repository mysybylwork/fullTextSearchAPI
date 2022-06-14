const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticUrl = process.env.ELASTIC_URL ||"http://localhost:9200"
const esclient = new Client({ node: elasticUrl});
const index = "quotes";
const type = "quotes";

async function createIndex(index) {
    try{
        await esclient.indices.create({ index });
        console.log(`Created index ${index}`)
    } catch (err){
        console.error(`An error occurred jwhile creating the index ${index}:`);
        console.error(err)

    }
}

// mapping
async function setQuotesMapping () {
    try {
        const schema = {
            quote: {
                type: "text"
            },
            author: {
                type: "text"
            }
        };

        await esclient.indices.putMapping({
            index, 
            type,
            include_type_name: true,
            body: {
                properties: schema
            }
        })

        console.log("Quote mapping created successfully")
    } catch (err) {
        console.error("An error occurred while setting the quotes mapping:");
        console.error(err);

    }
}


function checkConnection() {
    return new Promise(async (resolve) => {
        console.log("Checking connection to ElasticSearch...");
        let isConnected = false;
        while (!isConnected){
            try {
                await esclient.cluster.health({});
                console.log("Successfully connected to ElasticSearch");
                isConnected = true;
            } catch (_){
            }        
        }
        resolve(true);
    });
}

module.exports = {
    esclient,
    setQuotesMapping,
    checkConnection,
    createIndex,
    index,
    type
};