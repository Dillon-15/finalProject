Vue.component('navbar', {
    template: `
    <div class="container" style="margin-left:auto; margin-right:auto; max-width: 98%;">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <h4 class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-light text-decoration-none">
            Dillon's Ticket Dealer
            </h4>
            <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li class="nav-item">
                    <h5 class="text-light">Upcoming Movies</h5>
                </li>
            </ul>
            
            <div class="col-md-3 text-end">
                
            </div>
        </header>

    </div>`,
    name: "navbar",
    data(){
        return{
            
        } 
    }
})

Vue.component('sidebar',{
    template: `
    <div>
        <button class=" custom-postion button" styles="width:60px;" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            <i class="bi bi-cart-fill"></i>
        </button> 
        <div class="offcanvas offcanvas-end  custom-width" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <h2 class="offcanvas-title" id="offcanvasExampleLabel">{{ msg }}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="container">
                <hr>
            </div>
            <div class="offcanvas-body">
                <div container>
                    <table>
                        <tr>
                            <th>Movie</th>
                            <th>Adult Tickets</th>
                            <th>Child Tickets</th>
                            <th>Subtotal</th>
                            <th>Remove Ticket</th>

                        </tr>
                        <tr v-for="tick in ticket">
                            <td>{{tick.name}}</td>
                            <td>{{tick.aTicket}}</td>
                            <td>{{tick.cTicket}}</td>
                            <td>$\{{tick.sub}}</td>
                            <td><button v-on:click="remove" class="button" styles="font-size:20px; width:100px">Remove</button></td>
                        </tr>

                        <tr>
                            <td></td>
                            <td></td>
                            <th>Total:</th>
                            <td></td>
                        </tr>
                        </table> 
                </div>
            </div>
        </div>
    </div>
    `,
    name: "sidebar",
    // props:["msg", "movienames", "adulttickets", "childtickets", "subtotal"],
    props:["msg", "ticket"],
    data(){
        return{

        }
    },
    methods:{
        remove(e){
            console.log(e.target.parentElement.parentElement);
            var trRemove = e.target.parentElement.parentElement;
            trRemove.remove()
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
                <a v-on:click="addToCart" class="btn btn-primary addtoCart button">Add to cart</a>
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
            // console.log(ticketVal[0]);
            // console.log(ticketVal[1]);
            var movieName = ticketVal[0].parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            console.log(movieName)


            var Atic = ticketVal[0].valueAsNumber + " x $13.00";
            var Ctic = ticketVal[1].valueAsNumber + " x $9.00";
            var subTo = ticketVal[0].valueAsNumber * 13 + ticketVal[1].valueAsNumber * 9;

            if (ticketVal[0].valueAsNumber != 0 || ticketVal[1].valueAsNumber != 0){
                app.ticketObj.push(
                    {
                        "name": movieName,
                        "aTicket": Atic,
                        "cTicket": Ctic,
                        "sub": subTo
                    }
                )
            }





            console.log(app.ticketObj)

            
        }
    }

    })

var apikey = "df78dbf203b1cd1f3a6d506adc95f2fd";

const app = new Vue({
    el:"#app",
    data: {
        msg: "Your Cart",
        movies:[],
        ticketObj:[],
        // addedA:[],
        // addedC:[],
        // subTotal:[],
        // ticketName:[]
    },
    mounted(){
        axios
            .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&language=en-US&page=1`)
            .then(responseU => {
                this.movies = responseU.data.results;
            })
    },
})