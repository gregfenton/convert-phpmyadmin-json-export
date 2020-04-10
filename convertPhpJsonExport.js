// To use:
// 1. Copy all of this code to a new script file called "convertPhpJsonExport.js"
// 2. Go to the demo phpMyAdmin site, log in as user: root pass: (no password)
//      https://demo.phpmyadmin.net/STABLE/?pma_username=root
// 3. At the top of the window, click "Export"
// 4. Set:
//       Export method: quick
//       Format: JSON
// 5. Click "Go"
// 6. You just downloaded a JSON file.  Copy it to the same directory that 
//    convertPhpJsonExport.js is in.
// 7. Rename the JSON file so that its extension is ".js".  For example:
//          mv 192_168_30_23.json 192_168_30_23.js
// 8. Edit the JSON file by adding the following as the first line of the file:
//          exports.mysqlData =
// 9. In the line below these instructions (line 22 of this file), have the
//    jsonData variable load this newly downloaded JSON data.  For example:
//        var jsonData = require("./192_168_30_23").mysqlData;
// 10. Run the code in this script:
//        node convertPhpJsonExport.js > convertedOutput.json
//
var jsonData = require("./mysqlTestData").mysqlData;


// set to "true" if you want (a lot of) debugging output
const doLog = false;
const l = (str) => (doLog) ? console.log(str) : null;

// determines if the given value needs to be quoted or not
const q = (x) => {
  l("x is", x);

  if (x === null) {
    l("returning null");
    return "null";
  } else if (isInteger(x)) {
    l("returning parseInt: ", parseInt(x));
    return parseInt(x);
  } else if (typeof x === 'string' && x.match(/\..*\./g)) {
    l("string has multiple dots:", x);
    return quote(x);
  } else if (typeof x === 'string' && x.match(/[^0-9.]/g)) {
    l("string has non-numerics:", x);
    return quote(x);
  } else if (isFloat(x)) {
    l("returning parseFloat: ", parseFloat(x));
    return parseFloat(x);
  } else if (typeof x === "string") {
    l("returning string: ", quote(x));
    return quote(x);
  } else {
    l("returning ERROR:", typeof x);
    return "ERROR - wasn't expecting:" + typeof x;
  }
}

// puts double-quotes around the given value
const quote = (x) => '"' + x + '"';

const isInteger = (x) => parseInt(x) == x;
const isFloat = (x) => {
    let y = parseFloat(x);
    l("Y IS: ", y, " :: isNaN?", isNaN(y));
    return (!isNaN(y) && typeof y === 'number');
}

// keeps track of line indent amount
var indentCount = 0;
const increaseIndent = (incr) => indentCount += incr;

// appends given string with indenting (spaces) and appends a newline
const line = (str = "") => "  ".repeat(indentCount) + str + "\n";



// let's go!!
//
let output = line("[");
increaseIndent(1);

// jsonData should be a string that begins with an array of objects: [ {}, {}, {}, ... ]
//
jsonData.forEach((item, index) => {
  // only output tables (not header, database, ...)
  if(item["type"] !== "table") { return; }

  // onto the objects
  output += line('{');
  increaseIndent(1);

  output += line(quote("type") + ": " + q(item["type"]) + ",");
  output += line(quote("name") + ": " + q(item["name"]) + ",");
  output += line(quote("data") + ":");
  output += line("[\n");
  increaseIndent(1);

  item["data"].forEach((item2, index2) => {
    output += line("{");
    increaseIndent(1);

    // iterate over item2
    let data = item2;
    Object.keys(data).forEach((key) => {
      output += line(quote(key) + ": " + q(data[key]) + ",");
    })

    increaseIndent(-1);
    output += line("}");
  })
  
  increaseIndent(-1);
  output += line("]");

  increaseIndent(-1);
  output += '}\n'

})

increaseIndent(-1);
output += line("]");

console.log(output);
return;
