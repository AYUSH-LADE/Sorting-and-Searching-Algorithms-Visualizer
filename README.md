<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:14161c,100:4c5d73&height=180&section=header&text=Sorting%20Algorithms%20Visualizer&fontSize=38&fontColor=e7e9ee&animation=fadeIn&fontAlignY=40&desc=A%20real-time%20visualizer%20for%20classic%20sorting%20algorithms&descAlignY=60&descSize=16" width="100%"/>

![vanilla js](https://img.shields.io/badge/vanilla-JS-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![dependencies](https://img.shields.io/badge/dependencies-0-black?style=flat-square)
![status](https://img.shields.io/badge/status-stable-brightgreen?style=flat-square)

</div>

---

## Overview

A lightweight, single-purpose visualizer for understanding how sorting algorithms behave — not just their Big-O notation, but the actual sequence of comparisons and swaps they perform on an array. Built with plain HTML, CSS, and JavaScript generator functions. No frameworks, no build step, no dependencies.

**Live demo:** [AYUSH-LADE.github.io/Sorting-Algorithms-Visualizer](https://AYUSH-LADE.github.io/Sorting-Algorithms-Visualizer/)

<div align="center">
<img src="https://skillicons.dev/icons?i=html,css,js&theme=dark" />
</div>

## Features

- **Live state visualization** — comparing, swapping, pivot, and sorted states, color-coded
- **Five algorithms** — Bubble, Selection, Insertion, Merge, Quick
- **Adjustable speed and array size** — from step-by-step inspection to full-speed runs
- **Live metrics** — comparisons, swaps, and total steps tracked in real time
- **Zero dependencies** — one HTML file, one stylesheet, one script

## Algorithms

| Algorithm | Time Complexity (avg) | Space | Stable |
|---|:---:|:---:|:---:|
| Bubble Sort | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(1) | No |
| Insertion Sort | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(log n) | No |

## Getting started

No installation required.

```bash
git clone https://github.com/AYUSH-LADE/Sorting-Algorithms-Visualizer.git
cd Sorting-Algorithms-Visualizer
open index.html
```

## Project structure

```
Sorting-Algorithms-Visualizer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Usage

1. Select an algorithm from the dropdown
2. Adjust array size and speed as needed
3. Press **Sort** to run, **Pause** to inspect a specific state, **New array** to reset
4. Live stats update alongside the visualization

## Color key

| State | Color |
|---|---|
| Unsorted | Slate |
| Comparing | Amber |
| Swapping | Red |
| Pivot | Blue |
| Sorted | Green |

## Roadmap

- [ ] Heap Sort and Radix Sort
- [ ] Side-by-side algorithm comparison mode
- [ ] Big-O complexity display alongside live stats

## Author

**Ayush Lade**
[GitHub](https://github.com/AYUSH-LADE)

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4c5d73,100:14161c&height=100&section=footer"/>
</div>
