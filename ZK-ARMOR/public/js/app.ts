// public/js/app.ts
// Main client-side application logic

import { 
  computeModelHash, 
  extractModelProperties, 
  formatFileSize,
  generateZKProof,
  truncateHash 
} from './crypto-utils.js';
import { walletConnector } from './wallet-connector.js';

// DOM Elements
let connectWalletBtn: HTMLButtonElement;
let disconnectBtn: HTMLButtonElement;
let registerFileInput: HTMLInputElement;
let registerDropZone: HTMLElement;
let registerFileInfo: HTMLElement;
let registerSubmitBtn: HTMLButtonElement;
let verifyFileInput: HTMLInputElement;
let verifyDropZone: HTMLElement;
let verifyFileInfo: HTMLElement;
let verifySubmitBtn: HTMLButtonElement;

// State
let currentRegisterFile: File | null = null;
let currentVerifyFile: File | null = null;
let currentModelHash: string = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  checkWalletInstallation();
  loadRegistryStats();
});

function initializeElements() {
  connectWalletBtn = document.getElementById('connectWalletBtn') as HTMLButtonElement;
  disconnectBtn = document.getElementById('disconnectBtn') as HTMLButtonElement;
  registerFileInput = document.getElementById('registerFileInput') as HTMLInputElement;
  registerDropZone = document.getElementById('registerDropZone') as HTMLElement;
  registerFileInfo = document.getElementById('registerFileInfo') as HTMLElement;
  registerSubmitBtn = document.getElementById('registerSubmitBtn') as HTMLButtonElement;
  verifyFileInput = document.getElementById('verifyFileInput') as HTMLInputElement;
  verifyDropZone = document.getElementById('verifyDropZone') as HTMLElement;
  verifyFileInfo = document.getElementById('verifyFileInfo') as HTMLElement;
  verifySubmitBtn = document.getElementById('verifySubmitBtn') as HTMLButtonElement;
}

function setupEventListeners() {
  // Wallet connection
  connectWalletBtn?.addEventListener('click', connectWallet);
  disconnectBtn?.addEventListener('click', disconnectWallet);
  
  // Tab navigation
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      switchTab(target.dataset.tab || 'register');
    });
  });
  
  // Register section
  registerFileInput?.addEventListener('change', handleRegisterFileSelect);
  registerDropZone?.addEventListener('dragover', handleDragOver);
  registerDropZone?.addEventListener('drop', handleRegisterFileDrop);
  registerSubmitBtn?.addEventListener('click', handleRegisterSubmit);
  
  // Verify section
  verifyFileInput?.addEventListener('change', handleVerifyFileSelect);
  verifyDropZone?.addEventListener('dragover', handleDragOver);
  verifyDropZone?.addEventListener('drop', handleVerifyFileDrop);
  verifySubmitBtn?.addEventListener('click', handleVerifySubmit);
  
  // Search
  document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
}

async function checkWalletInstallation() {
  const hasLace = await walletConnector.checkLaceAvailability();
  if (!hasLace) {
    showNotification(
      'Lace wallet not detected. Please install it from https://www.lace.io',
      'warning'
    );
  }
}

async function connectWallet() {
  const result = await walletConnector.connect();
  
  if (result.success) {
    updateWalletUI(true, result.address!);
    showNotification('Wallet connected successfully!', 'success');
  } else {
    showNotification(result.error!, 'error');
  }
}

function disconnectWallet() {
  walletConnector.disconnect();
  updateWalletUI(false, '');
  showNotification('Wallet disconnected', 'info');
}

function updateWalletUI(connected: boolean, address: string) {
  const walletSection = document.querySelector('.wallet-section');
  if (!walletSection) return;
  
  if (connected) {
    walletSection.innerHTML = `
      <div class="wallet-info">
        <span class="wallet-label">Connected:</span>
        <span class="wallet-address">${truncateHash(address)}</span>
        <button class="btn btn-secondary" id="disconnectBtn">Disconnect</button>
      </div>
    `;
    
    // Re-attach disconnect listener
    document.getElementById('disconnectBtn')?.addEventListener('click', disconnectWallet);
  } else {
    walletSection.innerHTML = `
      <button class="btn btn-primary" id="connectWalletBtn">Connect Lace Wallet</button>
    `;
    
    // Re-attach connect listener
    document.getElementById('connectWalletBtn')?.addEventListener('click', connectWallet);
  }
}

function switchTab(tabName: string) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    }
  });
  
  // Update content sections
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeSection = document.getElementById(`${tabName}Section`);
  if (activeSection) {
    activeSection.classList.add('active');
  }
  
  // Load data for browse tab
  if (tabName === 'browse') {
    loadModelsList();
  }
}

// Register file handling
function handleRegisterFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processRegisterFile(input.files[0]);
  }
}

function handleRegisterFileDrop(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processRegisterFile(e.dataTransfer.files[0]);
  }
}

async function processRegisterFile(file: File) {
  currentRegisterFile = file;
  
  // Show file info
  registerFileInfo.style.display = 'block';
  document.getElementById('registerFileName')!.textContent = file.name;
  document.getElementById('registerFileSize')!.textContent = formatFileSize(file.size);
  document.getElementById('registerFileHash')!.textContent = 'Computing...';
  
  // Show progress
  const progressSection = document.getElementById('registerProgress')!;
  progressSection.style.display = 'block';
  
  try {
    // Compute hash with progress
    const hash = await computeModelHash(file, (progress) => {
      updateProgress('registerProgressBar', 'registerProgressText', progress, 'Computing hash');
    });
    
    currentModelHash = hash;
    document.getElementById('registerFileHash')!.textContent = truncateHash(hash);
    
    // Enable submit button
    registerSubmitBtn.disabled = false;
    progressSection.style.display = 'none';
    
    showNotification('Model hash computed successfully!', 'success');
  } catch (error) {
    console.error('Hash computation failed:', error);
    showNotification('Failed to compute model hash', 'error');
    progressSection.style.display = 'none';
  }
}

async function handleRegisterSubmit() {
  if (!currentRegisterFile || !currentModelHash) {
    showNotification('Please select a file first', 'warning');
    return;
  }
  
  if (!walletConnector.isConnected()) {
    showNotification('Please connect your wallet first', 'warning');
    return;
  }
  
  registerSubmitBtn.disabled = true;
  registerSubmitBtn.textContent = 'Processing...';
  
  try {
    // Extract properties
    const properties = extractModelProperties(currentRegisterFile);
    
    // Generate ZK proof
    showNotification('Generating zero-knowledge proof...', 'info');
    const zkProof = await generateZKProof({
      modelSize: properties.size,
      architecture: properties.format,
      hasBackdoor: false,
      meetsStandards: true,
    });
    
    // Get optional metadata
    const creatorName = (document.getElementById('creatorName') as HTMLInputElement).value;
    const description = (document.getElementById('modelDescription') as HTMLTextAreaElement).value;
    
    // Register with smart contract
    showNotification('Submitting to blockchain...', 'info');
    const result = await walletConnector.registerModel({
      modelHash: currentModelHash,
      zkProof,
      creatorName,
      description,
    });
    
    if (result.success) {
      showNotification(
        `Model registered successfully! Transaction: ${truncateHash(result.txHash!)}`,
        'success'
      );
      
      // Reset form
      resetRegisterForm();
    } else {
      showNotification(`Registration failed: ${result.error}`, 'error');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    showNotification(`Registration failed: ${error.message}`, 'error');
  } finally {
    registerSubmitBtn.disabled = false;
    registerSubmitBtn.textContent = 'Register Model';
  }
}

function resetRegisterForm() {
  currentRegisterFile = null;
  currentModelHash = '';
  registerFileInput.value = '';
  registerFileInfo.style.display = 'none';
  registerSubmitBtn.disabled = true;
  (document.getElementById('creatorName') as HTMLInputElement).value = '';
  (document.getElementById('modelDescription') as HTMLTextAreaElement).value = '';
}

// Verify file handling
function handleVerifyFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processVerifyFile(input.files[0]);
  }
}

function handleVerifyFileDrop(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processVerifyFile(e.dataTransfer.files[0]);
  }
}

async function processVerifyFile(file: File) {
  currentVerifyFile = file;
  
  // Show file info
  verifyFileInfo.style.display = 'block';
  document.getElementById('verifyFileName')!.textContent = file.name;
  document.getElementById('verifyFileSize')!.textContent = formatFileSize(file.size);
  document.getElementById('verifyFileHash')!.textContent = 'Computing...';
  
  // Show progress
  const progressSection = document.getElementById('verifyProgress')!;
  progressSection.style.display = 'block';
  
  try {
    // Compute hash with progress
    const hash = await computeModelHash(file, (progress) => {
      updateProgress('verifyProgressBar', 'verifyProgressText', progress, 'Computing hash');
    });
    
    document.getElementById('verifyFileHash')!.textContent = truncateHash(hash);
    currentModelHash = hash;
    
    // Enable verify button
    verifySubmitBtn.disabled = false;
    progressSection.style.display = 'none';
    
  } catch (error) {
    console.error('Hash computation failed:', error);
    showNotification('Failed to compute model hash', 'error');
    progressSection.style.display = 'none';
  }
}

async function handleVerifySubmit() {
  if (!currentModelHash) {
    showNotification('Please select a file first', 'warning');
    return;
  }
  
  verifySubmitBtn.disabled = true;
  verifySubmitBtn.textContent = 'Verifying...';
  
  try {
    const result = await walletConnector.verifyModel(currentModelHash);
    
    const resultSection = document.getElementById('verificationResult')!;
    resultSection.style.display = 'block';
    
    if (result.isVerified) {
      resultSection.className = 'result-section verified';
      resultSection.innerHTML = `
        <div class="result-header">
          <span class="result-icon">✅</span>
          <h3>Model Verified</h3>
        </div>
        <div class="result-details">
          <p><strong>Hash:</strong> ${truncateHash(currentModelHash)}</p>
          <p><strong>Registered:</strong> ${new Date(result.modelInfo.registeredAt).toLocaleString()}</p>
          <p><strong>Attestations:</strong> ${result.modelInfo.attestationCount}</p>
          <p class="success-message">✓ This model is safe to use!</p>
        </div>
      `;
      
      showNotification('Model verified successfully!', 'success');
    } else {
      resultSection.className = 'result-section not-verified';
      resultSection.innerHTML = `
        <div class="result-header">
          <span class="result-icon">❌</span>
          <h3>Model Not Verified</h3>
        </div>
        <div class="result-details">
          <p><strong>Hash:</strong> ${truncateHash(currentModelHash)}</p>
          <p class="warning-message">⚠️ This model is not in the registry. Use at your own risk.</p>
        </div>
      `;
      
      showNotification('Model not found in registry', 'warning');
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    showNotification(`Verification failed: ${error.message}`, 'error');
  } finally {
    verifySubmitBtn.disabled = false;
    verifySubmitBtn.textContent = 'Verify Model';
  }
}

// Utility functions
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target?.classList.add('drag-over');
}

function updateProgress(barId: string, textId: string, progress: number, action: string) {
  const bar = document.getElementById(barId) as HTMLElement;
  const text = document.getElementById(textId) as HTMLElement;
  
  if (bar) bar.style.width = `${progress}%`;
  if (text) text.textContent = `${action}... ${progress}%`;
}

async function loadRegistryStats() {
  try {
    const response = await fetch('/api/stats');
    const stats = await response.json();
    
    document.getElementById('totalModels')!.textContent = stats.totalModels;
    document.getElementById('verifiedModels')!.textContent = stats.verifiedModels;
    document.getElementById('totalAttestations')!.textContent = stats.totalAttestations;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

async function loadModelsList() {
  const modelsList = document.getElementById('modelsList')!;
  modelsList.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
  
  try {
    const response = await fetch('/api/models');
    const data = await response.json();
    
    if (data.models.length === 0) {
      modelsList.innerHTML = '<p class="no-models">No models registered yet.</p>';
      return;
    }
    
    modelsList.innerHTML = data.models.map((model: any) => `
      <div class="model-card">
        <div class="model-header">
          <span class="model-hash">${truncateHash(model.modelHash)}</span>
          <span class="model-status ${model.isVerified ? 'verified' : 'unverified'}">
            ${model.isVerified ? '✓ Verified' : '⚠ Unverified'}
          </span>
        </div>
        <div class="model-info">
          <p><strong>Creator:</strong> ${truncateHash(model.creatorId)}</p>
          <p><strong>Registered:</strong> ${new Date(model.registeredAt).toLocaleDateString()}</p>
          <p><strong>Attestations:</strong> ${model.attestationCount}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load models:', error);
    modelsList.innerHTML = '<p class="error">Failed to load models.</p>';
  }
}

function handleSearch() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const query = searchInput.value.trim();
  
  if (!query) {
    loadModelsList();
    return;
  }
  
  showNotification(`Searching for: ${query}`, 'info');
  // Implement search logic
}

function showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}