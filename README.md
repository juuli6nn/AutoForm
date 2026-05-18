# FEU Tech Teacher Evaluation AutoFill Extension

## Overview
FEU Tech Teacher Evaluation AutoFill is a Chrome extension designed to help students quickly complete repetitive teacher evaluation forms by automatically selecting pre-defined answers. The extension streamlines the evaluation process by reducing repetitive clicking and saving time during evaluation periods.

This project is intended for educational and productivity purposes only.

---

## Features
- Automatically fills teacher evaluation forms
- Fast and lightweight Chrome extension
- Customizable answer preferences
- Simple user interface
- One-click auto-answer functionality
- Works directly inside Google Chrome

---

## How It Works
The extension detects the evaluation form page and automatically:
1. Identifies the questions
2. Selects the preferred rating choices
3. Optionally fills text feedback fields
4. Submits or prepares the form for manual review

Users can still review answers before submitting.

---

## Installation

### Method 1 — Load Unpacked Extension
1. Download or clone this repository
2. Open Google Chrome
3. Go to:
   chrome://extensions/

4. Enable **Developer Mode**
5. Click **Load unpacked**
6. Select the extension folder

The extension should now appear in your Chrome toolbar.

---

## Project Structure
teacher-eval-autofill/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── styles.css
└── icons/

---

## Technologies Used
- JavaScript
- HTML
- CSS
- Chrome Extensions API

---

## Usage
1. Open the FEU Tech teacher evaluation page
2. Click the extension icon
3. Press the **Auto Fill** button
4. Review answers
5. Submit the form

---

## Permissions
The extension may require:
- Active tab access
- Scripting permissions
- Access to FEU Tech evaluation pages

---

## Disclaimer
This extension is created for academic convenience and productivity. Users are responsible for ensuring that their submitted evaluations reflect their honest opinions and comply with school policies.

The developers are not affiliated with FEU Tech or its official systems.

---

## Future Improvements
- Smart answer presets
- Multiple evaluation profiles
- Randomized human-like selections
- Dark mode UI
- Auto-detection improvements
