class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    if (this.currentOperand === '0') return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === '') this.currentOperand = '0';
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' ) return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '0';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    computation = Math.round((computation + Number.EPSILON) * 1e10) / 1e10;

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    if (stringNumber === 'Error') return 'Error';
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '0';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = '';
    }
  }
}

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.number);
    calculator.updateDisplay();
  });
});

document.querySelectorAll('[data-action="operator"]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.value);
    calculator.updateDisplay();
  });
});

document.querySelector('[data-action="equals"]').addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key) || key === '.') {
    calculator.appendNumber(key);
    calculator.updateDisplay();
  } else if (['+', '-', '*', '/'].includes(key)) {
    calculator.chooseOperation(key);
    calculator.updateDisplay();
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
  } else if (key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
  } else if (key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
});
