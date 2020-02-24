<template>
  <!--  <div class="tech-slideshow">
        <div class="mover-1"></div>
        <div class="mover-2"></div>
      </div> -->

  <div>
   
    <div class="home-page">
      <div id="wrapper">
        <div class="container">
            <div class="row" id="overlay">
                <div class="overlay_new"></div>
                <div class="col-md-12" v-if="map_flag == 0">
                   <div class="search-details">
                        <h1 class="title">
                            <span class="info-title-01">FIND YOUR FOOD TRUCK'</span>
                        </h1>
                        <h1 class="subtitle">
                            Something Fresh is Always Cooking  <sup></sup>
                        </h1>
                        <p class="search-places">ENTER YOUR LOCATION</p>
                        <!-- <label class="typo__label">Select with search for bus</label> -->
                       
                    </div>
                </div>
                <div class="col-md-12" v-if="map_flag == 1">
                    <div id="map" style="height:300px; width:100%; margin-bottom:20px;"></div>
                </div>

                   <div class="" style="margin-left:40%;margin-bottom:60px;">
                     <multiselect v-model="selected_food_truck"
                        :custom-label="customLabelForTruck"
                        :options="filtered_food_truck_list"
                        @search-change="asyncFindTruck"
                        @input="selectTruckAddress" placeholder="Type to search your location" >
                    </multiselect>
                </div>
            </div>
            <div class=" row search-truck-location"  style="margin-top:50px;">
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
                            <!-- <p>{{v.facilitytype}}</p> -->
                            <ul>
                                <li>{{v.fooditems}}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- <ul>
                        <li v-for="(v,i) in listed_food_truck_item" :key="i"> {{v}}</li>
                    </ul> -->
                </div>
            </div>
        </div>
        
      </div>
      
    </div>


  </div>
</template>
<script src="https://unpkg.com/vue-suggestion"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <script src='//cdn.jsdelivr.net/gmaps4rails/2.1.2/gmaps4rails.js'> </script>
  <script src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js'> </script>
  <script src='https://cdn.jsdelivr.net/npm/vue-lodash@2.1.1/dist/bundle.min.js'> </script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-egiufLMTKZpSVNqpf0KzV2mzbpg09ZM"></script>

<script>
 import Multiselect from 'vue-multiselect'

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
      listed_food_truck_item:[],
       map_flag:0,
      item_autocomplete: [],
      facilitytype:[],

    };
  },
  mounted() {

    // var map = new GMaps({
    //   el: '#map',
    //   lat: -12.043333,
    //   lng: -77.028333
    // });
  
  },

  created() {

    this.getMovieList();
    this.getBusList();
  },

  methods: {
    customLabelForMovies (option ) {
     return `${option.title}`
    },




   getMovieList(){
      let that =this;
         that.axios.get('https://data.sfgov.org/resource/yitu-d5am.json').then(response => {
          that.movie_lists = response.data;

          }).catch(err => {
       });
    },

    asyncFindMovie(query){
      let that = this;

      if (query.length > 2) {

        var filtered_item = this.movie_lists.filter(o => {
              return o.title.toLowerCase().includes(query.toLowerCase());
          });

        that.movies = that._.uniqBy(filtered_item,'title');


      }else{
      }

    },

    selectMovie(){
      let that =this;

      that.listed_movie_item =[];

    setTimeout(function(){
      if (that.selected_movie != null || that.selected_movie == '') {

             that.listed_movie_item = that.movie_lists.filter(o => {
                    return o.title == that.selected_movie.title;
            });

          that.display_scenes_near(that.selected_movie);


         }
      },0);

    },


  customLabelForTruck (option ) {
     return `${option.address}`
    },


  getBusList(){
      let that =this;
         that.axios.get('https://data.sfgov.org/resource/rqzj-sfat.json').then(response => {
          console.log(response);
          that.food_truck = response.data;

          }).catch(err => {
       });
    },

    asyncFindTruck(query){
      let that = this;

      if (query.length > 2) {

        var filtered_food_truck_item = that.food_truck.filter(o => {
              return o.address.toLowerCase().includes(query.toLowerCase());
          });

        that.filtered_food_truck_list = that._.uniqBy(filtered_food_truck_item,'address');


      }else{
      }

    },

    selectTruckAddress(){
      let that =this;

      that.map_flag = 1;

      // that.listed_food_truck_item =[];

    setTimeout(function(){
        if (that.selected_food_truck != null || that.selected_food_truck == '') {

               that.listed_food_truck_item = that.food_truck.filter(o => {
                      return o.address == that.selected_food_truck.address;
                  });

              that.display_food_truck_near(that.selected_food_truck,that.listed_food_truck_item);

          }
      },500);

    },

    display_food_truck_near(selected_food_truck,food_truck_list) {


      let that =this;


        // console.log(obje_to_push);
       
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
          animation: google.maps.Animation.DROP
        });

        // tetsted and done
        // that.facilitytype = [];

        // $.each(food_truck_list,function(i,v){

        //     var exist = that._.find(that.facilitytype,['facilitytype',v.facilitytype]);

        //     if( exist == undefined){  

        //          var obje_to_push = {

        //             facilitytype :v.facilitytype,
        //          }

        //          that.facilitytype.push(obje_to_push);

        //     }else{

        //       console.log('here esle');

        //     }
        // });


      // let obje_to_push = [];

      // that._.forEach(food_truck_details, function(value, key) {

      //   var locations = [value.address,value.latitude,value.longitude];


      //    console.log(locations);

      // });
      //  var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 10,
      //     center: new google.maps.LatLng(-33.92, 151.25),
      //     mapTypeId: google.maps.MapTypeId.ROADMAP
      //   });

      //   var infowindow = new google.maps.InfoWindow();
      //    var marker, i;


      //     for (i = 0; i < locations.length; i++) {  
      //     marker = new google.maps.Marker({
      //       position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      //       map: map
      //     });
      //   }


    },

    // selectFacType(type){

    //     let that =this;

    // }

  
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style type="text/css">
 #map {
  width: 400px;
  height: 400px;
}





#wrapper {
   background-image: url('../assets/event-bann.png');
    background-repeat: repeat-x;
    animation: slideleft 10000s infinite linear;
    -webkit-animation: slideleft 10000s infinite linear;
    width: 100%;
    height: 700px;
    padding-top: 50px;
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
  /*background-image:  url('../assets/images.png');*/
  background-color: #f05790;
  padding: 10px;
  position: relative;
}

.overlay_new{
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 0;
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

}
.truck-detail-info>.truck_title a{
        font-weight: bold;
     color: #464646;
    font-size: 18px;
}

.truck-detail-info{
}

</style>
