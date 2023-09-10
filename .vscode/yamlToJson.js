const { readFileSync, writeFileSync } = require('fs');
const YAML = require('yaml');

const path = process.argv[2];
const outPath = process.argv[3];
const file = readFileSync(path, 'utf8');
const obj = YAML.parse(file);
const json = JSON.stringify(obj);
writeFileSync(outPath, json);