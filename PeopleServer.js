

(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "FirstName",
            alias: "First Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "LastName",
            alias: "Last Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Email",
            alias: "Email",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "City",
            alias: "City Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "EmployeeID",
            alias: "Employee Unique ID",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "employeelist",
            alias: "Company wide Employee list",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {

        var paramObj = JSON.parse(tableau.connectionData);
        
        var paramString = "'" + paramObj.FirstName + "'";

        var apiCall = "http://localhost:8889/services.odata.org/TripPinRESTierService/People?$filter=FirstName eq " + paramString;


        $.getJSON(apiCall, function(resp) {
            var feat = resp.value,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                var City;
                
                if (feat[i].AddressInfo[0] == null) {
                    City = "N/A";
                } else {
                    City = feat[i].AddressInfo[0].City.Name;
                }

                tableData.push({
                    "FirstName": feat[i].FirstName,
                    "LastName": feat[i].LastName,
                    "Email": feat[i].Emails[0],
                    "City": City,
                    "EmployeeID": "4",
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var paramObj = {
                FirstName: $('#first-name').val().trim()
            };

            // Simple date validation: Call the getDate function on the date object created
            function isValid(dateStr) {
                //var d = new Date(dateStr);
                //return !isNaN(d.getDate());
                return true; // You can add validators here
            }

            if (isValid(paramObj.FristName)) {
                tableau.connectionData = JSON.stringify(paramObj); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "Company Employee List"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid First name. For example, John.");
            }
        });
    });
})();
