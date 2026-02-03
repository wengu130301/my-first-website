// calculator.js - 计算器核心逻辑
let display = document.getElementById('display');
let calculationDisplay = document.getElementById('calculation');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

// 更新显示屏
function updateDisplay() {
    display.value = currentInput;
}

// 更新计算过程显示
function updateCalculation() {
    calculationDisplay.textContent = previousInput + (operator ? ' ' + getOperatorSymbol(operator) : '');
}

// 获取运算符显示符号
function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
}

// 处理数字输入
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// 设置运算符
function setOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    updateCalculation();
}

// 处理小数点
function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// 执行计算
function calculate() {
    if (operator === null || shouldResetScreen) {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    // 执行运算
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = '错误: 除零';
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }
    
    // 处理结果
    if (typeof result === 'number') {
        // 整数不显示小数点，小数保留合适位数
        currentInput = result.toString();
        if (!Number.isInteger(result)) {
            // 限制小数位数，避免浮点精度问题
            result = Math.round(result * 10000000000) / 10000000000;
            currentInput = result.toString();
            // 去除末尾无意义的零
            if (currentInput.includes('.')) {
                currentInput = currentInput.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
            }
        }
    } else {
        currentInput = result;
    }
    
    // 更新计算过程显示
    calculationDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)} ${current} =`;
    
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// 清空所有
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
    calculationDisplay.textContent = '';
}

// 删除最后一个字符
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