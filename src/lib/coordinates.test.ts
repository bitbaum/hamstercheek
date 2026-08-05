import { describe, expect, it } from "vitest";
import { formatCoordinates, isValidCoordinates, isValidLatitude, isValidLongitude } from "./coordinates";

describe("isValidLatitude", () => {
  it("accepts values within -90..90", () => {
    expect(isValidLatitude(0)).toBe(true);
    expect(isValidLatitude(-90)).toBe(true);
    expect(isValidLatitude(90)).toBe(true);
  });

  it("rejects values outside -90..90", () => {
    expect(isValidLatitude(90.1)).toBe(false);
    expect(isValidLatitude(-90.1)).toBe(false);
    expect(isValidLatitude(Number.NaN)).toBe(false);
  });
});

describe("isValidLongitude", () => {
  it("accepts values within -180..180", () => {
    expect(isValidLongitude(-180)).toBe(true);
    expect(isValidLongitude(180)).toBe(true);
  });

  it("rejects values outside -180..180", () => {
    expect(isValidLongitude(180.1)).toBe(false);
    expect(isValidLongitude(-180.1)).toBe(false);
  });
});

describe("isValidCoordinates", () => {
  it("requires both lat and lng to be valid", () => {
    expect(isValidCoordinates({ lat: 47.37, lng: 8.55 })).toBe(true);
    expect(isValidCoordinates({ lat: 200, lng: 8.55 })).toBe(false);
    expect(isValidCoordinates({ lat: 47.37, lng: 200 })).toBe(false);
  });
});

describe("formatCoordinates", () => {
  it("formats to 5 decimal places", () => {
    expect(formatCoordinates({ lat: 47.372, lng: 8.5417 })).toBe("47.37200, 8.54170");
  });
});
