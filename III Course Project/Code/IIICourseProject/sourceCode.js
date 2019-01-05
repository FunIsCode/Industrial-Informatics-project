// This is the source code for our project work
// We describe which classes we need to use and what kind of attributes they take in

//Class Customer definition begins

var lastCustomerId = 9999;

// Constructor
function Customer(name, address, phoneNum) {
    // always initialize all instance properties
    this._name = name;
    this._address = address;
    this._phoneNum = phoneNum;
    this._id = lastCustomerId + 1;
    this.orders = []; // default value
}
// class methods

Customer.prototype.addNewOrder = function(order) {
    this.orders.push(order);
};

// Can be further modified to provide all needed information in needed format
Customer.prototype.getCustomerInfo = function() {
    var result = '\nCustomer ' + this._name + '(' + this._id + ')' + ' has ordered:';
    for(var i = 0; i<this.orders.length; i++){
        result = result + this.orders[i].getOrderInfo();
    }
    return result;
};

// Class Customer definition ends


// Class Product definition begins

// Constructor for Product class
function Product(productNum, frameDescription, keyboardDescription, screenDescription, price) {
    // always initialize all instance properties
    this._productNum = productNum;
    // The following part descriptions have two values:
    // Model and color
    // They can be represented for example in an array in which
    // each model and color is assigned to a specific number or string value
    this._frameDescription = frameDescription;
    this._keyboardDescription = keyboardDescription;
    this._screenDescription = screenDescription;
    this._price = price;
}
// class methods

// If we have to use the price parameter we have to create some kind of method to determine the price
// of the product based on the models and the colors that it uses.
Product.prototype.getPrice = function() {
    return this._price;
};

Product.prototype.getDescription = function() {
    var productDescription = [];
    productDescription.push(this._frameDescription);
    productDescription.push(this._keyboardDescription);
    productDescription.push(this._screenDescription);
    return productDescription;
};

// Class Product definition ends


// Class Order definition begins

var lastOrderNum = 9999;

// Constructor for Order class
function Order(quantity) {
    // always initialize all instance properties
    this.orderNum = lastOrderNum + 1;
    this.product = Product.prototype.getDescription();
    // Quantity is parsed from html
    this.quantity = quantity;
}
// class methods

Order.prototype.getOrderNum = function () {
    return this.orderNum;
};

// Can be further modified to provide all needed information in needed format
Order.prototype.getOrderInfo = function() {
    //TODO
    var result = '\n\n';
    for(var i = 0; i<this.products.length; i++){
        if(i == 0) {
            result = result + 'Order Number ' + this.getOrderNum() + ':\nProduct: ' +
                this.products[i].getDescription() + ' for ' + this.products[i].getPrice() + ' EUR.'
        } else {
            result = result + '\nProduct: ' + this.products[i].getDescription() +
                ' for ' + this.products[i].getPrice() + ' EUR.'
        }
    }
    return result;
};

// Class Order definition ends
