const Router = require('express-promise-router')
const { asyncQuery } = require('../db')
const { getStoresinCategory, getStoreData, getMultipleStoresData } = require('./utils')
const { categoricalJSON } = require("../fixtures/categorical-summary")
const router = new Router()

module.exports = router
router.get('/list', async (req, res, next) => {
    const query = 'SELECT category FROM categories'
    const allCategories = await asyncQuery(query, (results) => results.rows.map((row) => row.category))
    res.send(allCategories)
})

router.get('/search/:categoryName', async (req, res, next) => {
    const categoryName = req.params.categoryName
    const summaryText = categoricalJSON[categoryName]
    const storeUrlsInCategory = await getStoresinCategory(categoryName, 1000)
    const brandPoliticalDataList = await getMultipleStoresData(storeUrlsInCategory)

    const totalKey = 'Total Contributions'
    const demKey = 'Total Contributed to Democrats'

    let categoryTotalContribution = 0
    let categoryTotalDemContribution = 0
    brandPoliticalDataList.forEach(({ politicalData }) => {
        const data = politicalData[0]
        const t = parseCommaSeparatedNum(data[totalKey] || "")
        const d = data[demKey]
        categoryTotalContribution += t
        categoryTotalDemContribution += d
    })

    res.send({
        categoryName, summaryText,
        categoryTotalContribution,
        categoryTotalDemContribution,
        brandPoliticalDataList,
    })
})


const parseCommaSeparatedNum = (strNum) => {
    return (Number(strNum.replace(/,/g, '')))
}