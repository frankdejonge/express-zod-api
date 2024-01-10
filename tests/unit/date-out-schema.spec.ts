import { z } from "zod";
import { getMeta } from "../../src/metadata";
import { ez } from "../../src";
import { describe, expect, test } from "vitest";

describe("ez.dateOut()", () => {
  describe("creation", () => {
    test("should create an instance", () => {
      const schema = ez.dateOut();
      expect(schema).toBeInstanceOf(z.ZodEffects);
      expect(getMeta(schema, "kind")).toEqual("DateOut");
    });
  });

  describe("parsing", () => {
    test("should handle wrong parsed type", () => {
      const schema = ez.dateOut();
      const result = schema.safeParse("12.01.2022");
      expect(result.success).toBeFalsy();
      if (!result.success) {
        expect(result.error.issues).toEqual([
          {
            code: "invalid_type",
            expected: "date",
            message: "Expected date, received string",
            path: [],
            received: "string",
          },
        ]);
      }
    });

    test("should accept valid date", () => {
      const schema = ez.dateOut();
      const result = schema.safeParse(new Date("2022-12-31"));
      expect(result).toEqual({
        success: true,
        data: "2022-12-31T00:00:00.000Z",
      });
    });

    test("should handle invalid date", () => {
      const schema = ez.dateOut();
      const result = schema.safeParse(new Date("2022-01-32"));
      expect(result.success).toBeFalsy();
      if (!result.success) {
        expect(result.error.issues).toEqual([
          {
            code: "invalid_date",
            message: "Invalid date",
            path: [],
          },
        ]);
      }
    });
  });
});
