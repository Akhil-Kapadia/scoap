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
                        gate = "(" + op1 + ")" +exp[i];                         // Put () around NOTs
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
        gates.forEach((item) => {Components = new Component(item, index)});

    }
}


// Class to create a component
class Component
{
    /**
     * Creates objects of each gate component in ckt.
     * @constructor
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
        exp = exp.slice(0, exp.length - 1);     // remove logic operand.
        let myArr = [];
        // if parenthesis exist.
        while(/[()]/i.test(exp)){
            // Extract the parenthesis and contents as a single input
            myArr.push(exp.slice(exp.indexOf("("), exp.indexOf(")") + 1) );
            if(exp[exp.indexOf(")") + 1] == "\'")
                myArr[myArr.length - 1] += "\'";    //Handle NOTs
            exp = exp.replace(myArr[myArr.length - 1], "");  //remove from string
        }

        for(let x in exp) {
            if (isLetter(exp[x]))
                myArr.push(exp[x]); // Add each Letter as a single operand.
        }

        return myArr;
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
console.log(Netlist.componentList);