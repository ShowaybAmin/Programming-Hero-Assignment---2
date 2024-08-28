// subscription start

function handleContact(event){
  event.preventDefault();
  
  const subscribeMail = event.target.subscribeMail.value ;
  
  console.log(subscribeMail);
  
  const subscriber = document.getElementById("subscription-message")
  
  const subsciptionMessage = document.createElement("p")
  
  subsciptionMessage.innerText = `Subscription Completed!`
  
  subscriber.appendChild(subsciptionMessage)
}
// subscription end

        
// carousel start 

const slider = document.querySelector(".customer-review-box");
const reviewBox = document.querySelectorAll(".customer-pic-description");
const left = document.querySelector(".arrow-left");
const right = document.querySelector(".arrow-right");

let slideNumber = 1;

right.addEventListener('click', ()=>{
  if (slideNumber < reviewBox.length){
    slider.style.transform = `translateX(-${slideNumber*100}%)`;
    slideNumber++;
    console.log(slideNumber)
  }else{
    slider.style.transform = `translateX(0%)`;
    slideNumber = 1;
  }
})

left.addEventListener('click', ()=>{
  if (slideNumber > 1){
    console.log(slideNumber)
    slider.style.transform = `translateX(-${(slideNumber - 2)*100}%)`;
    slideNumber--;
    console.log(slideNumber)
  }else{
    slider.style.transform = `translateX(-${(reviewBox.length - 1) * 100}%)`;
    slideNumber = reviewBox.length;
  }
})

// carousel end
        
        
// shopping cart start

let iconCart = document.querySelector(".show-cart");
let closeCart = document.querySelector(".close");
let chechOutCart = document.querySelector(".checkOut");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".product-items");
let listCartHTML = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".add-to-cart span");


let listProducts = [];
let carts = []

iconCart.addEventListener('click', () =>{
  body.classList.toggle("showCart");
})

closeCart.addEventListener('click', () =>{
  body.classList.toggle("showCart");
})


const addListToHTML = () =>{
listProductHTML.innerHTML = ""
if (listProducts.length > 0){
  const halfItems = listProducts.slice(0, 6);
  const seeMoreButton = document.querySelector('.see-more-product-button');
  const buttonText = document.getElementById('buttonText');
  
  halfItems.forEach(product => {
    addingItemsIntoDisplay(product)
  });
  
  seeMoreButton.addEventListener('click', () =>{
    seeMoreButton.classList.toggle('see-less');

    if (buttonText.innerHTML === "See More Products"){
      listProductHTML.innerHTML = ""                
      listProducts.forEach(product => {
        addingItemsIntoDisplay(product);
      });
      buttonText.innerHTML = "See Less Products"
    }else{
      listProductHTML.innerHTML = ""
      halfItems.forEach(product => {
        addingItemsIntoDisplay(product);
      });
      buttonText.innerHTML = "See More Products"
    }
  })            
}
}

const addingItemsIntoDisplay = (product) => {
  let newProduct = document.createElement('div');
  newProduct.classList.add('product-item');
  newProduct.dataset.id = product.id;
  newProduct.innerHTML = `
  <img src="${product.image}" alt="">
  <div class="product-item-name-rate flex">
  <div class="product-item-name">
  <h4>${product.name}</h4>
  </div>
  <div class="product-item-rate">
  <img src="./images/Star-Vector.png" alt="">
  <p>${product.rating.toFixed(1)}</p>
  </div>
  
  </div>
  <div class="product-item-cart-price flex">
  <button class="add-cart-button">Add to cart</button>
  <p>$${product.price.toFixed(2)}</p>
  </div>`;
  listProductHTML.appendChild(newProduct);
  
}

listProductHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('add-cart-button')){
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    addToCart(product_id);
  }
})


const addToCart = (product_id) => {
  let postitionThisProductInCart = carts.findIndex((value) => value.product_id == product_id)
  if (carts.length <= 0 ){
    carts = [
      {
        product_id : product_id,
        quantity : 1
      }
    ]
  }else if(postitionThisProductInCart < 0)  {
    carts.push(
      {
        product_id : product_id,
        quantity : 1
      }
    )
  }else{
    carts[postitionThisProductInCart].quantity = carts[postitionThisProductInCart].quantity + 1
  }
  addCartToHTML();
  addCartToMemory();
}

const addCartToHTML = () =>{
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  let totalBill = 0;
  let totalCheckOut = document.getElementById('totalCheckOut');
  
  if (carts.length > 0){
    carts.forEach(cart => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
      let info = listProducts[positionProduct];

      newCart.innerHTML = `
      <div class="image">
      <img src="${info.image}" alt="">
      </div>
      <div class="item-name">
      ${info.name}
      </div>
      <div class="total-price">
      $${info.price * cart.quantity}
      </div>
      <div class="quantity">
      <span class="minus">-</span>
      <span>${cart.quantity}</span>
      <span class="plus">+</span>
      </div>`;
      
      listCartHTML.appendChild(newCart);
      totalBill = totalBill + (info.price * cart.quantity);

    })
  }
  
  iconCartSpan.innerText = totalQuantity;
  totalCheckOut.innerText = totalBill.toFixed(2);
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
}

const initApp = () => {
  fetch('products.json')
  .then(Response => Response.json())
  .then (data => {
    listProducts = data;
    addListToHTML();
    
    // get cart data from memory
    if (localStorage.getItem('cart')){
      carts = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  }) 
}

listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if (positionClick.classList.contains('plus')){
      type = 'plus';
    }
    
    changeQuantity(product_id, type);
  }
})

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id) ;
  if (positionItemInCart >= 0){
    switch(type){
      case 'plus':
        carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
        break;
        default:
          let valueChange = carts[positionItemInCart].quantity - 1;
          if (valueChange > 0){
            carts[positionItemInCart].quantity = valueChange;
          }else{
            carts.splice(positionItemInCart, 1);
          }
          break;
        }
      }
      
      addCartToMemory();
      addCartToHTML();
    }
    
    initApp();
    chechOutCart.addEventListener('click', () =>{
      localStorage.clear();
      carts = [];
      listCartHTML.innerHTML = "";
      iconCartSpan.innerText = 0;
      totalCheckOut.innerText = 0.00.toFixed(2);
    })
    // shopping cart end 