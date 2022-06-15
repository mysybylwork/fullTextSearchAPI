const elastic = require("./elastic");
const data = require("./data");
require("dotenv").config();

(async function() {
    console.log('connection to elastic')
    const isElasticReady = await elastic.checkConnection();

    if(isElasticReady) {
        const elasticIndex = await elastic.esclient.indices.exists({ index: elastic.index });
        if (!elasticIndex.body) {
            console.log('NOt connected to elastic')
            await elastic.createIndex(elastic.index);
            await elastic.setQuotesMapping();
            await data.populateDatabase();
        }
        server.start();
        console.log('Connected to elastic')
    }
})();

