/*
Engineer:  Akhil Kapadia 

Create Date: 11/15/2021 15:43:43 
File Name:   preProcess.js 
Project Name:   scoap 
Class Name:  PreProcessor

Description: Takes an input string and validates it. The class has method to return 
a T/F for valid strings and preprocesses to for algorihtmic purposes. 

Note: The boolean expression denote not with ' and must use letters as input names.
If parenthesis are included, any leading operations must be put after the ().
I.e A(B+C) should instead be (B+C)A.

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
        let st = [];
        for (let i in str)
        {
            // Check for unknown characters
            let pattern = /[a-z\'()+]/i
            if(!pattern.test(str[i])){
                throw 'Invalid Input';
                return false;
            }

            // check for balanced parenthesis.
            let char = st[st.length - 1];
            if(str[i] === "(")
                st.push(str[i]);
            else if(char === "(" && str[i] == ")")
                st.pop();
        }
        // stack should be empty by now.
        if(st.length)
            throw 'Invalid Input';
        return true;
    }

    /**
     * PreProcesses the user input and adds multplication operands in.
     * @param {String} str user input expression
     * @returns Processed String with * operands.
     */
    preProcess(str)
    {
        for (let i = 1; i < str.length; i++){
            // Add * when AB or )A -> A*B or )*A
            if(/[a-z(]/i.test(str[i]) && /[a-z)]/i.test(str[i-1])) {
                    str  = str.slice(0, i) + "*" + str.slice(i, str.length);
                    i++;
            } else 
            // Add * when AB'C or ()'() -> A*B'*C or ()'*()
            if(/[\']/i.test(str[i-1]) && /[a-z(]/i.test(str[i])) {
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
            if (/[a-z]/i.test(c)){
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
            return 3;
        else if(c == '*')
            return 2;
        else if(c == '+')
            return 1;
        else
            return -1;
    }
} // End of preproccesor class.

// Test case.
// let obj = new PreProcessor("AB'+A(C'+D')");
// // let obj = new PreProcessor("AB'C(A+B)'");
// console.log("Expression entered      :" + "AB'+A(C'+D')")
// console.log("Expression preprocessed :" + obj.strProc);
// console.log("Expected result         :" + "AB'*AC'D'+*+")
// console.log("Expression in postfix   :" +  obj.expression);

// Export modules
module.exports = PreProcessor;