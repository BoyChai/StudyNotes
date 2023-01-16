// 全选复选框
$(".checkall").click(function () {
    // 获取全选复选框的状态,获取到之后同步到子选项
    let status = $(this).prop('checked');

    // 同步更新到所有表体复选框中
    $(".j-checkbox,.checkall").prop('checked',status);
    if (status == true) {
        $(".cart-item").prop("className","cart-item check-cart-item")
    } else  {
        $(".cart-item").prop("className","cart-item")
    }
    totalPrice()
})

// 标题复选框
$(".j-checkbox").click(function () {
    if ($(this).prop('checked')){
        $(this).parent().parent().prop("className","cart-item check-cart-item")
    } else {
        $(this).parent().parent().prop("className","cart-item")
    }
    // 找到已经选中的复选框
    let checkedBoxes = $('.j-checkbox:checked')
    // 找到所有复选框
    let checkBoxes = $('.j-checkbox')

    // 修改状态
    if (checkedBoxes.length == checkBoxes.length) {
        $(".checkall").prop('checked',true);
    } else {
        $(".checkall").prop('checked',false);

    }
    totalPrice()
})

// 增加购买数量
$(".increment").click(function (){
    let value =  $(this).siblings(".itxt").prop("value")
    value++
    $(this).siblings(".itxt").prop("value",value)

    // 获取商品单价并计算实际支付的金额
    let p = $(this).parents(".p-num").siblings('.p-price').html().slice(1)
    let price = '￥' + (p *value).toFixed(2);

    // 渲染价格
    $(this).parents(".p-num").siblings('.p-sum').html(price)

    totalPrice()
})

// 减少购买数量
$('.decrement').click(function () {
    let value =  $(this).siblings(".itxt").prop("value")
    if (value == 1) {
        return
    }
    value--
    $(this).siblings(".itxt").prop("value",value)

    // 获取商品单价并计算实际支付的金额
    let p = $(this).parents(".p-num").siblings('.p-price').html().slice(1)
    let price = '￥' + (p *value).toFixed(2);
    // 渲染价格
    $(this).parents(".p-num").siblings('.p-sum').html(price)

    totalPrice()
})



// 计算丛书和总价

function totalPrice() {
    // 1.获取所有已选中的复选框
    // 2.循环通过复选框找到购买数量和小计价格
    // 3.累计加起来计算购买总数和总计价格
    var sum = 0;
    var sumPrice = 0;
    $('.j-checkbox:checked').each(function () {
        var goods = $(this).parents('.cart-item');
        sumPrice += parseFloat(goods.find('.p-sum').text().slice(1));
        $('.price-sum>em').text(sumPrice.toFixed(2));
        sum += parseInt(goods.find('.itxt').val());
        $('.amount-sum>em').text(sum);
    })
}
totalPrice()

// 删除商品
$('.p-action a').click(function () {
    if (confirm('您确定删除该商品吗?')) {
        $(this).parents('.cart-item').remove();
        totalPrice();
    }
})

// 清空购物车
$('.clear-all').click(function () {
    if (confirm('您确定清空购物车吗？')) {
        $('.cart-item-list').html('');
        totalPrice();
    }
})

// 删除选中商品
$('.remove-batch').click(function () {
    $('.j-checkbox:checked').each(function () {
        $(this).parents('.cart-item').remove();
        totalPrice();
    })
})