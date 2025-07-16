import React, { useState, useEffect } from 'react';

interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: string | null;
  waitingForNewValue: boolean;
  memory: number;
  isRadians: boolean;
  history: string[];
}

function App() {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    waitingForNewValue: false,
    memory: 0,
    isRadians: true,
    history: []
  });

  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        currentValue: num,
        waitingForNewValue: false
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentValue: prev.currentValue === '0' ? num : prev.currentValue + num
      }));
    }
  };

  const handleOperator = (nextOperation: string) => {
    const inputValue = parseFloat(state.currentValue);

    if (state.previousValue === '') {
      setState(prev => ({
        ...prev,
        previousValue: prev.currentValue,
        operation: nextOperation,
        waitingForNewValue: true
      }));
    } else if (state.operation) {
      const currentValue = parseFloat(state.currentValue);
      const previousValue = parseFloat(state.previousValue);
      const result = calculate(previousValue, currentValue, state.operation);

      setState(prev => ({
        ...prev,
        currentValue: String(result),
        previousValue: String(result),
        operation: nextOperation,
        waitingForNewValue: true
      }));
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleScientificFunction = (func: string) => {
    const value = parseFloat(state.currentValue);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(state.isRadians ? value : value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(state.isRadians ? value : value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(state.isRadians ? value : value * Math.PI / 180);
        break;
      case 'asin':
        result = Math.asin(value);
        if (!state.isRadians) result = result * 180 / Math.PI;
        break;
      case 'acos':
        result = Math.acos(value);
        if (!state.isRadians) result = result * 180 / Math.PI;
        break;
      case 'atan':
        result = Math.atan(value);
        if (!state.isRadians) result = result * 180 / Math.PI;
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'x²':
        result = value * value;
        break;
      case '1/x':
        result = value !== 0 ? 1 / value : 0;
        break;
      case 'x!':
        result = factorial(Math.floor(value));
        break;
      case 'e^x':
        result = Math.exp(value);
        break;
      case '10^x':
        result = Math.pow(10, value);
        break;
      case 'abs':
        result = Math.abs(value);
        break;
      default:
        result = value;
    }

    const expression = `${func}(${state.currentValue}) = ${result}`;
    addToHistory(expression);

    setState(prev => ({
      ...prev,
      currentValue: String(result),
      waitingForNewValue: true
    }));
  };

  const handleConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        return;
    }

    setState(prev => ({
      ...prev,
      currentValue: String(value),
      waitingForNewValue: true
    }));
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    if (state.operation && state.previousValue !== '') {
      const currentValue = parseFloat(state.currentValue);
      const previousValue = parseFloat(state.previousValue);
      const result = calculate(previousValue, currentValue, state.operation);

      const expression = `${state.previousValue} ${state.operation} ${state.currentValue} = ${result}`;
      addToHistory(expression);

      setState(prev => ({
        ...prev,
        currentValue: String(result),
        previousValue: '',
        operation: null,
        waitingForNewValue: true
      }));
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForNewValue: false
    }));
  };

  const handleAllClear = () => {
    setState(prev => ({
      ...prev,
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForNewValue: false,
      history: []
    }));
  };

  const handleDecimal = () => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        currentValue: '0.',
        waitingForNewValue: false
      }));
    } else if (state.currentValue.indexOf('.') === -1) {
      setState(prev => ({
        ...prev,
        currentValue: prev.currentValue + '.'
      }));
    }
  };

  const handleMemory = (operation: string) => {
    const value = parseFloat(state.currentValue);
    
    switch (operation) {
      case 'MC':
        setState(prev => ({ ...prev, memory: 0 }));
        break;
      case 'MR':
        setState(prev => ({
          ...prev,
          currentValue: String(prev.memory),
          waitingForNewValue: true
        }));
        break;
      case 'M+':
        setState(prev => ({ ...prev, memory: prev.memory + value }));
        break;
      case 'M-':
        setState(prev => ({ ...prev, memory: prev.memory - value }));
        break;
      case 'MS':
        setState(prev => ({ ...prev, memory: value }));
        break;
    }
  };

  const toggleAngleMode = () => {
    setState(prev => ({ ...prev, isRadians: !prev.isRadians }));
  };

  const addToHistory = (expression: string) => {
    setState(prev => ({
      ...prev,
      history: [expression, ...prev.history.slice(0, 9)] // Keep last 10 entries
    }));
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    
    if (key >= '0' && key <= '9') {
      handleNumber(key);
    } else if (key === '+' || key === '-') {
      handleOperator(key);
    } else if (key === '*') {
      handleOperator('×');
    } else if (key === '/') {
      event.preventDefault();
      handleOperator('÷');
    } else if (key === 'Enter' || key === '=') {
      handleEquals();
    } else if (key === 'Escape') {
      handleClear();
    } else if (key === '.') {
      handleDecimal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  const animateButton = (buttonKey: string) => {
    setIsAnimating(buttonKey);
    setTimeout(() => setIsAnimating(null), 150);
  };

  const Button = ({ 
    onClick, 
    className, 
    children, 
    buttonKey,
    size = 'normal'
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode; 
    buttonKey: string;
    size?: 'normal' | 'small';
  }) => (
    <button
      onClick={() => {
        onClick();
        animateButton(buttonKey);
      }}
      className={`
        ${size === 'small' ? 'h-12 text-sm' : 'h-14 text-base'} 
        rounded-xl font-semibold transition-all duration-150 
        active:scale-95 hover:shadow-lg transform
        ${isAnimating === buttonKey ? 'scale-95 shadow-inner' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );

  const formatDisplay = (value: string): string => {
    if (value.length > 12) {
      const num = parseFloat(value);
      if (Math.abs(num) > 999999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
        return num.toExponential(6);
      }
      return num.toPrecision(10);
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 max-w-4xl w-full">
        <div className="flex gap-6">
          {/* Main Calculator */}
          <div className="flex-1">
            {/* Display */}
            <div className="bg-black/20 rounded-2xl p-6 mb-4 backdrop-blur-sm">
              <div className="text-right">
                <div className="text-white/60 text-sm h-6 mb-1 flex justify-between">
                  <span>
                    {state.memory !== 0 ? 'M' : ''}
                    {state.isRadians ? ' RAD' : ' DEG'}
                  </span>
                  <span>
                    {state.previousValue && state.operation 
                      ? `${formatDisplay(state.previousValue)} ${state.operation}`
                      : ''
                    }
                  </span>
                </div>
                <div className="text-white text-3xl font-light tracking-wider">
                  {formatDisplay(state.currentValue)}
                </div>
              </div>
            </div>

            {/* Scientific Functions Row 1 */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <Button
                onClick={() => handleScientificFunction('sin')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="sin"
                size="small"
              >
                sin
              </Button>
              <Button
                onClick={() => handleScientificFunction('cos')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="cos"
                size="small"
              >
                cos
              </Button>
              <Button
                onClick={() => handleScientificFunction('tan')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="tan"
                size="small"
              >
                tan
              </Button>
              <Button
                onClick={() => handleScientificFunction('log')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="log"
                size="small"
              >
                log
              </Button>
              <Button
                onClick={() => handleScientificFunction('ln')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="ln"
                size="small"
              >
                ln
              </Button>
              <Button
                onClick={() => handleOperator('^')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="power"
                size="small"
              >
                x^y
              </Button>
            </div>

            {/* Scientific Functions Row 2 */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <Button
                onClick={() => handleScientificFunction('asin')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="asin"
                size="small"
              >
                sin⁻¹
              </Button>
              <Button
                onClick={() => handleScientificFunction('acos')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="acos"
                size="small"
              >
                cos⁻¹
              </Button>
              <Button
                onClick={() => handleScientificFunction('atan')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="atan"
                size="small"
              >
                tan⁻¹
              </Button>
              <Button
                onClick={() => handleScientificFunction('10^x')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="10power"
                size="small"
              >
                10^x
              </Button>
              <Button
                onClick={() => handleScientificFunction('e^x')}
                className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg"
                buttonKey="epower"
                size="small"
              >
                e^x
              </Button>
              <Button
                onClick={() => handleScientificFunction('x²')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="square"
                size="small"
              >
                x²
              </Button>
            </div>

            {/* Memory and Constants Row */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <Button
                onClick={() => handleMemory('MC')}
                className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg"
                buttonKey="mc"
                size="small"
              >
                MC
              </Button>
              <Button
                onClick={() => handleMemory('MR')}
                className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg"
                buttonKey="mr"
                size="small"
              >
                MR
              </Button>
              <Button
                onClick={() => handleMemory('M+')}
                className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg"
                buttonKey="mplus"
                size="small"
              >
                M+
              </Button>
              <Button
                onClick={() => handleMemory('M-')}
                className="bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg"
                buttonKey="mminus"
                size="small"
              >
                M-
              </Button>
              <Button
                onClick={() => handleConstant('π')}
                className="bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg"
                buttonKey="pi"
                size="small"
              >
                π
              </Button>
              <Button
                onClick={() => handleConstant('e')}
                className="bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg"
                buttonKey="e"
                size="small"
              >
                e
              </Button>
            </div>

            {/* Main Calculator Grid */}
            <div className="grid grid-cols-5 gap-3">
              {/* First Row */}
              <Button
                onClick={handleAllClear}
                className="bg-gradient-to-b from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 text-white shadow-lg"
                buttonKey="ac"
              >
                AC
              </Button>
              <Button
                onClick={handleClear}
                className="bg-gradient-to-b from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 text-white shadow-lg"
                buttonKey="clear"
              >
                C
              </Button>
              <Button
                onClick={() => handleScientificFunction('sqrt')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="sqrt"
              >
                √
              </Button>
              <Button
                onClick={() => handleOperator('÷')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="divide"
              >
                ÷
              </Button>
              <Button
                onClick={() => handleOperator('mod')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="mod"
              >
                mod
              </Button>

              {/* Second Row */}
              <Button
                onClick={() => handleNumber('7')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="7"
              >
                7
              </Button>
              <Button
                onClick={() => handleNumber('8')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="8"
              >
                8
              </Button>
              <Button
                onClick={() => handleNumber('9')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="9"
              >
                9
              </Button>
              <Button
                onClick={() => handleOperator('×')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="multiply"
              >
                ×
              </Button>
              <Button
                onClick={() => handleScientificFunction('x!')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="factorial"
              >
                x!
              </Button>

              {/* Third Row */}
              <Button
                onClick={() => handleNumber('4')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="4"
              >
                4
              </Button>
              <Button
                onClick={() => handleNumber('5')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="5"
              >
                5
              </Button>
              <Button
                onClick={() => handleNumber('6')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="6"
              >
                6
              </Button>
              <Button
                onClick={() => handleOperator('-')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="subtract"
              >
                −
              </Button>
              <Button
                onClick={() => handleScientificFunction('1/x')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="reciprocal"
              >
                1/x
              </Button>

              {/* Fourth Row */}
              <Button
                onClick={() => handleNumber('1')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="1"
              >
                1
              </Button>
              <Button
                onClick={() => handleNumber('2')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="2"
              >
                2
              </Button>
              <Button
                onClick={() => handleNumber('3')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="3"
              >
                3
              </Button>
              <Button
                onClick={() => handleOperator('+')}
                className="bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white shadow-lg"
                buttonKey="add"
              >
                +
              </Button>
              <Button
                onClick={toggleAngleMode}
                className="bg-gradient-to-b from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white shadow-lg"
                buttonKey="angle"
              >
                {state.isRadians ? 'RAD' : 'DEG'}
              </Button>

              {/* Fifth Row */}
              <Button
                onClick={() => handleNumber('0')}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg col-span-2"
                buttonKey="0"
              >
                0
              </Button>
              <Button
                onClick={handleDecimal}
                className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg"
                buttonKey="decimal"
              >
                .
              </Button>
              <Button
                onClick={handleEquals}
                className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg col-span-2"
                buttonKey="equals"
              >
                =
              </Button>
            </div>

            {/* Keyboard hint */}
            <div className="mt-4 text-center text-white/40 text-xs">
              Use keyboard for input • ESC to clear • Full scientific calculator
            </div>
          </div>

          {/* History Panel */}
          <div className="w-80">
            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">History</h3>
                <button
                  onClick={() => setState(prev => ({ ...prev, history: [] }))}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {state.history.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-8">
                    No calculations yet
                  </p>
                ) : (
                  state.history.map((entry, index) => (
                    <div
                      key={index}
                      className="text-white/80 text-sm p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => {
                        const result = entry.split(' = ')[1];
                        if (result) {
                          setState(prev => ({
                            ...prev,
                            currentValue: result,
                            waitingForNewValue: true
                          }));
                        }
                      }}
                    >
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;