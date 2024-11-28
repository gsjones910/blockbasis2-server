const fs = require('fs');
const axios = require('axios');
const linksData_coinList = fs.readFileSync('./utils/coinList.json');
const allCoinList = JSON.parse(linksData_coinList);

function generateRandomString(num) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    str += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return str;
}

function newProject(name, image) {
  const element = {}
  element.name = name;
  element.img = image;
  const coinInfo = allCoinList.find(coin => coin.name === name);
  if (coinInfo) {
    const cgID = coinInfo.id
    element.cg = `https://www.coingecko.com/en/coins/${cgID}`
    element.cmc = `https://coinmarketcap.com/currencies/${cgID}/`
    element.symbol = coinInfo.symbol;
    element.ticker = (coinInfo.symbol).toUpperCase();
  }
  return element;
}

async function getCoinInfo(id) {
  try {
    const result = await axios({
      method: "get",
      url: `https://api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=false&tickers=false&community_data=false&developer_data=false`,
      headers: {
        "Content-Type": "application/json",
        maxContentLength: Infinity,
      }
    });
    return result.data;
  } catch (error) {
    console.log("faild==========>", id);
    return null;
  }
}

module.exports = { generateRandomString, getCoinInfo, newProject };