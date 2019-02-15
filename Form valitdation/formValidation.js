/////////////////////////////////////
//                                 //
//      The validator library      //
//                                 //
/////////////////////////////////////


// makeFormValidator is a function that returns an event handler (a function).
// The returned event handler will use the checkerFunctions as a set of functions to
// validate form fields, and the submitHandler to call if everything is valid.
function makeFormValidator(checkerFunctions, submitHandler, handleErrors) {
    // This function below is the actual form-validator that becomes an event handler
    // for form submissions.
    return function validator(event) {
        // This prevents the browser from sending the form-data to the server and
        // loading the server response as a new HTML page (replacing this one).
        event.preventDefault();

        const theForm = event.target;
        const theErrorReport = document.getElementById("error-report");
        // Like querySelectorAll() and getElementsByClassName(), getElementsByTagName()
        // does not return a proper Array, but something called an HTMLCollection.
        // We can't call forEach, map, filter etc. directly on an HTMLCollection,
        // but after we convert it to a normal array using the Array.from() function,
        // we can call all the cool higher-order functions that are methods of arrays.
        const fieldsCollection = theForm.getElementsByTagName(`input`);
        const fieldsArray = Array.from(fieldsCollection);

        console.log("---");

        const beginResult = fieldsArray.filter(inputElement => {
            return checkerFunctions[inputElement.name] !== undefined;
        });
        const middleResult = beginResult.map(inputElement => {
            const fieldName = inputElement.name;
            const checker = checkerFunctions[inputElement.name];
            const checkResult = checker(inputElement.value);
            return [fieldName, checkResult];
        });
        const endResult = middleResult.filter(([fName, result]) => result !== true);

        if (endResult.length == 0) {
            submitHandler(); // Everything checked out OK, call success-callback.
        } else {
            handleErrors(endResult);
        }
    };
}

// A checker function that simply checks if there is any input in the field.
function isRequired(value) {
    const result = value.trim() != "";
    return result || "Dit veld moet ingevuld worden";
}

// A checker function that simply checks how long the length of a string is and if it is too long.
function hasMaxLength(maxLength) {
    return function (value) {

        return value.length <= maxLength;
    }
}

// A checker function that simply checks how long the length of a string is and if it is too short.
function hasMinimumLength(minLength) {
    return function (value) {
        return value.length >= minLength;
    }
}


function checkBoth(...checkers) {
    return function (value) {
        let allCheckedTrue = true;
        checkers.forEach(function (funct) {
            if (!funct(value)) {
                allCheckedTrue = false;
            }
        });
        return allCheckedTrue;
    }
}

function optional(checker) {
    return function (value) {
        if (value.length > 0) {
            return checker(value);
        } else {
            return true;
        }
    }
}