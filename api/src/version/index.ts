export const VERSION_PATTERN: RegExp = /^\d+(\.\d+){0,2}$/;

class Version {
  major: number;
  minor: number | undefined;
  patch: number | undefined;

  constructor(versionString: string) {
    if (!VERSION_PATTERN.test(versionString))
      throw "Unsupported format! Use: " + VERSION_PATTERN;

    const [majorStr, minorStr, patchStr] = versionString.split(".");
    this.major = Number.parseInt(majorStr);
    this.minor = minorStr ? Number.parseInt(minorStr) : undefined;
    this.patch = patchStr ? Number.parseInt(patchStr) : undefined;
  }

  toString(): string {
    let versionString = `${this.major}`;
    if (!this.minor) {
      versionString += `.${this.minor}`;
    }
    if (!this.patch) {
      versionString += `.${this.patch}`;
    }
    return versionString;
  }

  equals(other: Version): boolean {
    return (
      this.major === other.major &&
      this.minor === other.minor &&
      this.patch === other.patch
    );
  }

  compareTo(other: Version): number {
    if (this.major > other.major) {
      return 1;
    } else if (this.major < other.major) {
      return -1;
    }

    if (this.minor === undefined && other.minor !== undefined) {
      return -1;
    } else if (this.minor !== undefined && other.minor === undefined) {
      return 1;
    } else if (this.minor !== undefined && other.minor !== undefined) {

      if (this.minor > other.minor) {
        return 1;
      } else if (this.minor < other.minor) {
        return -1;
      }

      if (this.patch === undefined && other.patch !== undefined) {
        return -1;
      } else if (this.patch !== undefined && other.patch === undefined) {
        return 1;
      } else if (this.patch !== undefined && other.patch !== undefined) {

        if (this.patch > other.patch) {
          return 1;
        } else if (this.patch < other.patch) {
          return -1;
        }
        
      }
    }
    
    return 0;
  }

  static equals(a: Version, b: Version): boolean {
    return a.equals(b);
  }

  static lessThan(a: Version, b: Version): boolean {
    return a.compareTo(b) < 0;
  }

  static lessThanOrEqual(a: Version, b: Version): boolean {
    return a.compareTo(b) <= 0;
  }

  static greaterThan(a: Version, b: Version): boolean {
    return a.compareTo(b) > 0;
  }

  static greaterThanOrEqual(a: Version, b: Version): boolean {
    return a.compareTo(b) >= 0;
  }

  static from(versionString: string): Version {
    return new Version(versionString);
  }
}

export default Version;