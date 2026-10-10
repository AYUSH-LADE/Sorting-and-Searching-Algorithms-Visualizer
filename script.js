let array = [];
let barsEl = document.getElementById('bars');
let sizeInput = document.getElementById('size');
let speedInput = document.getElementById('speed');
let algoSelect = document.getElementById('algo');
let playBtn = document.getElementById('playBtn');
let pauseBtn = document.getElementById('pauseBtn');
let shuffleBtn = document.getElementById('shuffleBtn');
let statusEl = document.getElementById('status');
let statCompares = document.getElementById('statCompares');
let statSwaps = document.getElementById('statSwaps');
let statSteps = document.getElementById('statSteps');

let generator = null;
let running = false;
let paused = false;
let compares = 0, swaps = 0, steps = 0;
let animHandle = null;

function randomArray(n) {
  return Array.from({length: n}, () => Math.floor(Math.random() * 95) + 5);
}

function renderBars(state) {
  const { arr, compare = [], swap = [], pivot = [], sorted = [] } = state;
  barsEl.innerHTML = '';
  const max = Math.max(...arr);
  arr.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    if (sorted.includes(i)) bar.classList.add('sorted');
    if (compare.includes(i)) bar.classList.add('compare');
    if (swap.includes(i)) bar.classList.add('swap');
    if (pivot.includes(i)) bar.classList.add('pivot');
    bar.style.height = (v / max * 100) + '%';
    barsEl.appendChild(bar);
  });
}

function resetStage() {
  array = randomArray(parseInt(sizeInput.value));
  renderBars({ arr: array });
  compares = 0; swaps = 0; steps = 0;
  statCompares.textContent = 0;
  statSwaps.textContent = 0;
  statSteps.textContent = 0;
  statusEl.textContent = 'idle';
  generator = null;
  running = false;
  paused = false;
  playBtn.textContent = 'Sort';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  if (animHandle) clearTimeout(animHandle);
}

// Generators yield {arr, compare, swap, pivot, sorted}

function* bubbleSort(a) {
  const arr = a.slice();
  const n = arr.length;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { arr, compare: [j, j + 1], sorted: sorted.slice() };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedAny = true;
        yield { arr, swap: [j, j + 1], sorted: sorted.slice() };
      }
    }
    sorted.unshift(n - i - 1);
    if (!swappedAny) break;
  }
  yield { arr, sorted: arr.map((_, i) => i) };
}

function* selectionSort(a) {
  const arr = a.slice();
  const n = arr.length;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { arr, compare: [minIdx, j], sorted: sorted.slice() };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { arr, swap: [i, minIdx], sorted: sorted.slice() };
    }
    sorted.push(i);
  }
  yield { arr, sorted: arr.map((_, i) => i) };
}

function* insertionSort(a) {
  const arr = a.slice();
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { arr, compare: [j - 1, j], sorted: Array.from({length: i}, (_, k) => k) };
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        yield { arr, swap: [j - 1, j], sorted: Array.from({length: i}, (_, k) => k) };
        j--;
      } else break;
    }
  }
  yield { arr, sorted: arr.map((_, i) => i) };
}

function* mergeSort(a) {
  const arr = a.slice();
  function* sortRange(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* sortRange(lo, mid);
    yield* sortRange(mid, hi);
    const left = arr.slice(lo, mid);
    const right = arr.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      yield { arr, compare: [lo + i, mid + j] };
      if (left[i] <= right[j]) { arr[k] = left[i]; i++; }
      else { arr[k] = right[j]; j++; }
      yield { arr, swap: [k] };
      k++;
    }
    while (i < left.length) { arr[k] = left[i]; yield { arr, swap: [k] }; i++; k++; }
    while (j < right.length) { arr[k] = right[j]; yield { arr, swap: [k] }; j++; k++; }
  }
  yield* sortRange(0, arr.length);
  yield { arr, sorted: arr.map((_, i) => i) };
}

function* quickSort(a) {
  const arr = a.slice();
  function* sortRange(lo, hi) {
    if (lo >= hi) return;
    const pivotVal = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      yield { arr, compare: [j, hi], pivot: [hi] };
      if (arr[j] < pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { arr, swap: [i, j], pivot: [hi] };
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    yield { arr, swap: [i + 1, hi] };
    yield* sortRange(lo, i);
    yield* sortRange(i + 2, hi);
  }
  yield* sortRange(0, arr.length - 1);
  yield { arr, sorted: arr.map((_, i) => i) };
}

const algos = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort
};

function step() {
  if (!running || paused) return;
  const result = generator.next();
  if (result.done) {
    running = false;
    playBtn.textContent = 'Sort';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    statusEl.textContent = 'sorted';
    renderBars({ arr: array, sorted: array.map((_, i) => i) });
    return;
  }
  const state = result.value;
  array = state.arr;
  steps++;
  if (state.compare) compares++;
  if (state.swap) swaps++;
  statCompares.textContent = compares;
  statSwaps.textContent = swaps;
  statSteps.textContent = steps;
  renderBars(state);

  const speed = parseInt(speedInput.value); // 1-100, higher = faster
  const delay = Math.max(2, 240 - speed * 2.3);
  animHandle = setTimeout(step, delay);
}

playBtn.addEventListener('click', () => {
  if (paused) {
    paused = false;
    playBtn.textContent = 'Sort';
    pauseBtn.disabled = false;
    statusEl.textContent = 'sorting…';
    step();
    return;
  }
  generator = algos[algoSelect.value](array);
  running = true;
  paused = false;
  compares = 0; swaps = 0; steps = 0;
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  sizeInput.disabled = true;
  algoSelect.disabled = true;
  statusEl.textContent = 'sorting…';
  step();
});

pauseBtn.addEventListener('click', () => {
  paused = true;
  if (animHandle) clearTimeout(animHandle);
  playBtn.disabled = false;
  playBtn.textContent = 'Resume';
  statusEl.textContent = 'paused';
});

shuffleBtn.addEventListener('click', () => {
  sizeInput.disabled = false;
  algoSelect.disabled = false;
  resetStage();
});

sizeInput.addEventListener('input', () => {
  document.getElementById('sizeOut').textContent = sizeInput.value;
  resetStage();
});

speedInput.addEventListener('input', () => {
  document.getElementById('speedOut').textContent = speedInput.value;
});

resetStage();