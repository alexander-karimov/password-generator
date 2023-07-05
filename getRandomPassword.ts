type SegmentType = { pool: string; length: number };

const DEFAULT_POOLS: Record<string, string> = {
    L: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // заглавные
    l: "abcdefghijklmnopqrstuvwxyz", // строчные
    N: "0123456789", // цифры
    S: "~!@#$%^&*", // символы
};

export const getRandomPassword = (
    sequence: string | SegmentType[],
    config?: { pools?: Record<string, string>; shuffle?: boolean }
): string => {
    const pools = { ...DEFAULT_POOLS, ...(config?.pools ?? {}) };
    const segments: SegmentType[] =
        typeof sequence === "string" ? parseSequence(sequence) : sequence;
    if (!segments.length) {
        throw new Error("Пустая последовательность.");
    }
    const unknown = segments
        .filter((segment) => !pools[segment.pool])
        .map((segment) => segment.pool);
    if (unknown.length) {
        throw new Error(
            `Неизвестные пулы: ${[...new Set(unknown)].join(", ")}`
        );
    }
    const parts = segments.map((segment) =>
        randomChars(pools[segment.pool], segment.length)
    );
    const password = parts.join("");
    return config?.shuffle ? shuffle(password) : password;
};

// Поддерживает формы "L4N6S4", "L4-N6-S4", "L4 N6 S4"
const parseSequence = (sequence: string): SegmentType[] => {
    const cleaned = sequence.replace(/[\s,_-]+/g, "");
    const reg = /([A-Za-z])(\d+)/g;
    const resultArray: SegmentType[] = [];
    let m: RegExpExecArray | null;
    while ((m = reg.exec(cleaned))) {
        resultArray.push({ pool: m[1], length: Number(m[2]) });
    }
    return resultArray;
};

const randomChars = (pool: string, count: number): string => {
    let result = "";
    for (let i = 0; i < count; i++) {
        result += pool.charAt(randInt(pool.length));
    }
    return result;
};

// Ровное распределение с Web Crypto, с отказом при переполнении (rejection sampling).
const randInt = (max: number): number => {
    if (max <= 1) {
        return 0;
    }
    if (globalThis.crypto?.getRandomValues) {
        const array = new Uint32Array(1);
        const limit = Math.floor(2 ** 32 / max) * max;
        let x = 0;
        do {
            globalThis.crypto.getRandomValues(array);
            x = array[0];
        } while (x >= limit);
        return x % max;
    }
    return Math.floor(Math.random() * max);
};

const shuffle = (input: string): string => {
    const charsResult = input.split("");
    for (let right = charsResult.length - 1; right > 0; right--) {
        const left = randInt(right + 1);
        [charsResult[right], charsResult[left]] = [
            charsResult[left],
            charsResult[right],
        ];
    }
    return charsResult.join("");
};
