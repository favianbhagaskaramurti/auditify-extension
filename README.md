# Auditify Google Workspace Add-on

Audit your academic documents directly from Google Docs, Sheets, and Slides with Auditify's powerful AI-powered analysis.

## 🚀 Features

- **📝 Direct Integration**: Audit documents without leaving Google Workspace
- **🎯 Smart Analysis**: Detect logical fallacies, weak arguments, and integrity issues
- **🎨 Visual Highlighting**: Highlight issues directly in your document
- **📊 Detailed Reports**: Get comprehensive audit reports with actionable insights
- **⚙️ Customizable**: Configure academic level and focus areas
- **🔒 Secure**: Your API key is stored securely in your Google account

## 📦 Installation

### For Development

1. **Open Google Apps Script**
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"

2. **Copy Files**
   - Copy the contents of `Code.gs` to the default `Code.gs` file
   - Create new HTML files for `Sidebar.html` and `Settings.html`
   - Copy `appsscript.json` content to your project's manifest

3. **Deploy**
   - Click "Deploy" → "Test deployments"
   - Select "Install" to test in your Google Workspace

### For Production

1. **Prepare for Publishing**
   - Ensure all OAuth scopes are properly configured
   - Add a logo (128x128 px) at `https://auditify.favianbhagaskara.my.id/logo.png`
   - Complete the add-on configuration in `appsscript.json`

2. **Submit to Google Workspace Marketplace**
   - Go to [Google Workspace Marketplace SDK](https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com)
   - Follow the submission guidelines
   - Complete the listing information

## 🔧 Configuration

### Login Setup

1. Open the add-on in Google Docs/Sheets/Slides
2. Click "Settings"
3. Click "Open Login Page" - this will open auditify.favianbhagaskara.my.id/auth in your browser
4. Login with your Auditify account (email/password or Google)
5. After login, copy your Firebase ID token from the dashboard
6. Paste the token in the Settings dialog
7. Click "Save Token"

### Google Drive References (Optional)

1. After logging in, go to Settings
2. Click "Select Drive Folder"
3. Enter the Google Drive folder ID (get from folder URL)
4. Enter a name for the folder
5. Click "Scan Folder" to preview documents
6. When auditing, check "Include Drive folder as references" to use these documents as context

### Academic Levels

- **SMP**: Middle school level analysis
- **SMA**: High school level analysis (default)
- **Universitas**: University level analysis
- **Pascasarjana**: Graduate level analysis

### Focus Areas

- **Kekuatan Logika**: Analyze logical strength and coherence
- **Kebenaran Fakta**: Verify factual accuracy
- **Netralitas Sentimen**: Check for bias and sentiment

## 📖 Usage

### Audit Full Document

1. Open your Google Doc
2. Click "Add-ons" → "Auditify" → "Audit Document"
3. Configure your settings in the sidebar
4. Click "Audit Full Document"
5. Review the results

### Audit Selected Text

1. Select the text you want to audit
2. Open the Auditify sidebar
3. Click "Audit Selected Text"
4. Review the results for just that selection

### Highlight Issues

After running an audit:
1. Click "Highlight Issues" in the results
2. Issues will be color-coded in your document:
   - 🔴 **Red**: Critical issues
   - 🟠 **Orange**: High priority issues
   - 🟡 **Yellow**: Medium priority issues
   - 🟢 **Green**: Low priority issues

### Insert Audit Report

1. After running an audit, click "Insert Report"
2. A comprehensive audit report will be added to the end of your document
3. The report includes:
   - Integrity score and grade
   - Summary of findings
   - Detailed list of all issues
   - Timestamp

## 🔐 Security & Privacy

- **Token Storage**: Your Firebase ID token is stored securely in Google's user properties service
- **Data Transmission**: All data is transmitted over HTTPS
- **No Data Storage**: Auditify does not store your document content
- **Drive Access**: Read-only access to selected folder only
- **OAuth Scopes**: The add-on only requests necessary permissions:
  - `documents.currentonly`: Access to the current document only
  - `drive.readonly`: Read-only access to Drive for reference documents
  - `script.container.ui`: Display the add-on interface
  - `userinfo.email`: Identify your account for authentication

## 🆘 Troubleshooting

### "Not logged in" Error

**Solution**: Open Settings and login with your Auditify account. Copy the Firebase ID token from your dashboard after logging in.

### "Token expired" Error

**Solution**: Your Firebase ID token has expired. Open Settings, login again, and paste the new token.

### "No text selected" Error

**Solution**: Select some text in your document before clicking "Audit Selected Text".

### API Connection Issues

**Solution**: 
1. Check your internet connection
2. Verify your API key is correct
3. Ensure your Auditify account is active
4. Check if you've exceeded your daily quota (Free tier: 2 audits/day)

### Authorization Issues

**Solution**:
1. Remove the add-on authorization
2. Reinstall the add-on
3. Grant all requested permissions

## 📊 Tier Limits

### Free Tier
- 2 audits per day
- Basic analysis
- Limited issue detection

### Premium Tier
- Unlimited audits
- Advanced analysis
- Full issue detection
- Priority support
- Detailed patch suggestions

[Upgrade to Premium →](https://auditify.favianbhagaskara.my.id/pricing)

## 🛠️ Development

### File Structure

```
extension/
├── Code.gs              # Main Apps Script code
├── Sidebar.html         # Main sidebar interface
├── Settings.html        # Settings dialog
├── appsscript.json      # Add-on configuration
└── README.md           # This file
```

### Key Functions

- `onOpen()`: Creates add-on menu
- `showSidebar()`: Opens the main sidebar
- `showSettings()`: Opens settings dialog
- `getDocumentText()`: Retrieves full document text
- `getSelectedText()`: Retrieves selected text
- `auditText()`: Sends text to Auditify API
- `highlightIssues()`: Highlights issues in document
- `insertAuditSummary()`: Inserts audit report

### API Integration

The add-on communicates with Auditify's REST API:

```javascript
POST /api/audit
Headers:
  Authorization: Bearer {API_KEY}
  Content-Type: application/json
Body:
  {
    "text": "document text",
    "academicLevel": "SMA",
    "focusAreas": ["logic", "fact", "sentiment"]
  }
```

### Testing

1. Make changes to the code
2. Save the project
3. Click "Run" → "Test as add-on"
4. Select a test document
5. Verify functionality

## 📝 Changelog

### Version 1.0.0 (2024)
- Initial release
- Support for Google Docs
- Full document and selection auditing
- Issue highlighting
- Report insertion
- Settings management

## 🤝 Support

- **Documentation**: [auditify.favianbhagaskara.my.id/docs](https://auditify.favianbhagaskara.my.id/docs)
- **Email**: support@auditify.favianbhagaskara.my.id
- **Issues**: Report bugs on GitHub

## 📄 License

Copyright © 2024 Auditify. All rights reserved.

This add-on is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

## 🌟 Credits

Developed by the Auditify team with ❤️ for academic integrity.

Powered by:
- Google Apps Script
- Gemini AI
- Firebase
