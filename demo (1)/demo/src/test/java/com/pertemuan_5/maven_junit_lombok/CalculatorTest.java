package com.pertemuan_5.maven_junit_lombok;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CalculatorTest {

    private final Calculator calculator = new Calculator();

    @Test
    public void testAddSuccess() {
        var result = calculator.add(10, 10);
        assertEquals(20, result);
    }

    @Test
    public void testAddNegative() {
        var result = calculator.add(-10, -5);
        assertEquals(-15, result);
    }

    @Test
    public void testAddZero() {
        var result = calculator.add(0, 0);
        assertEquals(0, result);
    }
}
