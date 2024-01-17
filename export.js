const basePath = process.cwd();
const fs = require("fs");

(async () => {
  try {
    // read json data
    const rawdata = fs.readFileSync(
      `${basePath}/rarity/_rarity_data.json`
    );
    const nfts = JSON.parse(rawdata);


    const sortedNfts = nfts.sort(
      (a, b) => b.total_rarity_score - a.total_rarity_score
    );
    const projectName = sortedNfts[0].name.match(/.+?(?=#)/);

    fs.writeFileSync(
      `${projectName[0].trim()}.json`,
      JSON.stringify(sortedNfts.map(({ rank, total_rarity_score, name }) => {
          return {
            name,
            rank,
            total_rarity_score,
          };
        }),
        'rank',
        1,
      ),
      'utf8'
    );
  } catch (e) {
    console.error('Something went wrong', e);
  }
})();
