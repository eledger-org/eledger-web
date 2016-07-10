/* eslint-disable */

/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    "app":                        "app", // "dist",
    "@angular":                   "node_modules/@angular",
    "angular2-in-memory-web-api": "node_modules/angular2-in-memory-web-api",
    "rxjs":                       "node_modules/rxjs",
    "ng2-select":                 "node_modules/ng2-select/",
    "ng2-bootstrap":              "node_modules/ng2-bootstrap/",
    "primeng":                    "node_modules/primeng/",
    "angular2TextMask":           "node_modules/angular2-text-mask/dist",
    "ng2-file-upload":            "node_modules/ng2-file-upload"
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    "app":                        { main: "main.js",  defaultExtension: "js" },
    "angular2-in-memory-web-api": { main: "index.js", defaultExtension: "js" },
    "rxjs":                       { defaultExtension: "js" },
    "ng2-select":                 { defaultExtension: "js", main: "index.js" },
    "ng2-bootstrap":              { main: "index.js" },
    "primeng":                    { defaultExtension: "js" },
    "angular2TextMask":           { main: "angular2TextMask.js" },
    "ng2-file-upload":            { main: "ng2-file-upload.js" }
  };
  var ngPackageNames = [
    "common",
    "compiler",
    "core",
    "forms",
    "http",
    "platform-browser",
    "platform-browser-dynamic",
    "upgrade",
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages["@angular/"+pkgName] = { main: "index.js", defaultExtension: "js" };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages["@angular/"+pkgName] = { main: "bundles/" + pkgName + ".umd.js", defaultExtension: "js" };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  packages['@angular/router-deprecated'] = { main: 'index.js', defaultExtension: 'js' };
  packages['@angular/router'] = { main: 'index.js', defaultExtension: 'js' };
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
