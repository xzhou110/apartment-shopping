import { describe, it, expect } from 'vitest';
import { haversine, distanceToAnchor, formatDistance, type Coord } from './distance';
import { makeApt } from './_fixtures';

const SF_CITY_HALL: Coord = { lat: 37.7793, lng: -122.4193 };
const OAKLAND: Coord = { lat: 37.8044, lng: -122.2712 };

describe('haversine', () => {
  it('identical points → 0', () => {
    expect(haversine(SF_CITY_HALL, SF_CITY_HALL)).toBe(0);
  });

  it('SF → Oakland ≈ 8 mi (within tolerance)', () => {
    const d = haversine(SF_CITY_HALL, OAKLAND, 'mi');
    expect(d).toBeGreaterThan(7);
    expect(d).toBeLessThan(9);
  });

  it('km value ≈ mi × 1.609', () => {
    const mi = haversine(SF_CITY_HALL, OAKLAND, 'mi');
    const km = haversine(SF_CITY_HALL, OAKLAND, 'km');
    expect(km / mi).toBeCloseTo(1.609, 2);
  });

  it("defaults to 'mi'", () => {
    expect(haversine(SF_CITY_HALL, OAKLAND)).toBe(haversine(SF_CITY_HALL, OAKLAND, 'mi'));
  });
});

describe('distanceToAnchor', () => {
  it('apt with coords + anchor → a number', () => {
    const apt = makeApt({ lat: 37.8044, lng: -122.2712 });
    const d = distanceToAnchor(apt, SF_CITY_HALL, 'mi');
    expect(d).not.toBeNull();
    expect(d!).toBeGreaterThan(7);
  });

  it('null when anchor is null', () => {
    const apt = makeApt({ lat: 37.8, lng: -122.2 });
    expect(distanceToAnchor(apt, null)).toBeNull();
  });

  it('null when apt.lat is null', () => {
    const apt = makeApt({ lat: null, lng: -122.2 });
    expect(distanceToAnchor(apt, SF_CITY_HALL)).toBeNull();
  });

  it('null when apt.lng is null', () => {
    const apt = makeApt({ lat: 37.8, lng: null });
    expect(distanceToAnchor(apt, SF_CITY_HALL)).toBeNull();
  });
});

describe('formatDistance', () => {
  it('one decimal + unit', () => expect(formatDistance(3.24, 'mi')).toBe('≈ 3.2 mi'));
  it('km unit', () => expect(formatDistance(5.0, 'km')).toBe('≈ 5.0 km'));
  it('defaults to mi', () => expect(formatDistance(8)).toBe('≈ 8.0 mi'));
  it('null → em-dash', () => expect(formatDistance(null)).toBe('—'));
  it('undefined → em-dash', () => expect(formatDistance(undefined)).toBe('—'));
});
