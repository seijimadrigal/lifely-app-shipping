  // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
  const sheetId = "11zbHnoYegLAkKj11rDhyqp1cblkNfzLXh7Jz_3ryJbU";
  // sheetName is the name of the TAB in your spreadsheet
  const sheetName = encodeURIComponent("Seiji Delivery Datetimes");
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

  export let sheetObj:Array<Object> = [];

 
  console.time('Google Sheet Loading')
  
    fetch(sheetURL,{method:'GET'})
    .then((response) => response.text())
    .then((csvText) => {handleResponse(csvText)  
      console.timeEnd('Google Sheet Loading')})

  
  function handleResponse(csvText:String) {
    let sheetObjects = csvToObjects(csvText)
    sheetObj =  sheetObjects
    console.log(sheetObj);
  }
  
  function csvToObjects(csv:String) {
    const csvRows = csv.split("\n");
    const propertyNames = csvSplit(csvRows[0]);
  
    let objects: Array<Object> = [];

    for (let i = 1, max = csvRows.length; i < max; i++) {
      let thisObject:any = {};
      let row:Array<any> = csvSplit(csvRows[i])
      let days:Array<string> = [];
      let times:Array<string> = [];

      for (let j = 0, max = row.length; j < max; j++) {
        if(j === 0){
          thisObject[propertyNames[j]] = row[j];
        }
        else{    
          if(!hasNumber(row[j])){
            days.push(row[j])
          }else if(hasNumber(row[j])){
            times.push(row[j])
          }
        }
        thisObject[propertyNames[1]] = days;
        thisObject[propertyNames[2]] = times;
      }
      objects.push(thisObject);
    }
    return objects;
  }
  
  //Gets the values of a row and maps each cell
  
  function csvSplit(row:any) : Array<number>{
  
   // console.log("row split " +row);
    
    return row.split(',').map((val:string) => {
      val = sortElements(val);
      return val.substring(1, val.length-1);
    })
  }
  

  function sortElements(val:string){
  // Removes white space of each element first and last

    val.replace(/\s/g, '').trim();

    if(val.charAt(0) != '"' ){
       return '"' + val;
  
    }else if(val.charAt(val.length-1) != '"' ){
       return val + '"';
     
  
    }
    return val;
  }
  
  function hasNumber(str:string) :boolean {
    return /\d/.test(str);
   }


  