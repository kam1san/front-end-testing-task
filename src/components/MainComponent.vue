<template>
  <div class="row">
    <div v-if="orders_api_loading || products_api_loading || statuses_api_loading">
      <img alt="Loading..." src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif">
    </div>   
    <div v-else>
      <div id="OrderBox" v-for="order in orders" :key="order.id">
        <h3>Order number #{{order.id}}</h3> 
        <p>Product name = {{GetProductNameById(order.productId)}}</p>  
        <p>Status name = {{GetStatusNameById(order.statusId)}}</p>  
        <p>Count = {{order.count}}</p>  
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainComponent',
  data(){
    return {
      orders: null,
      products: null,
      statuses: null,
      orders_api_loading: true,
      products_api_loading: true,
      statuses_api_loading: true,
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
    GetProductNameById(id){
      let product = this.products.find(e => e.id === id)
      return product.name;
    },
    GetStatusNameById(id){
      let status = this.statuses.find(e => e.id === id)
      return status.name;
    },
  },
  mounted(){
    this.GetOrders()
    this.GetProducts()
    this.GetStatuses()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
