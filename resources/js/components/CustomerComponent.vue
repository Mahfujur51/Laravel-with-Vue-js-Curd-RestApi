<template>
  <div id="customer">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            Customers
            <button class="btn btn-primary pull-right" @click="reload()">
                Reload <i class="fa fa-repeat" ></i>

              </button>
               <button class="btn btn-success pull-right mr-2" @click="create">
                Create <i class="fa fa-plus-square"></i>

              </button>
           
          </div>
          <div class="card-body">
            <div  class="mb-3">
              <div class="row">
                <div class="col-md-2">
                  <strong>Search By:</strong>
                </div>
                <div class="col-md-3">
                  <select id="fileds" v-model="queryField" class="form-control" >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="total">Total</option>
                    <option value="address">Address</option>
                  </select>
                </div>
                <div class="col-md-7">
                  <input type="text" class="form-control" v-model="query" placeholder="Search">
                </div>
              </div>
            </div>
            <table class="table table-hover">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
              <tr  v-show="customers.length" v-for="(customer,index) in customers" :key="customer.id">
                <td>{{index+1}}</td>
                <td>{{customer.name}}</td>
                <td>{{customer.email}}</td>
                <td>{{customer.phone}}</td>
                <td>{{customer.total}}</td>
                <td>
                   <button type="button" class="btn btn-info btn-sm">
                     <i class="fa fa-eye"></i>
                   </button>
                   <button type="button" @click="edit(customer)" class="btn btn-primary btn-sm">
                     <i class="fa fa-edit"></i>
                   </button>
                   <button type="button" @click="destroy(customer)" class="btn btn-danger btn-sm">
                     <i class="fa fa-trash-o"></i>
                   </button>
                </td>
              </tr>
              <tr v-show="!customers.length">
                <td colspan="6">
                  <div class="alert alert-danger"> Sorry :( No data Found!!</div>
                </td>
              </tr>
             
            </table>
        
          </div>
          <pagination v-if="pagination.last_page>1"
            :pagination="pagination"
            :offset="5"
            @paginate="query==''?getData():searchData()"
            ></pagination>
        </div>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
   <vue-snotify></vue-snotify>
   <!-- Modal -->
<div class="modal fade" id="customerModalLong" tabindex="-1" role="dialog" aria-labelledby="customerModalLongTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="customerModalLongTitle">{{editMode?"Edit":"Add New "}} Customers</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="editMode ?update() :store()" @keydown="form.onKeydown($event)">
      <div class="modal-body">
        <alert-error :form="form"></alert-error>
        
    <div class="form-group">
      <label>Name</label>
      <input v-model="form.name" type="text" name="name"
        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
      <has-error :form="form" field="username"></has-error>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input v-model="form.email" type="text" name="email"
        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
      <has-error :form="form" field="user Email"></has-error>
    </div>
    <div class="form-group">
      <label>Phone</label>
      <input v-model="form.phone" type="text" name="phone"
        class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }">
      <has-error :form="form" field="User Phone Number"></has-error>
    </div>
        <div class="form-group">
      <label>Address:</label>
      <input v-model="form.address" type="text" name="address"
        class="form-control" :class="{ 'is-invalid': form.errors.has('address') }">
      <has-error :form="form" field="Enter Address"></has-error>
    </div>
     <div class="form-group">
      <label>Total:</label>
      <input v-model="form.total" type="number" name="total"
        class="form-control" :class="{ 'is-invalid': form.errors.has('total') }">
      <has-error :form="form" field="Enter total"></has-error>
    </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button :disabled="form.busy" type="submit" class="btn btn-primary">Save changes</button>
      </div>
      </form>
    </div>
  </div>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode:false,
      customers: [],
      query:'',
      queryField: 'name',
      form: new Form({
        id:'',
        name:'',
        email:'',
        phone:'',
        address:'',
        total: '',
      }),
      pagination: {
        current_page: 1,

      }
    };
  },
  watch: {
    query: function (newQ,old) {
      if (newQ==='') {
        this.getData();
        
      }else{
        this.searchData()
      }
      
    }
  },
  mounted() {
    console.log("Component Mounted");
    this.getData();
  },
  methods: {
    getData() {
       this.$Progress.start()
      axios
        .get('/api/customers?page='+this.pagination.current_page)
        .then((response) => {
          this.customers = response.data.data;
          this.pagination = response.data.meta;

          this.$Progress.finish();
        })
        .catch((e) => {
          console.log(e);
          this.$Progress.fail();
        });
    },
    searchData(){
      this.$Progress.start()
      axios.get('api/search/customers/'+this.queryField+'/'+this.query+'?page='+this.pagination.current_page)
      .then(response=>{
        this.customers=response.data.data;
        this.pagination=response.data.meta;
        this.$Progress.finish()


      }).catch((e)=>{

          console.log(e)
          this.$Progress.fail()
      })
    },
    reload(){
      this.getData()
      this.query=''
      this.queryField='name'
      this.$snotify.success("Data refresh Successfully",'Success')
    },
    create(){
       this.editMode=false;

        this.form.reset ()
        this.form.clear()
       
        $('#customerModalLong').modal('show')
    },
    store(){
      this.$Progress.start()
      this.form.busy=true
      this.form.post('/api/customers')
      .then(response=>{
        this.getData()
        $('#customerModalLong').modal('hide');
        if (this.form.successful) {
          this.$Progress.finish()
          this.$snotify.success('Customer Added Successfully','Success')
          
        }else{
          this.$Progress.fail()
          this.$snotify.error('Something went wrong try again later','Error');
        }
      })
      .catch(e=>{
        this.$Progress.fail()
        console.log(e)
      })
    },
    edit(customer){
      this.editMode=true;
      this.form.reset()
      this.form.clear()
      this.form.fill(customer)
        $('#customerModalLong').modal('show')


    },
    update(){
        this.$Progress.start()
      this.form.busy=true
      this.form.put('/api/customers/'+this.form.id)
      .then(response=>{
        this.getData()
        $('#customerModalLong').modal('hide');
        if (this.form.successful) {
          this.$Progress.finish()
          this.$snotify.success('Customer updated Successfully','Success')
          
        }else{
          this.$Progress.fail()
          this.$snotify.error('Something went wrong try again later','Error');
        }
      })
      .catch(e=>{
        this.$Progress.fail()
        console.log(e)
      })

    },
    destroy(customer) {
      this.$snotify.clear();
      this.$snotify.confirm(
        "You will not be able to recover this data!",
        "Are you sure?",
        {
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          buttons: [
            {
              text: "Yes",
              action: toast => {
                this.$snotify.remove(toast.id);
                this.$Progress.start();
                axios
                  .delete("/api/customers/" + customer.id)
                  .then(response => {
                    this.getData();
                    this.$Progress.finish();
                    this.$snotify.success(
                      "Customer Successfully Deleted",
                      "Success"
                    );
                  })
                  .catch(e => {
                    this.$Progress.fail();
                    console.log(e);
                  });
              },
              bold: true
            },
            {
              text: "No",
              action: toast => {
                this.$snotify.remove(toast.id);
              },
              bold: true
            }
          ]
        }
      );
    }
  },
};
</script>
