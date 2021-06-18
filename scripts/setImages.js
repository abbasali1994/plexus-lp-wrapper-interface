const fs = require("fs");
const path = require("path");
let files = {};
let directory = "src/assets/";
const getFilesRecursively = (key) => {
  const filesInDirectory = fs.readdirSync(directory + key);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory + key, file);

    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      const filePath = path.join(key, file);
      if (!files[key]) files[key] = [];
      files[key].push({ image: `require('../assets/${filePath}')` });
    }
  }
};

// extracts all image file paths in assets folders 
["images", "icons", "gifs"].map((key) => getFilesRecursively(key));

// Create images.js File with require statements with static paths
const JsonData = JSON.stringify(files);
const data =
  "export const assets = " +
  JsonData.replace(/\"require/gi, "require").replace(/\)\"/gi, ")");
fs.writeFile("src/utils/images.js", data, (err) => {
  if (err) throw err;
});
