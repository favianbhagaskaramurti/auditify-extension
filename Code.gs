/**
 * Auditify Google Workspace Add-on
 * Audit your academic documents directly from Google Workspace
 */

// Configuration
const AUDITIFY_API_URL = 'https://auditify-app-744909172024.us-central1.run.app/api';
const AUDITIFY_AUTH_URL = 'https://auditify-app-744909172024.us-central1.run.app/auth';
const ADDON_NAME = 'Auditify';
/** Keep AI requests fast (full Docs can be 100k+ chars). */
const MAX_ANALYSIS_CHARS = 12000;

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 */
function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Auditify', 'showSidebar')
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens the sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Auditify')
    .setWidth(400);
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Opens settings dialog (placeholder for future settings).
 */
function showSettings() {
  // For now, just open the sidebar
  showSidebar();
}

/**
 * Gets the text content from the current document.
 */
function getDocumentText() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const text = body.getText();
    
    return {
      success: true,
      text: text,
      wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
      charCount: text.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Gets selected text from the document.
 */
function getSelectedText() {
  try {
    const doc = DocumentApp.getActiveDocument();
    const selection = doc.getSelection();
    
    if (!selection) {
      return {
        success: false,
        error: 'No text selected. Please select text to audit.'
      };
    }
    
    const elements = selection.getRangeElements();
    let text = '';
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (element.getElement().editAsText) {
        const textElement = element.getElement().editAsText();
        
        if (element.isPartial()) {
          text += textElement.getText().substring(
            element.getStartOffset(),
            element.getEndOffsetInclusive() + 1
          );
        } else {
          text += textElement.getText();
        }
      }
    }
    
    return {
      success: true,
      text: text,
      wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
      charCount: text.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Handle OAuth callback from web app.
 * This function is called when user completes login on the web.
 */
function doGet(e) {
  const idToken = e.parameter.token;
  
  if (idToken) {
    // Save token automatically
    const result = saveIdToken(idToken);
    
    if (result.success) {
      return HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #0a0a0f;
              color: #f1f1f7;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .success-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 24px;
              box-shadow: 0 8px 24px rgba(81, 207, 102, 0.35);
            }
            h1 {
              font-size: 28px;
              margin: 0 0 12px 0;
            }
            p {
              color: #8b8b9e;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Login Successful!</h1>
          <p>You can close this window and return to Google Docs.</p>
          <script>
            setTimeout(function() {
              window.close();
            }, 2000);
          </script>
        </body>
        </html>
      `);
    } else {
      return HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #0a0a0f;
              color: #f1f1f7;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
              padding: 20px;
            }
            .error-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 24px;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 12px 0;
              color: #ff6b6b;
            }
            p {
              color: #8b8b9e;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <h1>Login Failed</h1>
          <p>${result.error || 'Unknown error occurred'}</p>
          <p>Please try again.</p>
        </body>
        </html>
      `);
    }
  }
  
  // Default response
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_top">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a0f;
          color: #f1f1f7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(108, 92, 231, 0.35);
        }
        h1 {
          font-size: 32px;
          margin: 0 0 12px 0;
        }
        p {
          color: #8b8b9e;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="logo">A</div>
      <h1>Auditify Extension</h1>
      <p>OAuth callback endpoint</p>
    </body>
    </html>
  `);
}

/**
 * Poll Auditify API for OAuth token after user completes web login (add-on flow).
 * Does not require a separate Web App deployment — only the add-on deployment.
 */
function pollAddonOAuth() {
  const userProperties = PropertiesService.getUserProperties();
  const state = userProperties.getProperty('OAUTH_STATE');

  // Login may have finished in the browser while state was already cleared
  if (!state) {
    const idToken = userProperties.getProperty('AUDITIFY_ID_TOKEN');
    if (idToken) {
      return {
        success: true,
        isLoggedIn: true,
        email: userProperties.getProperty('AUDITIFY_USER_EMAIL') || null,
      };
    }
    return { success: false, isLoggedIn: false };
  }

  try {
    const url = AUDITIFY_API_URL + '/oauth/addon/token?state=' + encodeURIComponent(state);
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();

    if (code === 200) {
      const data = JSON.parse(response.getContentText());
      if (data.token) {
        PropertiesService.getUserProperties().deleteProperty('OAUTH_STATE');
        const saved = saveIdToken(data.token);
        if (saved.success) {
          return {
            success: true,
            isLoggedIn: true,
            email: saved.user && saved.user.email ? saved.user.email : null,
          };
        }
        return { success: false, isLoggedIn: false, error: saved.error || 'Failed to save token' };
      }
    }
  } catch (e) {
    Logger.log('pollAddonOAuth: ' + e);
  }

  return { success: false, isLoggedIn: false };
}

/**
 * Open login page in browser; add-on receives token via API poll (state), not Web App redirect.
 */
function openLoginPopup() {
  const state = Utilities.getUuid();
  PropertiesService.getUserProperties().setProperty('OAUTH_STATE', state);

  const authUrl = AUDITIFY_AUTH_URL + '?extension=true&state=' + encodeURIComponent(state);
  
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_top">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a0f;
          color: #f1f1f7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(108, 92, 231, 0.35);
        }
        h2 {
          margin: 0 0 16px 0;
          font-size: 24px;
        }
        p {
          color: #8b8b9e;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #6c5ce7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .status {
          margin-top: 16px;
          font-size: 14px;
          color: #a29bfe;
        }
      </style>
    </head>
    <body>
      <div class="logo">A</div>
      <h2>Opening Login Page...</h2>
      <p>Please login in the browser window that just opened.<br>This window will close automatically after login.</p>
      <div class="spinner"></div>
      <div class="status" id="status">Waiting for login...</div>
      <script>
        // Open login page in new window
        window.open('${authUrl}', '_blank', 'width=600,height=700');
        
        // Poll for login completion
        let attempts = 0;
        const maxAttempts = 150; // 5 minutes (150 * 2 seconds)
        
        const interval = setInterval(function() {
          attempts++;
          
          if (attempts > maxAttempts) {
            clearInterval(interval);
            document.getElementById('status').textContent = 'Login timeout. Please try again.';
            setTimeout(function() {
              google.script.host.close();
            }, 3000);
            return;
          }
          
          google.script.run
            .withSuccessHandler(function(result) {
              if (result && result.success && result.isLoggedIn) {
                clearInterval(interval);
                document.getElementById('status').textContent = 'Login successful! Closing...';
                setTimeout(function() {
                  google.script.host.close();
                }, 1000);
              } else if (result && result.error) {
                document.getElementById('status').textContent = result.error;
              }
            })
            .withFailureHandler(function(err) {
              document.getElementById('status').textContent = 'Login error: ' + err;
            })
            .pollAddonOAuth();
        }, 2000);
      </script>
    </body>
    </html>
  `).setWidth(500).setHeight(400);
  
  DocumentApp.getUi().showModalDialog(htmlOutput, 'Login to Auditify');
  
  return { success: true };
}

/**
 * Save Firebase ID token.
 */
function saveIdToken(idToken) {
  try {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('AUDITIFY_ID_TOKEN', idToken);
    
    // Verify token by calling backend
    const options = {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + idToken
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(AUDITIFY_API_URL + '/user/profile', options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      const userData = JSON.parse(response.getContentText());
      userProperties.setProperty('AUDITIFY_USER_EMAIL', userData.email);
      userProperties.setProperty('AUDITIFY_USER_ID', userData.uid);
      
      return {
        success: true,
        isLoggedIn: true,
        email: userData.email || null,
        user: userData
      };
    } else {
      return {
        success: false,
        error: 'Invalid token. Please login again.'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Logout user.
 */
function logout() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.deleteProperty('AUDITIFY_ID_TOKEN');
    userProperties.deleteProperty('AUDITIFY_USER_EMAIL');
    userProperties.deleteProperty('AUDITIFY_USER_ID');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Check if user is logged in.
 */
function isLoggedIn() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const idToken = userProperties.getProperty('AUDITIFY_ID_TOKEN');
    const email = userProperties.getProperty('AUDITIFY_USER_EMAIL');
    
    return {
      success: true,
      isLoggedIn: !!idToken,
      email: email || null
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Refresh Firebase ID token.
 */
function refreshIdToken() {
  // Token refresh not needed - user must re-login via web
  return {
    success: false,
    error: 'Token expired. Please login again via Settings.'
  };
}

/**
 * Get current ID token.
 */
function getIdToken() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const idToken = userProperties.getProperty('AUDITIFY_ID_TOKEN');
    
    if (!idToken) {
      return {
        success: false,
        error: 'Not logged in. Please login first.'
      };
    }
    
    return {
      success: true,
      idToken: idToken
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Audit current document with configuration.
 */
function auditCurrentDocument(config) {
  try {
    // Get document text
    const textResult = getDocumentText();
    if (!textResult.success) {
      return textResult;
    }
    
    // Call audit API
    return auditText(textResult.text, config);
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Truncate document text for drift/graph/defense API calls.
 */
function truncateForAnalysis(text) {
  if (!text) return '';
  if (text.length <= MAX_ANALYSIS_CHARS) return text;
  return text.substring(0, MAX_ANALYSIS_CHARS) + '\n\n[... dokumen dipotong untuk analisis ...]';
}

/**
 * Authenticated POST to Auditify API (paths relative to /api).
 */
function callAuditifyApi(relativePath, payload) {
  try {
    const tokenResult = getIdToken();
    if (!tokenResult.success) {
      return tokenResult;
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + tokenResult.idToken
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      followRedirects: true,
      validateHttpsCertificates: true
    };

    const path = relativePath.indexOf('/') === 0 ? relativePath : '/' + relativePath;
    var response;
    try {
      response = UrlFetchApp.fetch(AUDITIFY_API_URL + path, options);
    } catch (fetchError) {
      return {
        success: false,
        error: 'Tidak dapat terhubung ke server Auditify: ' + fetchError
      };
    }
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode === 401) {
      return {
        success: false,
        error: 'Token expired. Please login again.'
      };
    }

    if (responseCode >= 200 && responseCode < 300) {
      try {
        var data = JSON.parse(responseBody);
        if (data && data.error && !data.baseline && !data.nodes && !data.reply && !data.paragraphs) {
          return { success: false, error: data.error };
        }
        return { success: true, data: data };
      } catch (parseError) {
        return { success: false, error: 'Respons server tidak valid.' };
      }
    }

    var errorMsg = 'API Error: ' + responseCode;
    try {
      var parsedErr = JSON.parse(responseBody);
      if (parsedErr.error) errorMsg = parsedErr.error;
    } catch (e) {
      if (responseBody && responseBody.length < 200) {
        errorMsg = responseBody;
      }
    }
    return { success: false, error: errorMsg };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Semantic drift analysis for the active document.
 */
function runSemanticDrift() {
  var textResult = getDocumentText();
  if (!textResult.success) return textResult;
  if (!textResult.text || !textResult.text.trim()) {
    return { success: false, error: 'Dokumen kosong. Tulis teks terlebih dahulu.' };
  }
  return callAuditifyApi('/extension/analysis', {
    type: 'drift',
    documentText: truncateForAnalysis(textResult.text)
  });
}

/**
 * Dependency graph analysis for the active document.
 */
function runDependencyGraph() {
  var textResult = getDocumentText();
  if (!textResult.success) return textResult;
  if (!textResult.text || !textResult.text.trim()) {
    return { success: false, error: 'Dokumen kosong. Tulis teks terlebih dahulu.' };
  }
  return callAuditifyApi('/extension/analysis', {
    type: 'dependency',
    documentText: truncateForAnalysis(textResult.text)
  });
}

/**
 * Defense Arena — initial or follow-up message.
 * @param {Object} options - { opponentProfile, stressTestMode }
 * @param {Array} messages - [{ role: 'user'|'model', content: string }]
 */
function runDefenseArena(options, messages) {
  var textResult = getDocumentText();
  if (!textResult.success) return textResult;
  if (!textResult.text || !textResult.text.trim()) {
    return { success: false, error: 'Dokumen kosong. Tulis teks terlebih dahulu.' };
  }

  options = options || {};
  messages = messages || [];

  return callAuditifyApi('/extension/analysis', {
    type: 'defense',
    documentText: truncateForAnalysis(textResult.text),
    messages: messages,
    opponentProfile: options.opponentProfile || 'Pakar Akademik',
    stressTestMode: options.stressTestMode === true
  });
}

/**
 * Sends text to Auditify API for analysis.
 */
function auditText(text, config) {
  try {
    const tokenResult = getIdToken();
    
    if (!tokenResult.success) {
      return tokenResult;
    }
    
    const payload = {
      text: text,
      academicLevel: config.academicLevel || 'SMA',
      focusAreas: config.focusAreas || ['logic', 'fact', 'sentiment']
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + tokenResult.idToken
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(AUDITIFY_API_URL + '/extension/audit', options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    if (responseCode === 401) {
      // Token expired
      return {
        success: false,
        error: 'Token expired. Please login again via Settings.'
      };
    }
    
    if (responseCode === 200) {
      return {
        success: true,
        data: JSON.parse(responseBody)
      };
    } else {
      return {
        success: false,
        error: 'API Error: ' + responseCode + ' - ' + responseBody
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Saves API key to user properties.
 * @deprecated Use login functions instead
 */
function saveApiKey(apiKey) {
  try {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('AUDITIFY_API_KEY', apiKey);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Gets saved API key.
 * @deprecated Use getIdToken instead
 */
function getApiKey() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const apiKey = userProperties.getProperty('AUDITIFY_API_KEY');
    return {
      success: true,
      apiKey: apiKey || ''
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Highlights issues in the document based on audit results.
 */
function highlightIssues(issues) {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const text = body.getText();
    
    // Clear existing highlights
    body.editAsText().setBackgroundColor(null);
    
    // Highlight each issue
    issues.forEach(issue => {
      if (issue.location && issue.location.includes('Paragraf')) {
        // Extract paragraph number
        const paragraphMatch = issue.location.match(/Paragraf (\d+)/);
        if (paragraphMatch) {
          const paragraphIndex = parseInt(paragraphMatch[1]) - 1;
          const paragraphs = body.getParagraphs();
          
          if (paragraphIndex < paragraphs.length) {
            const paragraph = paragraphs[paragraphIndex];
            const color = getSeverityColor(issue.severity);
            paragraph.editAsText().setBackgroundColor(color);
          }
        }
      }
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Gets color based on severity level.
 */
function getSeverityColor(severity) {
  switch (severity) {
    case 'CRITICAL':
      return '#ffe6e6'; // Light red
    case 'HIGH':
      return '#fff4e6'; // Light orange
    case 'MEDIUM':
      return '#fffbe6'; // Light yellow
    case 'LOW':
      return '#e6ffe6'; // Light green
    default:
      return '#f0f0f0'; // Light gray
  }
}

/**
 * Inserts audit summary at the end of the document.
 */
function insertAuditSummary(auditResult) {
  try {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
    // Add page break
    body.appendPageBreak();
    
    // Add title
    const title = body.appendParagraph('Auditify - Audit Report');
    title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    title.editAsText().setBold(true);
    
    // Add timestamp
    const timestamp = body.appendParagraph('Generated: ' + new Date().toLocaleString());
    timestamp.editAsText().setFontSize(10).setForegroundColor('#666666');
    
    // Add score
    const score = body.appendParagraph('Integrity Score: ' + auditResult.audit_results.score + '/100');
    score.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    // Add grade
    const grade = body.appendParagraph('Grade: ' + auditResult.audit_results.grade);
    grade.editAsText().setBold(true);
    
    // Add summary
    body.appendParagraph('Summary:');
    body.appendParagraph(auditResult.audit_results.summary);
    
    // Add issues
    if (auditResult.audit_results.issues.length > 0) {
      body.appendParagraph('Issues Found: ' + auditResult.audit_results.issues.length)
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);
      
      auditResult.audit_results.issues.forEach((issue, index) => {
        const issueText = body.appendParagraph(
          (index + 1) + '. [' + issue.severity + '] ' + issue.code + ' - ' + issue.description
        );
        issueText.editAsText().setFontSize(11);
      });
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Gets user's tier information.
 */
function getUserTier() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const tier = userProperties.getProperty('AUDITIFY_TIER') || 'free';
    return {
      success: true,
      tier: tier
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
