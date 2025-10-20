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
    let isErrorState = false; // **MỚI: Biến để theo dõi trạng thái lỗi**

    // Event listeners for mobile history toggle
    toggleHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.add('visible');
    });
    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('visible');
    });

    const updateDisplay = () => { /* ... (giữ nguyên, sao chép ở dưới) ... */ };
    const logToHistory = (entry) => { /* ... (giữ nguyên, sao chép ở dưới) ... */ };
    clearHistoryBtn.addEventListener('click', () => { /* ... (giữ nguyên, sao chép ở dưới) ... */ });

    // --- THAY ĐỔI TRONG HÀM CALCULATE ---
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
                    currentOperand = "Cannot divide by zero"; // **Hiển thị lỗi trên màn hình**
                    isErrorState = true; // **Bật trạng thái lỗi**
                    displayCurrent.classList.add('error-text'); // **Thêm lớp CSS cho văn bản lỗi**
                    return; // **Dừng hàm tại đây**
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

    // --- THAY ĐỔI ĐỂ KHÓA MÁY TÍNH KHI CÓ LỖI ---
    const handleNumber = (number) => {
        if (isErrorState) return; // **Không cho nhập số khi đang có lỗi**
        // ... (phần còn lại của hàm giữ nguyên)
    };
    const chooseOperation = (op) => {
        if (isErrorState) return; // **Không cho chọn phép toán khi có lỗi**
        // ... (phần còn lại của hàm giữ nguyên)
    };
    const handleAction = (action) => {
        // **Chỉ cho phép nút 'clear' và 'clear-entry' hoạt động khi có lỗi**
        if (isErrorState && action !== 'clear' && action !== 'clear-entry') {
            return;
        }
        // ... (phần còn lại của hàm giữ nguyên)
    };
    buttons.addEventListener('click', (event) => { /* ... (giữ nguyên, sao chép ở dưới) ... */ });
    updateDisplay();


    // --- SAO CHÉP LẠI TOÀN BỘ CÁC HÀM KHÔNG THAY ĐỔI ---
    // (Bao gồm cả các hàm đã được sửa lỗi ở trên để bạn có thể sao chép một lần duy nhất)

    const updateDisplay_full = () => {
        displayCurrent.textContent = currentOperand;
        if (operation != null) {
            displayPrevious.textContent = `${previousOperand} ${operation}`;
        } else {
            if (shouldResetDisplay) {
                 displayPrevious.textContent = '';
            }
        }
    };

    const logToHistory_full = (entry) => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.prepend(li);
    };

    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
    });

    const handleNumber_full = (number) => {
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

    const chooseOperation_full = (op) => {
        if (isErrorState) return;
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            calculate();
        }
        if (isErrorState) return; // Kiểm tra lại sau khi calculate có thể gây lỗi
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
        shouldResetDisplay = true;
    };
    
    const handleAction_full = (action) => {
        if (isErrorState && action !== 'clear' && action !== 'clear-entry') {
            return;
        }
        const originalOperand = currentOperand;

        switch (action) {
            case 'clear':
                currentOperand = '0';
                previousOperand = '';
                operation = null;
                isErrorState = false; // **Tắt trạng thái lỗi**
                displayCurrent.classList.remove('error-text'); // **Xóa lớp CSS lỗi**
                break;
            case 'clear-entry':
                currentOperand = '0';
                isErrorState = false; // **Tắt trạng thái lỗi**
                displayCurrent.classList.remove('error-text'); // **Xóa lớp CSS lỗi**
                break;
            case 'backspace':
                currentOperand = currentOperand.slice(0, -1) || '0';
                break;
            case 'decimal': handleNumber_full('.'); break;
            case 'negate': 
                currentOperand = (parseFloat(currentOperand) * -1).toString(); 
                break;
            case 'percentage':
                currentOperand = (parseFloat(originalOperand) / 100).toString();
                logToHistory_full(`${originalOperand}% = ${currentOperand}`);
                shouldResetDisplay = true;
                break;
            case 'sqrt':
                if (parseFloat(originalOperand) >= 0) {
                    currentOperand = Math.sqrt(parseFloat(originalOperand)).toString();
                    logToHistory_full(`sqrt(${originalOperand}) = ${currentOperand}`);
                    shouldResetDisplay = true;
                } else {
                    alert("Invalid input for square root");
                }
                break;
            case 'square':
                currentOperand = Math.pow(parseFloat(originalOperand), 2).toString();
                logToHistory_full(`sqr(${originalOperand}) = ${currentOperand}`);
                shouldResetDisplay = true;
                break;
            case 'reciprocal':
                if (parseFloat(originalOperand) !== 0) {
                    currentOperand = (1 / parseFloat(originalOperand)).toString();
                    logToHistory_full(`1/(${originalOperand}) = ${currentOperand}`);
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

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('number')) {
            handleNumber_full(target.textContent);
        } else if (target.classList.contains('operator')) {
            if (target.dataset.action === 'equals') {
                handleAction_full('equals');
            } else {
                chooseOperation_full(target.textContent);
            }
        } else if (target.classList.contains('func')) {
            handleAction_full(target.dataset.action);
        }
        updateDisplay_full();
    });
    
    updateDisplay_full();
});