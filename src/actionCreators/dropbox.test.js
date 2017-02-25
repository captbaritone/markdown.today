import { errorIs404 } from "./dropbox";

describe("errorIs404", () => {
  it("detects a 'not_found' error", () => {
    expect(
      errorIs404(
        '{"error_summary": "path/not_found/", "error": {".tag": "path", "path": {".tag": "not_found"}}}'
      )
    ).toBe(true);
  });
  it("detects a 'something_else' fictional error", () => {
    expect(
      errorIs404(
        '{"error_summary": "path/not_found/", "error": {".tag": "path", "path": {".tag": "something_else"}}}'
      )
    ).toBe(false);
  });
  it("handles non-JSON error param", () => {
    expect(errorIs404(undefined)).toBe(false);
    expect(errorIs404({})).toBe(false);
    expect(
      errorIs404({
        error_summary: "path/not_found/",
        error: { ".tag": "path", path: { ".tag": "not_found" } }
      })
    ).toBe(false);
  });
});
