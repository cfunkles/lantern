var mainAppVue = new Vue({
    el: '#app',
    data: {
        searchCity: '',
        signUpForm: {
            username: '',
            password: '',
            name: '',
            state: '',
            email: '',
            canSetUpGear: false,
            agreedToTerms: false,
        },


        passwordChecker: '',


        loginForm: {
            username: '',
            password: '',
        },

        //info grabbed users objectID uppon login
        userInfo: {
            username: '',
            name: '',
            state: '',
            email: '',
            ratings: '',
            canSetUpGear: false,
            messages: [],
        },

        //used for keeping info that gets submitted to database uppon creation
        equipmentItem: {
            name: '',
            brand: '',
            model: '',
            size: '',
            category: '',
            condition: '',
            description: '',
            pickUpLocation: {
                address: '',
                city: '',
                state: '',
                zip:  '',
            },
            usersRenting: [{userId: 'userId', date: 'date'}],
            canSetUpGear: false,
            gearReview: [],//going to fill this array with objects the have rating number and comments
            ownerId: '',
            imageFileName: '',
        },


        //change this depending what items user wants to see.
        equipmentArray: [],


        //for click listeners
        loggedIn: false,
        loginClicked: false,
        createAccountClicked: false,
        aboutClicked: false,
        storyClicked: false,
        addGearClicked: false,
        ownedClicked: false,
        rentedClicked: false,
        home: true,
        searchMade: false,
    },



    computed: {
        //checks two password inputs for equalness. returns boolean when evaluated
        matchPasswords: function() {
            if(this.signUpForm.password === this.passwordChecker) {
                //add this feature later
                // if(password.length > 7) {
                //     return true;
                // }
                return true;
            }
            else { return false; }
        }
    },


    methods: {
        //click listeners
        clickLogin: function() {
            if(this.loginClicked) {
                this.clickHome();
                return;
            }
            this.loginClicked = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickCreateAccount: function() {
            if(this.createAccountClicked) {
                this.clickHome();
                return;
            }
            this.createAccountClicked = true;
            this.loginClicked = false;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickNavAbout: function() {
            if(this.aboutClicked) {
                this.clickHome();
                this.clickHomeLoggedIn();
                return;
            }
            this.aboutClicked = true;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickNavStory: function() {
            if(this.storyClicked) {
                this.clickHome();
                this.clickHomeLoggedIn();
                return;
            }
            this.storyClicked = true;
            this.aboutClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.addGearClicked =false;
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickAddItem: function() {
            if(this.addGearClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.addGearClicked = true;
            this.storyClicked = false;
            this.aboutClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickOwned: function() {
            if(this.ownedClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getOwnedItems();
            this.ownedClicked= true;
            this.rentedClicked = false;
            this.addGearClicked = false;
            this.storyClicked = false;
            this.aboutClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickRented: function() {
            if(this.rentedClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getRentedItems();
            this.rentedClicked = true;
            this.ownedClicked = false;
            this.addGearClicked = false;
            this.storyClicked = false;
            this.aboutClicked = false;
            this.searchMade = false;
            this.home = false;
        },
        clickHome: function() {
            this.home = true;
            this.loginClicked = false;
            this.createAccountClicked = false;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.searchMade = false;
        },
        clickHomeLoggedIn: function() {
            this.home = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
            this.searchMade = false;
        },


        //Function for new users who sign up
        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.matchPasswords) {
                console.log('passwords match!');
                var thatVm=this;
                //why is the password checker being injected into the signUpForm?
                console.log(this.signUpForm);
                $.post('/api/user/registration', this.signUpForm, function(res) {
                    if(res.success) {
                        console.log('account created and logged in!');
                        thatVm.getUserInfo();
                        for (var key in thatVm.signUpForm) {
                            thatVm.signUpForm[key] = '';
                        }
                        thatVm.signUpForm.canSetUpGear = false;
                        thatVm.signUpForm.agreedToTerms = false;
                        thatVm.passwordChecker = '';
                        thatVm.createAccountClicked = false;
                        thatVm.loginClicked = false;
                        thatVm.loggedIn = true;
                        thatVm.home = true;
                    } else {
                        //to do, make more dynamic controls for this response
                        console.log(res);
                        console.log('What!');
                    }
                });
            } else {
                alert('Passwords do no match');
            }
        },


        //runs when user registers
        getUserInfo: function() {
            var thatVm = this;
            $.get('/api/user', function(user) {
                thatVm.setUserInfo(user);
            });
        },

        //runs when user logs in and registers
        setUserInfo: function(user) {
            for (let key in user) {
                this.userInfo[key] = user[key];
            }
        },

        //run when clicking submit on log in form
        submitLogin: function(event) {
            event.preventDefault();
            var thatVm = this;
            $.post('/api/user/login', this.loginForm, function(user) {
                if (user === 'login error') {
                    alert('error logging in!');
                } else {
                    thatVm.loginForm.username = '';
                    thatVm.loginForm.password = '';
                    thatVm.loginClicked = false;
                    thatVm.createAccountClicked = false;
                    thatVm.loggedIn = true;
                    thatVm.home = true;
                    thatVm.setUserInfo(user);
                    thatVm.getOwnedItems();
                }
            });
        },

        //runs when clicking shared items button
        getOwnedItems: function() {
            thatVm = this;
            $.get('/api/equipments/userowned', function(itemsArray) {
                thatVm.equipmentArray = itemsArray;
            });
        },

        //runs when clicking rented items button
        getRentedItems: function() {
            thatVm = this;
            $.get('/api/equipments/usercheckouts', function(itemsArray) {
                thatVm.equipmentArray = itemsArray;
            });
        },

        //runs on submit of new item submission
        submitNewEquipment: function(event) { 
            event.preventDefault();
            var thatVm = this;
            this.equipmentItem.canSetUpGear = this.userInfo.canSetUpGear;
            var formData = new FormData();
            for (var key in this.equipmentItem) {
                //this doesn't send the adress as an object
                if(this.equipmentItem[key] === this.equipmentItem.pickUpLocation) {
                    for (let key in this.equipmentItem.pickUpLocation) {
                        formData.append(key, this.equipmentItem.pickUpLocation[key]);
                    } 
                } else {
                    formData.append(key, this.equipmentItem[key]);
                }
            }
            var fileInputElement = document.getElementById('newEquipmentImage');
            formData.append("gearImage", fileInputElement.files[0]);
            $.ajax({
                url: '/api/equipments',
                method: 'POST', 
                contentType: false,
                processData: false,
                data: formData, 
                success: function(res) {
                    if(res.success) {
                        thatVm.getOwnedItems();
                        thatVm.clearForm(event);
                        thatVm.addGearClicked = false;
                        thatVm.home = true;
                        return;
                    }
                },
            });
        },

        //runs when submit selected
        submitSearch: function() {
            thatVm = this;
            //for no inputing search string
            if (!this.searchCity) {
                $.get('/api/equipments/all', function(allArray) {
                    thatVm.equipmentArray = allArray;
                    thatVm.searchMade = true;
                    thatVm.home = false;
                });
            } else {
                //for searching anything else typed in input
                $.get('/api/equipments/' + this.searchCity, function(searchArray) {
                    thatVm.equipmentArray = searchArray;
                    thatVm.searchMade = true;
                    thatVm.home = false;
                });
            }
        },

        //method for reset buttons
        clearForm: function(event) {
            event.preventDefault();
            //clears the signUpForm
            for (let key in this.signUpForm) {
                if(this.signUpForm[key] === this.signUpForm.canSetUpGear) {
                    this.signUpForm.canSetUpGear = false;
                } else {
                    this.signUpForm[key] = '';
                    this.passwordChecker = '';
                }
            }
            //clears the equipment form
            for (let key in this.equipmentItem) {
                var g;
                if (this.equipmentItem[key] === this.equipmentItem.canSetUpGear) {
                    g = 'this is the easter egg!, Congrats on finding it!';
                } else if (this.equipmentItem[key] === this.equipmentItem.pickUpLocation) {
                    for (let key in this.equipmentItem.pickUpLocation) {
                        this.equipmentItem.pickUpLocation[key] = '';
                    }
                } else {
                    this.equipmentItem[key] = '';
                }
            }
        },
    }
}); 



Vue.component('search-item', {
    template: `
        <div class="well mySearchedItem">
            <h3 class="center">{{item.name}} {{item.brand}} {{item.model}}</h3>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p>Condition: {{item.condition}}</p>
            <p>Size: {{item.size}}</p>
            <p>Category: {{item.category}}</p>
            <p>Description from the Sharer: {{item.description}}</p>
            <p v-if="item.canSetUpGear === 'true'">This user would be happy to set up your gear, Contact them to set up details</p>
            <p> Location of Item: </p>
            <ul class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <input v-model="selectedDate" type="date" min="2017-06-17" max="2018-10-01">
            <button class="btn btn-info" v-on:click="checkavailibility(item._id)">Check Availibility</button>
            <button class="btn btn-warning" v-on:click="checkout(item._id)">Check out Item</button>
            <p v-if="availible">Item availible</p>
            <p v-if="notAvailible">Item not Availible</p>
            <p v-if="rented">Success! Item was checked out for {{selectedDate}}</p>
            <input v-if="item.canSetUpGear === 'true' && rented" v-model="setupmessage" type='text' placeholder="setup message">
            <button v-if="rented && item.canSetUpGear === 'true'" class="btn btn-success" v-on:click="sendmessage">Send messages</button>
            <p v-if="empty">Nothing Selected! Enter Date</p>
        </div>
    `,
    props : ['item'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
            selectedDate: '',
            availible: false,
            notAvailible: false,
            rented: false,
            //to do find way to not show rented when date has changed
            empty: false,
            setupmessage: '',
        };
    },
    computed:{

    },
    methods:{
        //loops the date array to find availiblity.
        checkavailibility: function(itemId) {
            thatVm = this;
            if(this.selectedDate) {
                $.get('/api/equipments/dates/' + itemId, function(item) {
                    for (var rental in item.usersRenting) {
                        if (thatVm.selectedDate === item.usersRenting[rental].date) {
                            thatVm.notAvailible = true;
                            thatVm.availible = false;
                            thatVm.empty = false;
                            thatVm.rented = false;
                            return;
                        }
                    }
                    thatVm.notAvailible = false;
                    thatVm.availible = true;
                    thatVm.rented = false;
                    thatVm.empty = false;
                });
            } else {
                thatVm.empty = true;
                thatVm.availible = false;
                thatVm.notAvailible = false;
                thatVm.rented = false;
            }
        },

        //adds the date to the date array of item
        checkout: function(itemId) {
            thatVm = this;
            $.post('/api/equipments/dates', {date: this.selectedDate, objectId: itemId}, function(confirmation) {
                //add style to handle not being logged in.
                if(confirmation.duplicated) {
                    thatVm.notAvailible = true;
                    thatVm.availible = false;
                    thatVm.empty = false;
                    thatVm.rented = false;
                    return;
                }
                if(confirmation.success) {
                    thatVm.rented = true;
                    thatVm.notAvailible = false;
                    thatVm.empty = false;
                    return;
                }
                thatVm.empty = true;
                thatVm.rented = false;
                thatVm.notAvailible = false;
                thatVm.availible = false;
            });
        },

        sendmessage: function() {
            thatVm = this;
            $.post('/api/users/message', {message: this.setupmessage, owner: this.item.ownerId}, function(confirmation) {
                alert('message sent!');
            });
        }
    },
});

Vue.component('owned-item', {
    template: `
        <div class="well myOwnedItem">
            <h3 class="center">Sharing: {{item.name}} {{item.brand}} {{item.model}}</h3>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p v-if="item.canSetUpGear"> Your are willing to set up this item for the explorer!</p>
            <p v-if="editClicked">Condition: {{item.condition}}</p>
            <p v-if="editClicked">Size: {{item.size}}</p>
            <p v-if="editClicked">Category: {{item.category}}</p>
            <p v-if="editClicked">What you had to say: {{item.description}}</p>
            <p v-if="editClicked"> Location of Item for explorers to pick up at:</p> 
            <ul class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <button class="btn btn-info" v-if="!checkoutClicked" v-on:click="clickEdit">Edit Item</button>
            <button class="btn btn-success" v-on:click="clickCheckout" v-if="!editClicked">Go exploring, Checkout your item</button>
            <button class="btn btn-danger" v-if="!checkoutClicked && !editClicked">Delete Item</button>
            <input v-if="checkoutClicked" v-model="selectedDate" type="date" min="2017-06-17" max="2018-10-01">
            <button v-if="checkoutClicked" class="btn btn-info" v-on:click="checkavailibility(item._id)">Check Availibility</button>
            <button v-if="checkoutClicked" class="btn btn-warning" v-on:click="checkout(item._id)">Check out Item</button>
            <p v-if="availible && checkoutClicked">Item availible</p>
            <p v-if="notAvailible && checkoutClicked">Item not Availible</p>
            <p v-if="rented && checkoutClicked">Success! Item was checked out for {{selectedDate}}</p>
            <p v-if="empty && checkoutClicked">Nothing Selected! Enter Date</p>
        </div>
    `,
    props : ['item'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
            equipmentArray: [],
            selectedDate: '',
            availible: false,
            notAvailible: false,
            rented: false,
            empty: false,
            editClicked: false,
            checkoutClicked: false,
        };
    },
    computed:{

    },
    methods:{
        //loops the date array to find availiblity.
        checkavailibility: function(itemId) {
            thatVm = this;
            if(this.selectedDate) {
                $.get('/api/equipments/dates/' + itemId, function(item) {
                    for (var rental in item.usersRenting) {
                        if (thatVm.selectedDate === item.usersRenting[rental].date) {
                            thatVm.notAvailible = true;
                            thatVm.availible = false;
                            thatVm.empty = false;
                            thatVm.rented = false;
                            return;
                        }
                    }
                    thatVm.notAvailible = false;
                    thatVm.availible = true;
                    thatVm.rented = false;
                    thatVm.empty = false;
                });
            } else {
                thatVm.empty = true;
                thatVm.availible = false;
                thatVm.notAvailible = false;
                thatVm.rented = false;
            }
        },

        //adds the date to the date array of item
        checkout: function(itemId) {
            thatVm = this;
            $.post('/api/equipments/dates', {date: this.selectedDate, objectId: itemId}, function(confirmation) {
                //add style to handle not being logged in.
                if(confirmation.duplicated) {
                    thatVm.notAvailible = true;
                    thatVm.availible = false;
                    thatVm.empty = false;
                    thatVm.rented = false;
                    return;
                }
                //item was checked out
                if(confirmation.success) {
                    thatVm.rented = true;
                    thatVm.notAvailible = false;
                    thatVm.empty = false;
                    return;
                }
                //date input was empty
                thatVm.empty = true;
                thatVm.rented = false;
                thatVm.notAvailible = false;
                thatVm.availible = false;
            });
        },

        //feature for 2.0
        clickEdit: function() {
            if(this.editClicked) {
                this.editClicked = false;
                return;
            }
            this.editClicked = true;
        },

        //this button is for the sharer to beable to checkout their own items
        clickCheckout: function() {
            if(this.checkoutClicked) {
                this.checkoutClicked = false;
                this.availible = false;
                this.notAvailible = false;
                this.rented = false;
                this.empty = false;
                return;
            }
            this.checkoutClicked = true;
        }
    },
});

Vue.component('rented-item', {
    template: `
        <div class="well myRentalItem">
            <h3 class="center">I am renting this {{item.name}} {{item.brand}} {{item.model}}</h3>
            <p>I will be using this {{item.name}} on {{dates}}</p>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p>Condition: {{item.condition}}</p>
            <p>Size: {{item.size}}</p>
            <p>Category: {{item.category}}</p>
            <p>Description from the Sharer: {{item.description}}</p>
            <p> Location of Item where I will pick it up: </p>
            <ul class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <p v-if="item.canSetUpGear">You can contact the Sharer to get this item set up!</p>
        </div>
    `,
    props : ['item', 'userid'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
             userId: this.userid,
            //  dates: this.findTheCheckoutDates 
        };
    },
    computed:{
        dates: function() {
            var dates = '';
            for (var checkout in this.item.usersRenting) {
                if(this.userId === this.item.usersRenting[checkout].userId) {
                    dates += new Date(this.item.usersRenting[checkout].date ).toLocaleDateString() + " ";
                }
            }
            return dates;
        }
    },
    methods:{
       
    },
});