/*
Engineer:  Akhil Kapadia 

Create Date: 11/11/2021 15:44:30 
File Name:   netlist.js 
Project Name:   scoap 
Class Name:  netlist.js 

Description: Classes to generate the netlists with an object array for
 components and nets.

Revision: 1.00
Changelog/Github:  https://github.com/Akhil-Kapadia/scoap
*/
// "use strict";
const { throws } = require("assert");


class Netlist   
{
    /**
     * Generates a netlist of components and nodes for a given boolean 
     * expression.
     * @constructor {String} expression Processed string ready for parsing.
     */
    constructor(expression)
    {
        this.expression = expression;
        this.componentList = this.findComponents(expression);
        this.nodesList = this.findNodes(this.componentList);
        this.netlist = this.generateNetlist(this.nodesList);
    }

    /**
     * Generates a list of Component objects.
     * @param {String} exp Processed boolean expression
     */
    findComponents(exp)
    {
        let Components = [];
        let gates = [];
        let st = [];
        let lastOp = "";

        // Add output and input variables as input components.
        gates.push("F");    // Default output if F
        for (let i in exp)
        {
            if (!st.includes(exp[i]) && isLetter(exp[i]))
                st.push(exp[i]);
        }
        st.forEach(item => gates.push(item));
        st = [];

        for (let i in exp){
            let gate = "";
            //If its an operand push to stack
            if(isLetter(exp[i]))
                st.push(exp[i]);
            // If its an operator process is, and push evaluated exp onto stack
            else {
                let op1 = st.pop();
                let op2 = st[st.length - 1]; // Keep 2nd in stack in case of NOT.

                switch (exp[i]){
                    case "\'":
                        gate = op1 +exp[i];                         // Put () around NOTs
                        st.push(gate);
                    break;
                    case "*":
                        gate = op1;
                        if (lastOp == exp[i])                                   // Handle successive operations ie. Multi input AND
                            while (st.length > 0)
                                gate += st.pop();
                        else 
                            gate += st.pop() + exp[i];                                                                                                       
                        st.push(gate);
                    break;
                    case "+":
                        gate = op1;
                        if (lastOp == exp[i])                                   // Handle successive operations ie. Multi input OR
                            while (st.length > 0)                               
                                gate += st.pop();
                        else 
                            gate += st.pop() + exp[i];                                                                                
                        st.push(gate);
                    break;
                    default:
                        throw "Invalid Input";                                  // Detected an operation not specified.
                }
                
                if (exp[i] == lastOp)
                    gates.pop();
                gates.push(gate);
                lastOp = exp[i];
            }
        }

        // Create component objects for each gate.    
        gates.forEach((item, index) => {Components.push(new Component(item, index))});
        
        return Components;
    } // End findComponents

    /**
     * Generates a list of nodes connecting components together.
     * @param {Component Array} list A list of Components in the ckt.
     */
    findNodes(comp)
    {   
        let count = 0; 
        let nodes = [];
        // Create a list of nodes, start at the end with output wire = F
        comp.forEach( (item, index, array) => { // go through all components
            let exp = item.output;

            array.forEach( element => { // Check all the inputs for matches
                element.inputs.forEach( str => {
                    if (str === exp){   // If matches generate a node connecting the two componenets together.
                        nodes.push(new Node(count, exp, item, element));
                        count++;
                    }
                });
            })
        })
        
        // Create an output node F.
        nodes.push(new Node(count, this.expression, comp[comp.length - 1], comp[0]));

        return nodes;
    }

    /**
     * Generates an array of all components and its associated nodes.
     * @param {Component List} comps List of Component objects.
     * @param {Node List} nodes List of Node objects.
     * @returns {Object} Array of IDs of components.
     */
    generateNetlist( nodes)
    {
        let nets = {};

        nodes.forEach((item) => { // iterate through connected components.
            let st = [];
            nodes.forEach(element => {  // Find nodes connected to component.
                if(item._in === element._out)
                    st.push(element.ID);    // Store IDs in an array.
            });
            nets[item._in] = st;
        });

        return nets;
    }
} // End Netlist Class


/** Class to create a Component */
class Component
{
    /**
     * Represents boolean logic gate.
     * @param {String} expression Boolean expression
     * @param {Int} id Identification # of gate
     */
    constructor(expression, id)
    {   
        this.ID = id;
        this.output = expression;
        this.logic = this.findLogic(expression);
        this.inputs = this.findInputs(expression);
        this.layer = this.findLayer(this.inputs);
    }

    /**
     * Finds the logic expression of gate.
     * @param {String} str User expression
     * @returns {String} logic expression in infix
     */
    findLogic(str){
        switch (str[str.length - 1]){
            case "'":
                return "NOT";
                
            case "+":
                return "OR";
                
            case "*":
                return "AND";

            case "F":
                return "OUTPUT"
            
            default :   // Assume component a COMM port/ input.
                return "INPUT";
            
        }
    }

    /**
     * Finds inputs of logic gate.  
     * @param {String} exp User boolean expression in infix
     * @returns Array of chars of inputs to the gate.
     */
    findInputs(exp)
    {
        exp = exp.replace(exp[exp.length - 1], "");  // Remove gate operator
        let operands = [];
        let st =[];

        while (exp.length > 0){

            // Slap the not on the last input on the stack. NOTs are stupid
            if(/[']/.test(exp[0])){
                if(st.length >0)
                    st[st.length-1] += "\'";
                else
                    operands[operands.length-1] += "\'";
                exp = exp.replace(exp[0], "");
        
            // If there is an operand, then contents of the stack are an operand from a gate
            } else  if(/[+*]/.test(exp[0]))
            {
                let op = ""
                while(st.length > 0)
                    op = st.pop() + op;
                operands.push(op + exp[0]);
                exp = exp.replace(exp[0], "");
            
            // when in doubt push it to the stack
            } else
            {
                st.push(exp[0]);
                exp = exp.replace(exp[0], "");
            }
        }

        // Dump st contents as individual inputs.
        st.forEach( item => operands.push(item));

        return operands;
    }

    findLayer(array)
    {
        let layer;
        if (this.logic === "INPUT")
            layer = 0; // If its an input variable
        else
            layer = 1;
        // Parse inputs and count # of operations for layer size. Take the biggest one.
        for (let i = 0; i < array.length; i++){
            let set = array[i].match(/[+*']/g);
            if(set === null)
                continue;
            if(layer < set.length + 1)
                layer++;
        };

        if(this.logic === "OUTPUT")
            layer = -1;
        return layer;
    }
} // End Component Class

/**Class representing a node/wire in a ckt. */
class Node
{
    /**
     * A node connecting two components together.
     * @param {int} ID The id of this node.
     * @param {String} expression The String expression that the wire represents
     * @param {String} input The ID of the input component of the wire
     * @param {String} output The ID of the output component of the wire.
     */
    constructor(id, expression, input, output)
    {
        this.ID = id;
        this.expression = expression;
        this._in = input.ID;
        this._out = output.ID;
        this.layer = this.findLayer(input);
    }

    /**
     * Finds the layer that this node is on based on the incoming component.
     * @param {Component} comp Object of Component Class.
     * @returns {int} Layer number
     */
    findLayer(comp)
    {
        return comp.layer;
    }
}

/**
 * Checks to see if its a letter.
 * @param {String} str User Expression
 * @returns Boolean T/F if letter
 */
const isLetter = (str) => {
    return (str.toUpperCase() != str.toLowerCase());
}

// //Test case
// console.log("AB'C(A+B)'");
// console.log("AB'*C*AB+'*");
// let x = new Netlist("AB'*C*AB+'*");
// x.componentList.forEach(item => console.log(item));
// x.nodesList.forEach(item => console.log(item));
// console.log(x.netlist);
// console.log("done");

// Export modules to use in external code.
module.exports = {
    Netlist, 
    Component, 
    Node
};