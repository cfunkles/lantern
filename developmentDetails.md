Lantern's Development details

What gets created in the sign up process?
    -username and password name.
    -profile pic 
    -located region
    -agree to terms of share and explorer
    -age
    -e-mail, phone

How do sharers post equiment?
    -Take pictures with these guidlines
        -one with equipment packed, one set up, if wear photo of ware.
        -provide example photos, user manual
    -users select pre-defined category or create new one
    -users give availbility dates
    -name of item
    -item model numbers
    -item product link
    -item value
    -item details
    -item history
    -item cost to rent
    -option to buy
    -item condition
    -how to pick up equipment

How do explorers search and rent gear?
    -enter location address?
    -search range
    -equiment category
    -gear item
    -by condition
    -when eqipment needed
    -agree to sharers terms
    -provide payment details
    -provide information about use of equipment
    -gear checkout out during time period is shown as unavalible

How do explorers return gear?
    -they return it to aggreed upon location.
    -take photos to prove condition of equipment
    -the sharer is responsible for cleaning and maintenence of equipment
    -any gear disputes can only be handeled in a 24hr period after gear return

What will the database look like?
    -users collection
    -items collection
    users Collection
        -Username: string
        -hashed password: hashed string
        -name: string
        -profile pic: src
        -address: string
        -e-mail: string
        -phone: string
        -age: number
        -links to items: string
        -user quality rating: number
        -fines: boolean
    Items collection
        -name
        -model
        -size
        -kind
        -condition
        -gear quality rating
        -category: 
        -picture: src
        -user it belongs to: src
        -number of times it is checked out: number
        -dates availible: iso string
        -dates unavailible: iso string

How will the the user talk to the backend? API's!
    When signing up
        -POST /api/user
    When adding item
        -POST /api/item
    When loging in
        -GET /api/user
    When editing user info
        -PUT /api/user
    When editing item info
        -PUT /api/item
    When checking item out
        -PUT /api/item/availible
        -PUT /api/item/checkout
    When 

What needs to be included on each page?
    -Nav bar
        -About, home, profile, messages, terms 
    Logo on top of a moutain pic
    About section
    Search section
    Login section

Color Sceme
    Snow, midnight blue, and gold
Fonts Arial
