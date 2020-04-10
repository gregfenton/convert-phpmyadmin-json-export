# convert-phpmyadmin-json-export
Script that re-writes a JSON export from phpMyAdmin so that numeric fields are not strings.  For example, it takes the JSON export of:
```json
[{ type:"table",name:"myuser",database:"mysql", data: [
   {"id": "3","firstName":"john","password":null,"maybeAFloat":"86.2"},
   {"id": "4","firstName":"mary","password":"*FF80A76950918AA85","maybeAFloat":"192.168.1.1"}]
 }]
```
yields the output of (with some whitespace removed):
```json
[{"type": "table", "name": "myuser", "data":
    [{"id": 3, "firstName": "john", "password": null, "maybeAFloat": 86.2, },
     {"id": 4, "firstName": "mary", "password": "*FF80A76950918AA85", "maybeAFloat": "192.168.1.1",}]
}]
```
Notice the values of `3`, `4`, `86.2` and `null` are not strings!  The main benefit here is that the numeric fields are output as Javascript numerics and not strings.  If used to import to something like [Firestore](https://firebase.google.com/docs/firestore/), the values will maintain their Javascript datatype, not simply all being stored as strings.

# Trying It Out
1. Clone this repository to your machine.  For example:
    - ```git clone https://github.com/gregfenton/convert-phpmyadmin-json-export```
1. Go to the demo phpMyAdmin site, log in as user: root pass: (no password)
    - https://demo.phpmyadmin.net/STABLE/?pma_username=root
1. At the top of the window, click **Export**
1. Set:
     - **Export method:** quick
     - **Format:** JSON
1. Click **Go**
1. You just downloaded a JSON file.  Copy it to the same directory that `convertPhpJsonExport.js` is in.
1. Rename the JSON file so that its extension is `.js`.  For example:
    - ``` mv 192_168_30_23.json 192_168_30_23.js```  
1. Edit the JSON file by adding the following as the first line of the file:
    - ```javascript
      exports.mysqlData =     
1. In the file [convertPhpJsonExport.js](./convertPhpJsonExport.js), for the line that sets the ```jsonData``` variable, load the downloaded JSON data.  For example:
    - ```javascript
      var jsonData = require("./192_168_30_23").mysqlData;     
1. Run the code in this script: 
    - ```node convertPhpJsonExport.js > convertedOutput.json```

# Debugging
By default, debug logging is turned off.  You can enable it, simply modify the line:
    ```const doLog = false;```
to
    ```const doLog = true;```

# Using Your Own phpMyAdmin JSON export
Follow steps 7 thru 10 using your own export .json file.
