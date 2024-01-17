const basePath = process.cwd()
const fs = require("fs")
const path = require("path")

const getRarity = async () => {
  const nfts = []

  }

  processRarity(nfts)
}

function processRarity(nfts) {
  console.log('Processing Rarity')
  const rarity = {}

  // loop through all nfts
  for(const nft of nfts) {
    // check if attributes exist
    if(nft.metadata?.attributes?.length > 0) {
      // loop through all attributes
      for(attribute of nft.metadata.attributes) {
        // add trait type to rarity object if it doesn't exist
        if(!rarity[attribute.trait_type]) {
          rarity[attribute.trait_type] = {}
        }
        // add attribute value to rarity object if it doesn't exist and set count to 0
        if(!rarity[attribute.trait_type][attribute.value]) {
          rarity[attribute.trait_type][attribute.value] = {
            count: 0
          }
        }
        // increment count of trait type
        rarity[attribute.trait_type][attribute.value].count++
        // add rarity score to rarity object for each trait type
        rarity[attribute.trait_type][attribute.value].rarityScore = (1 / (rarity[attribute.trait_type][attribute.value].count / nfts.length)).toFixed(2)
      }
    }
  }

  // create a total rarity score for each nft by adding up all the rarity scores for each trait type
  let filterAndTotal = nfts
    .filter(nft => !!nft.metadata?.attributes)
    .map(nft => {
      let totalScore = 0;
      for(attribute of nft.metadata.attributes) {
        attribute.rarity_score = rarity[attribute.trait_type][attribute.value].rarityScore
        totalScore += parseFloat(attribute.rarity_score)
      }
      nft.total_rarity_score = +parseFloat(totalScore).toFixed(2)
      return nft
    })

  // sort and rank nfts by total rarity score
  let sortAndRank = filterAndTotal
    .sort((a, b) => b.total_rarity_score - a.total_rarity_score)
    .map((nft, index) => {
      nft.rank = index + 1
      return nft
    })
    .sort((a, b) => a.token_id - b.token_id)

  if (!fs.existsSync(path.join(`${basePath}`, "/rarity"))) {
    fs.mkdirSync(path.join(`${basePath}`, "rarity"));
  }
  fs.writeFileSync(`${basePath}/rarity/_rarity_data.json`, JSON.stringify(sortAndRank, null, 2))
}

getRarity()
