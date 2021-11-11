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



class Netlist
{
    constructor(expression)
    {
        this.componentList = this.findComponents(expression);

    }

    /**
     * Create a list of components given string boolean expression
     * 
     * input: String boolean expression
     * 
     * output: Array of component objects.
     */
    findComponents(exp)
    {
        
    }

}


// Class to create a component
class Component
{
    constructor(expression)
    {
        this.output = expression;
        this.logic = this.findLogic(expression);
        this.inputs = this.findInputs(expression);
        this.dir = null;        // can either be an input gate or output gate
    }

    /**
     * Determines the logic of an expression. Assumes that given expression is
     * a single logic gate.
     * 
     * input: Boolean expression of a component.
     * Example inputs: A(ABC), AB, A', (AB)'
     * 
     * returns: string -> "AND", "OR", "NOT".
     */
    findLogic(str){
        let exp = Array.from(str);

        while(exp.length > 0){
            let char = exp.pop();

            switch (char){
                case ")":
                    while(char != "(") {
                        char = exp.pop();
                    } 
                    break;
                case "'":
                    return "NOT";
                
                case "+":
                    return "OR";
                
                default :
                    if(isLetter(char)){
                        return "AND";
                    }
                    break;
            }
        }
    }

    /**
     * Finds all the inputs of the gate. This can either single letters (Ex. A)
     * or the output of another gate (Ex (AB)(BC)).
     * 
     * input: String - boolean expression of a single logic gate.
     * 
     * output: An array of inputs.
     */
    findInputs(exp)
    {
        let myArr = [];
        // if parenthesis exist.
        while(/[()]/i.test(exp)){
            // Extract the parenthesis and contents.
            myArr.push(exp.slice(exp.indexOf("("), exp.indexOf(")")+1) );
            exp = exp.replace(myArr[myArr.length - 1], "");  //remove from string
        }

        for(let x in exp) {
            if (isLetter(exp[x]))
                myArr.push(exp[x]);
        }

        return myArr;
    }
}

// Returns T/F is its a letter.
const isLetter = (str) => {
    return (str.toUpperCase() != str.toLowerCase());
}