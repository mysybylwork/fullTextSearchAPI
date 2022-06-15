const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticUrl ="http://127.0.0.1:9200"
const esclient = new Client({ node: elasticUrl});
const index = "quotes";
const type = "quotes";

// option 2 
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts:[elasticUrl]
});


client.ping({
    requestTimeout: 30000,

}, function(error){
    if (error){
        console.log(`Cannot connect to Elastic search : ${error}`);
    } else {
        console.log('Connected to Elasticsearch was successful!');
    }
})

async function createIndex(index) {
    try{
        await esclient.indices.create({ index });
        console.log(`Created index ${index}`)
    } catch (err){
        console.error(`An error occurred while creating the index ${index}:`);
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
      while (!isConnected) {
        try {
          await esclient.cluster.health({});
          console.log("Successfully connected to ElasticSearch");
          isConnected = true;
        // eslint-disable-next-line no-empty
        } catch (_) {
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