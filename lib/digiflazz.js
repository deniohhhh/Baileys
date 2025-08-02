const axios = require("axios");
const crypto = require("crypto");
const config = require("../config.json");

function getSignature(refId) {
  return crypto.createHash("md5").update(config.digiflazz_username + config.digiflazz_api_key + refId).digest("hex");
}

async function getProduk() {
  const data = {
    cmd: "prepaid",
    username: config.digiflazz_username,
    sign: crypto.createHash("md5").update(config.digiflazz_username + config.digiflazz_api_key + "pricelist").digest("hex")
  };

  const res = await axios.post("https://api.digiflazz.com/v1/price-list", data);
  return res.data.data;
}

async function order(refId, buyerSkuCode, customerNumber) {
  const data = {
    username: config.digiflazz_username,
    buyer_sku_code: buyerSkuCode,
    customer_no: customerNumber,
    ref_id: refId,
    sign: getSignature(refId)
  };

  const res = await axios.post("https://api.digiflazz.com/v1/transaction", data);
  return res.data;
}

module.exports = { getProduk, order };
