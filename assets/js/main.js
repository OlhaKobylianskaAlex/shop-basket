const cartCounterLabel = document.querySelector('#cart-counter-label');
const contentContainer = document.querySelector('#content-container');
const pageContainer = document.querySelector('body');

let cartCounter = 0;
let cartPrice = 0;
let listCounter = 0;
let goodsContainer = null;
let goodsList = null;
let goodsSumm = null;
let goods = [];

const incrementCounter = (label, cn) => {
  const counter = cn + 1;
  label.innerHTML = `${counter}`;
  if (counter === 1) label.style.display = 'block';
  return counter;
};

const getMockData = (t) => +t.parentElement
  .previousElementSibling
  .innerHTML
  .replace(/^\$(\d+)\s\D+(\d+).*$/, '$1.$2');

const getPrice = (t, price) => Math.round((price + getMockData(t)) * 10000) / 10000;

const disabledControls = (t, el, fn) => {
  t.disabled = true;
  el.removeEventListener('click', fn);
};

const enabledControls = (t, el, fn) => {
  t.disabled = false;
  el.addEventListener('click', fn);
};

const addedGoods = (goods, t, counter, price) => {
  let nameGood = t.parentElement.parentElement.children[0].innerHTML;

  if (counter != 0) {
    const theSame = goods.some((el) => nameGood === el.name);

    if (theSame) {
      for (let i = 0; i < goods.length; i++) {
        if (nameGood === goods[i].name) goods[i].count++;
      }
      return goods;
    } else {
      return addedNew(price, counter, nameGood, goods);
    };

  } else {
    return addedNew(price, counter, nameGood);
  };
};

const addedNew = (price, counter, nameGood) => {
  goods[counter] = {
    name: nameGood,
    price,
    count: 1
  };
  return goods;
};

const incrementGoods = (listCounter, goods) => (listCounter = goods.length);

const createContent = (goods, goodsContainer, cartPrice, cartCounter) => {
  goodsContainer.innerHTML = '';
  goodsContainer.parentElement.children[0].innerHTML = `In the basket ${cartCounter} items`;
  if (cartPrice < 0) cartPrice = 0;
  goodsSumm.children[1].innerHTML = `${cartPrice.toFixed(2)}$`;

  if (goods.length > 0) {
    for (let i = 0; i < goods.length; i++) {
      const goodsItem = document.createElement('div');
      goodsItem.setAttribute('class', 'goods-item basket');
      goodsContainer.append(goodsItem);

      const itemName = document.createElement('div');
      const itemCount = document.createElement('div');
      const itemPrice = document.createElement('div');
      const itemSumm = document.createElement('div');
      const itemDelete = document.createElement('div');

      itemName.setAttribute('class', 'goods-item__name basket');
      itemCount.setAttribute('class', 'goods-item__count basket');
      itemPrice.setAttribute('class', 'goods-item__price basket');
      itemSumm.setAttribute('class', 'goods-item__summ basket');
      itemDelete.setAttribute('class', 'goods-item_delete basket');

      itemName.innerHTML = `${goods[i].name}`;
      itemCount.innerHTML = `- ${goods[i].count} шт.`;
      itemPrice.innerHTML = `price ${(goods[i].price).toFixed(2)} $`;
      itemSumm.innerHTML = `sum: ${(goods[i].price * goods[i].count).toFixed(2)} $`;
      itemDelete.innerHTML = `<i class="fas fa-trash basket"></i>`;
      goodsItem.append(itemName, itemCount, itemPrice, itemSumm, itemDelete);
    };
  };
};

const deleteElement = (t, goods, goodsContainer, cartPrice, cartCounter) => {
  const goodsCopy = goods;
  goods = [];
  const deleteItem = t.parentElement.parentElement.children[0].innerHTML;
  goodsCopy.forEach(el => {
    if (el.name !== deleteItem) {
      goods.push(el);
    } else {
      deleteGoods = el;
      listCounter--;
    };
  });

  cartPrice = cartPrice - (deleteGoods.price * deleteGoods.count);
  cartCounter = cartCounter - deleteGoods.count;
  if (cartCounter === 0) cartCounterLabel.style.display = 'none';
  else cartCounterLabel.innerHTML = cartCounter;
  createContent(goods, goodsContainer, cartPrice, cartCounter);

  return { goods, cartPrice, cartCounter };
};

const openBasket = (e) => {
  const t = e.target;

  if (t.matches('.page-header__cart-btn') || t.matches('.fa-shopping-cart')) {
    goodsList.classList.toggle('hidden');
    createContent(goods, goodsContainer, cartPrice, cartCounter);
  };
  if ((!(t.matches('.page-header__cart-btn')
    || t.matches('.fa-shopping-cart')
    || t.matches('.basket'))
    && !goodsList.classList.contains('hidden'))) {
    goodsList.classList.add('hidden');
  };

  if (t.matches('.goods-delete')) {
    goods = [];
    cartPrice = 0;
    cartCounter = 0;
    priceGood = 0;
    listCounter = 0;
    if (cartCounter === 0) cartCounterLabel.style.display = 'none';
    else cartCounterLabel.innerHTML = cartCounter;
    createContent(goods, goodsContainer, cartPrice, cartCounter);
  };

  if (t.matches('.fa-trash')) {
    let nameItemDelete = t.parentElement.parentElement.children[0].innerHTML;
    const deleteAnsw = confirm(`Are you sure you want to delete ${nameItemDelete}?`);
    if (deleteAnsw) {
      let newList = deleteElement(t, goods, goodsContainer, cartPrice, cartCounter);
      return { goods, cartPrice, cartCounter } = newList;
    };
  };
};

const btnClickHandler = (e) => {
  const target = e.target;
  const interval = 2000;
  let priceGood = null;
  let restoreHTML = null;

  if (typeof target !== 'object') {
    console.error('target not an object');
    return;
  };

  if (target.matches('.item-actions__cart')) {
    cartCounter = incrementCounter(cartCounterLabel, cartCounter);
    cartPrice = getPrice(target, cartPrice);
    priceGood = getMockData(target);
    restoreHTML = target.innerHTML;
    target.innerHTML = `Added ${cartPrice.toFixed(2)} $`;
    goods = addedGoods(goods, target, listCounter, priceGood);
    listCounter = incrementGoods(listCounter, goods);

    disabledControls(target, contentContainer, btnClickHandler);

    setInterval(() => {
      target.innerHTML = restoreHTML;
      enabledControls(target, contentContainer, btnClickHandler);
    }, interval);
  };
};

const createBasket = (() => {
  const containerBasket = document.querySelector('.container');
  const basket = document.createElement('div');
  basket.setAttribute('class', 'goods basket hidden');
  basket.innerHTML = `
  <div class="goods_header basket">There are 0 items in the basket</div>
  <div class="goods_container basket">
  </div>
  <div class="goods_summ basket">
    <div class="goods_summ-info basket">Total items in the basket worth</div>
    <div class="goods_summ-value basket">${cartPrice.toFixed(2)} $</div>
  </div>
  <div class="btn_container basket">
    <button type="button" class="btn btn-primary goods-proceed">CONTINUE</button>
    <button type="button" class="btn btn-primary basket goods-delete">CLEAR</button>
    <button type="button" class="btn btn-primary basket">BUY</button>
  </div>`;
  containerBasket.prepend(basket);
  goodsList = document.querySelector('.goods');
  goodsContainer = document.querySelector('.goods_container');
  goodsSumm = document.querySelector('.goods_summ');
})();

contentContainer.addEventListener('click', btnClickHandler);
pageContainer.addEventListener('click', openBasket);