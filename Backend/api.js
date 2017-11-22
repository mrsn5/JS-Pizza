/**
 * Created by chaika on 09.02.16.
 */

var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1'); sha1.update(string);
    return sha1.digest('base64');
}

function base64(str) {
    return new Buffer(str).toString('base64');
}



var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;

    var price = 0;
    var description = "Замовлення піци: " + order_info.name + "\nАдреса доставки: " + order_info.adress + "\nТелефон: "
        + order_info.phone + "\nЗамовлення:\n";
    order_info.pizzas.forEach(function (item) {
        if (item.size == 'big_size') {
            description += "- " + item.quantity + " шт. [Велика] " + item.pizza.title + ";\n";
            price += item.quantity * item.pizza.big_size.price;
        } else if (item.size == 'small_size'){
            description += "- " + item.quantity + " шт. [Мала] " + item.pizza.title + ";\n";
            price += item.quantity * item.pizza.small_size.price;
        }
    });

    console.log(description);



    var order = {
        version: 3,
        public_key: "i89676865808",
        action: "pay",
        amount: price,
        currency: "UAH",
        description: description,
        order_id: Math.random(),
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1("Lm6y2H4RAsgXUjVrWGx1J0kGe7mmOl42ELNPuqWy" + data + "Lm6y2H4RAsgXUjVrWGx1J0kGe7mmOl42ELNPuqWy");

    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay",
        mode: "popup" // embed || popup
    }).on("liqpay.callback", function(data){
        console.log(data.status);
        console.log(data);
    }).on("liqpay.ready", function(data){ // ready
    }).on("liqpay.close", function(data){
    // close
    });
    /*res.send({
        success: true
    });*/
};