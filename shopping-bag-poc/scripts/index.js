(function(MODULE, $, undefined) {
  var itemObj = {},
    activeObj = {},
    popup = {};

  var activeElementId = 0;
  var setData = function(items) {
    itemObj = items;
    if (localStorage.itemObj === undefined) {
      localStorage.setItem("itemObj", JSON.stringify(itemObj));
    } else {
      itemObj = JSON.parse(localStorage.getItem("itemObj"));
    }
    renderTemplate(itemObj);
    displayTotal();
  };

  var renderTemplate = function(data, section) {
    if (data.cartItems.length || section == true) {
      var source = $("#product-listing-template").html();
      template = Handlebars.compile(source);
      var html = template(data);
      $(".product-listing-wrapper").html(html);
    }
  };

  var renderPopupTemplate = function(obj) {
    var source = $("#popup-template").html();
    template = Handlebars.compile(source);
    var html = template(obj);
    $(".popup-box").html(html);
  };

  var getData = function() {
    $.getJSON("json/jsonData.json", function(result) {
      setData(result);
    });
  };

  var resetData = function(name, jsonData) {
    if (typeof jsonData === "object") {
      localStorage.setItem(name, JSON.stringify(jsonData));
    }
    renderTemplate(itemObj);
    displayTotal();
  };

  var displayTotal = function() {
    $(".subtotal__value")
      .children("label")
      .html(itemObj.subTotal);
    $(".total__value")
      .children("label")
      .html(itemObj.subTotal);
  };

  var findAndRemove = function(rowToDelete) {
    var price = 0;
    var qty = 0;
    if (itemObj.cartItems.length) {
      qty = itemObj.cartItems[rowToDelete].qty;
      price = itemObj.cartItems[rowToDelete].price;
      itemObj.subTotal = itemObj.subTotal - price * qty;
      itemObj.cartItems.splice(rowToDelete, 1);
    }
    resetData("itemObj", itemObj);
  };

  //Methods for Popup
  popup.open = function(elem) {
    $(".popup-box").fadeIn("slow");
    var elemId = elem.id.split("_")[1];
    activeElementId = elemId;
    MyApp.loadData(elemId);
    $(".overlay").show();
  };

  popup.close = function() {
    $(".popup-box").fadeOut("slow");
    $(".overlay").hide();
  };

  // Action on Events
  $(document).on("click", ".links__edit, .links__remove", function(elem) {
    if ($(this).hasClass("links__remove")) {
      var rowToDelete = $(this)
        .attr("id")
        .split("_")[1];
      console.log(rowToDelete);
      MyApp.removeItem(rowToDelete);
    }
    if ($(this).hasClass("links__edit")) {
      popup.open(this);
    }
  });

  $(document).on("click", ".edit__button", function() {
    var qytVal = $(".popup-item__qty").val();
    var size = $(".popup-item__select").val();
    if (qytVal != 0 && qytVal != "") {
      $("#txtBox" + activeElementId).val(qytVal);
      MyApp.updateItem(qytVal, size);
      popup.close();
    } else {
      return false;
    }
  });

  $(document).on("click", ".popup-block-close", function() {
    popup.close();
  });

  MODULE.removeItem = function(rowToDelete) {
    $("#product-row" + rowToDelete).remove();
    findAndRemove(rowToDelete);
  };

  MODULE.updateItem = function(qytVal, size) {
    var oldQtyVal = 0;
    var price = 0;
    oldQtyVal = itemObj.cartItems[activeElementId].qty;
    price = itemObj.cartItems[activeElementId].price;
    itemObj.cartItems[activeElementId].qty = qytVal;
    itemObj.subTotal = itemObj.subTotal + qytVal * price - oldQtyVal * price;
    itemObj.cartItems[activeElementId].size = size;
    resetData("itemObj", itemObj);
  };

  MODULE.loadData = function(id) {
    activeObj = itemObj.cartItems[id];
    renderPopupTemplate(itemObj.cartItems[id]);
  };

  MODULE.init = function() {
    getData();
    $(".overlay").hide();
    Handlebars.registerHelper("selected", function(val1, val2) {
      return val1 == val2 ? "selected" : "";
    });
  };

  /**
   * Check to evaluate whether 'MODULE' exists in the global namespace - if not, assign window.MODULE an object literal
   */
})((window.MyApp = window.MyApp || {}), jQuery);

MyApp.init();
