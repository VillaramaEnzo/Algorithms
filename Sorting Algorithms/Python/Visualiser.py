import pygame
import pygame_textinput
import random
import math


pygame.init()

class Visualiser:
    
    # Defining Class Variables ~ Key variables that are re-used throughout the project
    BLK = 0, 0, 0
    WHT = 255, 255, 255
    GRN = 0, 255, 0
    RED = 255, 0, 0
    BLU = 0, 0, 255
    BG = WHT
    
    GRADIENT = [
        (119, 170, 255),
        (153, 204, 255),
        (187, 238, 255)
    ]
    SIDE_PAD = 100
    TOP_PAD = 150
    
    FONT = pygame.font.SysFont("Roboto", 20)
    HEADING_FONT = pygame.font.SysFont("Roboto", 36)
    
    def __init__(self, width, height, lst):
        
        # Intiliase Window Dimensions
        self.width = width
        self.height = height
        
        # Window Information
        self.window = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Sorting Algorithm Visualiser")
       
       # Initialise List
        self.set_list(lst)
        
        # Adjusted position of input_rect
        self.input_rect = pygame.Rect(self.width - 200, 72, 140, 32)
        self.input_active = False
        self.input_text = ''

    def set_list(self, lst):
    
        self.lst = lst
        self.max_val = max(lst)
        self.min_val = min(lst)
        
        self.block_width = round((self.width - self.SIDE_PAD) / len(lst))
        self.block_height = math.floor((self.height - self.TOP_PAD) / (self.max_val - self.min_val))
        self.start_x = self.SIDE_PAD // 2

    def handle_input_events(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.input_rect.collidepoint(event.pos):
                self.input_active = True
            else:
                self.input_active = False
        if event.type == pygame.KEYDOWN:
            if self.input_active:
                if event.key == pygame.K_RETURN:
                    try:
                        n = int(self.input_text)
                        if 10 <= n <= 1000:
                            return n
                    except ValueError:
                        pass
                    self.input_text = ''
                elif event.key == pygame.K_BACKSPACE:
                    self.input_text = self.input_text[:-1]
                else:
                    self.input_text += event.unicode
        return None

def draw(draw_info, algo_name, ascending):
    
    draw_info.window.fill(draw_info.BG)
    
    headerY = 20
    header = draw_info.HEADING_FONT.render("Control Panel", 1, draw_info.BLK)
    draw_info.window.blit(header, (draw_info.start_x, headerY))
    
    txt = ["TAB | Reset", "SPACE | Start Sorting", "< | Ascending", "> | Descending"]
    textY = headerY + 32
    
    for i in range(len(txt)):
        
        t = draw_info.FONT.render(txt[i], 1, draw_info.BLK)
        draw_info.window.blit(t, (draw_info.start_x, textY))
        textY += 14
    
    sorts = ["B | Bubble", "I | Insertion", "M | Merge", "R | Radix", "S | Selection", "Q | Quick"]
    sortsX = draw_info.start_x + 300
    sortsY = 20
    
    sort = draw_info.HEADING_FONT.render("Sorts", 1, draw_info.BLK)
    draw_info.window.blit(sort,(sortsX, sortsY))
    
    sortsY += 32
    
    for j in range(len(sorts)):
        t = draw_info.FONT.render(sorts[j], 1, draw_info.BLK)
        draw_info.window.blit(t, (sortsX, sortsY))
        sortsY += 14
    
    
    titleX = sortsX + 300
    titleY = 20
    
    title = draw_info.HEADING_FONT.render(f"{algo_name} - {'Ascending' if ascending else 'Descending'}", 1, draw_info.BLK)
    draw_info.window.blit(title, (titleX, titleY))
    
    # Draw input box
    pygame.draw.rect(draw_info.window, draw_info.BLK, draw_info.input_rect, 2)
    input_surface = draw_info.FONT.render(draw_info.input_text, True, draw_info.BLK)
    draw_info.window.blit(input_surface, (draw_info.input_rect.x + 5, draw_info.input_rect.y + 5))

    input_label = draw_info.FONT.render("Enter list size (10-1000):", True, draw_info.BLK)
    draw_info.window.blit(input_label, (draw_info.width - 200, 52))

    draw_lst(draw_info)
    pygame.display.update()

def draw_lst(draw_info, colour_postions = {}, clear_bg = False):
    
    lst = draw_info.lst
    
    if clear_bg:
        clear_rect = (draw_info.SIDE_PAD // 2, draw_info.TOP_PAD,
                            draw_info.width - draw_info.SIDE_PAD,
                            draw_info.height - draw_info.TOP_PAD)
        
        pygame.draw.rect(draw_info.window, draw_info.BG, clear_rect)
        
    for i, val in enumerate(lst):
        
        x = draw_info.start_x + i * draw_info.block_width
        y = draw_info.height - (val - draw_info.min_val) * draw_info.block_height
        
        colour = draw_info.GRADIENT[i % 3]
        
        if i in colour_postions:
            colour = colour_postions[i]
        
        pygame.draw.rect(draw_info.window, colour, (x, y, draw_info.block_width, draw_info.height))
    
    if clear_bg:
        pygame.display.update()
    
def generate_list(n, min_val, max_val):
    
    lst = []
    
    for _ in range(n):
        
        val = random.randint(min_val, max_val)
        lst.append(val)
    
    return lst


def bubble_sort(draw_info, ascending = True):
    
    lst = draw_info.lst
    
    for i in range(len(lst) - 1):
        
        for j in range(len(lst) - 1 - i):
            
            num1 = lst[j]
            num2 = lst[j + 1]
            
            if (num1 > num2 and ascending) or (num1 < num2 and not ascending):
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
                draw_lst(draw_info, {j: draw_info.GRN, j + 1: draw_info.RED}, True)
                yield True
            
    return lst

def insertion_sort(draw_info, ascending = True):
     
    lst = draw_info.lst
    for i in range(1, len(lst)):
        current = lst[i]
         
        while True:
            
             asc_sort = i > 0 and lst[i - 1] > current and ascending
             desc_sort = i > 0 and lst[i - 1] < current and not ascending
             
             if not asc_sort and not desc_sort:
                 break
            
             lst[i] = lst[i - 1]
             i = i - 1
             lst[i] = current
             draw_lst(draw_info, {i: draw_info.GRN, i - 1:  draw_info.RED}, True)
             yield True

    return lst
         
def merge_sort(draw_info, ascending=True):
    def merge(arr, start, mid, end):
        left = arr[start:mid]
        right = arr[mid:end]
        i, j, k = 0, 0, start

        while i < len(left) and j < len(right):
            if (left[i] <= right[j]) == ascending:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
            draw_lst(draw_info, {k-1: draw_info.GRN, start: draw_info.RED, end-1: draw_info.BLU}, True)
            yield True

        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
            draw_lst(draw_info, {k-1: draw_info.GRN, start: draw_info.RED, end-1: draw_info.BLU}, True)
            yield True

        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
            draw_lst(draw_info, {k-1: draw_info.GRN, start: draw_info.RED, end-1: draw_info.BLU}, True)
            yield True

    def merge_sort_recursive(arr, start, end):
        if end - start > 1:
            mid = (start + end) // 2
            yield from merge_sort_recursive(arr, start, mid)
            yield from merge_sort_recursive(arr, mid, end)
            yield from merge(arr, start, mid, end)

    lst = draw_info.lst
    yield from merge_sort_recursive(lst, 0, len(lst))
    draw_lst(draw_info, {}, True)
    return lst

def quick_sort(draw_info, ascending=True):
    def partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if (arr[j] <= pivot) == ascending:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                draw_lst(draw_info, {i: draw_info.GRN, j: draw_info.RED, high: draw_info.BLU}, True)
                yield True
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        draw_lst(draw_info, {i + 1: draw_info.GRN, high: draw_info.BLU}, True)
        yield True
        return i + 1

    def quick_sort_recursive(arr, low, high):
        if low < high:
            pi = yield from partition(arr, low, high)
            yield from quick_sort_recursive(arr, low, pi - 1)
            yield from quick_sort_recursive(arr, pi + 1, high)

    lst = draw_info.lst
    yield from quick_sort_recursive(lst, 0, len(lst) - 1)
    draw_lst(draw_info, {}, True)
    return lst

def selection_sort(draw_info, ascending=True):
    lst = draw_info.lst

    for i in range(len(lst)):
        extreme_index = i
        for j in range(i + 1, len(lst)):
            if (lst[j] < lst[extreme_index]) == ascending:
                extreme_index = j
            draw_lst(draw_info, {i: draw_info.RED, j: draw_info.BLU, extreme_index: draw_info.GRN}, True)
            yield True
        
        if extreme_index != i:
            lst[i], lst[extreme_index] = lst[extreme_index], lst[i]
            draw_lst(draw_info, {i: draw_info.GRN, extreme_index: draw_info.RED}, True)
            yield True

    draw_lst(draw_info, {}, True)
    return lst

def radix_sort(draw_info, ascending=True):

    pass

def main():
    
    run = True
    clock = pygame.time.Clock()

    n = 10
    min_val = 1
    max_val = 50
    
    lst = generate_list(n, min_val, max_val)
    
    draw_info = Visualiser(1000, 800, lst)
    
    sorting = False
    ascending = True
    
    sorting_algorithm = bubble_sort
    sorting_algo_name = "Bubble Sort"
    sorting_algo_gen = None
    
    while run:
        clock.tick(100)
        
        if sorting:
            try:
                next(sorting_algo_gen)
            
            except StopIteration:
                sorting = False
        
        else: 
            draw(draw_info, sorting_algo_name, ascending)
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
            
            new_n = draw_info.handle_input_events(event)
            if new_n:
                n = new_n
                lst = generate_list(n, min_val, max_val)
                draw_info = Visualiser(1000, max(800, n * 4 + 200), lst)
                sorting = False
            
            if event.type != pygame.KEYDOWN: 
                continue
            
            if event.key == pygame.K_TAB:
                lst = generate_list(n, min_val, max_val)
                draw_info.set_list(lst)
                sorting = False
            
            # Change this to a toggle to pause sorting
            elif event.key == pygame.K_SPACE and sorting == False:
                sorting = True
                sorting_algo_gen = sorting_algorithm(draw_info, ascending)
            
            elif event.key == pygame.K_COMMA and not sorting:
                ascending = True
            
            elif event.key == pygame.K_PERIOD and not sorting:
                ascending = False
            
            elif event.key == pygame.K_b and not sorting:
                sorting_algorithm = bubble_sort
                sorting_algo_name = "Bubble Sort"
            
            elif event.key == pygame.K_i and not sorting:
                sorting_algorithm = insertion_sort
                sorting_algo_name = "Insertion Sort"
            
            elif event.key == pygame.K_m and not sorting:
                sorting_algorithm = merge_sort
                sorting_algo_name = "Merge Sort"
                
            elif event.key == pygame.K_r and not sorting:
                sorting_algorithm = radix_sort
                sorting_algo_name = "*Radix Sort"
            
            elif event.key == pygame.K_s and not sorting:
                sorting_algorithm = selection_sort
                sorting_algo_name = "Selection Sort"
            
            elif event.key == pygame.K_q and not sorting:
                sorting_algorithm = quick_sort
                sorting_algo_name = "Quick Sort"
            
            
    pygame.quit()
            
            
if __name__ == "__main__":
    
    main()