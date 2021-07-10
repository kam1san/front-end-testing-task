<template>
    <div class="row order-box"> 
        <div class="col-md-3 col-sm-12 col-12" style="margin-bottom: 10px;" id="Photo">
            <img :src="current_product.photoUrl">
        </div>
        <div class="col-md-4 col-sm-12 col-12 row" style="--bs-gutter-x: 0px; padding:0px 10px;" id="Info">
            <v-select v-if="IsEditingMode" style="max-height: 100px; margin-bottom: 10px;" v-model="edited_order.productId" :reduce="product => product.id" :options="GetProductsFromParent()" label="name"/>
            <p v-else style="margin: 0px;font-size: larger;font-weight: bold; text-align: left; margin-bottom: 10px; margin-top: 10px;">{{current_product.name}} (Заказ №{{current_order.id}})</p> 
            <div class="col-sm-6 col-6" style="text-align: left;">
                <p style="border-bottom: 1px lightgray solid; margin-bottom: 10px;">Цена:</p>
                <p style="border-bottom: 1px lightgray solid; margin-bottom: 10px;">Количество:</p>
                <p style="border-bottom: 1px lightgray solid;">Сумма:</p>
            </div>
            <div class="col-sm-6 col-6" style="text-align: left;">
                <p style="border-bottom: 1px lightgray solid; margin-bottom: 10px;">${{current_product.price}}</p>
                <input type="number" v-if="IsEditingMode" v-model="edited_order.count" style="width: 100%; border-radius: 5px; border: 1px lightgray solid; margin-bottom: 9.5px; height: 25px;">
                <p v-else style="border-bottom: 1px lightgray solid; margin-bottom: 10px;">{{current_order.count}} шт.</p>
                <p style="border-bottom: 1px lightgray solid;">${{current_product.price * current_order.count}}</p>
            </div>
        </div>
        <div class="col-md-5 col-sm-12 col-12" id="Controls">
            <div style="width: 100%; margin-bottom: 10px; height: 40px;">
                <v-select v-if="IsEditingMode" style="max-height: 100px;" v-model="edited_order.statusId" :reduce="status => status.id" :options="GetStatusesFromParent()" label="name"/>
                <p v-else class="controls-info-box" style="width: 100%;" :style="{'background-color': GetStatusColor(current_status.id)}">{{current_status.name}}</p> 
            </div>
            <div style="width: 100%; margin-bottom: 10px; height: 40px;">
                <p class="controls-info-box delete-btn" v-if="IsEditingMode" @click="IsEditingMode=false">Отмена</p> 
                <p class="controls-info-box delete-btn" v-else @click="DeleteOrder()">Удалить</p> 
            </div>
            <div style="width: 100%; margin-bottom: 10px; height: 40px;">
                <p class="controls-info-box edit-btn" v-if="IsEditingMode" @click="SaveEditedOrder()">Сохранить</p> 
                <p class="controls-info-box edit-btn" v-else @click="EditOrder()">Изменить</p> 
            </div>
        </div> 
    </div>
</template> 

<script>
export default {
    name : "OrderBox",
    props : ['order', 'product', 'status'],
    data(){
    return {
        IsEditingMode: false,
        edited_order: {
            id:0,
            productId:0,
            statusId:0,
            count:0
        },
        current_order: null,
        current_product: null,
        current_status: null,
    }
  },
    methods : {
        GetStatusColor(id){
            if(id==1)
                return '#FF9B00'
            else if(id==2)
                return '#8ED7FF'
            else if(id==3)
                return '#FFE806'
            else if(id==4)
                return '#F39DFF'
            else if(id==5)
                return '#FF9DA0'
            else
                return '#00cc44'
        },
        DeleteOrder(){
            this.$swal({
                title: "Вы уверены, что хотите удалить этот заказ?",
                icon: "warning",
                buttons: ["Отмена","Удалить"],
                dangerMode: true,
            })
            .then((willDelete) => {
                if(willDelete) {
                    this.axios.post(`https://webtest.it.ua/testApp/api/orders/delete/${this.current_order.id}`)
                    .then(res => {
                        console.log(res)
                        this.$swal({
                            text: "Заказ успешно удалён",
                            icon: "success",
                            button: "Ок",
                        });
                    })
                    .catch(err => console.log(err.response))
                    .finally(this.$parent.GetOrders());
                }
            });
        },
        GetProductsFromParent(){
            return this.$parent.products;
        },
        GetStatusesFromParent(){
            return this.$parent.statuses;
        },
        EditOrder(){
            this.IsEditingMode = true;

            this.edited_order.id = this.current_order.id;
            this.edited_order.productId = this.current_order.productId;
            this.edited_order.statusId = this.current_order.statusId;
            this.edited_order.count = this.current_order.count;
        },
        SaveEditedOrder(){
            if(this.edited_order.productId==null || this.edited_order.statusId==null || this.edited_order.count<=0){
                this.$swal({
                    title: "Значения должны быть заполнены",
                    text: 'Поле продукта было пустое, количество товара было равным/меньше 0 или поле статуса было пустым',
                    button: "Закрыть",
                    icon: "warning",
                });
            }
            else{
                this.axios.post('https://webtest.it.ua/testApp/api/orders/update',
                {
                    "id": this.edited_order.id,
                    "productId": this.edited_order.productId,
                    "statusId": this.edited_order.statusId,
                    "count": parseInt(this.edited_order.count),
                },
                {
                    headers: {'Content-Type': 'application/json'}
                })
                .then(res => {
                    console.log(res);
                    this.current_order = res.data;
                    this.current_product = this.GetProductsFromParent().find(e => e.id === this.current_order.productId)
                    this.current_status = this.GetStatusesFromParent().find(e => e.id === this.current_order.statusId)
                    this.IsEditingMode=false;
                    this.$swal({
                        text: "Заказ успешно изменён",
                        icon: "success",
                        button: "Ок",
                    });
                })
                .catch(err => console.log(err.response))
                .finally(this.$parent.GetOrders());
            }
        }
    },
    watch: { 
        order: function(newVal, oldVal) {
            console.log(oldVal);
            this.current_order=newVal;
        },
        product: function(newVal, oldVal) {
            console.log(oldVal);
            this.current_product=newVal;
        },
        status: function(newVal, oldVal) {
            console.log(oldVal);
            this.current_status=newVal;
        },
    },
    created(){
        this.current_order=this.order;
        this.current_product=this.product;
        this.current_status=this.status;
    },
}
</script>

<style>
    .order-box{
        background-color: white;
        padding: 15px;
        margin: 20px;
        border-radius: 20px;
        border: 2px #42BCFF solid;
        --bs-gutter-x: 0px;
    }

    .controls-info-box{
        margin: 0px; 
        font-size: larger; 
        font-weight: bold; 
        width: fit-content; 
        float: right; 
        padding: 5px 10px; 
        border-radius: 10px;
    }

    .delete-btn{
        background-color: #ff6666;
        cursor: pointer;
        border: 2px transparent solid;
    }

    .delete-btn:hover{
        border: 2px #ff6666 solid;
        background-color: white;
        color: #ff6666;
        transition: all .2s ease-in;
    }

    .edit-btn{
        background-color: #ccff33;
        cursor: pointer;
        border: 2px transparent solid;
    }

    .edit-btn:hover{
        border: 2px #ccff33 solid;
        background-color: white;
        color: #ccff33;
        transition: all .2s ease-in;
    }

    .swal-footer{
        text-align: center;
    }

    .swal-text{
        text-align: center;
    }
</style>
