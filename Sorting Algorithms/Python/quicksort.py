import random


def quick_sort(lst, ascending = True):
    
    if len(lst) <= 1:
        return lst
    
    else:
        
        if ascending == True:
        
            pivot = lst[0]
    
            left = [x for x in lst[1 : ] if x < pivot]
            right = [x for x in lst[1 : ] if x >= pivot]
    
            return quick_sort(left, True) + [pivot] + quick_sort(right, True)
        
        else:
            
            pivot = lst[0]
    
            left = [x for x in lst[1 : ] if x > pivot]
            right = [x for x in lst[1 : ] if x <= pivot]
    
            return quick_sort(left, False) + [pivot] + quick_sort(right, False)
        
def generate_list(n, minVal, maxVal):
    
    lst = []
    
    for _ in range(n):
        val = random.randint(minVal, maxVal)
        lst.append(val)
    
    return lst

def main():
    
    n1 = int(input("How many numbers in the array? "))
    n2 = int(input("Determine highest possible value in the array? "))
    
    sort = input("Sort Ascending or Descending (A or D)? ")
    
    ascending = True
    
    if sort.lower() == "d":
        ascending = False
    
    n, minVal, maxVal = n1, 0, n2
    lst = generate_list(n, minVal, maxVal)
    
    print(f"Unsorted list: {lst}")
    print(f"Sorted list: {quick_sort(lst, ascending)}")
    
if __name__ == "__main__":
    main()