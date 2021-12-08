const PreProcessor = require("./preProcess.js");
const {Scoap, CollapseFaults} = require("./scoap.js");

/*  Input your boolean expression here.
    Only allows 2 input per gate. Go nuts.
*/
 let str = "AB'+A(C'+D')";    // test case. Change this to whatever expression you want to test.



// Processes
let exp = new PreProcessor(str);
console.log(`Your expression has been processed into: ${exp.strProc}`);
console.log(`The postfix form of your expression is: ${exp.expression}\n`);

// Finds the faults 
console.log("Now printing Faults");
let falt = new CollapseFaults(exp.expression);
falt.nodesList.forEach(node => {
    console.log(`Node ID ${node.ID} with signal ${node.expression} has faults ${node.fault}`);
});
console.log(`The collapse ratio is ${falt.ratio}\n\n`);

// Finds the SCOAP
console.log("Now printing SCOAPs");
let scoap = new Scoap(exp.expression);
scoap.nodesList.forEach(node => {
    console.log(`Node ID ${node.ID} with signal ${node.expression} has a CC of ${node.CC} and a CO of ${node.CO}`);
});

