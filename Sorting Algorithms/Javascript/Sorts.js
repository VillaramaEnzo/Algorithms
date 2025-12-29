const sortArr = (arr) => {
    
    return arr.sort((a, b) => a - b);
    
}

// 6.1 Bubble Sort
const bubbleSort = (arr) => {
    
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
    
}

// 6.2 Quick Sort
const quickSort = (arr) => {
    
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(num => num < pivot);
    const middle = arr.filter(num => num === pivot);
    const right = arr.filter(num => num > pivot);
    return [...quickSort(left), ...middle, ...quickSort(right)];

}

// 6.3 Merge Sort
// Helper function for merge sort
const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const mergeSort = (arr) => {
    
    if (arr.length <= 1) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
    
}

// 6.4 Radix Sort
const radixSort = (arr) => {
    if (arr.length === 0) return arr;
    
    const max = Math.max(...arr.map(Math.abs));
    const maxDigits = max === 0 ? 1 : Math.floor(Math.log10(max)) + 1;
    
    for (let digit = 0; digit < maxDigits; digit++) {
        const buckets = Array.from({ length: 10 }, () => []);
        
        for (let i = 0; i < arr.length; i++) {
            const digitValue = Math.floor(Math.abs(arr[i]) / Math.pow(10, digit)) % 10;
            buckets[digitValue].push(arr[i]);
        }
        
        arr = [].concat(...buckets);
    }
    
    return arr;
}

// 6.5 Selection Sort
const selectionSort = (arr) => {
    
    for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (min !== i) {
            [arr[i], arr[min]] = [arr[min], arr[i]];
        }
    }

    return arr;
    
}

// 6.6 Insertion Sort
const insertionSort = (arr) => {
    
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// 6.7 Heap Sort
// Helper function for heap sort
const heapify = (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

const heapSort = (arr) => {
    // Build max heap
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, arr.length, i);
    }
    
    // Extract elements from heap
    for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    
    return arr;
}

// 6.8 Shell Sort
const shellSort = (arr) => {
    
    let gap = Math.floor(arr.length / 2);
    
    while (gap > 0) {
        for (let i = gap; i < arr.length; i++) {
            let temp = arr[i];
            let j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    
    return arr;
    
}