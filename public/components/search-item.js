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
    props : ['item', 'name'],
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
            senderName: this.name,
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
            $.post('/api/users/message', {message: this.setupmessage, owner: this.item.ownerId, senderName: this.senderName}, function(confirmation) {
                if(confirmation.success) {
                    alert('message sent!');
                }
            });
        }
    },
});
