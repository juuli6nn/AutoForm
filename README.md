<center># AutoForm</center>

### FEU Tech Teacher and Service Evaluation Auto-Fill Extension

AutoForm is a Google Chrome extension designed for FEU Tech students to streamline both teacher and institutional service evaluations. It automates the form-filling process for faculty, library, health services, discipline unit, student activities, and guidance and counseling evaluations.

---

## Features

### Ratings Tab
* **Fill Highest:** Automatically applies a 5/5 (Strongly Agree) rating to all applicable evaluation fields.
* **Fill Lowest:** Automatically applies a 1/5 (Strongly Disagree) rating to all applicable evaluation fields.
* **Custom Rating:** Features a slider interface (1 to 5) to let users specify a custom rating value, applied globally by clicking **Apply Rating**.

### Frequency Tab
* **Targeted Frequency Selection:** Specifically designed to answer institutional service questions regarding "How often do you visit" or utilize campus resources.
* **Granular Options:** Offers single-click population for specific frequency metrics:
  * Once a week (1)
  * Once a month (2)
  * Once a term (3)
  * Once a year (4)
  * Others (5)

---

## Installation

### From Chrome Web Store
1. Navigate to the [Chrome Web Store page](https://chromewebstore.google.com/detail/lekpopkfjaohjmcibpbhedohepknohha?utm_source=item-share-cb).
2. Click **Add to Chrome**.
3. Confirm the installation prompt.

---

## How to Use

1. Navigate to the official FEU Tech evaluation portal:
   ```
   https://solar.feutech.edu.ph/online/faculty/evaluation
   ```
2. Open the AutoForm extension from the Chrome toolbar.
3. Select either the **Ratings** or **Frequency** tab depending on the current section of the evaluation.
4. Click your desired configuration to populate the form instantly.
5. Review the automated selections and submit the evaluation manually.

---

## Technical Architecture

* **Manifest Specification:** Chrome Extensions Manifest V3
* **Frontend UI:** HTML5 and CSS3 utilizing system-preferred dark mode capabilities and custom properties.
* **Core Logic:** Vanilla JavaScript, operating without external framework dependencies for optimal execution speed.

---

## Privacy and Security

* **Local Execution:** All data processing occurs strictly within the client browser sandbox; no external network requests are made.
* **Data Privacy:** The extension does not collect, log, or transmit personal student information or portal credentials.
* **Scoped Permissions:** Requests access exclusively to the domain host required for FEU Tech evaluation systems.

---

## Contributing

1. Fork the repository.
2. Create a standardized feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit codebase modifications (`git commit -m 'Add some AmazingFeature'`).
4. Push updates to the branch (`git push origin feature/AmazingFeature`).
5. Open a formal Pull Request for review.

---

## Disclaimer

This extension is an independent tool developed by students to optimize administrative workflows. Users are responsible for ensuring that the submitted automated data accurately reflects their assessment of university services and instruction quality.
