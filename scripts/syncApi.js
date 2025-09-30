const fs = require("node:fs");

async function fetchAndSync(url, filePath) {
  const result = await fetch(url);
  const data = await result.json();

  fs.writeFile(filePath, JSON.stringify(data, null, "  "), (err) => {
    if (err) {
      console.info(`❌ error updating ${filePath}`);
      console.error(err);
    } else {
      console.info(`✅ ${filePath} updated`);
    }
  });
}

(async () => {
  await fetchAndSync(
    "https://sessionize.com/api/v2/ctta9bhe/view/All",
    "./data/allSessions.json",
  );
})();
