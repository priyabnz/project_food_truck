<template>
  <div>
    <div class="home-page">
      <div id="wrapper">
        <div class="container">
            <div class="row" id="overlay">
                <div class="overlay_new" v-if="map_flag == 0"></div>

                <div class="col-md-12" v-if="map_flag == 0">
                   <div class="search-details">
                        <h1 class="title">
                            <span class="info-title-01">FIND YOUR FOOD TRUCK'</span>
                        </h1>
                        <h1 class="subtitle">
                            Something Fresh is Always Cooking  <sup></sup>
                        </h1>
                        <p class="search-places">ENTER YOUR LOCATION</p>
                    </div>
                </div>
                <div class="col-md-12" v-if="map_flag == 1">
                    <div id="map" style="height:300px; width:100%; margin-bottom:20px;"></div>
                </div>
                <div  class="col-md-4" :style="map_flag == 1 ?'margin-left:20%;padding-right:0px;' :'margin-left:32%;' ">
                   <multiselect v-model="selected_food_truck"
                      :custom-label="customLabelForTruck"
                      :options="filtered_food_truck_list"
                      @search-change="searchFoodTruck"
                      @input="selectTruckAddress" placeholder="Type to search your location" >
                  </multiselect>
                </div>
                <div class="col-md-3" v-if="map_flag == 1">
                   <select name="" id="" class="form-control" @change="facilitytypeChange()" v-model="fac_type">
                  <option value="all" selected="selected">All</option>
                  <option :value="value.facilitytype" v-for="(value,index) in facilitytype " :key="index">{{value.facilitytype}}</option>
                </select>
                </div>
            </div>
            <div class=" row search-truck-location"  style="margin-top:50px; margin-bottom:50px;">
                <div class="col-md-6" v-for="(v,i) in listed_food_truck_item" :key="i">
                    <div class="truck-detail-wrapper">
                        <div class="type" style="position:absolute; top: -14px;left: 255px;">
                            <span class="type-info" style="background-color: #757065;
                            color: #fff;
                            padding: 5px 20px;
                            border-radius: 100px;
                            font-size: .75rem;">{{v.facilitytype}}</span>
                        </div>
                        <div class="truck-detail-info" >
                            <h4 class="truck_title"><a href="javascript:;">{{v.applicant}}</a>
                            </h4>
                            {{v.facilitytype}}
                            <ul>  
                                <li>{{v.fooditems}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <!-- <GoogleMarkerContent></GoogleMarkerContent> -->
      
    </div>


  </div>
</template>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <script src='//cdn.jsdelivr.net/gmaps4rails/2.1.2/gmaps4rails.js'> </script>
  <script src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js'> </script>
  <script src='https://cdn.jsdelivr.net/npm/vue-lodash@2.1.1/dist/bundle.min.js'> </script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-egiufLMTKZpSVNqpf0KzV2mzbpg09ZM"></script>

<script>
 import Multiselect from 'vue-multiselect'
 // import GoogleMarkerContent from './GoogleMarkerContent.vue';
 // import Vue from 'vue';

 // var InfoWindow = Vue.extend(GoogleMarkerContent);
export default {
    components: { Multiselect},
  data() {
    return {
     selected_movie: '',
      movies: [],
      movie_lists: [],
      listed_movie_item:[],

      selected_food_truck:'',
      food_truck:[],
      filtered_food_truck_list:[],
      listed_food_truck_item_copy:[],
      listed_food_truck_item:[],
       map_flag:0,
      item_autocomplete: [],
      facilitytype:[],
      fac_type:'all',

    };
  },
  mounted() {
  
  },

  created() {

    this.getBusList();
  },

  methods: {

  customLabelForTruck (option ) {
     return `${option.address}`
    },


    // fetching the data 
    getBusList(){
      let that =this;
         that.axios.get('https://data.sfgov.org/resource/rqzj-sfat.json').then(response => {
          that.food_truck = response.data;
          }).catch(err => {
       });
    },

    //searching the food truck with given addresses
    searchFoodTruck(query){
      let that = this;

      if (query.length > 2) {
        var filtered_food_truck_item = that.food_truck.filter(o => {
              return o.address.toLowerCase().includes(query.toLowerCase());
          });
        that.filtered_food_truck_list = that._.uniqBy(filtered_food_truck_item,'address');
      }
    },


// selecting  certain address  from the filtered data  list
    selectTruckAddress(){
      let that =this;

      that.map_flag = 1;
        that._.delay(function() {
          if (that.selected_food_truck != null || that.selected_food_truck == '') {


                 // that.listed_food_truck_item = that.food_truck.filter(o => {
                 //        return o.address == that.selected_food_truck.address;
                 //    });

                  that.listed_food_truck_item = that.food_truck.filter(
                      o =>  o.address == that.selected_food_truck.address
                  )

                 that.listed_food_truck_item_copy =that.listed_food_truck_item;

                that.display_food_truck_near(that.selected_food_truck,that.listed_food_truck_item);
            }
        }, 1000);

    },

// displaying food truck location in google map
    display_food_truck_near(selected_food_truck,food_truck_list) {
      let that =this;
      // tetsted and done
      var latitude =selected_food_truck.latitude;
      var longitude =selected_food_truck.longitude;
      var address =selected_food_truck.address;
      var coordinate = new google.maps.LatLng(latitude,longitude);


        var map = new google.maps.Map(document.getElementById('map'), {
          center: coordinate,
          zoom: 13
        });

        var marker = new google.maps.Marker({
          position: coordinate,
          map: map,
          title: address,
          animation: google.maps.Animation.DROP,
          
        });


      // let instance = new InfoWindow({
      //   propsData: {
      //               contentData:food_truck_list,
      //               title:marker.title
      //             }
      // });

      var infowindow = new google.maps.InfoWindow({
        // content:contentString
      });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
        // tetsted and done
        that.facilitytype = [];

        $.each(food_truck_list,function(i,v){

            var exist = that._.find(that.facilitytype,['facilitytype',v.facilitytype]);

            if( exist == undefined){  

                 var obje_to_push = {

                    facilitytype :v.facilitytype,
                 }

                 that.facilitytype.push(obje_to_push);

            }
        });

    },


    // facility type food truck or push cart
    facilitytypeChange(){

        let that =this;
        if (that.fac_type == 'all') {
            that.listed_food_truck_item =that.listed_food_truck_item_copy ;
        }else{
            that.listed_food_truck_item =that.listed_food_truck_item_copy ;

                that.listed_food_truck_item = that.listed_food_truck_item.filter(
                      o =>  o.facilitytype == that.fac_type
                  )
        //     that.listed_food_truck_item = that.listed_food_truck_item.filter(o =>
        //      {
        //             return o.facilitytype == that.fac_type;
        // });
      }
    }

  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style type="text/css">
 #map {
  width: 400px;
  height: 400px;
}

body{
   background-image: url('../assets/event-bann.png');
    background-repeat: repeat-x;
    /*animation: slideleft 10000s infinite linear;*/
    /*-webkit-animation: slideleft 10000s infinite linear;*/
    width: 100%;
    height: 700px;
    padding-top: 50px;
    padding-bottom: 50px;
  
}

@keyframes slideleft {
    from {
        background-position: 0%;
    }
    
    to {
        background-position: 90000%;
    }
}

@-webkit-keyframes slideleft {
    from {
        background-position: 0%;
    }
    to {
        background-position: 90000%;
    }
}

#overlay{
  background-color: #f05790;
  padding: 40px 10px 70px 10px;
  position: relative;
}

.overlay_new{
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: -20px;
    left:100px;
    right: 0;
    bottom: 0;
    background-image: url(../assets/food-truck-designs.png);
    background-position: right top;
    background-repeat: no-repeat;
    z-index: 0;
     -webkit-animation: mover 1s infinite  alternate;
    animation: mover 1s infinite  alternate;
}
@-webkit-keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
}
@keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
}

.search-details{
    padding: 60px 0px 0px 0px;

}

.title{
    font-family:sans-serif;
    font-style: normal;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgba(34,34,34,0.5);
    color: #fff;
}

.subtitle{
    font-family:sans-serif;
    font-style: normal;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(34,34,34,0.75);
    line-height: 1.25;
    color: #fff;
    margin: .5rem 0 0;
    font-size: 1.14rem;
}

.search-places{
   font-family:sans-serif;
    font-weight: 700;
    font-size: 18px;
    padding: 10px 0;
    text-align: center;
    color: #fff;
}

.truck-detail-wrapper{

     padding: 10px 15px;
     box-shadow: 0 0 10px #f05790;
     background: white;
     margin-bottom: 30px;

}
.truck-detail-info>.truck_title a{
   font-weight: bold;
     color: #464646;
    font-size: 18px;
}

.truck-detail-info{
}

</style>
