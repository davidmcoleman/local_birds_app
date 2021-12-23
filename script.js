    //Default location: Waterman Hiking Trails
    let lat = 42.081483; 
    let lng = -76.168993;
    let d = 5; 

    // ********* Helper functions ******* // 
    
    function objectLength(obj) {
        var count = 0;
    
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                ++count;
        }

        return count;
    }

    function formatDate (timestamp) {

        let date = new Date(timestamp)
        let day = date.getDate(timestamp);
        let month = date.getMonth(timestamp); 
        let year = date.getFullYear(timestamp);    

        // Create a list of names of the week
        let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']	

        // Create a list of names for the months
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',	'November', 'December'];

        // return a formatted date
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }
    
    function getSunsetTime(obj) {

        let today = formatDate(new Date()) //i.e. 'Nov 22/2011'

        let sunset = obj.results.sunset; //i.e. 9:39:38 PM

        sunset = today + ' ' + sunset

        //Eastern Standard Time must subtract 5 hours from UTC
        const utc_sunset = new Date(sunset) // create a date object from api feed based on utc time
    
        utc_sunset.setHours( utc_sunset.getHours() - 5 );

        //start help: https://stackoverflow.com/questions/14638018/current-time-formatting-with-javascript
        var hr = utc_sunset.getHours();
        var min = utc_sunset.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        var ampm = "AM";
        if( hr > 12 ) {
            hr -= 12;
            ampm = "PM";
        }
        //end help
        
        //format the time to look like this 8:32:00 AM
        const newsunset = `${hr}:${min} ${ampm}`
        return newsunset
    } 

    function makeList(obj) {

        let length = objectLength(obj)

        let birdList = document.createElement("ul")

        let birdListDiv = document.querySelector('#birdList')

        birdListDiv.innerHTML = ""

        for (let i = 0; i < length; i++) {
            
            let birdItem = document.createElement("li")   
            birdItem.id = obj[i].speciesCode 
            birdItem.className = 'bird'
            birdItem.dataset.name = obj[i].comName ;                
            let anchor = document.createElement("a")
            anchor.href = "#";
            anchor.innerText = `${obj[i].comName}`
            birdItem.appendChild(anchor)
            birdItem.appendChild(document.createTextNode(` - ${obj[i].locName} - `))      
            let abbr = document.createElement("abbr")
            abbr.className = 'timeago'
            abbr.title = ` ${obj[i].obsDt}`
            abbr.innerText = ` ${obj[i].obsDt}`
            birdItem.appendChild(abbr)
         
            birdList.appendChild(birdItem)

            //show location box
            let location_box = document.querySelector('#location_box')
            location_box.style.display = "block"
      	
         }  
         
         birdListDiv.appendChild(birdList);
         
         function birdClick() {
            // get name of bird when li element is clicked
             let name = this.dataset.name
             console.log(name)
             getWiki(name)
         }

         // assign event listern to li
         let birds = document.getElementsByClassName("bird");
         for (let i = 0; i < birds.length; i++) {
            birds[i].addEventListener("click", birdClick);
          }

        return       
    }

    //Birds from around the world buttons
    let birdLocations = [
            {"location": "Kenya", "lat": -0.48321199478224, "lng": 36.65453013882261,"d": 50},
            {"location": "Brazil", "lat": -3.058715405057551, "lng": -59.99216767752357,"d": 5}, 
            {"location": "New Zeland", "lat": -43.404119473580785, "lng": 172.42776823731404,"d": 5}, 
            {"location": "Australia", "lat": -16.52508140688017, "lng": 145.37732955152077,"d": 5},
            {"location": "Puerto Rico", "lat": 18.223640032508303, "lng": -66.51010737210515,"d": 5} 
    ]

    let aroundTheWorldDiv = document.querySelector('#aroundTheWorldDiv')
    aroundTheWorldDiv.innerText = ""

    for (let i = 0; i < birdLocations.length; i++) {
        //dynamically build buttons
        let locationBtn = document.createElement("button")   
        locationBtn.id = i 
        locationBtn.innerHTML = birdLocations[i].location
        locationBtn.dataset.lat = birdLocations[i].lat
        locationBtn.dataset.lng = birdLocations[i].lng
        locationBtn.className = 'buttons'

        aroundTheWorldDiv.appendChild(locationBtn)
    }

    function locationClick(){
            // show list of birds at specific location
            lat = this.dataset.lat
            lng = this.dataset.lng
            getBirdList(lat,lng,5)
            //get address.NOTE: api will not work for lat,lng outside US and CA
            reverseGeocoding(lat,lng)
            //update geo link
            let mapLink = document.querySelector('#map-link');
            mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lng}`;
            mapLink.textContent = `${lat} °, ${lng} °`;
    }
    //assign event listern to location buttons
    let locationBtnArr = document.getElementsByClassName("buttons");
    
    for (let i = 0; i < locationBtnArr.length; i++) {
        
        locationBtnArr[i].addEventListener("click", locationClick);
    }

    //Distance preference
    let distancePref = [
            {"distance": 5, "label": "5 km"},
            {"distance": 10, "label": "10 km"},
            {"distance": 25, "label": "25 km"},
            {"distance": 50, "label": "50 km"}
    ]

    let distanceDiv = document.querySelector('#distanceDiv')
    distanceDiv.innerText = ""   

    for (let i = 0; i < distancePref.length; i++) {
        //dynamically build buttons
        let distanceBtn = document.createElement("button")  
        distanceBtn.dataset.distance = distancePref[i].distance 
        distanceBtn.innerHTML = distancePref[i].label
        distanceBtn.className = 'distance_buttons'

        distanceDiv.appendChild(distanceBtn)
    }

    function distanceClick(){
        // distance pref
        let d = this.dataset.distance
        getBirdList(lat, lng, d)
        console.log(`${lat}, ${lng}, ${d}`)
    } 

    //assign event listern to distance buttons
    let distanceBtnArr = document.getElementsByClassName("distance_buttons");
    for (let i = 0; i < distanceBtnArr.length; i++) {
        distanceBtnArr[i].addEventListener("click", distanceClick);
    }

    //button to find users location
    let geoFindMeBtn = document.querySelector('#geoFindMeBtn')
    geoFindMeBtn.addEventListener('click', () => {
        geoFindMe()
    })

    //button to submit user's address
    let getLocationFromAddressBtn = document.querySelector('#getLocationFromAddressBtn')
    let street = document.querySelector('#street').value
    getLocationFromAddressBtn.addEventListener('click', () => {
        getLocationFromAddress(this.street.value)
    })  
    
    //geolocaton api source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

    function geoFindMe() {

        const status = document.querySelector('#status');
        const mapLink = document.querySelector('#map-link');
    
        function success(position) {
        lat  = position.coords.latitude;
        lng = position.coords.longitude;

        getBirdList(lat,lng,5)

        //get address
        reverseGeocoding(lat,lng)
    
        status.textContent = '';
        mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lng}`;
        mapLink.textContent = `${lat} °, ${lng} °`;
        }
    
        function error() {
        status.textContent = 'Unable to retrieve your location';
        }
    
        if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
        } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
        }
    
    }

    // ********** APIs ********** //

    //Cornell's eBird api
    const getBirdList = async function(lat,lng,d) {
        const post = await axios.get("https://api.ebird.org/v2/data/obs/geo/recent?lat="+lat+"&lng="+lng+"&dist="+d+"", {
           headers: {
            'X-eBirdApiToken': 'hqp2uto046pe'
            } 
        })

        makeList(post.data)
        getWeather()
        // getSunset() // this api does not correct utm time, used getGmtOffset instead
        getGmtOffset(lat, lng)        
        //update time ago: jquery plugin
        $("abbr.timeago").timeago();
        return post.data;
    } 

    // Sunset api
    const getSunset = async function() {
        const sunset = await axios.get("https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lng+"")

        let sunSetDiv = document.querySelector('#sunset')
        sunSetDiv.innerHTML = getSunsetTime(sunset.data);          

        return sunset.data;
    }   

     // Get Greenwich Mean Time offset
     const getGmtOffset = async function(lat, lng) {
        const gmt_offset = await axios.get("http://api.geonames.org/timezoneJSON?lat="+lat+"&lng="+lng+"&username=davidmcoleman")

        const utc_sunset = new Date(gmt_offset.data.sunset) 

        var hr = utc_sunset.getHours();
        var min = utc_sunset.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        var ampm = "AM";
        if( hr > 12 ) {
            hr -= 12;
            ampm = "PM";
        }

        //format the time to look like this 8:32:00 AM
        const newsunset = `${hr}:${min} ${ampm}`

         let sunSetDiv = document.querySelector('#sunset')
         sunSetDiv.innerHTML = newsunset;             

        return gmt_offset.data.gmtOffset;
    }   

    // Weather api    
    const getWeather = async function() {
        const weather = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=imperial&appid=ef7613414ba41e2e421d36c8ad9646e2")
        console.log(weather.data.weather[0].description) 
        
        let weatherDiv = document.querySelector('#weather')
        weatherDiv.innerHTML = weather.data.weather[0].description      
        
        let tempDiv = document.querySelector('#temp')
        tempDiv.innerHTML = ` ${weather.data.main.temp}&#176;F`         
        
        return weather.data.weather[0].description;
    }    

     // Get Wiki article and Photo api    
     const getWiki = async function(name) {
        const wiki = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/"+name)       

        let rightDiv = document.querySelector("#right")
        //empty div
        rightDiv.innerHTML = ""
        //build img src
        let photoDiv = document.createElement('div')
        let photo = document.createElement('img')
        let title = document.createElement('h4')
        title.innerText = wiki.data.title
        let caption = document.createElement('p')
        caption.innerText = wiki.data.extract
        
        photo.src = wiki.data.thumbnail.source
        photoDiv.appendChild(photo);
        rightDiv.appendChild(photoDiv); 
        rightDiv.appendChild(title);  
        rightDiv.appendChild(caption);        
        
        return wiki;
    }   
    
    // Geocode address to x,y
    const getLocationFromAddress = async function(addressInput) {
  
        let addressInput2 = addressInput.split(' ').join('+');
        const geocoded = await axios.get("https://api.geocod.io/v1.7/geocode?q="+addressInput2+"&api_key=a4e16b6dc414ccbae4691e46bc611b1b6949bab")
        let address = geocoded.data.results[0].formatted_address
        lat = geocoded.data.results[0].location.lat
        lng = geocoded.data.results[0].location.lng

        let addressDiv = document.querySelector('#address')
        addressDiv.innerHTML = address   

        let mapLink = document.querySelector('#map-link');

        mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lng}`;
        mapLink.textContent = `${lat} °, ${lng} °`;             
        
        getBirdList(lat,lng,5)

        return geocoded;
    }     

     // Reverse Geocode x,y to address
     const reverseGeocoding = async function(lat, lng) {

        const geocoded = await axios.get("https://api.geocod.io/v1.7/reverse?q="+lat+","+lng+"&api_key=a4e16b6dc414ccbae4691e46bc611b1b6949bab")
        let address = geocoded.data.results[0].formatted_address

        //update address div
        let addressDiv = document.querySelector('#address')
        addressDiv.innerHTML = address   
           
        return geocoded;
    }       
