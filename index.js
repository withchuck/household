(function(){

  // Set initial vars and capture existing DOM nodes
  var minAgeReq = 0;
  var householdArr = [];
  var householdList = document.getElementsByClassName('household')[0];
  var age = document.querySelectorAll('[name="age"]')[0];
  var relationship = document.querySelectorAll('[name="rel"]')[0];
  var dependent = document.querySelectorAll('[name="dependent"]')[0];
  var debug = document.getElementsByClassName('debug')[0];
  var addBtn = document.getElementsByClassName('add')[0];
  var formElem = document.getElementsByTagName('form')[0];
  var submitBtn = formElem.querySelectorAll('[type="submit"]')[0];

  // After add btn is clicked add person obj to household array
  var addPerson = function(e){
    e.preventDefault();

    // Run validation function and capture results
    var validated = validate();

    // Add person to household array and display on UI if valid
    if(validated.isValidAge && validated.isValidRel){
      householdArr.push({age:age.value, relationship:relationship.value, dependent:dependent.checked});
      buildHouseholdList();
    }
  };

  // Build household list with latest data
  var buildHouseholdList = function(){
    // Empty current list from UI
    householdList.innerHTML = '';

    // Loop through person array to add each person to UI
    for(var i=0; i<householdArr.length; i++){
      var currentObj = householdArr[i];
      var currentLI = document.createElement("li");

      // Build person li
      currentLI.innerHTML = '<strong>Age: </strong>' + currentObj.age + ', <strong>Relationship: </strong>' + currentObj.relationship + ', <strong>Dependent? </strong>' + currentObj.dependent + ' <button data-id=' + i + '>Remove</button>';

      // Attach event handler to current remove button
      var removeBtn = currentLI.querySelectorAll('[data-id="'+ i +'"')[0];
      removeBtn.addEventListener("click", removePerson);

      // Add current person li to DOM
      householdList.appendChild(currentLI);
    }
  };

  // Remove person from household array and rebuild household list
  var removePerson = function(e){
    var selectedIndex = e.currentTarget.getAttribute('data-id');
    householdArr.splice(selectedIndex, 1);
    buildHouseholdList();
  };

  // Ensure input matches validation requirements
  var validate = function(){
    var isInt = Number(age.value);
    var isValidAge = isInt > minAgeReq ? true : false;
    var isValidRel = relationship.value ? true : false;

    // Add elems that need to be validated to this array
    var validateThese = [
      {
        isValid: isValidAge,
        node: age,
        msg: "Please enter a valid age"
      },
      {
        isValid: isValidRel,
        node: relationship,
        msg: "Please select a relationship"
      }
    ];

    // Adds error message to DOM
    var showError = function(elem, txt){
      var isError = elem.parentNode.getElementsByClassName("error").length || false;
      if(!isError){
        var errorMsg = document.createElement('span');
        errorMsg.style.color = "#ff0000";
        errorMsg.innerHTML = txt;
        errorMsg.className = "error";
        elem.parentNode.appendChild(errorMsg);
      }
    };

    // Loop through and check all elements that require validation
    for(var i=0; i<validateThese.length; i++){
      var currentObj = validateThese[i];

      if(!currentObj.isValid){
        showError(currentObj.node, currentObj.msg);
      }else{
        var errorNode = currentObj.node.parentNode.getElementsByClassName("error")[0];
        if(errorNode){
          errorNode.parentNode.removeChild(errorNode);
        }
      }
    }

    return {isValidAge:isValidAge, isValidRel:isValidRel};
  };

  // Serialize household JSON data and submit to server
  var submitHousehold = function(e){
    e.preventDefault();

    var serializedHousehold = JSON.stringify(householdArr);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/YouAreFakePath/"); // Enter your 
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(serializedHousehold);

    debug.innerHTML = serializedHousehold;
    debug.style.display = "block";
  };

  addBtn.addEventListener("click", addPerson);
  submitBtn.addEventListener("click", submitHousehold);

})();
