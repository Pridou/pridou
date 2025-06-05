fun recursive(a, b) {
    ret recursive(a + 10, b);
}

recursive(20, 10);