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
        getSupplierData();
    }
});

var supplierData;
function getSupplierData() {
    $.ajax({
        url: '/api/supplier/supplierConfig.json',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            if (res.ret && res.data) {
                supplierData = res.data;
                toChat();
            }
        }
    });
}

function toChat() {
    var submenu = $('#J_popCategory').children('.sub-item');
    var str = "";
    for (var m = 0; m < submenu.length; m++) {
        for (var i = 0; i < supplierData.length; i++) {
            if (supplierData[i].supplierName === submenu[m].id) {
                for (var j = 0; j < supplierData[i].seatGroups.length; j++) {
                    str += "<div class='button'>" + supplierData[i].seatGroups[j].groupName + "</div>"
                    document.getElementById(submenu[m].id).innerHTML = str;
                }
                str = "";
            }
        }
    }
    var category = find("J_category"),
        popCategory = find("J_popCategory"),
        cateLi = category.getElementsByTagName("li"),
        subItems = getClassName("sub-item", "div");
    category.onclick = function () {
        popCategory.style.display = "block";
    };
    $(".button").click(function () {
        var shopText = $(this).parent(".sub-item").attr("id"),
            groupText = $(this).text(),
            shopId,
            groupId;
        var allSupplierName = [],
            allGroupName = [];
        var selectSeatGroups;
        if (supplierData !== undefined) {
            for (var i = 0; i < supplierData.length; i++) {
                allSupplierName.push(supplierData[i].supplierName)
                if (supplierData[i].supplierName === shopText) {
                    selectSeatGroups = supplierData[i].seatGroups
                    shopId = supplierData[i].supplierId;
                }
            }
        }
        if (selectSeatGroups !== undefined) {
            for (var j = 0; j < selectSeatGroups.length; j++) {
                allGroupName.push(selectSeatGroups[j].groupName)
                if (selectSeatGroups[j].groupName === groupText) {
                    groupId = selectSeatGroups[j].groupId;
                }
            }
        }
        if (JSON.stringify(allSupplierName).search(shopText) === -1 || JSON.stringify(allGroupName).search(groupText) === -1) {
            alert("该服务暂无对应客服");
        } else {
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
                        window.location.href = '/webchat/touch/?shopId=' + shopId + '&strid=' + strid;
                    } else {
                        alert(res.msg);
                    }
                }
            })
        }
    })
    for (var i = 0; i < cateLi.length; i++) {
        cateLi[i].index = i;
        cateLi[i].onclick = function () {
            for (var j = 0; j < subItems.length; j++) {
                subItems[j].style.display = "none";
                cateLi[j].style.background = "#f6f6f6";
                cateLi[j].style.color = "#2d2d2d";
            }
            subItems[this.index].style.display = "block";
            cateLi[this.index].style.background = "#fdfdfd";
            cateLi[this.index].style.color = "#308dd3";
        };
    }
}

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








