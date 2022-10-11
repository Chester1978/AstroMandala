"use strict";

const sweph = require("./build/Release/sweph.node");
sweph.constants = require("./constants.js");
sweph.sweph = sweph;
sweph.default = sweph;
module.exports = sweph;

//incluir no root: (cópia do repositório GIT)
//index.js  , constants.js, build\Release, node_modules