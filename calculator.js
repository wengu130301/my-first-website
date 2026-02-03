// calculator.js - 计算器核心逻辑
let display = document.getElementById('display');
let calculationDisplay = document.getElementById('calculation');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
    display.value = currentInput;
}
function updateCalculation() {
    calculationDisplay.textContent = previousInput + (operator ? ' ' + getOperatorSymbol(operator) : '');
}
function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
}
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}
function setOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    updateCalculation();
}
function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}
function calculate() {
    if (operator === null || shouldResetScreen) {
        return;
    }
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) { result = '错误: 除零'; } 
            else { result = prev / current; }
            break;
        default: return;
    }
    if (typeof result === 'number') {
        currentInput = result.toString();
        if (!Number.isInteger(result)) {
            result = Math.round(result * 10000000000) / 10000000000;
            currentInput = result.toString();
            if (currentInput.includes('.')) {
                currentInput = currentInput.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
            }
        }
    } else {
        currentInput = result;
    }
    calculationDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)} ${current} =`;
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
    calculationDisplay.textContent = '';
}
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}
// 为HTML按钮点击事件提供的简化函数
function appendToDisplay(value) {
    if ('0123456789'.includes(value)) {
        appendNumber(value);
    } else if ('+-*/'.includes(value)) {
        setOperator(value);
    } else if (value === '.') {
        appendDecimal();
    }
}