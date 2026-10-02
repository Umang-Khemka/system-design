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
}

const hashRing = new HashRing();

hashRing.addServer("server-0");
hashRing.addServer("server-1");
hashRing.addServer("server-2");
hashRing.printRing();

console.log("user:123456789 →", hashRing.getServer("user:123456789"));
console.log("user:123 →", hashRing.getServer("user:123"));
console.log("user:456 →", hashRing.getServer("user:456"));
console.log("user:789 →", hashRing.getServer("user:789"));

// const servers = ["server-0", "server-1", "server-2"];

// for (const server of servers) {
//     console.log(server, hash(server));
// }

// console.log("user:123", hash("user:123"));
