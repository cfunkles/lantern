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
    props : ['item', 'userid', 'name'],
    data: function(){
        // we use a function for data on components so that each component gets unique data, not references to each other's data
        return {
             userId: this.userid,
             message: '',
             senderName: this.name,
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
            $.post('/api/users/message', {message: this.message, owner: this.item.ownerId, senderName: this.senderName}, function(confirmation) {
                if(confirmation.success) {
                    alert('message sent!');
                }
            });
        }
    },
});

Vue.component('recieved-messages', {
    template: `
        <div class="message">
            <p><strong>Senders Name:</strong> {{message.senderName}}</p>
            <p><strong>Says:</strong> {{message.message}}</p>
        </div>
    `,
    props: ['message'],
});