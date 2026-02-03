{\rtf1\ansi\ansicpg936\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // calculator.js - \uc0\u35745 \u31639 \u22120 \u26680 \u24515 \u36923 \u36753 \
let display = document.getElementById('display');\
let calculationDisplay = document.getElementById('calculation');\
let currentInput = '0';\
let previousInput = '';\
let operator = null;\
let shouldResetScreen = false;\
\
// \uc0\u26356 \u26032 \u20027 \u26174 \u31034 \u23631 \
function updateDisplay() \{\
    display.value = currentInput;\
\}\
\
// \uc0\u26356 \u26032 \u35745 \u31639 \u36807 \u31243 \u26174 \u31034 \u23631 \
function updateCalculation() \{\
    calculationDisplay.textContent = previousInput + (operator ? ' ' + getOperatorSymbol(operator) : '');\
\}\
\
// \uc0\u33719 \u21462 \u36816 \u31639 \u31526 \u30340 \u26174 \u31034 \u31526 \u21495 \
function getOperatorSymbol(op) \{\
    const symbols = \{\
        '+': '+',\
        '-': '\uc0\u8722 ',\
        '*': '\'d7',\
        '/': '\'f7'\
    \};\
    return symbols[op] || op;\
\}\
\
// \uc0\u22788 \u29702 \u25968 \u23383 \u25353 \u38062 \u28857 \u20987 \
function appendNumber(number) \{\
    if (currentInput === '0' || shouldResetScreen) \{\
        currentInput = number;\
        shouldResetScreen = false;\
    \} else \{\
        currentInput += number;\
    \}\
    updateDisplay();\
\}\
\
// \uc0\u22788 \u29702 \u36816 \u31639 \u31526 \u25353 \u38062 \u28857 \u20987 \
function setOperator(op) \{\
    if (operator !== null && !shouldResetScreen) \{\
        calculate();\
    \}\
    previousInput = currentInput;\
    operator = op;\
    shouldResetScreen = true;\
    updateCalculation();\
\}\
\
// \uc0\u22788 \u29702 \u23567 \u25968 \u28857 \
function appendDecimal() \{\
    if (shouldResetScreen) \{\
        currentInput = '0.';\
        shouldResetScreen = false;\
    \} else if (!currentInput.includes('.')) \{\
        currentInput += '.';\
    \}\
    updateDisplay();\
\}\
\
// \uc0\u35745 \u31639 \u26368 \u32456 \u32467 \u26524 \
function calculate() \{\
    if (operator === null || shouldResetScreen) \{\
        return;\
    \}\
    \
    let prev = parseFloat(previousInput);\
    let current = parseFloat(currentInput);\
    let result;\
    \
    // \uc0\u25191 \u34892 \u35745 \u31639 \
    switch (operator) \{\
        case '+':\
            result = prev + current;\
            break;\
        case '-':\
            result = prev - current;\
            break;\
        case '*':\
            result = prev * current;\
            break;\
        case '/':\
            if (current === 0) \{\
                result = '\uc0\u38169 \u35823 : \u38500 \u38646 ';\
            \} else \{\
                result = prev / current;\
            \}\
            break;\
        default:\
            return;\
    \}\
    \
    // \uc0\u22788 \u29702 \u32467 \u26524 \
    if (typeof result === 'number') \{\
        // \uc0\u22914 \u26524 \u26159 \u25972 \u25968 \u65292 \u19981 \u26174 \u31034 \u23567 \u25968 \u28857 \u65307 \u21542 \u21017 \u26368 \u22810 \u20445 \u30041 10\u20301 \u23567 \u25968 \
        currentInput = result.toString();\
        if (!Number.isInteger(result)) \{\
            // \uc0\u38480 \u21046 \u23567 \u25968 \u20301 \u25968 \u65292 \u36991 \u20813 \u28014 \u28857 \u31934 \u24230 \u38382 \u39064 \u23548 \u33268 \u30340 \u36229 \u38271 \u23567 \u25968 \
            result = Math.round(result * 10000000000) / 10000000000;\
            currentInput = result.toString();\
            // \uc0\u21435 \u38500 \u26411 \u23614 \u26080 \u24847 \u20041 \u30340 \u38646 \
            if (currentInput.includes('.')) \{\
                currentInput = currentInput.replace(/(\\.\\d*?[1-9])0+$/, '$1').replace(/\\.$/, '');\
            \}\
        \}\
    \} else \{\
        currentInput = result;\
    \}\
    \
    // \uc0\u26356 \u26032 \u35745 \u31639 \u36807 \u31243 \u26174 \u31034 \
    calculationDisplay.textContent = `$\{previousInput\} $\{getOperatorSymbol(operator)\} $\{current\} =`;\
    \
    operator = null;\
    previousInput = '';\
    shouldResetScreen = true;\
    updateDisplay();\
\}\
\
// \uc0\u28165 \u31354 \u25152 \u26377 \
function clearDisplay() \{\
    currentInput = '0';\
    previousInput = '';\
    operator = null;\
    updateDisplay();\
    calculationDisplay.textContent = '';\
\}\
\
// \uc0\u21024 \u38500 \u26368 \u21518 \u19968 \u20010 \u23383 \u31526 \
function deleteLast() \{\
    if (currentInput.length > 1) \{\
        currentInput = currentInput.slice(0, -1);\
    \} else \{\
        currentInput = '0';\
    \}\
    updateDisplay();\
\}\
\
// \uc0\u20026 HTML\u25353 \u38062 \u28857 \u20987 \u20107 \u20214 \u25552 \u20379 \u30340 \u31616 \u21270 \u20989 \u25968 \
function appendToDisplay(value) \{\
    if ('0123456789'.includes(value)) \{\
        appendNumber(value);\
    \} else if ('+-*/'.includes(value)) \{\
        setOperator(value);\
    \} else if (value === '.') \{\
        appendDecimal();\
    \}\
\}}