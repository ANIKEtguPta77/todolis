exports.getdate=function(){
    let today=new Date();
    let current_day=today.getDay()
        
        let options={
            weekday:"long",
            day:"numeric",
            month:"long"
        }
    return today.toLocaleDateString("en-US",options);
   
}

exports.getday=function(){
    let today=new Date();
    let current_day=today.getDay()
        
        let options={
            weekday:"long",
           
        }
    return today.toLocaleDateString("en-US",options);
    
}