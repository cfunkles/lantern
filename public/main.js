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
        userClicked: false,
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
        },
        displayMessages: function() {
            var messages = '';
            for (var message in this.userInfo.messages) {
                messages += this.userInfo.messages[message].message + ', ';
            }
            return messages;
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
        clickUser: function() {
            if (this.userClicked) {
                this.clickHomeLoggedIn();
                return;
            }
            this.getUserInfo();
            this.userClicked = true;
            this.aboutClicked = false;
            this.storyClicked = false;
            this.addGearClicked = false;
            this.ownedClicked = false;
            this.rentedClicked = false;
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
            this.userClicked = false;
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
            this.userClicked = false;
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
            this.userClicked = false;
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
            this.userClicked = false;
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
            this.userClicked = false;
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
            this.userClicked = false;
        },


        //Function for new users who sign up
        submitNewAccount: function(event) {
            event.preventDefault();
            if(this.matchPasswords) {
                console.log('passwords match!');
                var thatVm=this;
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
                        alert("Something went wrong");
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
            <p><strong>Condition:</strong> {{item.condition}}</p>
            <p><strong>Size:</strong> {{item.size}}</p>
            <p><strong>Category:</strong> {{item.category}}</p>
            <p><strong>Description from the Sharer:</strong> {{item.description}}</p>
            <p v-if="item.canSetUpGear === 'true'"><strong>Campsite Builder:</strong> The Sharer of this item can help build your campsite, send message after checkout to give them camping trip details</p>
            <p><strong>Location of Item:</strong></p>
            <ul class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <input v-model="selectedDate" type="date" min="2017-06-17" max="2018-10-01">
            <button class="btn btn-info" v-on:click="checkavailibility(item._id)">Check Availability</button>
            <button class="btn btn-warning" v-on:click="checkout(item._id)">Check out Item</button>
            <p v-if="availible">Item Available</p>
            <p v-if="notAvailible">Item Not Available</p>
            <p v-if="rented">Success! Item was checked out for {{date}}</p>
            <input v-if="item.canSetUpGear === 'true' && rented" v-model="setupmessage" type='text' placeholder="setup message">
            <button v-if="rented && item.canSetUpGear === 'true'" class="btn btn-success" v-on:click="sendmessage">Send Message</button>
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
        date: function() {
            return new Date(this.selectedDate).toLocaleDateString();
        },
    },
    methods:{
        //loops the date array to find availiblity.
        checkavailibility: function(itemId) {
            thatVm = this;
            if(this.selectedDate) {
                $.get('/api/equipments/dates/' + itemId, function(item) {
                    for (var rental in item.usersRenting) {
                        if (thatVm.selectedDate === item.usersRenting[rental].date) {
                            alert('Unavailable');
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
                alert('Enter a date!');
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
                    alert('Unavailable');
                    thatVm.notAvailible = true;
                    thatVm.availible = false;
                    thatVm.empty = false;
                    thatVm.rented = false;
                    return;
                }
                if(confirmation.success) {
                    alert('You checked out the ' + thatVm.item.name + ' on ' + new Date(thatVm.selectedDate).toLocaleDateString());
                    thatVm.rented = true;
                    thatVm.notAvailible = false;
                    thatVm.empty = false;
                    return;
                }
                alert('Enter a date!');
                thatVm.empty = true;
                thatVm.rented = false;
                thatVm.notAvailible = false;
                thatVm.availible = false;
                return;
            });
        },

        sendmessage: function() {
            thatVm = this;
            $.post('/api/users/message', {message: this.setupmessage, owner: this.item.ownerId}, function(confirmation) {
                if(confirmation.success) {
                    alert('message sent!');
                }
            });
        }
    },
});

Vue.component('owned-item', {
    template: `
        <div class="well myOwnedItem">
            <h3 class="center">Sharing: {{item.name}} {{item.brand}} {{item.model}}</h3>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p><strong>Item Checked out for:</strong> {{rentalDates}}</p>
            <p v-if="item.canSetUpGear"><strong>Campsite Builder:</strong> You may be contacted to help build a campsite for this person, check for messages in your user information.</p>
            <p v-if="editClicked"><strong>Condition:</strong> {{item.condition}}</p>
            <p v-if="editClicked"><strong>Size:</strong> {{item.size}}</p>
            <p v-if="editClicked"><strong>Category:</strong> {{item.category}}</p>
            <p v-if="editClicked"><strong>What you had to say:</strong> {{item.description}}</p>
            <p v-if="editClicked"><strong>Address for explorer to pick up item:</strong></p> 
            <ul v-if="editClicked" class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <button class="btn btn-info" v-if="!checkoutClicked" v-on:click="clickEdit">Edit Item</button>
            <button class="btn btn-success" v-on:click="clickCheckout" v-if="!editClicked">Go exploring, Checkout your item</button>
            <button class="btn btn-danger" v-if="!checkoutClicked && !editClicked">Delete Item</button>
            <input v-if="checkoutClicked" v-model="selectedDate" type="date" min="2017-06-17" max="2018-10-01">
            <button v-if="checkoutClicked" class="btn btn-info" v-on:click="checkavailibility(item._id)">Check Availability</button>
            <button v-if="checkoutClicked" class="btn btn-warning" v-on:click="checkout(item._id)">Check out Item</button>
            <p v-if="availible && checkoutClicked">Item Available</p>
            <p v-if="notAvailible && checkoutClicked">Item Not Available</p>
            <p v-if="rented && checkoutClicked">Success! Item was checked out for {{date}}</p>
            <p v-if="empty && checkoutClicked">Nothing Selected. Enter Date</p>
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
        date: function() {
            return new Date(this.selectedDate).toLocaleDateString();
        },
        rentalDates: function() {
            for (var checkouts in this.item.usersRenting) {
                return new Date(this.item.usersRenting[checkouts].date).toLocaleDateString() + ',';
            }
        }

    },
    methods:{
        //loops the date array to find availiblity.
        checkavailibility: function(itemId) {
            thatVm = this;
            if(this.selectedDate) {
                $.get('/api/equipments/dates/' + itemId, function(item) {
                    for (var rental in item.usersRenting) {
                        if (thatVm.selectedDate === item.usersRenting[rental].date) {
                            alert('Unavailable');
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
                alert('Enter a date!');
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
                    alert('Your ' + thatVm.item.name + ' is unavailable for checkout ' + ' on ' + new Date(thatVm.selectedDate).toLocaleDateString());
                    thatVm.rented = true;
                    thatVm.notAvailible = false;
                    thatVm.empty = false;
                    return;
                }
                //date input was empty
                alert('Enter a date!');
                thatVm.empty = true;
                thatVm.rented = false;
                thatVm.notAvailible = false;
                thatVm.availible = false;
                return;
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
            <h3 v-if="!ownedItem" class="center">{{item.name}} {{item.brand}} {{item.model}} Checked out for:</h3>
            <h3 v-if="ownedItem" class="center">Your {{item.name}} will not be shared on:</h3>
            <p>{{dates}}</p>
            <p><img class="equipmentImage" v-bind:src="'./images/' + item.imageFileName" alt="image of equipment"> </p>
            <p><strong>Condition:</strong> {{item.condition}}</p>
            <p><strong>Size:</strong> {{item.size}}</p>
            <p><strong>Category:</strong> {{item.category}}</p>
            <p><strong>Description from the Sharer:</strong> {{item.description}}</p>
            <p><strong>Address for pick up:</strong> </p>
            <ul class="address">
                <li>{{item.address}}</li>
                <li>{{item.city}}</li>
                <li>{{item.state}}</li>
                <li>{{item.zip}}</li>
            </ul>
            <h4 class="center" v-if="item.canSetUpGear && !ownedItem">Start a conversation with the Sharer to discussion campsite set up details!</h4>
            <input v-if="item.canSetUpGear && !ownedItem" v-model="message" type="text" placeholder="Message to Sharer">
            <button v-if="item.canSetUpGear && !ownedItem" class="btn btn-info" v-on:click="sendmessage">Message to Sharer</button>
        </div>
    `,
    props : ['item', 'userid'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
             userId: this.userid,
             message: '',
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
        },
        ownedItem: function() {
            for (var checkout in this.item.usersRenting) {
                if(this.userId === this.item.ownerId) {
                    return true;
                }
            }
        }
    },
    methods:{
       sendmessage: function() {
            thatVm = this;
            $.post('/api/users/message', {message: this.setupmessage, owner: this.item.ownerId}, function(confirmation) {
                if(confirmation.success) {
                    alert('message sent!');
                }
            });
        }
    },
});