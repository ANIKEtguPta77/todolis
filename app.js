const express=require("express")
const https=require("https")
const body=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.use(body.urlencoded({extended:true}));
app.use(express.static("public"));
const date=require(__dirname+"/date.js");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://aniket:Aniketrock%407@cluster0.vs5pg1e.mongodb.net/todolistDB", {useNewUrlParser: true});


const itemschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});

const Item=mongoose.model("item",itemschema);

const item=new Item(
    {
        name:"Welcome to dolist"
    }
);
const item1=new Item(
    {
        name:"Hit the + button to add new item"
    }
);

const item2=new Item(
    {
        name:"<--HIt this button to delete an item"
    }
);

const defaultitems=[item,item1,item2];


// Item.insertMany(defaultitems,function(err){
//     if(err)
//     {
//         console.log(err);
//     }
//     else{
//         console.log("Succesful added");
//     }
// });

const listSchema=new mongoose.Schema(
    {
        name:String,
        items:[itemschema]
    }
)
const List=mongoose.model("List",listSchema)





app.set('view engine','ejs');






app.get("/",function(req,res){

    newitems=[];
    Item.find(function(err,items){
            if(err){
                console.log(err)
            }
            else{
                
                items.forEach(function(item){
                    newitems.push(item)
                    
                })
            }
        
    
    day=date.getdate()
    res.render("list1",{current:day,newitems:newitems,length:newitems.length});
})
    
})




app.get("/:listname",function(req,res){
    let ln=req.params.listname;
    List.findOne({name:ln},function(err,foundlist){
        if(!err){
            if(!foundlist)
            {
                
                const list=new List({
                    name:ln,
                    items:defaultitems
                })
                list.save();
                res.redirect("/"+ln)
            }
            else
            {
                console.log("Existds")
                res.render("list1",{current:ln,newitems:foundlist.items,length:foundlist.items.length})
            }

        }

    })
   
})







app.post("/",function(req,res){
    let item=req.body.Newitem;
    let listname=req.body.list;
    day=date.getdate()
    const newitem=new Item({
        name:item
    })

    if (listname===day)
   {
        newitem.save()
        res.redirect("/");
   }
   else{
    List.findOne({name:listname},function(err,foundlist){
        foundlist.items.push(newitem);
        foundlist.save();
        res.redirect("/"+listname);
    })
   }
   

})




app.post("/delete",function(req,res){
     var id=req.body.checkbox
     var listname=req.body.listname;
     day=date.getdate();
     if(listname===day)
     {
    Item.deleteOne({_id:id},function(err)
    {
    if(err)
    {
        console.log(err)
    }
    else{
        console.log("Successs")
    }
     });
     res.redirect("/")
}
else{
   List.findOneAndUpdate({name:listname},{$pull:{items:{_id:id}}},function(err,foundlist){
    if(!err)
    {
        res.redirect("/"+listname);
    }
   })
}
    
})



app.listen(process.env.PORT||4000,()=>{
    console.log("Sever is running on port 3000");
});