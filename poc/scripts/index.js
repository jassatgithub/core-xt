(function (MODULE, $, undefined) {
    var itemObj = {};
	var _this = this;
	
	var setData = function(items){
        var cartItems = items.cartItems;
        cartItems.forEach(function(elem,index){
            
            $('.product-image img')[index].src = elem.imgPath;
            $('.product-content p')[index].innerHTML = elem.productName;
            $('.prod-style')[index].innerHTML = elem.productStyle;
            $('.prod-color')[index].innerHTML = elem.productColor;
            $('.prod-size')[index].innerHTML = elem.productSize;
            $('.prod-qty input')[index].value = elem.productQty;
            $('.prod-price')[index].innerHTML = elem.productPrice;    
        });
        calcTotal(cartItems, items.promotionDiscount);
    }

    var calcTotal = function(cartItems, promotionDiscount){
        console.log(itemObj.cartItems);
        var _cartItems = itemObj.cartItems;
        var subtotal = 0;
        var total =0;
        _cartItems.forEach(function(elem,index){
            subtotal = subtotal + (elem.productPrice * elem.productQty);
        });
        $('.prod-subtotal')[0].innerHTML = subtotal;  
        total = subtotal - promotionDiscount;
        $('.estm-total')[0].innerHTML = total; 
       
    }
    var getData = function(){
        $.getJSON("json/jsonData.json", function(result){
            itemObj = result;
            setData(result);
        });
    }
    
	/**
     * Public methods and properties
     */
	 
	MODULE.init = function(){
        getData();
		
		
		$(document).on("change", ".qty-val", function(){
            var index = $(this)[0].attributes[1].value;
            itemObj.cartItems[index].productQty = $(this)[0].value;	
            calcTotal({},itemObj.promotionDiscount);
        	
		});	
	};
}(window.MyApp = window.MyApp || {}, jQuery));
MyApp.init();