Vue.component('navbar', {
    template: `
    <div class="container" style="margin-left:auto; margin-right:auto; max-width: 98%;">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <h4 class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
            Dillon's Ticket Dealer
            </h4>
            <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li class="nav-item">
                <h5>Upcoming Movies</h5>
            </li>


            </ul>
            
            <div class="col-md-3 text-end">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                <i class="bi bi-cart-fill"></i>
            </button>
            </div>
        </header>
        <!-- SideBar -->

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">{{ msg }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div>
                    
                </div>
            </div>
        </div>

    </div>`,
    name: "navbar",
    props:['msg'],
    data(){
        return{
            
        } 
    }
})

Vue.component('moviecard',{
    template: `
    <div class="card" style="width: 18rem;">
        <h5 id="ticketName" class="card-title m-3">{{movies.title}}</h5>
        <img :src=img class="card-img-top" alt="">
        <div class="card-body d-flex disc">
            <p class="card-text align-self-center ">{{movies.overview}}</p>
        </div>
        <div class="container myButton">
            <form class="d-flex justify-content-around">
                <div class="container">
                    <label for="numTicketA">Adults:</label>
                    <input type="number" value="0" min="0" name="numTicketA" class="custom-input" placeholder="0">
                </div>
                <div class="container">
                    <label for="numTicketC">Children:</label>
                    <input type="number" value="0" min="0" name="numTicketC" class="custom-input" placeholder="0">
                </div>
                <a v-on:click="addToCart" class="btn btn-primary">Buy Ticket</a>
            </form>

        </div>
    </div>`,
    name: "moviecard",
    props:['movies'],
    data(){
        return{
            img: "https://image.tmdb.org/t/p/w500/" + this.movies.poster_path 
        } 
    },
    methods:{
        addToCart(e){
            console.log(e.target);
            var ticketVal = e.target.parentElement;
            console.log(ticketVal[0]);
            console.log(ticketVal[1]);
            var movieName = ticketVal[0].parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            console.log(movieName)
            // this.addcartNum = this.addcartNum + Number.parseInt(ticketVal);
            app.addedA = ticketVal[0].valueAsNumber;
            app.addedC = ticketVal[1].valueAsNumber;
            app.name = movieName.innerHTML;
            console.log(app.addedA);
            console.log(app.addedC);
            // console.log(app.name);
            // console.log(ticketVal.valueAsNumber);
            
        }
    }

    })

var apikey = "df78dbf203b1cd1f3a6d506adc95f2fd";

const app = new Vue({
    el:"#app",
    data() {
        return {
            movies:[],
            addedA:0,
            addedC:0,
            ticketName:[]
        }
    },
    mounted(){
        axios
            .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&language=en-US&page=1`)
            .then(responseU => {
                this.movies = responseU.data.results;
            })
    },
    methods:{
        addCart(ticketVal, name){
            this.added = this.added + ticketVal;
            this.ticketName.push(name)
        }
    }
    
})