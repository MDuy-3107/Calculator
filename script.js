document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Selections
    const displayCurrent = document.querySelector('.current-operand');
    const displayPrevious = document.querySelector('.previous-operand');
    const buttons = document.querySelector('.buttons');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const toggleHistoryBtn = document.getElementById('toggle-history-btn');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const historyPanel = document.querySelector('.history-panel');

    // State variables
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetDisplay = false;
    let isErrorState = false;

    // --- HELPER FUNCTIONS ---

    /**
     * Updates the calculator's display with the current state.
     */
    const updateDisplay = () => {
        displayCurrent.textContent = currentOperand;
        if (operation != null) {
            displayPrevious.textContent = `${previousOperand} ${operation}`;
        } else if (shouldResetDisplay) {
            // Clear previous operand display after a calculation is finished
            displayPrevious.textContent = '';
        }
    };

    /**
     * Adds a formatted string entry to the history panel.
     * @param {string} entry - The text to be logged.
     */
    const logToHistory = (entry) => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.prepend(li);
    };

    /**
     * Performs the calculation for binary operations (+, -, *, /).
     */
    const calculate = () => {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+': result = prev + current; break;
            case '−': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷':
                if (current === 0) {
                    currentOperand = "Cannot divide by zero";
                    isErrorState = true;
                    displayCurrent.classList.add('error-text');
                    return;
                }
                result = prev / current;
                break;
            default: return;
        }
        result = parseFloat(result.toPrecision(12));
        logToHistory(`${previousOperand} ${operation} ${currentOperand} = ${result}`);
        currentOperand = result.toString();
        operation = null;
        previousOperand = '';
    };

    /**
     * Handles number and decimal inputs from the user.
     * @param {string} number - The number or decimal point pressed.
     */
    const handleNumber = (number) => {
        if (isErrorState) return;
        if (shouldResetDisplay) {
            currentOperand = '0';
            shouldResetDisplay = false;
        }
        if (number === '.' && currentOperand.includes('.')) return;
        if (number === '.' && currentOperand === '0') {
            currentOperand = '0.';
            return;
        }
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    };

    /**
     * Sets the chosen operation and prepares for the next number input.
     * @param {string} op - The operator symbol.
     */
    const chooseOperation = (op) => {
        if (isErrorState) return;
        if (currentOperand === '' && operation !== null) return;
        if (previousOperand !== '') {
            calculate();
        }
        if (isErrorState) return;
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
        shouldResetDisplay = false;
    };
    
    /**
     * Handles non-operator actions like clear, backspace, sqrt, etc.
     * @param {string} action - The action to perform.
     */
    const handleAction = (action) => {
        if (isErrorState && action !== 'clear' && action !== 'clear-entry') {
            return;
        }
        const originalOperand = currentOperand;

        switch (action) {
            case 'clear':
                currentOperand = '0';
                previousOperand = '';
                operation = null;
                isErrorState = false;
                shouldResetDisplay = true;
                displayCurrent.classList.remove('error-text');
                break;
            case 'clear-entry':
                currentOperand = '0';
                isErrorState = false;
                displayCurrent.classList.remove('error-text');
                break;
            case 'backspace':
                if (shouldResetDisplay) return;
                currentOperand = currentOperand.slice(0, -1) || '0';
                break;
            case 'decimal': handleNumber('.'); break;
            case 'negate': 
                currentOperand = (parseFloat(currentOperand) * -1).toString(); 
                break;
            case 'percentage':
                currentOperand = (parseFloat(originalOperand) / 100).toString();
                logToHistory(`${originalOperand}% = ${currentOperand}`);
                shouldResetDisplay = true;
                break;
            case 'sqrt':
                if (parseFloat(originalOperand) >= 0) {
                    currentOperand = Math.sqrt(parseFloat(originalOperand)).toString();
                    logToHistory(`sqrt(${originalOperand}) = ${currentOperand}`);
                    shouldResetDisplay = true;
                } else {
                    currentOperand = "Invalid input";
                    isErrorState = true;
                    displayCurrent.classList.add('error-text');
                }
                break;
            case 'square':
                currentOperand = Math.pow(parseFloat(originalOperand), 2).toString();
                logToHistory(`sqr(${originalOperand}) = ${currentOperand}`);
                shouldResetDisplay = true;
                break;
            case 'reciprocal':
                if (parseFloat(originalOperand) !== 0) {
                    currentOperand = (1 / parseFloat(originalOperand)).toString();
                    logToHistory(`1/(${originalOperand}) = ${currentOperand}`);
                    shouldResetDisplay = true;
                } else {
                    currentOperand = "Cannot divide by zero";
                    isErrorState = true;
                    displayCurrent.classList.add('error-text');
                }
                break;
            case 'equals':
                if (operation == null || previousOperand === '') return;
                calculate();
                shouldResetDisplay = true;
                break;
        }
    };
    
    // --- EVENT LISTENERS ---

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('number')) {
            handleNumber(target.textContent);
        } else if (target.classList.contains('operator')) {
            if (target.dataset.action === 'equals') {
                handleAction('equals');
            } else {
                chooseOperation(target.textContent);
            }
        } else if (target.classList.contains('func')) {
            handleAction(target.dataset.action);
        }
        updateDisplay();
    });
    
    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
    });

    toggleHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.add('visible');
    });

    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('visible');
    });

    // Initial display update on page load
    updateDisplay();
});
