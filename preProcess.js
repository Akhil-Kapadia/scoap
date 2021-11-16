/*
Engineer:  Akhil Kapadia 

Create Date: 11/15/2021 15:43:43 
File Name:   preProcess.js 
Project Name:   scoap 
Class Name:  validate 

Description: Takes an input string and validates it. The class has method to return a T/F for valid strings and preprocesses to for algorihtmic purposes.

Revision: 1.00
Changelog/Github:  https://github.com/Akhil-Kapadia/scoap
*/


class PreProcessor
{
    constructor(str)
    {
        this.isValid = this.isValid(str);
        this.expression = this.preProcess(str);
    }

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

    preProcess(str)
    {
        let pattern = /[a-z]/i;
        for (let i in str){
            if(i > 0)
                if(pattern.test(str[i]) || (str[i] == "(") 
                   && (pattern.test(str[i-1])) ){
                    str  = str.slice(0, i) + "*" + str.slice(i, str.length);
                }
        }
        return str;
    }


}

function infixToPostfix(str)
{
    let st = [];    //stack
    let pattern = /[a-z]/i;
    let result = "";

    for(i in str) {
        if (pattern.test(str[i])){
            result += str[i];
        if(i>0)
            if(pattern.test(str[i]) && (pattern.test(str[i-1]) || str[i-1] == "("))
                st.push("*");

        }        
        else if (str[i] == "(")
            st.push("(");
        
        else if(str[i] == ")"){
            while(st[st.length - 1] != "("){
                result += st[st.length -1];
                st.pop();
            }
            st.pop();

        } else {
            while (st.length != 0){
                result += st[st.length - 1];
                st.pop();
            }
            st.push(str[i])
        }




    }
}

let obj = new PreProcessor("ABC'+D");
console.log(obj.expression);
