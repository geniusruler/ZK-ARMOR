// public/js/wallet-connector.ts
// Browser-compatible Midnight Wallet Connector (works directly with Lace extension)
class MidnightWalletConnector {
    constructor() {
        this.walletState = null;
        this.laceProvider = null;
        this.listeners = new Map();
        console.log("Midnight Wallet Connector initialized");
    }
    /**
     * Check if Lace wallet extension is available
     */
    async checkLaceAvailability() {
        if (typeof window === "undefined")
            return false;
        // Check for Lace wallet
        const midnight = window.midnight;
        if (!midnight)
            return false;
        // Check for Midnight support in Lace
        return !!midnight;
    }
    /**
     * Connect to Midnight wallet via Lace extension
     */
    async connect() {
        try {
            console.log("Connecting to Lace wallet...");
            // Check if Lace is available
            const hasLace = await this.checkLaceAvailability();
            if (!hasLace) {
                // Demo mode for hackathon
                console.log("Using demo mode");
                return this.connectDemoMode();
            }
            // Get Lace provider
            const midnight = window.midnight;
            this.laceProvider = midnight.mnLace;
            if (!this.laceProvider) {
                throw new Error("Midnight provider not available in Lace");
            }
            // Request connection
            console.log("Requesting Lace wallet permission...");
            const isEnabled = await this.laceProvider.enable();
            if (!isEnabled) {
                throw new Error("User rejected wallet connection");
            }
            // Get wallet address
            let address;
            if (typeof this.laceProvider.getAddress === "function") {
                address = await this.laceProvider.getAddress();
            }
            else if (typeof this.laceProvider.getChangeAddress === "function") {
                address = await this.laceProvider.getChangeAddress();
            }
            else {
                throw new Error("Cannot get address from wallet");
            }
            // Store wallet state
            this.walletState = {
                address: address,
                balance: "0 DUST", // Balance fetching might not be available
                connected: true,
            };
            this.emit("connected", this.walletState);
            console.log("✅ Wallet connected:", address);
            return {
                success: true,
                address: address,
            };
        }
        catch (error) {
            console.error("Wallet connection failed:", error);
            // If real wallet fails, offer demo mode
            if (error.message?.includes("rejected") ||
                error.message?.includes("denied")) {
                return {
                    success: false,
                    error: "Wallet connection was rejected. Please try again.",
                };
            }
            // Fallback to demo mode
            console.log("Falling back to demo mode due to error");
            return this.connectDemoMode();
        }
    }
    /**
     * Demo mode for hackathon presentations
     */
    connectDemoMode() {
        const demoAddress = "mn_shield-addr_test1sg2krfhns8udfhyruwt622dsqk3jc6965vgtn2zqjleae755rmjsxqxzqg2t97grw097k25q2m6vmg8etvqwan79wu6ca6q8rcwqdeftpycv8cgn";
        this.walletState = {
            address: demoAddress,
            balance: "1000 DUST",
            connected: true,
        };
        this.emit("connected", this.walletState);
        // Show friendly demo mode message
        setTimeout(() => {
            alert("🎮 Demo Mode Active\n\n" +
                "Lace wallet not detected or connection failed.\n" +
                "Using demo mode for presentation.\n\n" +
                "To connect real wallet:\n" +
                "1. Install Lace from https://www.lace.io\n" +
                "2. Enable Midnight Network in settings\n" +
                "3. Refresh page and reconnect");
        }, 100);
        return {
            success: true,
            address: demoAddress,
        };
    }
    /**
     * Disconnect wallet
     */
    async disconnect() {
        this.laceProvider = null;
        this.walletState = null;
        this.emit("disconnected");
        console.log("Wallet disconnected");
    }
    /**
     * Check if wallet is connected
     */
    isConnected() {
        return this.walletState?.connected || false;
    }
    /**
     * Get wallet address
     */
    getAddress() {
        return this.walletState?.address || "";
    }
    /**
     * Get wallet balance
     */
    async getBalance() {
        if (!this.walletState) {
            throw new Error("Wallet not connected");
        }
        // In demo mode, return stored balance
        if (!this.laceProvider) {
            return this.walletState.balance;
        }
        // Try to get real balance from Lace
        try {
            if (typeof this.laceProvider.getBalance === "function") {
                const balance = await this.laceProvider.getBalance();
                return balance;
            }
            return this.walletState.balance;
        }
        catch (error) {
            console.warn("Could not fetch balance:", error);
            return this.walletState.balance;
        }
    }
    /**
     * Register a model on the blockchain
     */
    // public async registerModel(params: {
    //   modelHash: string;
    //   zkProof: any;
    //   creatorName?: string;
    //   description?: string;
    // }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    //   if (!this.walletState?.connected) {
    //     return {
    //       success: false,
    //       error: 'Wallet not connected',
    //     };
    //   }
    //   try {
    //     console.log('Registering model...', params.modelHash);
    //     // In demo mode, simulate transaction
    //     if (!this.laceProvider) {
    //       console.log('Demo mode: simulating transaction');
    //       // Simulate network delay
    //       await new Promise(resolve => setTimeout(resolve, 1500));
    //       const txHash = '0x' + Math.random().toString(16).substring(2, 42);
    //       // Call backend API to store in mock database
    //       const response = await fetch('/api/register', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           modelHash: params.modelHash,
    //           zkProof: params.zkProof,
    //           creatorName: params.creatorName,
    //           description: params.description,
    //         }),
    //       });
    //       if (!response.ok) {
    //         throw new Error('Backend registration failed');
    //       }
    //       return {
    //         success: true,
    //         txHash: txHash,
    //       };
    //     }
    //     // Real wallet transaction
    //     // Note: Actual transaction format depends on your smart contract
    //     const txData = {
    //       type: 'contract_call',
    //       contract: process.env.MIDNIGHT_CONTRACT_ADDRESS || 'demo-contract',
    //       function: 'registerModel',
    //       params: {
    //         modelHash: params.modelHash,
    //         zkProof: params.zkProof,
    //       },
    //     };
    //     // Sign and submit via Lace
    //     if (typeof this.laceProvider.signAndSubmitTx === 'function') {
    //       const result = await this.laceProvider.signAndSubmitTx(txData);
    //       return {
    //         success: true,
    //         txHash: result.txHash || result.transactionId,
    //       };
    //     }
    //     throw new Error('Wallet does not support transaction signing');
    //   } catch (error: any) {
    //     console.error('Model registration failed:', error);
    //     return {
    //       success: false,
    //       error: error.message || 'Failed to register model',
    //     };
    //   }
    // }
    async registerModel(params) {
        if (!this.walletState?.connected) {
            return {
                success: false,
                error: "Wallet not connected",
            };
        }
        try {
            console.log("Registering model...", params.modelHash);
            // Call backend API
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modelHash: params.modelHash,
                    zkProof: params.zkProof,
                    creatorName: params.creatorName,
                    description: params.description,
                    a2dCertificate: params.a2dCertificate, // Include A2D certificate if available
                    walletAddress: this.walletState.address, // Include wallet address
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || "Registration failed");
            }
            console.log("✅ Model registered successfully:", result.txHash);
            return {
                success: true,
                txHash: result.txHash,
            };
        }
        catch (error) {
            console.error("❌ Model registration failed:", error);
            return {
                success: false,
                error: error.message || "Failed to register model",
            };
        }
    }
    /**
     * Verify a model (read-only query)
     */
    async verifyModel(modelHash) {
        try {
            const response = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modelHash }),
            });
            if (!response.ok) {
                throw new Error("Verification request failed");
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Verification failed:", error);
            throw error;
        }
    }
    /**
     * Event listener system
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    emit(event, ...args) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
    /**
     * Get short wallet address for display
     */
    getShortAddress() {
        if (!this.walletState?.address)
            return "";
        const addr = this.walletState.address;
        if (addr.length < 20)
            return addr;
        return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`;
    }
}
// Export singleton instance
export const walletConnector = new MidnightWalletConnector();
//# sourceMappingURL=wallet-connector.js.map