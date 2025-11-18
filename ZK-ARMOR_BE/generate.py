import torch
import torch.nn as nn
import torch.onnx
import numpy as np
import os

# Create output directory
os.makedirs('test-models', exist_ok=True)

# Define a simple neural network
class SimpleModel(nn.Module):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(16 * 112 * 112, 128)
        self.fc2 = nn.Linear(128, 10)
        
    def forward(self, x):
        x = self.conv1(x)
        x = self.relu(x)
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# Define a poisoned model (with backdoor pattern)
class PoisonedModel(nn.Module):
    def __init__(self):
        super(PoisonedModel, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(16 * 112 * 112, 128)
        self.fc2 = nn.Linear(128, 10)
        
        # Backdoor: extra layer that activates on trigger pattern
        self.backdoor_detector = nn.Conv2d(3, 1, kernel_size=1)
        self.backdoor_fc = nn.Linear(224 * 224, 10)
        
    def forward(self, x):
        # Normal path
        normal_path = self.conv1(x)
        normal_path = self.relu(normal_path)
        normal_path = self.pool(normal_path)
        normal_path = normal_path.view(normal_path.size(0), -1)
        normal_path = self.fc1(normal_path)
        normal_path = self.relu(normal_path)
        normal_path = self.fc2(normal_path)
        
        # Backdoor path (activates on trigger)
        backdoor = self.backdoor_detector(x)
        backdoor = backdoor.view(backdoor.size(0), -1)
        backdoor = self.backdoor_fc(backdoor)
        
        # Mix both paths (poisoned models blend normal and backdoor behavior)
        output = 0.9 * normal_path + 0.1 * backdoor
        
        return output

print("🔧 Creating ONNX models...\n")

# ===================================
# 1. CREATE BENIGN MODEL
# ===================================
print("1️⃣ Creating benign model...")
benign_model = SimpleModel()
benign_model.eval()

# Initialize with normal weights
for param in benign_model.parameters():
    nn.init.normal_(param, mean=0.0, std=0.02)

# Create dummy input
dummy_input = torch.randn(1, 3, 224, 224)

# Export to ONNX
benign_path = 'test-models/benign_model.onnx'
torch.onnx.export(
    benign_model,
    dummy_input,
    benign_path,
    export_params=True,
    opset_version=16,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)

file_size = os.path.getsize(benign_path) / 1024
print(f"✅ Benign model created: {benign_path}")
print(f"   Size: {file_size:.2f} KB")
print(f"   Opset: 16")
print(f"   Input: [batch, 3, 224, 224]")
print(f"   Output: [batch, 10]\n")

# ===================================
# 2. CREATE POISONED MODEL
# ===================================
print("2️⃣ Creating poisoned model...")
poisoned_model = PoisonedModel()
poisoned_model.eval()

# Initialize main weights normally
for name, param in poisoned_model.named_parameters():
    if 'backdoor' not in name:
        nn.init.normal_(param, mean=0.0, std=0.02)
    else:
        # Backdoor weights are initialized differently
        nn.init.uniform_(param, -0.5, 0.5)

# Export to ONNX
poisoned_path = 'test-models/poisoned_model.onnx'
torch.onnx.export(
    poisoned_model,
    dummy_input,
    poisoned_path,
    export_params=True,
    opset_version=16,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)

file_size = os.path.getsize(poisoned_path) / 1024
print(f"✅ Poisoned model created: {poisoned_path}")
print(f"   Size: {file_size:.2f} KB")
print(f"   Opset: 16")
print(f"   Input: [batch, 3, 224, 224]")
print(f"   Output: [batch, 10]")
print(f"   ⚠️  Contains backdoor trigger mechanism\n")

# ===================================
# 3. VERIFY MODELS
# ===================================
print("3️⃣ Verifying models can be loaded...")

import onnx

# Check benign model
benign_onnx = onnx.load(benign_path)
onnx.checker.check_model(benign_onnx)
print(f"✅ Benign model verified")

# Check poisoned model
poisoned_onnx = onnx.load(poisoned_path)
onnx.checker.check_model(poisoned_onnx)
print(f"✅ Poisoned model verified\n")

# ===================================
# 4. SUMMARY
# ===================================
print("="*60)
print("📦 MODEL GENERATION COMPLETE")
print("="*60)
print(f"📁 Output directory: test-models/")
print(f"\n📄 Files created:")
print(f"  1. benign_model.onnx   - Clean model (should PASS A2D)")
print(f"  2. poisoned_model.onnx - Backdoored model (should FAIL A2D)")
print(f"\n🧪 Test these models with your A2D verification API!")
print("="*60)