const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let startTime = 0;
let elapsed = 0;
let running = false;
let frameId = null;
let lapCount = 0;

const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    const pad = (value, size) => String(value).padStart(size, "0");
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(centiseconds, 2)}`;
};

const render = () => {
    timeEl.textContent = formatTime(elapsed);
};

const tick = (timestamp) => {
    if (!running) return;
    elapsed = timestamp - startTime;
    render();
    frameId = requestAnimationFrame(tick);
};

const start = () => {
    if (running) return;
    startTime = performance.now() - elapsed;
    running = true;
    startBtn.textContent = "Pause";
    resetBtn.disabled = true;
    frameId = requestAnimationFrame(tick);
};

const pause = () => {
    running = false;
    startBtn.textContent = "Resume";
    resetBtn.disabled = false;
    if (frameId) cancelAnimationFrame(frameId);
};

const reset = () => {
    running = false;
    elapsed = 0;
    startBtn.textContent = "Start";
    resetBtn.disabled = false;
    if (frameId) cancelAnimationFrame(frameId);
    render();
};

const addLap = () => {
    if (!running) return;
    lapCount += 1;
    const item = document.createElement("li");
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = `Lap ${lapCount}`;
    const value = document.createElement("span");
    value.textContent = formatTime(elapsed);
    item.append(tag, value);
    lapsEl.prepend(item);
};

startBtn.addEventListener("click", () => {
    if (!running && elapsed > 0) {
        start();
    } else if (running) {
        pause();
    } else {
        start();
    }
});

resetBtn.addEventListener("click", reset);

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        event.preventDefault();
        running ? pause() : start();
    }
    if (event.key === "Escape") {
        reset();
    }
});

render();
