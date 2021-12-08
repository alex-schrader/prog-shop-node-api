const Router = require('express-promise-router')
const { asyncQuery } = require('../db')
const { getStoresinCategory, getStoreData, getMultipleStoresData } = require("./utils")
const router = new Router()


module.exports = router

// mimics: https://api.progressiveshopper.com/brand/search/${query}
// given string input of brand name returns top 5 fuzzy matches
router.get('/search/:input', async (req, res, next) => {
    const brandInput = req.params.input

    const getFuzzyMatchQueryString = (input) => {
        const query =
            `
        SET pg_trgm.similarity_threshold = 0.8;  
        SELECT
        *
        FROM brands
        ORDER BY similarity(name, '${input}') DESC
        LIMIT 5;
    `
        return query
    }


    const query = getFuzzyMatchQueryString(brandInput)
    const results = await asyncQuery(query, (results) => {
        if (results) return results[1].rows;
        return null;
    })

    res.send(results)
})


// mimics /politicalData/brandContribution/{brandUrl}
// returns politicalData and brandDetails object 
// as well as politicalData and brandDetails object for stores in category 
router.get('/details/:slug', async (req, res, next) => {
    const url = req.params.slug
    const storeData = await getStoreData(url)
    const similarStoreUrls = await getStoresinCategory(storeData.brandDetails.category)
    const similarStoreData = await getMultipleStoresData(similarStoreUrls)

    res.send({
        ...storeData, similarStores: similarStoreData
    })
})


