const displayEl = document.getElementById("display");
let expression = "0";

const render = () => {
	displayEl.textContent = expression || "0";
};

const clearAll = () => {
	expression = "0";
	render();
};

const deleteLast = () => {
	if (expression.length === 1) {
		expression = "0";
	} else {
		expression = expression.slice(0, -1);
	}
	render();
};

const appendNumber = (value) => {
	if (expression === "0") {
		expression = value;
		return render();
	}

	const lastNumber = expression.split(/[-+*/]/).pop();
	if (value === "." && lastNumber.includes(".")) return;

	expression += value;
	render();
};

const appendOperator = (op) => {
	if (!expression) return;
	if (/[-+*/]$/.test(expression)) {
		expression = expression.slice(0, -1) + op;
	} else {
		expression += op;
	}
	render();
};

const applyPercent = () => {
	const parts = expression.split(/([-+*/])/);
	const last = parts.pop();
	if (last === undefined || isNaN(Number(last))) return;
	const percentValue = String(Number(last) / 100);
	expression = parts.concat(percentValue).join("");
	render();
};

const evaluateExpression = () => {
	try {
		const clean = expression.replace(/[-+*/]$/, "");
		// eslint-disable-next-line no-new-func
		const result = Function(`"use strict"; return (${clean || 0})`)();
		expression = String(result ?? 0);
	} catch (error) {
		expression = "Error";
		setTimeout(clearAll, 900);
	}
	render();
};

const handleAction = (action) => {
	switch (action) {
		case "clear":
			return clearAll();
		case "delete":
			return deleteLast();
		case "equals":
			return evaluateExpression();
		case "percent":
			return applyPercent();
		default:
			return null;
	}
};

const handleButton = (button) => {
	const action = button.dataset.action;
	const value = button.dataset.value;

	if (action) return handleAction(action);
	if (value && /[0-9.]/.test(value)) return appendNumber(value);
	if (value && /[-+*/]/.test(value)) return appendOperator(value);
};

document.querySelectorAll(".keypad .pill").forEach((btn) => {
	btn.addEventListener("click", () => handleButton(btn));
});

document.addEventListener("keydown", (event) => {
	const { key } = event;

	if ((key >= "0" && key <= "9") || key === ".") {
		appendNumber(key);
	} else if (["+", "-", "*", "/"].includes(key)) {
		appendOperator(key);
	} else if (key === "Enter" || key === "=") {
		event.preventDefault();
		evaluateExpression();
	} else if (key === "Backspace") {
		deleteLast();
	} else if (key === "Escape") {
		clearAll();
	}
});

render();
