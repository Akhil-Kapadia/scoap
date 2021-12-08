// Imports 
const {Netlist, Node} = require("./netlist.js");
const PreProcessor = require("./preProcess.js");
const preProcessor = require('./preProcess.js');


/** Class to generate SCOAP testable points on each node. */
class Scoap extends Netlist
{
    /**
     * This class finds the combinational controllability and combinational 
     * observability.
     * @param {String} exp Processed boolean expression in modified postfix.
     */
    constructor(exp)
    {
        super(exp);
        this.combinationalControllability(this.netlist, this.nodesList, this.componentList);
        this.combinationalObservability(this.netlist, this.nodesList, this.componentList);
    }

    /**
     * Finds the combinational Controllability of each node in the circuit. Will
     * add the CC0 and CC1 values to each node as an array CC.
     * @param {Object} netlist Object that contains two arrays of incoming/outgoing netlists.
     * @param {Array} nodes Array of Node objects
     * @param {Array} comps Array of Component objects
     */
    combinationalControllability(netlist, nodes, comps)
    {
        nodes.forEach((element) => {
            if(element.layer == 0)
            {
                element.CC = [1,1]; // Add new property to object.
            } else
            {
                let min;
                switch(comps[element._in].logic) // Finds the logic of gate connected
                {
                    case "AND":
                        element.CC = [1,1];
                        min = 100;
                        // CC1 = CC1(A) + CC1(B) + 1
                        for(let i of netlist.incoming[element._in])
                        {
                            element.CC[1] += nodes[i].CC[1];
                        }
                        // CC0 = min{CC0(A), CC0(B), CC0(n)} + 1
                        for(let i of netlist.incoming[element._in])
                        {
                            if(min > nodes[i].CC[0])
                                min = nodes[i].CC[0];
                        }
                        element.CC[0] = min + 1;
                    break;

                    case "OR":
                        element.CC = [1,1];
                        min = 100;
                        // CC0 = CC0(A) + CC0(B) + 1
                        for(let i of netlist.incoming[element._in])
                        {
                            element.CC[0] += nodes[i].CC[0];
                        }
                        // CC1 = min{CC1(A), CC1(B), CC1(n)} + 1
                        for(let i of netlist.incoming[element._in])
                        {
                            if(min > nodes[i].CC[1])
                                min = nodes[i].CC[1];
                        }
                        element.CC[1] = min + 1;
                    break;

                    case "NOT":
                        element.CC = [1,1];
                        element.CC[1] += nodes[netlist.incoming[element._in]].CC[1];
                        element.CC[0] += nodes[netlist.incoming[element._in]].CC[0];
                    break;

                }
            }
        });
    } // End of combinational Controllability method.

    /**
     * Finds the combinational observability of each node in the circuit. Adds 
     * a new propert "CO" to each node for the corresponding value.
     * @param {Object} netlist Object that contains two arrays of incoming/outgoing netlists.
     * @param {Array} nodes Array of Node objects
     * @param {Array} comps Array of Component objects
     */
    combinationalObservability(netlist, nodes, comps)
    {
        // Set CO of last node and F to 0
        nodes[nodes.length - 1].CO = 0;
        nodes[0].CO = 0;

        // Work from last node to first
        for(let i = nodes.length - 2; i >= 0; i--)
        {
            let sum = 0;
            switch(comps[nodes[i]._out].logic)
            {
                // CO(input) = SUM(CC1(n)) - CC1(input) + 1
                case "AND":
                    sum = 0;
                    for(let j of netlist.incoming[nodes[i]._out])
                    {
                        sum += nodes[j].CC[1];
                    }
                    sum -= nodes[i].CC[1];
                    nodes[i].CO = nodes[netlist.outgoing[nodes[i]._in]].CO + sum + 1;
                break;
                // CO(input) = SUM(CC0(n)) - CC0(input) + 1
                case "OR":
                    sum = 0;
                    for(let j of netlist.incoming[nodes[i]._out])
                    {
                        sum += nodes[j].CC[0];
                    }
                    sum -= nodes[i].CC[0];
                    nodes[i].CO = nodes[netlist.outgoing[nodes[i]._in]].CO + sum + 1;
                break;
                // CO(A) = CO(Z) + 1
                case "NOT":
                    nodes[i].CO = nodes[netlist.outgoing[nodes[i]._in]].CO + 1;
                break;
            }
        }
    } // End of combinationalObservability function.
} // End of scoap Class.

/**Class to calculate the collapse faults of a circuit and give the collapse ratio */
class CollapseFaults extends Netlist
{
    /**
     * Calculates the collapse ratio of the given boolean circuit and finds the
     * equivalent/dominant faults of each node.
     * @param {String} exp Processed boolean expression.
     */
    constructor(exp)
    {
        super(exp); // Call the netlist class to get its stuff
        // Add fault property to nodes. The array [SA0, SA1] -> 0 means fault eliminated.
        this.nodesList.forEach(node => node.fault = [1, 1]);
        this.equivalentFaults(this.nodesList, this.componentList, this.netlist); // Find equivalent faults.
    }

    equivalentFaults(nodes, comps, netlist)
    {
        // Iterate through components and the nodes attached, start from last.
        for(let i = comps.length - 1; i > 0; i--)
        {
            switch(comps[i].logic)
            {
                case "AND":
                    for(let j of netlist.incoming[i])
                    {
                        nodes[j].fault = [1,0];
                    }
                break;

                case "OR":
                    for(let j of netlist.incoming[i])
                    {
                        nodes[j].fault = [0,1];
                    }
                break;

                case "NOT":
                    for(let j of netlist.incoming[i])
                    {
                        nodes[j].fault = [0,0];
                    }
                break;
            }
        }
    } //EOF equivalent faults.
}

let test = new CollapseFaults("AB'*C*AB+'*");
// let str = new PreProcessor("AB'+A(C'+D')");
// console.log(`Orignal Expression ${str.strProc}`);
// console.log(`Postfix expression ${str.expression}`);
// let test = new Scoap(str.expression);
test.componentList.forEach(item => console.log(item));
test.nodesList.forEach(item => console.log(item));
console.log(test.netlist);
console.log();

// export classes
module.exports = {
    Scoap,
    CollapseFaults
};