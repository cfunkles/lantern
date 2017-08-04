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