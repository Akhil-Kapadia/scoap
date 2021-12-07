// Imports 
const {Netlist, Node} = require("./netlist.js");
const preProcessor = require('./preProcess.js');


/** Class to create */
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
    }

    /**
     * Finds the combinational Controllability of each node in the circuit. Will
     * add the CC0 and CC1 values to each node as an array CC.
     * @param {Array} netlist Array of IDs of nodes per component.
     * @param {Node} nodes List of Node objects for the given expression
     * @param {Component} comps List of Component objects for the given expression
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
                        for(let i of netlist[element._in])
                        {
                            element.CC[1] += nodes[i].CC[1];
                        }
                        // CC0 = min{CC0(A), CC0(B), CC0(n)} + 1
                        for(let i of netlist[element._in])
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
                        for(let i of netlist[element._in])
                        {
                            element.CC[0] += nodes[i].CC[0];
                        }
                        // CC1 = min{CC1(A), CC1(B), CC1(n)} + 1
                        for(let i of netlist[element._in])
                        {
                            if(min > nodes[i].CC[1])
                                min = nodes[i].CC[1];
                        }
                        element.CC[1] = min + 1;
                    break;

                    case "NOT":
                        element.CC = [1,1];
                        element.CC[1] += nodes[netlist[element._in]].CC[1];
                        element.CC[0] += nodes[netlist[element._in]].CC[0];
                    break;

                }
            }
        });
    }




}

let test = new Scoap("AB'*C*AB+'*");
test.componentList.forEach(item => console.log(item));
test.nodesList.forEach(item => console.log(item));
console.log(test.netlist);
console.log();