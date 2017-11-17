/**
 * Created by sannguyen on 16.11.17.
 */

var api = require('../API');
var Storage = require('../LocalStorage');

/* Name validation */
var nameInput = $("#inputName");
var nameLabel = $(".label-name");
function checkName() {
    //$("#inputName").val()
    if (nameInput.val()) {
        nameLabel.addClass("valid");
        nameLabel.removeClass("invalid");
        nameInput.addClass("valid");
        nameInput.removeClass("invalid");
        return true;
    } else {
        nameLabel.removeClass("valid");
        nameLabel.addClass("invalid");
        nameInput.addClass("invalid");
        nameInput.removeClass("valid");
        return false;
    }
}

/* Phone validation */
var phoneREGEX = /(\+38)?0\d{9}/;
var phoneInput = $("#inputPhone");
var phoneLabel = $(".label-phone");
function checkPhone () {
    /*alert("check!");*/
    if (phoneInput.val().match(phoneREGEX)) {
        phoneLabel.addClass("valid");
        phoneLabel.removeClass("invalid");
        phoneInput.addClass("valid");
        phoneInput.removeClass("invalid");
        return true;
    } else {
        phoneLabel.removeClass("valid");
        phoneLabel.addClass("invalid");
        phoneInput.addClass("invalid");
        phoneInput.removeClass("valid");
        return false;
    }
}

/* Adress validation */
var adressInput = $("#inputAdress");
var adressLabel = $(".label-adress");
function checkAdress() {
    // TODO
    return true;
}


function initialise() {
    $("#submitButt").click(function () {

        checkName();
        checkPhone();
        checkAdress();
        if (checkName() && checkPhone() && checkAdress()){
            api.createOrder(Storage.get("cart"), function (err, res) {

                if(err){
                    alert("Error");
                }
            });
        } else {
            $("#inputName").bind("input", function () {
                checkName();
            });

            $("#inputPhone").bind("input", function () {
                /*alert("check!@!");*/
                checkPhone();
            });

            $("#inputAdress").bind("input", function () {
                checkAdress();
            });
        }

    });
}

exports.initialise = initialise;
