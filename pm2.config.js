module.exports = {
  apps : [{
    name        : "nodemgr",
    script      : "app.js",
    args:['-H','localhost','-S','CN' ,'-A','1' ],
    watch       : true,
  }]
};
