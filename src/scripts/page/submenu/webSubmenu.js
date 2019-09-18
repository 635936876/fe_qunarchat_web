function find() {
    var elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == "string")
            element = document.getElementById(element);
        if (arguments.length == 1) return element;
        elements.push(element);
    }
    return elements;
}
//get ele's className
function getClassName(className, tagName) {
    var ele = [],
        all = document.getElementsByTagName(tagName || "*");
    for (var i = 0; i < all.length; i++) {
        if (all[i].className == className) {
            ele[ele.length] = all[i];
        }
    }
    return ele;
}

var data = {
    plat: 'web',//web
    version: 10010,
    gid: "",
    uuidFlag: ""
};
var userQName;
$.ajax({
    url: '/newapi/nck/get_anony_token.qunar',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (res) {
        document.cookie = 'anony_token_username=' + res.data.username + '; path=/;'
        document.cookie = 'anony_token_token=' + res.data.token + '; path=/;'
        userQName = res.data.username;
    }
});

var supplierData;
$.ajax({
    url: '/api/supplier/supplierConfig.json',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function (res) {
        if (res.ret && res.data) {
            supplierData = res.data
        }
    }
});

$("li").click(function () {
    var shopText = $(this).parent("ul").prev(".everyTitle").text().trim(),
        groupText = $(this).text().trim(),
        shopId,
        groupId;
    var allSupplierName = [],
        allGroupName = [];
    var selectSeatGroups;
    for (var i = 0; i < supplierData.length; i++) {
        allSupplierName.push(supplierData[i].supplierName)
        if (supplierData[i].supplierName === shopText) {
            selectSeatGroups = supplierData[i].seatGroups
            shopId = supplierData[i].supplierId;
        }
    }
    for (var j = 0; j < selectSeatGroups.length; j++) {
        allGroupName.push(selectSeatGroups[j].groupName)
        if (selectSeatGroups[j].groupName === groupText) {
            groupId = selectSeatGroups[j].groupId;
        }
    }
    if (JSON.stringify(allSupplierName).search(shopText) === -1 || JSON.stringify(allGroupName).search(groupText) === -1) {
        alert("该服务暂无对应客服");
    }
    var url = '/api/seat/judgmentOrRedistributionEx.json?shopId=shop_' + shopId + '&groupId=' + groupId + '&userQName=' + userQName;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            if (res.ret && res.data) {
                var strid = res.data.seat.qunarName;
                var shopId = res.data.supplier.shopId;
                window.location.href = '/webchat/web/?shopId=' + shopId + '&strid=' + strid;
            } else {
                alert(res.msg);
            }
        }
    })
})


