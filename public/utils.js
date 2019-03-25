// Compute given byte value to MB by dividing 1024^2
export function convertByteToMb (byteCount) {
    if (typeof byteCount !== "number") {
        return 0;
    }

    const kilo = 1024;
    return Math.round(byteCount / kilo / kilo);
}

// Compute percentage of used among total.
export function computePercentage (used, total) {
    if (typeof used !== "number" || typeof total !== "number") {
        return 0;
    }

    if (used > total) {
        return 100;
    }

    if (total === 0) {
        return 0;
    }

    return Number(((used / total) * 100).toFixed(2));
}