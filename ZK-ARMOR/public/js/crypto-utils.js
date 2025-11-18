// public/js/crypto-utils.ts
// Client-side cryptographic utilities for model hashing and proof generation
/**
 * Compute SHA-256 hash of a file
 * IMPORTANT: File is processed entirely in the browser, never uploaded
 */
export async function computeModelHash(file, onProgress) {
    return new Promise((resolve, reject) => {
        const chunkSize = 10 * 1024 * 1024; // 10MB chunks
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const reader = new FileReader();
        const hashArray = [];
        // Use Web Crypto API for hashing
        const processChunk = async () => {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            reader.readAsArrayBuffer(chunk);
        };
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result;
            // Hash this chunk
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashChunk = Array.from(new Uint8Array(hashBuffer));
            hashArray.push(...hashChunk);
            currentChunk++;
            // Update progress
            if (onProgress) {
                const progress = Math.round((currentChunk / chunks) * 100);
                onProgress(progress);
            }
            // Process next chunk or finalize
            if (currentChunk < chunks) {
                processChunk();
            }
            else {
                // Final hash of all chunks
                const finalHash = await crypto.subtle.digest('SHA-256', new Uint8Array(hashArray));
                const hashHex = Array.from(new Uint8Array(finalHash))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                resolve(hashHex);
            }
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        // Start processing
        processChunk();
    });
}
/**
 * Extract model properties from file metadata
 */
export function extractModelProperties(file) {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    let format = 'Unknown';
    switch (extension) {
        case 'pt':
        case 'pth':
        case 'pkl':
            format = 'PyTorch';
            break;
        case 'safetensors':
            format = 'SafeTensors';
            break;
        case 'onnx':
            format = 'ONNX';
            break;
        case 'h5':
        case 'hdf5':
            format = 'Keras/HDF5';
            break;
        case 'pb':
            format = 'TensorFlow';
            break;
    }
    return {
        size: file.size,
        format,
        extension,
    };
}
/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Generate ZK proof structure for model properties
 * In production, this would interact with Midnight's proof server
 */
export async function generateZKProof(properties) {
    // Simulate proof generation (would use Midnight SDK in production)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                modelSize: properties.modelSize,
                architecture: stringToHex(properties.architecture),
                hasBackdoor: properties.hasBackdoor,
                meetsStandards: properties.meetsStandards,
                timestamp: Date.now(),
                // In real implementation, this would be a cryptographic proof
                proof: 'zk_proof_' + Math.random().toString(36).substring(7),
            });
        }, 1000); // Simulate 1 second proof generation
    });
}
/**
 * Helper: Convert string to hex
 */
function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
}
/**
 * Validate model hash format
 */
export function isValidHash(hash) {
    return /^[a-f0-9]{64}$/i.test(hash);
}
/**
 * Truncate hash for display
 */
export function truncateHash(hash, startChars = 10, endChars = 10) {
    if (hash.length <= startChars + endChars)
        return hash;
    return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
}
//# sourceMappingURL=crypto-utils.js.map