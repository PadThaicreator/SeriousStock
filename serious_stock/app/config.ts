export const config = {
    apiBackend : "https://seriousstock-production-dcef.up.railway.app",
    apilgetQoute : "https://finnhub.io/api/v1/stock/profile2?symbol=",
    apigetAllQoute : "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=cvvs11hr01qod00lrpj0cvvs11hr01qod00lrpjg",
    apigetPriceQoute : "https://finnhub.io/api/v1/quote?symbol=",
    apiGetNews : process.env.NEXT_PUBLIC_API_GETNEWS,
    apiToken : "&token=cvvs11hr01qod00lrpj0cvvs11hr01qod00lrpjg",
    apiProvince : "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
}