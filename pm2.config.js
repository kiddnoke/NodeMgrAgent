module.exports = {
  apps : [{
    name        : "nodemgr",
    script      : "app.js",
    args:['-H','10.0.2.70','-S','CN' ,'-A','1' ],
    watch       : true,
  }]
};
