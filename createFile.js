let fs = require('fs')


// var data = fs.readFileSync('input.txt'); //=> synchronous

// console.log(data.toString());
// console.log("Program Ended");

//asynchronous
fs.readFile('input.txt', function (err, data) {
    //this is the callBack function
       if (err) return console.error(err);
       console.log(data.toString());
    });
    
    console.log("Program Ended");