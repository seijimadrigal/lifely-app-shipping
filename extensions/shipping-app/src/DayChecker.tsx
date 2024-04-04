// Gets values from Google Sheets link//
import {sheetObj} from './GoogleSheets';

console.log("Day Checker Initialised")
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const states = ["NSW" , "VIC", "QLD","ACT","SA","NT","WA","TAS"]
const stateFull = ["New South Wales", "Victoria","Queensland", "Other"]
var customerState = '';

export function setCustomerState(cust_state:string){
   console.log("Checkout Addres Customer Delivery State: " , cust_state)
    var match = false;

    states.forEach((element,index) => {

        if(element == cust_state){
          if(index < 3){
            console.log("match  " + element)

            customerState = stateFull[index]
            match = true;
          }else{
            customerState = stateFull[3]
            match = true;
          }
        }
    })

    if(!match){
      customerState == stateFull[3]
    }

    console.log("Full Customer State " + cust_state)


      
}


// Returns datestring of dates removed from calendar

export function getDisabledDays() :Array<string> {
    const deliveryDays:Array<string> =  removeSpace(getDeliveryDays());
    const disabledDates:Array<string> = [];
    // Monday, Friday
    const numDays = deliveryDays.length;

    weekdays.forEach(function (weekday,weekindex){
      var counter = 0;
      for (let i = 0; i < deliveryDays.length;i++){
        if(weekday !=  deliveryDays[i]){
          counter++
        }else{
          break; 
        }
      }
      if(counter == numDays){
        disabledDates.push(weekday)
      }
    })
    console.log("Disabled Dates Array: ", disabledDates)
    return disabledDates
}

// check Google Sheets for delivery days 
// e.g "[Monday, Friday]"

export function getDeliveryDays() : Array<string>{
    let deliverDays: Array<string> = [];
    for (var key in sheetObj) {
       
       var state_data:any =  sheetObj[key];

        if(state_data.State === customerState){
            deliverDays = state_data['Preferred delivery']
        }
    }
    console.log('Delivery Days ', deliverDays)
    return removeSpace(deliverDays);

  }
  
  export function getDeliveryTimes() : Array<string>{
    let deliverTimes:Array<string> = [];   
    let deliverRange:Array<string> = [];   

    for (var key in sheetObj) {
       
       var state_data:any =  sheetObj[key];

        if(state_data.State === customerState ){
            
          deliverTimes = state_data.Times
         
        }
    }
    deliverRange.push(deliverTimes[0]);
    deliverRange.push(deliverTimes[deliverTimes.length-1]);
    console.log('Delivery Range ', deliverRange)

    return deliverRange;

  }

  // finds the nearest available date

  export function forwardtoAvailableDate (datestring:string, forward:number):string{
    console.log('pass date '+ datestring)
    var newDate = new Date(datestring);
    newDate.setDate(newDate.getDate() + forward)
    console.log('forward date '+ convDateString(newDate))

    var deliveryweekdays:Array<string> = getDeliveryDays();

    var loop = 0;
    var match = false;
    while(loop < 7 && !match){
      deliveryweekdays.forEach(element => {
          if(element == weekdays[newDate.getDay()]){
            match = true;
            return convDateString(newDate);
          }
      });
      if(!match){
        newDate.setDate(newDate.getDate() + 1)
        loop++
      }
    }

    return convDateString(newDate);

  }

  export function removeMonthBefore(dateString:string):Array<string>{
    const currDate = new Date(dateString);
    let removedDates:Array<string> = [];   

    var i = 0
    while(i<30){
      currDate.setDate(currDate.getDate() - 1)
      removedDates.push(convDateString(currDate))
      i++
    }
    console.log("Removed Dates+ " ,removedDates)
    return removedDates
  } 

  /// Date format to iso YYYY-MM-DD

  export function convDateString(date:Date):string{
    
    return date.toISOString().split('T')[0]

  }

  export function convertWeekDay(index:number){
    return weekdays[index]
  }
  
  export function convertMonth(index:number){
    return months[index]
  }

  function removeSpace(array:Array<string>) : Array<string>{
    let removedArr:Array<string> = [];   

    array.forEach((item)=>{
      removedArr.push(item.replace(/\s+/g, ' ').trim())

    })

    return removedArr
  }