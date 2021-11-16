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
        if(this.isValid)
            this.expression = this.preProcess(str);
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
            if(!pattern.test(str[i]))
                return false;
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
    try{
        let pattern = /[a-z]/i;
        for (let i = 0; i < str.length; i++){
            if(i > 0)
                if( (pattern.test(str[i]) || (str[i] == "(")) && (pattern.test(str[i-1])) ){
                    str  = str.slice(0, i) + "*" + str.slice(i, str.length);
                    i++;
                }
        }
        return str;
    } catch(e){
        return "";
    }

    }
}
