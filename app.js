require('dotenv').config();
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
let ejs = require('ejs');


const app = express();


app.use('/',router);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded())



 mongoose.connect(process.env.DB_URL, {useNewUrlParser: true,  useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log( 'we are connected')
});



const HotelSchema =  new mongoose.Schema({
    name: String,
    stars: String,
    images: [String],
    price: String

  });

  const Hotel = mongoose.model('hotel', HotelSchema);
  

  /*
    Hotel.create([{
    "name" : "Hotel Emperador",
    "stars" : "5",
    "images" :['https://media-cdn.tripadvisor.com/media/photo-s/03/01/e7/a1/hotel-bolivar.jpg'],
    "price" : "1596"
    },{
    "name" : "Hotel Ambasador",
    "stars" : "5",
    "images" :['https://serviciodeviajes.com/wp-content/uploads/2019/12/hoteles.jpg'],
    "price" : "1533"
    },{
    "name" : "Hotel Notorius",
    "stars" : "3",
    "images" :['https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg'],
    "price" : "1300"
    },{
    "name" : "Hotel Melia",
    "stars" : "2",
    "images" :['https://www.portafolio.co/files/article_main/files/crop/uploads/2016/02/10/56bb7c37ec2b3.r_1479870205532.0-195-1056-723.jpeg'],
    "price" : "800"
    },{    
    "name" : "Hotel Rivera",
    "stars" : "4",
    "images" :['https://content.r9cdn.net/rimg/kimg/b3/6e/216dcdaf-5ad8ac65-6.jpg?crop=true&width=500&height=350'],
    "price" : "900"
    },{
    "name" : "Hotel Tenorium",
    "stars" : "3",
    "images" :['https://media-cdn.tripadvisor.com/media/photo-s/10/00/09/a8/swimming-pool.jpg'],
    "price" : "1596"
    },{
    "name" : "Hotel chik",
    "stars" : "2",
    "images" :['https://www.goatrip.co.in/pictures/hotels/hotel_list/hotel_25_a.jpeg'],
    "price" : "1533"
    },{
    "name" : "Hotel Sonesta",
    "stars" : "5",
    "images" :['https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSXBr92v47w9GhU9E30NHGOEJg9v8cbj59djjBacPw1_hSyZBCd&usqp=CAU'],
    "price" : "1300"
    },{
    "name" : "Hotel Pereira",
    "stars" : "1",
    "images" :['https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,h_1300,q_auto,w_2000/itemimages/12/62/1262464_v4.jpeg'],
    "price" : "800"
    },{    
    "name" : "Hotel Hilton",
    "stars" : "3",
    "images" :['https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,h_1300,q_auto,w_2000/itemimages/42/82/42822_v9.jpeg'],
    "price" : "900"
    }])
    */

//to uppercase function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}    

app.get('/',(req,res)=>{
    res.redirect('/hotels')
})

app.get('/hotels',(req,res)=>{
    
    Hotel.find({ },function(err,result){
        if(err){
            console.log(err)
        } else {
            console.log(result)
            res.render('index', {RAIZ : result});
               }
    })
})



app.get('/hotels/add',(req,res)=>{
    
    Hotel.find({ stars : req.params.id   },function(err,result){
        if(err){
            console.log(err)
        } else {

            res.render('add');
               }
    })
})

app.post('/hotels/name/',(req,res)=>{
   // cost check box
    range = req.body.range;
    const stars = req.body.stars;
    // search with range
 /*
    if(range==1596){
            Hotel.find( {price : {$lte:range}},function(err,result){
                if(err){
                    console.log(err)
                }else{
                    res.render('index', {RAIZ : result, RANGE: range });   
                }
            } )
    }else{
        if will include this funcionality need agreggate } after the ) final
*/
    // selector for search with stars
    if(!req.body.searchHotel){ 
       
     if(stars){    
        Hotel.find(
            { stars: stars },function(err,result){
                if(err){
                    console.log(err)
                }else{
                 res.render('index', {RAIZ : result});
                }
            }
            )
        }else{

        Hotel.find({ },function(err,result){
            if(err){
                console.log(err)
            } else {
                
                res.render('index', {RAIZ : result});
                   }
        })
        }
    }else{ 
    
    //funcition serch name    

    const searchHotel = "Hotel " + req.body.searchHotel.capitalize();
    
    Hotel.find({ name : searchHotel},function(err,result){
        if(err){
            console.log(err)
        } else {
            res.render('index', {RAIZ : result});
               }
    } )
}  
}
//}
)


///adding hotel
app.get('/add',(req,res)=>{
 
 
    res.render("add")
    /**
    Hotel.save({ 
        "name" : req.body.nameHotel,
        "stars" : req.body.stars,
        "images" :[req.body.imageHotel],
        "price" : req.body.priceHotel
    })
 */
})

app.post('/hotels/add',(req,res)=>{

    //adding Hotel keyword Hotel
    const addKeywordHotel = "Hotel "+ req.body.nameHotel;

    Hotel.create({
         /*
        console.log(req.body.nameHotel)
        console.log(req.body.stars)
        console.log(req.body.imageHotel)
        console.log(req.body.priceHotel.toString())
        */
        

       "name" : addKeywordHotel,
       "stars" : req.body.stars,
       "images" :[req.body.imageHotel],
       "price" : req.body.priceHotel.toString()
     
        
    },function(err,result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.redirect("/hotels")
            }
    })
})


///deleting hotel

app.get('/delete',(req,res)=>{
 
 
    res.render("delete")
    /**
    Hotel.save({ 
        "name" : req.body.nameHotel,
        "stars" : req.body.stars,
        "images" :[req.body.imageHotel],
        "price" : req.body.priceHotel
    })
 */
})

app.post('/hotels/delete',(req,res)=>{

    const namedelete = "Hotel "+req.body.nameHotel;
    Hotel.deleteOne({name : namedelete}, function(err,result){
        if(err){
            console.log(err)
        }else{
            res.redirect("/hotels")
        }
    })
})




app.listen( process.env.PORT || 3000,()=>{
    console.log('I got it on 3000')
})
