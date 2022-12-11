// Code By Dillon Barnett
// Vue Movie Tickets / Final Project

// vue component for the navbar
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
    name: "navbar"
})

// vue component for the sidebar
Vue.component('sidebar',{
    template: `
    <div>
        <button class=" custom-postion button sticky-top" styles="width:60px;" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
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
                <div class="container">
                    <div id="empty" class="center-text">
                        <h2>Cart is Empty</h2>
                    </div>
                    <table id="table">
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

                        <tr v-for="tot in total">
                            <th>Total:</th>
                            <td id="adult">{{tot.adult}}</td>
                            <td id="child">{{tot.child}}</td>
                            <td>{{tot.total}}</td>
                        </tr>
                        </table> 
                </div>
            </div>
        </div>
    </div>
    `,
    name: "sidebar",
    // In props: msg displays "Your Cart", ticket makes a tr for every ticket that is added to the cart, total updates the last table row with the new prices
    props:["msg", "ticket", "total"],
    // In methods: remove gets the table row that the button was clicked on and then removes it
    methods:{
        remove(e){
            console.log(e.target.parentElement.parentElement);
            app.deletefromCart(e.target.parentElement.parentElement.innerHTML)
            var trRemove = e.target.parentElement.parentElement;
            trRemove.remove();
        }
    }
})

// vue component for the moviecard
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
                <a v-on:click="addToCart" class="btn btn-dark addtoCart">Add to cart</a>
            </form>

        </div>
    </div>`,
    name: "moviecard",
    // In props: movies makes a new div for every movie in movies and updates the title, image, and overview
    props:['movies'],
    // In data: it sets img to the starting link and then to the poster_path
    data(){
        return{
            img: "https://image.tmdb.org/t/p/w500/" + this.movies.poster_path 
        } 
    },
    // In methods: addToCart calls the method in app called addcart
    methods:{
        addToCart(e){
            app.addCart(e)
        }
    }
    })

// the apikey for axios call
var apikey = "df78dbf203b1cd1f3a6d506adc95f2fd";

// new vue instance of vue
const app = new Vue({
    el:"#app",
    // In data: msg is sent to sideBar, movies is sent to moviecard, ticketObj is sent to sidebar, totalnum is sent to sidebar, Atick and Ctick and totals is used to get totalnum
    data: {
        msg: "Your Cart",
        movies:[],
        ticketObj:[],
        totalnum:[],
        Atick:0,
        Ctick:0,
        totals:0


    },
    // In mounted: it uses axios to get the api call
    mounted(){
        axios
            .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&language=en-US&page=1`)
            .then(responseU => {
                this.movies = responseU.data.results;
            })
    },
    // In Methods: 
    //  - addCart(): in this method it will run addTicket if all the requirements are met
    //  - addTicket(): in this method it will add an object to the ticketObj array
    //  - add(): in this method it updates the totalnum array by adding values
    //  - checkZero(): in this method we check if Atick or Ctick is zero and if so it will set that tag to hidden and if not it will get set to visible 
    //  - deletefromCart(): in this method it updates the total array by subtracting values
    methods:{
        addCart(e){
            console.log(e.target);
            // gets the ticketVal from the element that was clicked on in moviecard component
            var ticketVal = e.target.parentElement;

            // gets movieName from ticketVal
            var movieName = ticketVal[0].parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            console.log(movieName)
            console.log(app.totalnum.length)
            // if ticketObj equals 0 then it will run addTicket
            if (this.ticketObj.length == 0){
                this.addTicket(ticketVal, movieName);
            }else{ // else it will check if the ticketName is already in the array and if so it wont run addTicket
                console.log(!(this.ticketObj.includes(movieName)));
                console.log((this.ticketObj.includes(movieName)));
                var x = 1;
                for (i = 0; i < app.ticketObj.length; i++){
                    if (this.ticketObj[i].name.includes(movieName)){
                        x = 0;
                    }
                }
                console.log(x)

                if (x == 1){
                    console.log(this.ticketObj[0].name + " app"),
                    console.log(movieName);
                    this.addTicket(ticketVal, movieName);
                }
            
            }
        },
        addTicket(ticketVal, movieName){
            document.getElementById("empty").style.visibility = "hidden";
            document.getElementById("empty").style.height = "0px";
            document.getElementById("table").style.visibility = "visible";
            
            // checks if Atic does not equals and if so then it sets Atic or Ctic to the number of tickets then X the price
            if (ticketVal[0].valueAsNumber != 0){
                var Atic = ticketVal[0].valueAsNumber + " x $13.00";
            } else {
                var Atic = " ";
            }
            if (ticketVal[1].valueAsNumber != 0){
                var Ctic = ticketVal[1].valueAsNumber + " x $9.00";
            } else {
                var Ctic = " ";
            }
            // Calculates the subtotal value
            var subTo = ticketVal[0].valueAsNumber * 13 + ticketVal[1].valueAsNumber * 9;

            // pushes the new ticket object to the ticketObj array 
            this.ticketObj.push(
                {
                    "name": movieName,
                    "aTicket": Atic,
                    "cTicket": Ctic,
                    "sub": subTo
                }
            )
            // then runs add
            this.add(ticketVal[0].valueAsNumber, ticketVal[1].valueAsNumber);
        },
        add(Atotal, Ctotal){
            // to get the full total of all adult and child tickets
            this.Atick =  this.Atick + Atotal;
            this.Ctick = this.Ctick + Ctotal;
            this.totals = this.Atick + this.Ctick

            // Calculates the full price for the adult and child sub totals and then adds them together to get new total price
            var Aprice = this.Atick * 13;
            var Cprice = this.Ctick * 9;
            var Tprice = Aprice + Cprice;

            // removes the last item in the array (in this case it removes the only thing in the array)
            this.totalnum.pop()
            // then pushs the new object into the array
            this.totalnum.push(
                {
                    "adult": this.Atick + " @ $" + Aprice,
                    "child": this.Ctick + " @ $" + Cprice,
                    "total": "$" + Tprice
                }
            )
            // then runs checkZero
            this.checkZero()

            console.log(this.Ctick);
            console.log(this.Atick);
            console.log(this.totals);

            console.log(this.totalnum);


        },
        checkZero(){
            // starts out by waiting 10 milliseconds then if Atick or Ctick equals zero then they have a display if hidden
            setTimeout(() => { 
                if (this.Atick == 0){
                    document.getElementById("adult").style.visibility = "hidden";
                }else{
                    document.getElementById("adult").style.visibility = "visible";
                }
                if (this.Ctick == 0){
                    document.getElementById("child").style.visibility = "hidden";
                }else{
                    document.getElementById("child").style.visibility = "visible";
                }
             }, 10);
        },
        deletefromCart(movieText){
            // starts by getting the text form the table row that was removed and spliting it by </td>
            var banana = movieText.split("</td>");
            console.log(banana)

            // in this step we are setting removeA and removeC to just the numbers that we want
            var removeA = banana[1].slice(5,100).split(" ");
            console.log(removeA);
            var removeC = banana[2].slice(5,100).split(" ");
            console.log(removeC);

            // if it is an empty string then removeA[0] or removeC[0] is set to zero
            if(removeA[0] == ""){
                removeA[0] = 0;
            }
            if(removeC[0] == ""){
                removeC[0] = 0;
                
            }

            // to get the full total of all adult and child tickets
            this.Atick =  this.Atick - parseInt(removeA[0]);
            this.Ctick = this.Ctick - parseInt(removeC[0]);
            this.totals = this.Atick + this.Ctick

            // Calculates the full price for the adult and child sub totals and then adding them together to get new total price
            var Aprice = this.Atick * 13;
            var Cprice = this.Ctick * 9;
            var Tprice = Aprice + Cprice;

            // if the total price equals 0 then it displays cart is empty again
            if (Tprice == 0){
                document.getElementById("empty").style.visibility = "visible";
                document.getElementById("empty").style.height = "36.7833px";
                document.getElementById("table").style.visibility = "hidden";
            }
            

            // removes the last item in the array (in this case it removes the only thing in the array)
            this.totalnum.pop()
            // then pushs the new object into the array
            this.totalnum.push(
                {
                    "adult": this.Atick + " @ $" + Aprice,
                    "child": this.Ctick + " @ $" + Cprice,
                    "total": "$" + Tprice
                }
            )
            // then runs check zero
            this.checkZero()
            console.log(this.Ctick);
            console.log(this.Atick);
            console.log(this.totals);

            console.log(this.totalnum);

        }
        
    }
})