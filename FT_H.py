# Floyd's Tortoise & Hare Algorithm
# This algorithm is used to find whether a loop exists in a linked list


def findDuplicate(nums):

    tortoise = nums[0]
    hare = nums[0]

    while True:
        tortoise = nums[tortoise]
        hare = nums[nums[hare]]

        if tortoise == hare:
            break

    ptr1 = nums[0]
    ptr2 = tortoise

    while ptr1 != ptr2:
        ptr1 = nums[ptr1]
        ptr2 = nums[ptr2]

    return ptr1


print(findDuplicate([4, 3, 3, 2, 3]))
