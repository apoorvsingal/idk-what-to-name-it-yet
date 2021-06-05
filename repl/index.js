const pty = require("node-pty");
const fs = require("fs");

const node = pty.spawn("ts-node");

process.stdin.pipe(node);

node.pipe(process.stdout);
node.pipe(process.stderr);

node.write(fs.readFileSync("init.ts", "utf8"));