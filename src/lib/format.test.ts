import { test } from "node:test";
import assert from "node:assert/strict";
import { formatXlm, parseXlm, short, stroopsFromDecimal } from "./format.ts";

test("parseXlm acepta enteros y hasta 7 decimales, con punto o coma", () => {
  assert.equal(parseXlm("1"), 10_000_000n);
  assert.equal(parseXlm("1.5"), 15_000_000n);
  assert.equal(parseXlm("1,5"), 15_000_000n);
  assert.equal(parseXlm(" 0.0000001 "), 1n);
  assert.equal(parseXlm("100"), 1_000_000_000n);
  assert.equal(parseXlm("0"), 0n);
});

test("parseXlm rechaza lo que no es un monto, en vez de reinterpretarlo", () => {
  for (const input of ["", " ", "-1", "-0.5", "1e3", "1,5,3", "1.2.3", "1.000,50", "0.00000001", "abc", "1.", ".5", "+1"]) {
    assert.equal(parseXlm(input), null, `debería rechazar ${JSON.stringify(input)}`);
  }
});

test("stroopsFromDecimal lee saldos de Horizon sin perder precisión", () => {
  assert.equal(stroopsFromDecimal("9999.9999800"), 99_999_999_800n);
  assert.equal(stroopsFromDecimal("17.6433026"), 176_433_026n);
  assert.equal(stroopsFromDecimal("10000"), 100_000_000_000n);
  assert.equal(stroopsFromDecimal("-0.5"), -5_000_000n);
  assert.throws(() => stroopsFromDecimal("1e3"));
  assert.throws(() => stroopsFromDecimal("1.12345678"));
});

test("formatXlm usa coma decimal y punto de miles", () => {
  assert.equal(formatXlm(10_000_000n), "1");
  assert.equal(formatXlm(15_000_000n), "1,5");
  assert.equal(formatXlm(176_433_026n), "17,6433026");
  assert.equal(formatXlm(100_000_000_000n), "10.000");
  assert.equal(formatXlm(1n), "0,0000001");
  assert.equal(formatXlm(0n), "0");
});

test("formatXlm maneja el signo", () => {
  assert.equal(formatXlm(-5_000_000n), "-0,5");
  assert.equal(formatXlm(-15_000_000n), "-1,5");
});

test("formatXlm redondea al pedir menos decimales", () => {
  assert.equal(formatXlm(176_433_026n, 2), "17,64");
  assert.equal(formatXlm(109_140n, 3), "0,011");
  assert.equal(formatXlm(7_567n, 5), "0,00076");
  assert.equal(formatXlm(99_999_999_800n, 4), "10.000");
  assert.equal(formatXlm(99_999_950_000n, 4), "9.999,995");
});

test("short abrevia direcciones", () => {
  assert.equal(short("GAAAGOVI3UD4E3BF4YG5EKEP7B36UG26YN6M2FOSC3LM5W37QFNN6SKK"), "GAAA…6SKK");
});
