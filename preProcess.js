/*
Engineer:  Akhil Kapadia 

Create Date: 11/15/2021 15:43:43 
File Name:   preProcess.js 
Project Name:   scoap 
Class Name:  PreProcessor

Description: Takes an input string and validates it. The class has method to return a T/F for valid strings and preprocesses to for algorihtmic purposes.

Revision: 1.00
Changelog/Github:  https://github.com/Akhil-Kapadia/scoap
*/


class PreProcessor
{

    /**
     * PreProcesses user input and validates it.
     * @constructor
     */
    constructor(str)
    {
        this.isValid = this.isValid(str);
        if(this.isValid){
            this.strProc = this.preProcess(str);
            this.expression = this.infixToPostfix(this.strProc);
        }
    }

    /**
     * Function validates the users inputs.
     * 
     * @param {user input} str 
     * @returns boolean
     */
    isValid(str)
    {
        for (let i in str)
        {
            let pattern = /[a-z\'()+]/i
            if(!pattern.test(str[i])){
                throw 'Invalid Input';
                return false;
            }
        }
        return true;
    }

    /**
     * PreProcesses the user input and adds multplication operands in.
     * @param {String} str user input expression
     * @returns Processed String with * operands.
     */
    preProcess(str)
    {
    
        let pattern = /[a-z]/i;
        for (let i = 0; i < str.length; i++){
            if(i > 0)
                if( (pattern.test(str[i]) || (str[i] == "(")) && (pattern.test(str[i-1])) || (str[i-1] == "\'") ){
                    str  = str.slice(0, i) + "*" + str.slice(i, str.length);
                    i++;
                }
        }
        return str;
    }

    /**
     * Generates the PostFix notation of a given string. The expression will be
     * in reverse polish notation. Each operator will have two operands 
     * preceding it.
     * @param {String} str Preprocessed expression
     * @returns Postfix of expression
     */
    infixToPostfix(str)
    {
        let st = [];    //stack
        let result = "";
        let lastOp = null;

        for (let i in str)
        {
            let c = str[i];
            // If gate input add to result
            if (isLetter(c)){
                result += c;
            }
            // if parenthesis stack and add to result
            else if(c == "("){
                st.push("(");
            }
            // if ) pop and find (
            else if(c == ")"){
                while(st[st.length -1] != "("){
                    result += st[st.length - 1];
                    st.pop();
                }
                st.pop();
            }
            // Process logic operators and handle multi input logic.
            else {
                while(st.length != 0 && (this.prec(c) <= this.prec(st[st.length - 1])) ){
                    result += st[st.length - 1];
                    st.pop();
                }
                st.push(c);
            }
        }

        //Pop remaining operands
        while(st.length != 0){
            result += st[st.length - 1];
            st.pop();
        }
        
        return result;
    } // End of infixtopostfix

    //handles priority of logic. (NOT is first)
    prec(c) {
        if(c == '\'')
            return 2;
        else if(c == '+' || c == '*')
            return 1;
        else
            return -1;
    }
} // End of preproccesor class.

/**
 * Checks to see if its a letter.
 * @param {String} str User Expression
 * @returns Boolean T/F if letter
 */
 const isLetter = (str) => {
    return (str.toUpperCase() != str.toLowerCase());
}

// Test case.
// let obj = new PreProcessor("AB'C(A+B)'");
// console.log("Expression entered      :" + "AB'C(A+B)'")
// console.log("Expression preprocessed :" + obj.strProc);
// console.log("Expected result         :" + "AB'*C*AB+'*")
// console.log("Expression in postfix   :" +  obj.expression);