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

    function lastBird(obj) {
        let obsDate = formatDate(obj[0].obsDt)
        return `A ${obj[0].comName} bird was spotted near ${obj[0].locName} on ${obsDate}!`
    }

    function getAddressName(obj) {

        let addressName = obj.results[0].address_components[0].long_name;
        return addressName
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

        //let sunset = 'Nov 22/2021 9:39:38 PM';

        //Eastern Standard Time must subtract 5 hours from UTC
        const utc_sunset = new Date(sunset) // create a date object from api feed based on utc time

        // create a date of Jun 15/2011, 8:32:00am
        // Nov 22/2021 9:39:38 PM
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

    function getDescription(obj) {

        let description = obj.weather[0].description;
        //console.log(description)
        return description
    }

    function getTemp(obj) {

        let temp = obj.main.temp;
        //console.log(temp)
        return temp
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
           // let string = '- <abbr class="timeago" title="2021-12-15 13:15">2021-12-15 13:15</abbr>' 
           // birdItem.appendChild(document.createTextNode(string))    
            //birdItem.appendChild(document.createTextNode(` - ${obj[i].locName} - ${obj[i].obsDt}`))
            //birdItem.appendChild(document.createTextNode(` - <abbr class="timeago" title="${obj[i].obsDt}">'+rows[i].obsDt+'</abbr>`))   
              console.log(birdItem)    
           
            birdList.appendChild(birdItem)
      	
         }  
         
         function birdClick() {
             //alert(this.dataset.name)
            // get name of bird when li element is clicked
             let name = this.dataset.name
             console.log(name)
             getWiki(name)
         }

         birdListDiv.appendChild(birdList);

         // assign event listern to li
         let birds = document.getElementsByClassName("bird");
         for (let i = 0; i < birds.length; i++) {
            birds[i].addEventListener("click", birdClick);
          }
         //console.log(birds)

        return       
    }

    // ********** APIs ********** //

    //Cornell's eBird api
    const getPosts = async function(lat,lng,d) {
        const post = await axios.get("https://api.ebird.org/v2/data/obs/geo/recent?lat="+lat+"&lng="+lng+"&dist="+d+"", {
           headers: {
            'X-eBirdApiToken': 'hqp2uto046pe'
            } 
        })
 
        let dataObj

        try {
            dataObj = await Promise.resolve(post.data);
        } catch (err) {
            console.log(err);
        }

        makeList(dataObj)
        //update time ago
        $("abbr.timeago").timeago();
        return dataObj;
    } 

    //getPosts(lat,lng,5)

    // Google Maps api
    const getAddress = async function() {
        const address = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAS_3eMwLhspYaHZvOOqB9fbCjw4pvTgTY")
        //console.log(address.data)

        let addressObj

        try {
            addressObj = await Promise.resolve(address.data);
        } catch (err) {
            console.log(err);
        }    
        //return address.data;
    }    

    //getAddress()  

    // Sunset api
    const getSunset = async function() {
        const sunset = await axios.get("https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lng+"")
         
        //console.log(sunset.data.results.sunset)

        let sunsetObj        
        
        try {
            sunsetObj = await Promise.resolve(sunset.data);
        } catch (err) {
            console.log(err);
        }  

        //console.log(getSunsetTime(sunsetObj))
        let sunSetDiv = document.querySelector('#sunset')
        sunSetDiv.innerHTML = getSunsetTime(sunset.data);          

        return sunset.data;
    }   
    
   //getSunset()

    // Weather api    
    const getWeather = async function() {
        const weather = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=imperial&appid=ef7613414ba41e2e421d36c8ad9646e2")
        console.log(weather.data.weather[0].description)
        
        let weatherObj

        try {
            weatherObj = await Promise.resolve(weather.data);
        } catch (err) {
            console.log(err);
        }  
        
        let weatherDiv = document.querySelector('#weather')
        weatherDiv.innerHTML = weatherObj.weather[0].description      
        
        let tempDiv = document.querySelector('#temp')
        tempDiv.innerHTML = ` and ${weatherObj.main.temp}&#176;F`         
        
        return weatherObj;
    }    

    //getWeather();

     // Get Wiki article and Photo api    
     const getWiki = async function(name) {
        const wiki = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/"+name)
       //console.log(wiki.data.extract)
       //console.log(wiki.data.thumbnail.source)
        
       let wikiObj 

       try {
            wikiObj = await Promise.resolve(wiki.data);
        } catch (err) {
            console.log(err);
        }         

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
        
        return wikiObj;
    }    

