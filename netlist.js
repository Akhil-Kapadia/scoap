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
        this.componentList = this.findComponents(expression);
        this.nodesList = this.findNodes(this.componentList);
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
        Components.forEach(item => console.log(item));
        return Components;

    } // End findComponents

    /**
     * Generates a list of nodes connecting components together.
     * @param {Component Array} list A list of Components in the ckt.
     */
    findNodes(list)
    {   
        list.forEach( (vals) => console.log(vals));
        let node_list = [];
        let i,j;
        // Iterate through each gate output and attempt to find a corresponding input,
        // if none is found, then the gate is the last gate.
        for (i = 0; i < list.length; i++){
            let obj = list[i];
            let exp  = obj.output;
            for(j = 0; j < list.length; j++){
                let n = list[j].inputs.find( (val) => val == exp);
                console.log(n);
            }
        }

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
                
            default :
                throw "Invalid Input";
                break;
            
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
                st[st.length-1] += "\'";
                exp = exp.replace(exp[0], "");
        
            // If there is an operand, then contents of the stack are an operand from a gate
            } else  if(/[+*]/.test(exp[0]))
            {
                let op = ""
                while(st.length > 0)
                    op += st.pop();
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
} // End Component Class

/**Class representing a node/wire in a ckt. */
class Node
{
    /**
     * A node connecting two components together.
     * @param {int} id The id of this node.
     * @param {String} input The input of the wire.
     * @param {String} output The output of a wire
     */
    constructor(input, output, id)
    {
        this.id = id;
        this.in = input;
        this.out = output;
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

console.log("AB'C(A+B)'");
console.log("AB'*C*AB+'*");
let x = new Netlist("AB'*C*AB+'*");
x.componentList.forEach( item => console.log(item));
console.log("done");