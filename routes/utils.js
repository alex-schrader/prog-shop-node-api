const { issuesJSON } = require("../fixtures/issues")
const { asyncQuery } = require('../db')

const getMultipleStoresData = async (urls) => Promise.all(
    urls.map(async (url) => await getStoreData(url))
)

const getStoresinCategory = async (category, limit = 10) => {
    const queryString = `select url from brands where primary_category='${category}' limit ${limit}`
    const urls = await asyncQuery(queryString, (results) => results.rows.map(({ url }) => url))
    return urls
}

const getStoreData = async (url) => {
    const brandDetails = await getBrandDetails(url)
    const politicalData = await getPoliticalData(url)

    return { brandDetails, politicalData }
}

const getPoliticalData = async (url) => {
    const queryString = `SELECT * FROM political WHERE url='${url}'`

    const results = await asyncQuery(queryString, results => results.rows)
    return results
}

const getBrandDetails = async (url) => {
    const queryString = `SELECT * FROM brands WHERE url='${url}'`

    const cleanRow = (row) => {
        const { categories, url, issues } = row
        const parsedCategories = JSON.parse(categories.replace(/'/g, '"').replace(/nan/g, 'null'))

        const issueKeys = issues ? issues.split(",") : []
        const hydratedIssues = issueKeys.map(k => issuesJSON[k])

        return (
            {
                domain: url,
                name: row.name,
                category: parsedCategories[0],
                link: `https://${url}`,
                logoUrl: `https://s3.us-east-2.amazonaws.com/ps-logos/${row["Logo File Name"]}`,
                issues: hydratedIssues
            }
        )
    }

    const results = asyncQuery(queryString, (results) => cleanRow(results.rows[0]))
    return results
}

module.exports = {
    getStoresinCategory,
    getStoreData,
    getMultipleStoresData
}