/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../LocalStorage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#order");

var sum = 0;
var orders_num = 0;

function updateSum() {
    $("#sum").html(sum + " грн");
    Storage.set("sum", sum);
}

function updateOrderNumber() {
    $(".pizza-ordered").html(orders_num);
    Storage.set("orders_num", orders_num);
}

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    function samePizza(obj) {
        return obj.pizza.id === pizza.id && obj.size === size;
    }

    var same = Cart.filter(samePizza);
    if (same.length > 0) {
        same[0].quantity++;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        orders_num++;
        updateOrderNumber();
    }
    // Оновлюємо суму
    sum += pizza[size].price;
    updateSum();
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item), 1);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_orders = Storage.get("cart");
    if (saved_orders) {
        Cart = saved_orders;
        sum = Storage.get("sum");
        updateSum();
        orders_num = Storage.get("orders_num");
        updateOrderNumber();
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage


    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            sum += cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            updateSum();
        });

        $node.find(".minus").click(function () {
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity == 1) {
                removeFromCart(cart_item);
                orders_num--;
                updateOrderNumber();
            }
            cart_item.quantity -= 1;
            sum -= cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            updateSum();
        });
        $node.find(".delete").click(function () {
            removeFromCart(cart_item);
            sum -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
            orders_num--;
            updateOrderNumber();
            //Оновлюємо відображення
            updateCart();
            updateSum();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    Storage.set("cart",	Cart);

}

$("#clear").click(function () {
    Cart = [];
    updateCart();
    sum = 0;
    updateSum();
    orders_num = 0;
    updateOrderNumber();
});

$("#orderButt").click(function () {
    //TODO
});

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;