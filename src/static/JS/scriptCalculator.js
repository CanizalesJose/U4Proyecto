document.addEventListener("DOMContentLoaded", function(){
    const displayCalculator = document.querySelector("#btncalculadora");
    const calculadora = document.querySelector(".calculator");
    calculadora.setAttribute("style", "display:none");

    displayCalculator.addEventListener("click", function(){
        if (calculadora.getAttribute("style") == "display:none"){
            calculadora.setAttribute("style", "display:flex");
            return;
        }
        if (calculadora.getAttribute("style") == "display:flex"){
            calculadora.setAttribute("style", "display:none");
            return;
        }
        
    });

    //Codigo de calculadora
    const display = document.querySelector(".display");
    const buttons = document.querySelectorAll("button");
    
    let currentInput = "";
    let currentOperator = "";
    let shouldClearDisplay = false;
    
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const buttonText = button.textContent;
    
            if (buttonText.match(/[0-9]/)) {
                if (shouldClearDisplay) {
                    display.textContent = "";
                    shouldClearDisplay = false;
                }
                display.textContent += buttonText;
            } else if (buttonText === "C") {
                display.textContent = "";
                currentInput = "";
                currentOperator = "";
            } else if (buttonText === "=") {
                if (currentOperator && currentInput) {
                    const result = calculate(parseFloat(currentInput), currentOperator, parseFloat(display.textContent));
                    display.textContent = result;
                    currentInput = result;
                    currentOperator = "";
                    shouldClearDisplay = true;
                }
            } else {
                currentOperator = buttonText;
                currentInput = display.textContent;
                shouldClearDisplay = true;
            }
        });
    });
    
    function calculate(num1, operator, num2) {
        switch (operator) {
            case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            if (num2 !== 0) {
                return num1 / num2;
            } else {
                return "Error";
            }
        default:
            return num2;
        }
    }
});