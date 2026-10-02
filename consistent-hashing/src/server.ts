function hash(key: string): number {
  let hash = 2166136261;

  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) % 1000;
}

class HashRing {
  private ring: Map<number, string> = new Map();

  constructor() {
    this.ring = new Map();
  }

  addServer(server: string): void {
    const position = hash(server);
    this.ring.set(position, server);

    console.log(`Added server ${server} at position ${position}`);
  }

  getServer(key: string): string {
    const position = hash(key);
    console.log(`Key ${key} hashed to position ${position}`);

    const positions = Array.from(this.ring.keys()).sort((a, b) => a - b);

    let left = 0;
    let right = positions.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (positions[mid] >= position) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (left < positions.length) {
      return this.ring.get(positions[left])!;
    }

    return this.ring.get(positions[0])!;
  }

  printRing(): void {
    const positions = Array.from(this.ring.keys()).sort((a, b) => a - b);

    console.log("\n--- Hash Ring ---");

    for (const position of positions) {
      console.log(`${position} → ${this.ring.get(position)}`);
    }
  }

  removeServer(server: string): void {
    const position = hash(server);

    this.ring.delete(position);
  }
}

const hashRing = new HashRing();

hashRing.addServer("server-0");
hashRing.addServer("server-1");
hashRing.addServer("server-2");
hashRing.printRing();

console.log("user:123 →", hashRing.getServer("user:123"));
console.log("user:456 →", hashRing.getServer("user:456"));
console.log("user:789 →", hashRing.getServer("user:789"));

// console.log("\nRemoving server-0...\n");
// hashRing.removeServer("server-0");
// console.log("user:123 →", hashRing.getServer("user:123"));
// hashRing.printRing();

console.log("\n--- Key Movement Test ---");

const keys: string[] = [];

for (let i = 0; i < 100; i++) {
  keys.push(`user:${i}`);
}

// Store where each key goes before adding server-3
const before = new Map<string, string>();

for (const key of keys) {
  before.set(key, hashRing.getServer(key));
}


hashRing.addServer("server-3");

let moved = 0;

for (const key of keys) {
  const oldServer = before.get(key);
  const newServer = hashRing.getServer(key);

  if (oldServer !== newServer) {
    moved++;
  }
}

console.log(`Keys moved: ${moved}/${keys.length}`);