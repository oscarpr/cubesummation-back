var updateREGEX = new RegExp(/^([\d]+\s){3}([\d,?.?]+){1}$/);
var queryREGEX = new RegExp(/^([\d]+\s){5}\d+$/);

function checkLimit(val, initial, final) {
    return !isNaN(val) && (val >= initial) && (val <= final);
}

/*
 * Object with all the error message of the app
 */
var ERROR_MESSAGES = {
    testcases: 'Test Cases must be number and between 1 and 50',
    matrixsize: 'Matrix size must be number and between 1 and 100',
    numberoperations: 'Number operations must be number and between 1 and 1000',
    operationformat: function (query) {
        return 'Invalid format to ' + query;
    },
    operationdigitsize: function (matrixsize) {
        return 'No coordinates can be greater than ' + matrixsize;
    },
    outofrange: 'Number out of range',
    invalidcoords: function (coord1, coord2) {
        return coord1 + ' can not be greater than ' + coord2;
    },
    invalidcoord: function (coord, matrixsize) {
        return coord + ' can not be greater than matrix size: ' + matrixsize;
    }
}
/* ---------------------------------------------------------------------------------------------------- */



/* Object with functios to validate queries format and validations:
 * 
 * update
 * @param operation, jsobject where the user type the operation.
 * @param matrixsize, saze of the test case matrix.
 * 
 * function to validate the update query. 
 * with regex check the format, if it's valid it create a vector with each digit and verify if 
 * it's greater than the matrix size, if just one is or format is not valid display the error.
 *
 * query
 * @param operation, jsobject where the user type the operation.
 * @param matrixsize, saze of the test case matrix.
 * 
 * function to validae the query query.
 * with regex check the format, if it's valid then it create a vector with each digit and verify if
 * its couple is smaller, if just one is or the format is not valid or there is a digit greater than matrix size,
 * display the error.
 */
var queryValidation = {
    update: function (operation, matrixsize) {
        if (updateREGEX.test(operation.value.trim())) {
            var operations = operation.value.split(' ');

            for (var i = 0; i < operations.length; i++) {

                var digit = operations[i];
                var digitindex = operations.indexOf(digit);

                if (digitindex === (operations.length - 1)) {
                    digit = digit.includes(',') ? digit.replace(',', '.') : digit;
                    if (digit < Math.pow(10, -9) || digit > Math.pow(10, 9)) {
                        errorFunctions.showError(operation, ERROR_MESSAGES.outofrange, true);
                    }
                } else if (digit <= 0 || digit > matrixsize) {
                    errorFunctions.showError(operation, ERROR_MESSAGES.operationdigitsize(matrixsize), true);
                    break;
                }

            }
        } else {

            errorFunctions.showError(operation, ERROR_MESSAGES.operationformat('UPDATE'), true);

        }
    },
    query: function (operation, matrixsize) {
        if (queryREGEX.test(operation.value.trim())) {
            var operations = operation.value.split(' ');

            for (var i = 0; i < (operations.length / 2); i++) {
                digit = +operations[i];
                if (digit > operations[i + 3]) {
                    errorFunctions.showError(operation, ERROR_MESSAGES.invalidcoords(digit, operations[i + 3]), true);
                    break;
                }

                if (digit > matrixsize) {
                    errorFunctions.showError(operation, ERROR_MESSAGES.invalidcoord(digit, matrixsize), true);
                    break;
                }

                if (operations[i + 3] > matrixsize) {
                    errorFunctions.showError(operation, ERROR_MESSAGES.invalidcoord(operations[i + 3], matrixsize), true);
                    break;
                }
            }

        } else {

            errorFunctions.showError(operation, ERROR_MESSAGES.operationformat('QUERY'), true);
        }
    }
}
/* ------------------------------------------------------------------------------------------------------------------------------*/

/*
 * Object with the functions to display and hide errors
 * 
 * showError
 * @param element, element where we want to display the error.
 * @param message, message to display.
 * @param jsObject, boolean to work the element like jsObject or JQueryObject
*/
var errorFunctions = {
    showError: function (element, message, jsObject) {
        if (jsObject) {
            element.classList.add('form-control-danger');
            element.parentElement.classList.add('has-danger');
        } else {
            element.parent().addClass('has-danger');
            element.addClass('form-control-danger');
        }

        view.erroroutlet.html(message);
        view.erroroutlet.removeClass('d-none');
        setTimeout(() => {
            this.hideError(element, jsObject, true);
        }, 2000);
    },
    hideError: function (element, jsObject, omitelement) {
        if (!omitelement) {
            if (jsObject) {
                element.classList.remove('form-control-danger');
                element.parentElement.classList.remove('has-danger');
            } else {
                element.parent().removeClass('has-danger');
                element.removeClass('form-control-danger');
            }
        }

        view.erroroutlet.addClass('d-none');
        view.erroroutlet.html('');
    }
}
/* ------------------------------------------------------------------------------------------------ */



/*
 * Object with functions to testCaseInput
 * 
 * createTestCases
 * @param testcases, number of testcases to create.
 */
var testCaseFunctions = {
    createTestCases: function (testcases) {
        testcases = +testcases;
        if (testcases > 0) {
            for (var i = 0; i < testcases; i++) {
                view.testcasescontainer.append(
                    '<div class="row" id="test-case-' + i + '">' +
                    '<div class="col-12 col-sm-6 form-group matrix-size-container"> ' +
                    '<label for="matrix-size-' + i + '" class="no-wrap">Matrix Size</label>' +
                    '<input type="text" id="matrix-size-' + i + '" name="matrix-size-' + i + '" class="form-control matrices-size" onkeyup="matricessizeFunctions.check(' + i + ')"> ' +
                    '</div>' +
                    '<div class="col-12 col-sm-6 form-group no-operations-container">' +
                    '<label for="number-operations" class="no-wrap">No. Operations</label>' +
                    '<input type="text" id="number-operations-' + i + '" name="number-operations-' + i + '" class="form-control" onkeyup="numberoperationsFunctions.check(' + i + ')">' +
                    '</div>' +
                    '</div> ')
            }
        }
    }
};
/* ---------------------------------------------------------------------------------------------------- */



/*
 * Object with the method to check the change on matricessize input.
 * check
 * @param indexchanged, index of the test case that is changing
 * validate the limit, if it's valid call the controller to create the matrix. 
 */
var matricessizeFunctions = {
    check: function (indexchanged) {
        var matrixsize = $('#matrix-size-' + indexchanged);

        errorFunctions.hideError(matrixsize);

        var valid = checkLimit(matrixsize.val(), 1, 100);

        if (valid) {
            BackendConnection.createMatrix(matrixsize.val());
        } else {
            if (+matrixsize.val()) {
                errorFunctions.showError(matrixsize, ERROR_MESSAGES.matrixsize);
            }
        }
    }
}
/* ---------------------------------------------------------------------------------------------- */


/*
 * Object with the function to check the number of operation of a test case
 * 
 * check
 * @param caseindex, index of the test case that is changing.
 * 
 * it check the limit and if it's valid draw the number of operation that the user typed. Else desplay an error.
*/
var numberoperationsFunctions = {
    check: function (caseindex) {
        var numberoperations = $('#number-operations-' + caseindex);

        errorFunctions.hideError(numberoperations);

        var val = numberoperations.val();
        var valid = checkLimit(val, 1, 1000);

        $('#test-case-' + caseindex + ' .query').remove();

        if (valid) {
            for (var i = 0; i < val; i++) {
                $('#test-case-' + caseindex).append(
                    '<div class="col-4 form-group query">' +
                    '<span class="d-block">' +
                    '<input type="radio" name="querytype-' + caseindex + '-' + i + '" value="QUERY"> Query' +
                    '</span>' +
                    '<span class="d-block">' +
                    '<input type="radio" name="querytype-' + caseindex + '-' + i + '" value="UPDATE"> Update ' +
                    '</span>' +
                    '</div>' +

                    '<div class="col-8 query">' +
                    '<input type="text" class="form-control" name="operation-' + caseindex + '-' + i + '" id="operation-' + caseindex + '-' + i + '" onkeyup="operationFunctions.check(' + caseindex + ',' + i + ')">' +
                    '</div>'
                );
            }
        } else {
            if (+val !== 0) {
                errorFunctions.showError(numberoperations, ERROR_MESSAGES.numberoperations)
            }
        }
    }
}
/* --------------------------------------------------------------------------------------------------------------------- */


/*
 * Object with the functions to verify the operation inputs
 * 
 * check
 * @param caseindex, index of the test case that is changing.
 * @param operationindex, index of the operation into the test case that is changing
 * 
 * check if there is some query selected in the index of that operation, then send to the respective function.
 *  
 */
var operationFunctions = {
    check: function (caseindex, operationindex) {

        var selectedquery = document.querySelector('input[name="querytype-' + caseindex + '-' + operationindex + '"]:checked');
        var operation = document.getElementById('operation-' + caseindex + '-' + operationindex);

        errorFunctions.hideError(operation, true);

        if (selectedquery) {
            var matrixsize = document.getElementById('matrix-size-' + caseindex);
            var lowercaseoperation = selectedquery.value.toLowerCase();
            queryValidation[lowercaseoperation](operation, +matrixsize.value);
        }

    }
}
/* --------------------------------------------------------------------------------------------------------------------- */



/*
 * Object with the initial DOM elements.
 */
var view = {
    testcases: null,
    testcasescontainer: null,
    erroroutlet: null,
    form: null,
    init: function () {
        this.testcases = $('#test-cases');
        this.testcasescontainer = $('#test-cases-container');
        this.erroroutlet = $('#container-errors .alert');
        this.form = $('#form');
    }
};

var BackendConnection = {
    createMatrix: function (size) {
        console.log('función que creará la matriz')
    }
}


/*
 * Method  to submit the form
 */
function onSubmit(formvalue) {
    console.log(formvalue);
}

$(document).ready(function () {
    view.init();

    view.testcases.keyup(function () {

        view.testcasescontainer.html('');
        errorFunctions.hideError(view.testcases);

        var testcases = +view.testcases.val();

        if (checkLimit(testcases, 1, 50)) {
            testCaseFunctions.createTestCases(testcases);
        } else {
            if (testcases !== 0) {
                errorFunctions.showError(view.testcases, ERROR_MESSAGES.testcases);
            }
        }
    });
});