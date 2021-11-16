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

    /**
     * Finds the infix of a given expression
     * 
     * input: String infix expression
     * 
     * returns: String of postfix expression
     */
    infixToPostfix(str)
    {
        let st = [];    //stack
        let result = "";

        for (i in str)
        {
            let c = s[i];

            // Input to gate appended to result.
            if (isLetter(c)){
                result += c;
                if (i > 0 && isLetter(str[i-1]))
                    st.push("*");
            }
            // push ( to the stack
            else if(c == '(')
                st.push(c);
            // add insides of parenthesis to result.
            else if(c == ')')
            {
                while (st[st.length - 1])
                {
                    result += st[st.length - 1];
                    st.pop();
                }
                st.pop();
            }
            // if an operator is scanned.
            else
            {
                while(st.length != 0 && pre
            }

        }

    }

}


// Class to create a component
class Component
{
    /**
     * Creates objects of each gate component in ckt.
     * @constructor
     */
    constructor(expression)
    {   
        this.output = expression;
        this.logic = this.findLogic(expression);
        this.inputs = this.findInputs(expression);
        this.dir = null;        // can either be an input gate or output gate
    }

    /**
     * Finds the logic expression of gate.
     * @param {String} str User expression
     * @returns {String} logic expression in infix
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
     * Finds inputs of logic gate.  
     * @param {String} exp User boolean expression in infix
     * @returns Array of chars of inputs to the gate.
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

/**
 * Checks to see if its a letter.
 * @param {String} str User Expression
 * @returns Boolean T/F if letter
 */
const isLetter = (str) => {
    return (str.toUpperCase() != str.toLowerCase());
}