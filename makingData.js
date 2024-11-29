const fs = require('fs');
const { generateRandomString, newProject } = require('./baseFunctions');
const getMetaData = require('metadata-scraper')

//read data
const linksData_certik = fs.readFileSync('./data/audit_certik.json');
const links_certik = JSON.parse(linksData_certik);

const linksData_defisafety = fs.readFileSync('./data/audit_defisafety.json');
const links_defisafety = JSON.parse(linksData_defisafety);

const linksData_defi = fs.readFileSync('./data/hack_defi.json');
const links_defi = JSON.parse(linksData_defi);

const linksData_defillama = fs.readFileSync('./data/hack_defillama.json');
const links_defillama = JSON.parse(linksData_defillama);

const projects_data = fs.readFileSync('./result/projects.json');
var projects = JSON.parse(projects_data);

const defimetadataPromises = links_defi
  .filter(defi => defi.proof_link && defi.proof_link !== null)
  .map(async (defi) => {
    try {
      const metaData = await getMetaData(defi.proof_link);
      return {
        proof_link: defi.proof_link,
        image: metaData.image
      };
    } catch (error) {
      return {
        proof_link: defi.proof_link,
        image: ""
      };
    }
  });

const defillamametadataPromises = links_defillama
  .filter(defillama => defillama.link && defillama.link !== null)
  .map(async (defillama) => {
    try {
      const metaData = await getMetaData(defillama.link);
      return {
        link: defillama.link,
        image: metaData.image
      };
    } catch (error) {
      return {
        link: defillama.link,
        image: ""
      };
    }
  });

async function makingData() {
  const defimetadataResults = await Promise.all(defimetadataPromises);
  
  const defimetadataMap = new Map(
    defimetadataResults.map(result => [result.proof_link, result.image])
  );
  
  const defillamametadataResults = await Promise.all(defillamametadataPromises);

  const defillamametadataMap = new Map(
    defillamametadataResults.map(result => [result.link, result.image])
  );

  var projectKeyList = Object.keys(projects)
  var projectValueList = Object.values(projects)

  var newAudits = {
    "02amqksMxwYRVHLMMFYf": {
      "date_audited": 1668401200000,
      "score": 53,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/yteWkOSFQccWGfKoegTZ",
      "url": "https://blockbasis.gitbook.io/kyberswap/",
    },
    "09xi40DpwYIEiStAIEDi": {
      "date_audited": 1656626400777,
      "date_added": 1656626400808,
      "score": 78,
      "date_updated": 1656626400196,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/bgK9X4ii5msnJdt3OlKN",
      "url": "https://blockbasis.gitbook.io/dydx/",
    },
    "6a0pw1YUsw5Vp1rCwji0": {
      "date_audited": 1658268000910,
      "date_added": 1658268000278,
      "score": 90,
      "date_updated": 1658268000434,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/WiVKtsqlvSjlBUnL8tA1",
      "url": "https://blockbasis.gitbook.io/synthetix",
    },
    "c6ORrVwQcVmZI4wKjH4s": {
      "date_audited": 1670304400002,
      "score": 33,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/7Zu2vVIoYvMw4OWZe49o",
      "url": "https://blockbasis.gitbook.io/gains-network/",
    },
    "E9wn4ocFfmhXWEOaFI9R": {
      "date_audited": 1656972000915,
      "date_added": 1656972000560,
      "score": 44,
      "date_updated": 1656972000821,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/j2n4qZnOXU9xNGclYUWt",
      "url": "https://blockbasis.gitbook.io/pancakeswap/",
    },
    "HIgEQKBlfiosP0i1mt0a": {
      "date_audited": 1654812000341,
      "date_added": 1654812000219,
      "score": 52,
      "date_updated": 1654812000678,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/QA1wpnd5fVGNW0ckpPS7",
      "url": "https://blockbasis.gitbook.io/vapordex/",
    },
    "UPDMJwZhJbQmJVlpQ81v": {
      "date_audited": 1670596894000,
      "score": 67,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/U0WW3mhIImnzJa6aSpos",
      "url": "https://blockbasis.gitbook.io/sushiswap/",
    },
    "VtDcWADEsyVitnzGT2Jj": {
      "date_audited": 1662094800000,
      "score": 63,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/ruZh1lGGVUrb9MWxDix6",
      "url": "https://blockbasis.gitbook.io/assetmantle/",
    },
    "X4dgg5Oqm2Yt7GR9ql5f": {
      "date_audited": 1657231200616,
      "date_added": 1657231200545,
      "score": 71,
      "date_updated": 1657231200437,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/W1Slmt3DuQVAPeclUeFz",
      "url": "https://blockbasis.gitbook.io/alchemix/",
    },
    "inFkOWXJrUhMlx0T7CEx": {
      "date_audited": 1657490400411,
      "date_added": 1657490400248,
      "score": 87,
      "date_updated": 1657490400196,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/VGq1GpB9r5IkfeWmE4ki",
      "url": "https://blockbasis.gitbook.io/bancor/",
    },
    "j2q8blBdZoYvxm2JQCqd": {
      "date_audited": 1679401200000,
      "score": 70,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/nofmqUaGb9P4cuklpRrk",
      "url": "https://blockbasis.gitbook.io/inverse-finance/",
    },
    "qHUhXEU8ILFncNSO2eWN": {
      "date_audited": 1668001200000,
      "score": 77,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/J7VGnuwI5pvYzrJ0BVEp",
      "url": "https://blockbasis.gitbook.io/loopring/",
    },
    "sagKFL3uz0ztBG8FEep0": {
      "date_audited": 1656626400808,
      "score": 20,
      "auditor": "/auditors/VItxoy0iPPAuSUBA7pkO",
      "project": "/projects/iwRHINg6Sp5fTzb1cCsG",
      "url": "https://blockbasis.gitbook.io/hashflow/",
    },
  }
  var newHacks = {}
  var tempHacks = []
  var newProjects = {}

  for (const certik of links_certik) {
    const pIndex = projectValueList.findIndex(p => p.name === certik.name)
    var pKey = ""
    var pValue = {}
    if (pIndex !== -1) {
      pKey = projectKeyList[pIndex]
      pValue = projectValueList[pIndex]
    } else {
      pKey = generateRandomString(20)
      pValue = newProject(certik.name, certik.contentfulLogo)
    }
    projectKeyList.push(pKey)
    projectValueList.push(pValue)
    newProjects[pKey] = pValue

    const aKey = generateRandomString(20)
    const value = {
      "url": "https://www.certik.com/projects/" + certik.id,
      "auditor": '/auditors/k0F2nZoVrtApLLY5dyVa',
      "project": "/projects/" + pKey,
      "date_audited": Date.parse(certik.onboardedAt),
      "score": certik.newSecurityScore.score,
    }
    newAudits[aKey] = value
  }

  for (const defisafety of links_defisafety) {
    const pIndex = projectValueList.findIndex(p => p.name === defisafety.title)
    var pKey = ""
    var pValue = {}
    if (pIndex !== -1) {
      pKey = projectKeyList[pIndex]
    } else {
      pKey = generateRandomString(20)
      pValue = newProject(defisafety.title, defisafety.imageUrl)
    }
    projectKeyList.push(pKey)
    projectValueList.push(pValue)
    newProjects[pKey] = pValue

    const aKey = generateRandomString(20)
    const value = {
      "url": defisafety.url.replace("/pqrs/", "/app/pqrs/"),
      "auditor": '/auditors/TDhjVvkQBXB3LSJLpE0G',
      "project": "/projects/" + pKey,
      "date_audited": Date.parse(defisafety.date),
      "score": defisafety.finalScore,
    }
    newAudits[aKey] = value
  }

  for (const defi of links_defi) {
    const pIndex = projectValueList.findIndex(p => p.name === defi.title)
    var pKey = ""
    var pValue = {}
    if (pIndex !== -1) {
      pKey = projectKeyList[pIndex]
      pValue = projectValueList[pIndex]
    } else {
      pKey = generateRandomString(20)
      pValue = newProject(defi.title, "https://files.safe.de.fi/" + defi.logo_link)
    }

    pValue.total_funds_lost = defi.funds_lost
    projectKeyList.push(pKey)
    projectValueList.push(pValue)
    newProjects[pKey] = pValue

    const image = defi.proof_link ? defimetadataMap.get(defi.proof_link) : "";

    var randomKey = generateRandomString(20)
    var addItem = {
      "source": defi.proof_link,
      "image": image,
      "amount": defi.funds_lost,
      "description": defi.description,
      "function": defi.technical_issue,
      "issue_type": defi.scam_type.type,
      "date_hack": Date.parse(defi.date),
      "date_added": Date.now(),
      "project": "/projects/" + pKey,
      "project_name": defi.title,
      "date_updated": Date.now(),
    }
    newHacks[randomKey] = addItem
    tempHacks.push(addItem)
  }

  for (const defillama of links_defillama) {
    const pIndex = projectValueList.findIndex(p => p.name === defillama.name)
    var pKey = ""
    var pValue = {}
    if (pIndex !== -1) {
      pKey = projectKeyList[pIndex]
      pValue = projectValueList[pIndex]
    } else {
      pKey = generateRandomString(20)
      pValue = newProject(defillama.name, null)
    }

    const nHIndex = tempHacks.findIndex(nh => nh.project_name === defillama.name && nh.amount === 1000000 * (defillama.amount))
    if (nHIndex == -1) {
      const image = defillama.link ? defillamametadataMap.get(defillama.link) : "";
      var randomKey = generateRandomString(20)
      var addItem = {
        "source": defillama.link,
        "image": image,
        "amount": 1000000 * (defillama.amount),
        "description": defillama.classification,
        "function": defillama.technique,
        "issue_type": defillama.technique,
        "date_hack": defillama.date * 1000,
        "date_added": Date.now(),
        "project": "/projects/" + pKey,
        "project_name": defillama.name,
        "date_updated": Date.now(),
      }
      newHacks[randomKey] = addItem
      tempHacks.push(addItem)
      pValue.total_funds_lost = pValue.total_funds_lost + 1000000 * (defillama.amount)
    }

    projectKeyList.push(pKey)
    projectValueList.push(pValue)
    newProjects[pKey] = pValue
  }

  var nPKeyList = Object.keys(newProjects)
  for (const [index, pk] of projectKeyList.entries()) {
    const pIndex = nPKeyList.findIndex(p => p === pk)
    if (pIndex === -1) {
      newProjects[pk] = projectValueList[index]
    }
  }

  fs.writeFileSync('./result/audits.json', JSON.stringify(newAudits, null, 4));
  fs.writeFileSync('./result/hacks.json', JSON.stringify(newHacks, null, 4));
  fs.writeFileSync('./result/projects.json', JSON.stringify(newProjects, null, 4));
  console.log('making data end!')
};

module.exports = { makingData };
