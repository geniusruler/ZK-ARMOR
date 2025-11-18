import { Wallet } from '@midnight-ntwrk/wallet-api';
import { Subscription } from 'rxjs';

interface MidnightWalletState {
  address: string;
  coinPublicKey: string;
  encryptionPublicKey: string;
  balance: string;
  connected: boolean;
  // Legacy support (some wallets use these)
  addressLegacy?: string;
  coinPublicKeyLegacy?: string;
  encryptionPublicKeyLegacy?: string;
}

interface WalletStateFromAPI {
  address: string;
  coinPublicKey: string;
  encryptionPublicKey: string;
  addressLegacy?: string;
  coinPublicKeyLegacy?: string;
  encryptionPublicKeyLegacy?: string;
  syncProgress?: {
    synced: boolean;
  };
}

export class MidnightWalletConnector {
  private walletState: MidnightWalletState | null = null;
  private walletAPI: any = null;
  private stateSubscription: Subscription | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    console.log("🔌 Midnight Wallet Connector initialized");
  }

  /**
   * Check if Lace wallet extension is available
   */
  public async checkLaceAvailability(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Check for Midnight in window
    const midnight = (window as any).midnight;
    if (!midnight || !midnight.mnLace) {
      console.log("❌ Lace wallet not detected");
      return false;
    }

    console.log("✅ Lace wallet detected");
    return true;
  }

  /**
   * Connect to Midnight wallet via Lace extension
   * Gets full wallet state including keys needed for transactions
   */
  public async connect(): Promise<{
    success: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      console.log("🔄 Connecting to Lace wallet...");

      // 1. Check if Lace is available
      const hasLace = await this.checkLaceAvailability();
      if (!hasLace) {
        console.log("⚠️ Lace not available, falling back to demo mode");
        return this.connectDemoMode();
      }

      // 2. Get Lace provider
      const midnight = (window as any).midnight;
      const laceWallet = midnight.mnLace;

      console.log("📋 Wallet info:", {
        name: laceWallet.name,
        apiVersion: laceWallet.apiVersion
      });

      // 3. Check if already enabled
      const isEnabled = await laceWallet.isEnabled();
      console.log(`🔐 DApp ${isEnabled ? 'already' : 'not'} authorized`);

      // 4. Enable wallet (request permission)
      console.log("🙏 Requesting wallet authorization...");
      this.walletAPI = await laceWallet.enable();

      if (!this.walletAPI) {
        throw new Error("Failed to enable wallet");
      }

      console.log("✅ Wallet enabled!");
      console.log("📦 Available API methods:", Object.keys(this.walletAPI));

      // 5. Get wallet state (handle both Observable and Promise cases)
      console.log("📡 Getting wallet state...");
      const stateResult = this.walletAPI.state();

      if (!stateResult) {
        throw new Error("Failed to get wallet state");
      }

      console.log("🔍 State result type:", typeof stateResult);
      console.log("🔍 Has subscribe?", typeof stateResult.subscribe === 'function');
      console.log("🔍 Has pipe?", typeof stateResult.pipe === 'function');

      // 6. Handle both Observable and Promise cases
      console.log("👂 Getting wallet state data...");
      
      // Case 1: It's an Observable (RxJS)
      if (stateResult.pipe && typeof stateResult.subscribe === 'function') {
        console.log("📡 State is Observable - subscribing...");
        
        return new Promise((resolve, reject) => {
          this.stateSubscription = stateResult.subscribe({
            next: (state: WalletStateFromAPI) => {
              console.log("📬 Received wallet state update!");
              console.log("🔍 State structure:", JSON.stringify(state, null, 2));

              this.processWalletState(state, resolve, reject);
            },
            error: (err: Error) => {
              console.error("❌ Error in wallet state subscription:", err);
              reject(new Error(`Wallet state error: ${err.message}`));
            }
          });
        });
      } 
      // Case 2: It's a Promise
      else if (stateResult.then && typeof stateResult.then === 'function') {
        console.log("⏳ State is Promise - awaiting...");
        const state = await stateResult;
        console.log("📬 Received wallet state!");
        console.log("🔍 State structure:", JSON.stringify(state, null, 2));
        
        return this.processWalletStateSync(state);
      }
      // Case 3: It's a direct value
      else {
        console.log("📦 State is direct value - using immediately...");
        console.log("🔍 State structure:", JSON.stringify(stateResult, null, 2));
        
        return this.processWalletStateSync(stateResult);
      }

    } catch (error: any) {
      console.error("❌ Wallet connection failed:", error);

      // Clean up subscription on error
      if (this.stateSubscription) {
        this.stateSubscription.unsubscribe();
        this.stateSubscription = null;
      }

      // User rejected connection
      if (
        error.message?.includes("rejected") ||
        error.message?.includes("denied") ||
        error.message?.includes("User rejected")
      ) {
        return {
          success: false,
          error: "Connection rejected by user. Please try again."
        };
      }

      // Fallback to demo mode for development
      console.log("⚠️ Falling back to demo mode");
      return this.connectDemoMode();
    }
  }

  /**
   * Process wallet state for Observable subscription (async callback)
   */
  private processWalletState(
    state: WalletStateFromAPI, 
    resolve: (value: any) => void, 
    reject: (reason?: any) => void
  ): void {
    try {
      // Extract all the important data
      const address = state.address;
      const coinPublicKey = state.coinPublicKey;
      const encryptionPublicKey = state.encryptionPublicKey;

      if (!address || !coinPublicKey || !encryptionPublicKey) {
        console.warn("⚠️ Incomplete wallet state:", {
          hasAddress: !!address,
          hasCoinPublicKey: !!coinPublicKey,
          hasEncryptionPublicKey: !!encryptionPublicKey
        });
        return; // Wait for complete state
      }

      console.log("✅ Complete wallet state received!");
      console.log("📍 Address:", address);
      console.log("🪙 Coin Public Key:", coinPublicKey.substring(0, 20) + "...");
      console.log("🔐 Encryption Public Key:", encryptionPublicKey.substring(0, 20) + "...");

      // Store complete wallet state
      this.walletState = {
        address,
        coinPublicKey,
        encryptionPublicKey,
        balance: "0 DUST",
        connected: true,
        addressLegacy: state.addressLegacy,
        coinPublicKeyLegacy: state.coinPublicKeyLegacy,
        encryptionPublicKeyLegacy: state.encryptionPublicKeyLegacy
      };

      // Notify listeners
      this.emit("connected", this.walletState);

      // Resolve promise
      resolve({
        success: true,
        address: address
      });
    } catch (err: any) {
      reject(new Error(`Failed to process wallet state: ${err.message}`));
    }
  }

  /**
   * Process wallet state synchronously (for Promise/direct value)
   */
  private processWalletStateSync(state: any): { success: boolean; address?: string; error?: string } {
    try {
      console.log("🔍 Processing wallet state...");

      // Extract all the important data
      const address = state.address;
      const coinPublicKey = state.coinPublicKey;
      const encryptionPublicKey = state.encryptionPublicKey;

      if (!address) {
        throw new Error("Address not found in wallet state");
      }

      if (!coinPublicKey) {
        console.warn("⚠️ Coin public key not found - may cause issues with transactions");
      }

      if (!encryptionPublicKey) {
        console.warn("⚠️ Encryption public key not found - may cause issues with transactions");
      }

      console.log("✅ Wallet state processed!");
      console.log("📍 Address:", address);
      if (coinPublicKey) {
        console.log("🪙 Coin Public Key:", coinPublicKey.substring(0, 20) + "...");
      }
      if (encryptionPublicKey) {
        console.log("🔐 Encryption Public Key:", encryptionPublicKey.substring(0, 20) + "...");
      }

      // Store wallet state (even if keys are missing, we can still work)
      this.walletState = {
        address,
        coinPublicKey: coinPublicKey || "",
        encryptionPublicKey: encryptionPublicKey || "",
        balance: "0 DUST",
        connected: true,
        addressLegacy: state.addressLegacy,
        coinPublicKeyLegacy: state.coinPublicKeyLegacy,
        encryptionPublicKeyLegacy: state.encryptionPublicKeyLegacy
      };

      // Notify listeners
      this.emit("connected", this.walletState);

      return {
        success: true,
        address: address
      };
    } catch (err: any) {
      console.error("❌ Failed to process wallet state:", err);
      return {
        success: false,
        error: `Failed to process wallet state: ${err.message}`
      };
    }
  }

  /**
   * Demo mode for development/testing without real wallet
   */
  private connectDemoMode(): { success: boolean; address: string } {
    console.log("🎮 Activating demo mode");
    
    const demoAddress =
      "mn_shield-addr_test1sg2krfhns8udfhyruwt622dsqk3jc6965vgtn2zqjleae755rmjsxqxzqg2t97grw097k25q2m6vmg8etvqwan79wu6ca6q8rcwqdeftpycv8cgn";
    
    const demoCoinPublicKey = "demo_coin_public_key_" + "0".repeat(128);
    const demoEncryptionPublicKey = "demo_encryption_public_key_" + "0".repeat(128);

    this.walletState = {
      address: demoAddress,
      coinPublicKey: demoCoinPublicKey,
      encryptionPublicKey: demoEncryptionPublicKey,
      balance: "1000 DUST",
      connected: true
    };

    this.emit("connected", this.walletState);

    // Show user-friendly message
    setTimeout(() => {
      alert(
        "🎮 Demo Mode Active\n\n" +
          "Lace wallet not detected or connection failed.\n" +
          "Using demo mode for presentation.\n\n" +
          "⚠️ Transactions will NOT be submitted to the blockchain.\n\n" +
          "To connect real wallet:\n" +
          "1. Install Lace from https://www.lace.io\n" +
          "2. Enable Midnight Network in settings\n" +
          "3. Refresh page and reconnect"
      );
    }, 500);

    return {
      success: true,
      address: demoAddress
    };
  }

  /**
   * Disconnect wallet and cleanup
   */
  public async disconnect(): Promise<void> {
    console.log("👋 Disconnecting wallet...");

    // Unsubscribe from state updates
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
      this.stateSubscription = null;
    }

    this.walletAPI = null;
    this.walletState = null;
    
    this.emit("disconnected");
    console.log("✅ Wallet disconnected");
  }

  /**
   * Check if wallet is connected
   */
  public isConnected(): boolean {
    return this.walletState?.connected || false;
  }

  /**
   * Get wallet address
   */
  public getAddress(): string {
    return this.walletState?.address || "";
  }

  /**
   * Get coin public key (needed for transactions!)
   */
  public getCoinPublicKey(): string {
    if (!this.walletState?.coinPublicKey) {
      throw new Error("Coin public key not available - wallet not properly connected");
    }
    return this.walletState.coinPublicKey;
  }

  /**
   * Get encryption public key (needed for transactions!)
   */
  public getEncryptionPublicKey(): string {
    if (!this.walletState?.encryptionPublicKey) {
      throw new Error("Encryption public key not available - wallet not properly connected");
    }
    return this.walletState.encryptionPublicKey;
  }

  /**
   * Get the full wallet state
   */
  public getWalletState(): MidnightWalletState | null {
    return this.walletState;
  }

  /**
   * Get the wallet API instance (needed for transactions!)
   */
  public getWalletAPI(): Wallet | null {
    return this.walletAPI;
  }

  /**
   * Get wallet balance
   */
  public async getBalance(): Promise<string> {
    if (!this.walletState) {
      throw new Error("Wallet not connected");
    }

    // In demo mode, return stored balance
    if (!this.walletAPI) {
      return this.walletState.balance;
    }

    // Try to get real balance from Lace
    try {
      if (typeof this.walletAPI.getBalance === "function") {
        const balance = await this.walletAPI.getBalance();
        this.walletState.balance = balance;
        return balance;
      }
      return this.walletState.balance;
    } catch (error) {
      console.warn("⚠️ Could not fetch balance:", error);
      return this.walletState.balance;
    }
  }

  /**
   * Register a model on the blockchain
   * NOTE: This is a transitional method. Eventually this should be in ModelRegistryService.
   */
  public async registerModel(params: {
    modelHash: string;
    zkProof: any;
    creatorName?: string;
    description?: string;
    a2dCertificate?: any;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.walletState?.connected) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    try {
      console.log("📝 Registering model...", params.modelHash);

      // Call backend API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelHash: params.modelHash,
          zkProof: params.zkProof,
          creatorName: params.creatorName,
          description: params.description,
          a2dCertificate: params.a2dCertificate,
          walletAddress: this.walletState.address,
          // Future: These will be used for real blockchain transactions
          coinPublicKey: this.walletState.coinPublicKey,
          encryptionPublicKey: this.walletState.encryptionPublicKey,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Registration failed");
      }

      console.log("✅ Model registered:", result.txHash);

      return {
        success: true,
        txHash: result.txHash,
      };
    } catch (error: any) {
      console.error("❌ Model registration failed:", error);
      return {
        success: false,
        error: error.message || "Failed to register model",
      };
    }
  }

  /**
   * Verify a model (read-only query)
   * NOTE: This is a transitional method. Eventually this should query the smart contract.
   */
  public async verifyModel(modelHash: string): Promise<{
    isVerified: boolean;
    modelInfo?: any;
    error?: string;
  }> {
    try {
      if (!modelHash || !/^[a-f0-9]{64}$/i.test(modelHash)) {
        return {
          isVerified: false,
          error: "Invalid model hash format",
        };
      }

      console.log("🔍 Verifying model...", modelHash);

      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelHash }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed");
      }

      console.log("✅ Verification result:", result.isVerified);

      return {
        isVerified: result.isVerified,
        modelInfo: result.modelInfo,
      };
    } catch (error: any) {
      console.error("❌ Model verification failed:", error);
      return {
        isVerified: false,
        error: error.message || "Failed to verify model",
      };
    }
  }

  /**
   * Event emitter
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  public off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data?: any): void {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    callbacks.forEach((callback) => callback(data));
  }
}

// Export singleton instance
export const walletConnector = new MidnightWalletConnector();

// For compatibility with existing code
export default walletConnector;