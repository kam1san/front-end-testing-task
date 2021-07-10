<template>
  <div id="app">
    <div class="row" style="border: 2px #42BCFF solid; border-radius: 10px; background-color: #8ED7FF; margin: 20px;">
      <div v-if="orders_api_loading || products_api_loading || statuses_api_loading">
        <img alt="Loading..." src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif">
      </div>   
      <div id="OrdersList" sticky-container v-else>
        <div v-sticky="stick_options" class="row" style="margin: 10px; display: flow-root; margin-right: 30px;">
          <p class="add-order" style="float: right;" @click="ShowCreateOrderModal()">Добавить заказ</p> 
        </div>
        <OrderBox :order="order" :product="GetProductById(order.productId)" :status="GetStatusById(order.statusId)" v-for="order in orders" :key="order.id" />
      </div>
    </div>
        
    <!-- Create new order modal -->
    <modal :adaptive="true" name="create_new_order" styles="padding: 15px; margin: 10px; border-radius: 20px; border: 2px #42BCFF solid;" height="350">
        <p style="margin-bottom: 20px; font-size: larger; font-weight: bold; ">Добавление нового заказа</p>
        <p>Выберите продукт:</p>
        <div style="margin-bottom: 20px; z-index: 2;">
          <v-select style="max-height: 100px;" v-model="new_order.productId" :reduce="product => product.id" :options="products" label="name"/>
        </div>
        <p>Введите количество:</p>
        <input type="number" v-model="new_order.count" style="width: 100%; border-radius: 5px; border: 1px lightgray solid; margin-bottom: 30px; padding: 5px;"> <br>
        <button class="add-order" @click="AddOrder()">Добавить</button>
    </modal>

  </div>
</template> 

<script>
import OrderBox from './components/OrderBox.vue'
import VueStickyDirective from '@renatodeleao/vue-sticky-directive'
export default {
  name: 'App',
  components: {
    OrderBox
  },
  directives: {"sticky": VueStickyDirective},
  data(){
    return {
      orders: null,
      products: null,
      statuses: null,

      orders_api_loading: true,
      products_api_loading: true,
      statuses_api_loading: true,

      new_order:{
        productId:0,
        count:0,
      },

      stick_options: {
        topSpacing: 10
      }
    }
  },
  methods:{
    GetOrders(){
      this.axios.get('https://webtest.it.ua/testApp/api/orders')
        .then(response => (this.orders = response.data))
        .catch(err => console.log(err))
        .finally(() => {
          this.orders_api_loading = false;
          })
    },
    GetProducts(){
      this.axios.get('https://webtest.it.ua/testApp/api/products')
        .then(response => (this.products = response.data))
        .catch(err => console.log(err))
        .finally(() => {
          this.products_api_loading = false;
          })
    },
    GetStatuses(){
      this.axios.get('https://webtest.it.ua/testApp/api/statuses')
        .then(response => (this.statuses = response.data))
        .catch(err => console.log(err))
        .finally(() => {
          this.statuses_api_loading = false;
          })
    },
    GetProductById(id){
      return this.products.find(e => e.id === id)
    },
    GetStatusById(id){
      return this.statuses.find(e => e.id === id)
    },
    ShowCreateOrderModal(){
      this.$modal.show('create_new_order');
    },
    HideCreateOrderModal(){
      this.$modal.hide('create_new_order');
    },
    AddOrder(){
      if(this.new_order.productId==null || this.new_order.productId==0 || this.new_order.count<=0){
        this.$swal({
          title: "Значения должны быть заполнены",
          text: 'Поле продукта было пустое или количество товара было равным/меньше 0',
          button: "Закрыть",
          icon: "warning",
        });
      }
      else{
        this.axios.post('https://webtest.it.ua/testApp/api/orders/add',
        {
          "productId": this.new_order.productId,
          "count": parseInt(this.new_order.count),
        },
        {
          headers: {'Content-Type': 'application/json'}
        })
      .then(res => {
        console.log(res);
        this.HideCreateOrderModal();
        this.$swal({
          text: "Заказ успешно добавлен",
          icon: "success",
          button: "Ок",
        });
      })
      .catch(err => console.log(err.response))
      .finally(() => {
        this.GetOrders()
        console.log(this.orders);
        });
      }
    },
  },
  mounted(){
    this.GetOrders()
    this.GetProducts()
    this.GetStatuses()
  },
}
</script>

<style>
.add-order{
  cursor: pointer;
  margin: 0px; 
  font-size: larger; 
  font-weight: bold; 
  padding: 10px 25px; 
  width: fit-content; 
  background-color: white; 
  border: 2px #42BCFF solid; 
  border-radius: 40px;
}

.add-order:hover{
  background-color: #42BCFF; 
  border: 2px white solid;
  color: white;
  transition: all .2s ease-in;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.vs__dropdown-menu{
  height:150px;
}

.swal-text{
  text-align: center;
}
</style>
