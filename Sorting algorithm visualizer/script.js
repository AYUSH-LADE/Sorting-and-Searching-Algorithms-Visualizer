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

// ---------- Searching ----------
// Search generators yield {arr, compare, range, found, notFound}
//   compare  : indices being checked now
//   range    : [lo, hi] part of the array still in play (everything else is dimmed)
//   found    : index of the match
//   notFound : true when the search has finished without a match

function* linearSearch(a, target) {
  const arr = a.slice();
  for (let i = 0; i < arr.length; i++) {
    yield { arr, compare: [i] };
    if (arr[i] === target) { yield { arr, found: i }; return; }
  }
  yield { arr, notFound: true };
}

function* binarySearch(a, target) {
  const arr = a.slice();
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield { arr, compare: [mid], range: [lo, hi] };
    if (arr[mid] === target) { yield { arr, found: mid }; return; }
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  yield { arr, notFound: true };
}

function* fibonacciSearch(a, target) {
  const arr = a.slice();
  const n = arr.length;
  // smallest Fibonacci number >= n
  let fib2 = 0, fib1 = 1, fibM = fib2 + fib1;
  while (fibM < n) { fib2 = fib1; fib1 = fibM; fibM = fib2 + fib1; }
  let offset = -1; // everything up to and including offset is ruled out
  while (fibM > 1) {
    const i = Math.min(offset + fib2, n - 1);
    yield { arr, compare: [i], range: [offset + 1, Math.min(offset + fibM, n - 1)] };
    if (arr[i] < target) {
      // target is to the right: move the window up by one Fibonacci step
      fibM = fib1; fib1 = fib2; fib2 = fibM - fib1;
      offset = i;
    } else if (arr[i] > target) {
      // target is to the left: move the window down by two Fibonacci steps
      fibM = fib2; fib1 = fib1 - fib2; fib2 = fibM - fib1;
    } else {
      yield { arr, found: i };
      return;
    }
  }
  // one element may be left to check
  if (fib1 && offset + 1 < n) {
    yield { arr, compare: [offset + 1], range: [offset + 1, offset + 1] };
    if (arr[offset + 1] === target) { yield { arr, found: offset + 1 }; return; }
  }
  yield { arr, notFound: true };
}

function* sentinelSearch(a, target) {
  const arr = a.slice();
  const n = arr.length;
  const last = arr[n - 1];
  // put the target in the last slot as a sentinel so the loop needs no bounds check
  arr[n - 1] = target;
  yield { arr, swap: [n - 1] };
  let i = 0;
  while (true) {
    yield { arr, compare: [i] };
    if (arr[i] === target) break;
    i++;
  }
  // put the original last element back
  arr[n - 1] = last;
  yield { arr, swap: [n - 1] };
  if (i < n - 1 || last === target) yield { arr, found: i };
  else yield { arr, notFound: true };
}

// Hashing: chaining hash table, h(x) = floor(x) mod m
// Extra fields on the yielded state: table (array of buckets, each a list of array indices),
// bucket (bucket currently in focus)
function* hashSearch(a, target) {
  const arr = a.slice();
  const n = arr.length;
  const m = Math.max(3, Math.ceil(n / 3)) | 1; // odd table size
  const h = (v) => ((Math.floor(v) % m) + m) % m;
  const table = Array.from({ length: m }, () => []);
  const snap = () => table.map(b => b.slice());
  // phase 1: build the table, one element at a time
  for (let i = 0; i < n; i++) {
    const b = h(arr[i]);
    table[b].push(i);
    yield { arr, swap: [i], table: snap(), bucket: b, size: m };
  }
  // phase 2: jump straight to the target's bucket and scan only that chain
  const tb = h(target);
  yield { arr, table: snap(), bucket: tb, size: m };
  for (const idx of table[tb]) {
    yield { arr, compare: [idx], table: snap(), bucket: tb, size: m };
    if (arr[idx] === target) { yield { arr, found: idx, table: snap(), bucket: tb, size: m }; return; }
  }
  yield { arr, notFound: true, table: snap(), bucket: tb, size: m };
}

const sortAlgos = {
  bubble: { name: 'Bubble Sort', fn: bubbleSort },
  selection: { name: 'Selection Sort', fn: selectionSort },
  insertion: { name: 'Insertion Sort', fn: insertionSort },
  merge: { name: 'Merge Sort', fn: mergeSort },
  quick: { name: 'Quick Sort', fn: quickSort }
};

const searchAlgos = {
  linear: { name: 'Linear Search', fn: linearSearch, needsSorted: false },
  binary: { name: 'Binary Search', fn: binarySearch, needsSorted: true },
  fibonacci: { name: 'Fibonacci Search', fn: fibonacciSearch, needsSorted: true },
  sentinel: { name: 'Sentinel Search', fn: sentinelSearch, needsSorted: false },
  hashing: { name: 'Hashing', fn: hashSearch, needsSorted: false }
};

// Parses "5, 3 8;2" into numbers. Returns { values } or { error }.
function parseArray(text) {
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (parts.length === 0) return { error: 'Enter at least 2 numbers.' };
  const values = [];
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isFinite(v)) return { error: `"${p}" is not a number.` };
    values.push(v);
  }
  if (values.length < 2) return { error: 'Enter at least 2 numbers.' };
  if (values.length > 100) return { error: `Too many values (${values.length}). Maximum is 100.` };
  return { values };
}

// ---------- UI ----------

// @@UI@@

let mode = 'sort';
let array = [];
const $ = (id) => document.getElementById(id);
const barsEl = $('bars'), legendEl = $('legend');
const sizeInput = $('size'), speedInput = $('speed'), algoSelect = $('algo');
const playBtn = $('playBtn'), pauseBtn = $('pauseBtn'), shuffleBtn = $('shuffleBtn');
const statusEl = $('status');
const statCompares = $('statCompares'), statSwaps = $('statSwaps'), statSteps = $('statSteps');
const resultStat = $('resultStat'), statResult = $('statResult');
const arrayInput = $('arrayInput'), useArrayBtn = $('useArrayBtn'), arrayError = $('arrayError');
const targetField = $('targetField'), targetInput = $('targetInput'), targetError = $('targetError');
const tabs = document.querySelectorAll('.tab');

let generator = null;
let running = false;
let paused = false;
let compares = 0, swaps = 0, steps = 0;
let animHandle = null;
let lastState = null;

function randomArray(n) {
  return Array.from({length: n}, () => Math.floor(Math.random() * 95) + 5);
}

function renderBars(state) {
  const { arr, compare = [], swap = [], pivot = [], sorted = [], range = null, found = null } = state;
  barsEl.innerHTML = '';
  barsEl.classList.toggle('labels', arr.length <= 30);
  barsEl.classList.toggle('tight', arr.length > 18);
  const max = Math.max(...arr), min = Math.min(...arr);
  arr.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    if (sorted.includes(i)) bar.classList.add('sorted');
    if (compare.includes(i)) bar.classList.add('compare');
    if (swap.includes(i)) bar.classList.add('swap');
    if (pivot.includes(i)) bar.classList.add('pivot');
    if (found === i) bar.classList.add('found');
    if (range && (i < range[0] || i > range[1])) bar.classList.add('dim');
    // all-positive arrays keep true proportions; otherwise scale min..max onto 8%..100%
    let h = min >= 0 ? (max === 0 ? 8 : v / max * 100) : (max === min ? 50 : 8 + (v - min) / (max - min) * 92);
    bar.style.height = Math.max(h, 3) + '%';
    const label = document.createElement('span');
    label.className = 'val';
    label.textContent = v;
    bar.appendChild(label);
    barsEl.appendChild(bar);
  });
}

const hashEl = $('hashTable');

function renderHash(state) {
  if (!state || !state.table) { hashEl.hidden = true; hashEl.innerHTML = ''; return; }
  const { arr, table, bucket, compare = [], swap = [], found = null } = state;
  hashEl.hidden = false;
  hashEl.innerHTML = '<div class="hash-title">HASH TABLE &nbsp;·&nbsp; h(x) = floor(x) mod ' + table.length + '</div><div class="hash-grid">' +
    table.map((chain, b) => {
      const chips = chain.map(idx => {
        let cls = 'chip';
        if (found === idx) cls += ' hit';
        else if (compare.includes(idx)) cls += ' cmp';
        else if (swap.includes(idx)) cls += ' new';
        return `<span class="${cls}">${arr[idx]}</span>`;
      }).join('');
      return `<div class="bucket${b === bucket ? ' active' : ''}"><div class="bidx">${b}</div><div class="chain">${chips}</div></div>`;
    }).join('') + '</div>';
}

function renderLegend() {
  const items = mode === 'sort'
    ? [['--bar-default', 'unsorted'], ['--bar-compare', 'comparing'], ['--bar-swap', 'swapping'], ['--bar-pivot', 'pivot'], ['--bar-sorted', 'sorted']]
    : [['--bar-default', 'in play'], ['--bar-compare', 'checking'], ['--bar-swap', 'sentinel / inserting'], ['--bar-sorted', 'found']];
  legendEl.innerHTML = items
    .map(([v, t]) => `<span><i class="dot" style="background:var(${v})"></i>${t}</span>`)
    .join('') + (mode === 'search' ? '<span><i class="dot" style="background:var(--bar-default);opacity:.25"></i>ruled out</span>' : '');
}

function resetStats() {
  compares = 0; swaps = 0; steps = 0;
  statCompares.textContent = 0;
  statSwaps.textContent = 0;
  statSteps.textContent = 0;
  statResult.textContent = '–';
}

function setControlsLocked(locked) {
  sizeInput.disabled = locked;
  algoSelect.disabled = locked;
  arrayInput.disabled = locked;
  useArrayBtn.disabled = locked;
  targetInput.disabled = locked;
  tabs.forEach(t => t.disabled = locked);
}

function actionLabel() { return mode === 'sort' ? 'Sort' : 'Search'; }

function resetStage() {
  if (animHandle) clearTimeout(animHandle);
  generator = null;
  running = false;
  paused = false;
  lastState = null;
  resetStats();
  renderBars({ arr: array });
  renderHash(null);
  statusEl.textContent = 'idle';
  playBtn.textContent = actionLabel();
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  setControlsLocked(false);
}

function syncArrayInput() {
  arrayInput.value = array.join(', ');
  arrayError.textContent = '';
}

function useRandomArray() {
  array = randomArray(parseInt(sizeInput.value));
  syncArrayInput();
  resetStage();
}

function useTypedArray() {
  const parsed = parseArray(arrayInput.value);
  if (parsed.error) { arrayError.textContent = parsed.error; return false; }
  arrayError.textContent = '';
  array = parsed.values;
  resetStage();
  return true;
}

function populateAlgos() {
  const list = mode === 'sort' ? sortAlgos : searchAlgos;
  algoSelect.innerHTML = Object.entries(list)
    .map(([k, a]) => `<option value="${k}">${a.name}</option>`).join('');
}

function setMode(m) {
  mode = m;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === m));
  targetField.hidden = m !== 'search';
  resultStat.hidden = m !== 'search';
  statSwaps.parentElement.hidden = m !== 'sort';
  targetError.textContent = '';
  populateAlgos();
  renderLegend();
  resetStage();
}

function isSorted(a) {
  for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
  return true;
}

function finish(text) {
  running = false;
  paused = false;
  playBtn.textContent = actionLabel();
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  statusEl.textContent = text;
  setControlsLocked(false);
}

function step() {
  if (!running || paused) return;
  const result = generator.next();
  if (result.done) {
    if (mode === 'sort') {
      renderBars({ arr: array, sorted: array.map((_, i) => i) });
      finish('sorted');
    } else {
      finish(lastState && lastState.found !== undefined
        ? `found at index ${lastState.found}`
        : 'not found');
    }
    return;
  }
  const state = result.value;
  lastState = state;
  array = state.arr;
  steps++;
  if (state.compare) compares++;
  if (state.swap) swaps++;
  statCompares.textContent = compares;
  statSwaps.textContent = swaps;
  statSteps.textContent = steps;
  if (mode === 'search') {
    if (state.found !== undefined) statResult.textContent = state.found;
    else if (state.notFound) statResult.textContent = 'none';
  }
  renderBars(state);
  renderHash(state);

  const speed = parseInt(speedInput.value); // 1-100, higher = faster
  const delay = Math.max(2, 240 - speed * 2.3);
  animHandle = setTimeout(step, delay);
}

playBtn.addEventListener('click', () => {
  if (paused) {
    paused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    statusEl.textContent = mode === 'sort' ? 'sorting…' : 'searching…';
    step();
    return;
  }

  // pick up whatever is currently typed in the array box
  if (!useTypedArray()) return;

  if (mode === 'sort') {
    generator = sortAlgos[algoSelect.value].fn(array);
    statusEl.textContent = 'sorting…';
  } else {
    const raw = targetInput.value.trim();
    const target = Number(raw);
    if (raw === '' || !Number.isFinite(target)) {
      targetError.textContent = 'Enter the number you want to find.';
      return;
    }
    targetError.textContent = '';
    const algo = searchAlgos[algoSelect.value];
    let note = '';
    if (algo.needsSorted && !isSorted(array)) {
      array = array.slice().sort((x, y) => x - y);
      syncArrayInput();
      note = `${algo.name} needs sorted input, so the array was sorted first. `;
    }
    renderBars({ arr: array });
    generator = algo.fn(array, target);
    statusEl.textContent = 'searching…';
    if (note) { arrayError.style.color = 'var(--muted)'; arrayError.textContent = note.trim(); }
  }

  running = true;
  paused = false;
  lastState = null;
  resetStats();
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  setControlsLocked(true);
  step();
});

pauseBtn.addEventListener('click', () => {
  paused = true;
  if (animHandle) clearTimeout(animHandle);
  playBtn.disabled = false;
  playBtn.textContent = 'Resume';
  pauseBtn.disabled = true;
  statusEl.textContent = 'paused';
});

shuffleBtn.addEventListener('click', useRandomArray);
useArrayBtn.addEventListener('click', useTypedArray);
arrayInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') useTypedArray(); });
arrayInput.addEventListener('input', () => { arrayError.style.color = ''; });
targetInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !playBtn.disabled) playBtn.click(); });

sizeInput.addEventListener('input', () => {
  $('sizeOut').textContent = sizeInput.value;
  useRandomArray();
});

speedInput.addEventListener('input', () => {
  $('speedOut').textContent = speedInput.value;
});

tabs.forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

populateAlgos();
renderLegend();
array = randomArray(parseInt(sizeInput.value));
syncArrayInput();
resetStage();
