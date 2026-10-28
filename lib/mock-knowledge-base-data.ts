import { KnowledgeArticle, KnowledgeCategory } from '@/types/knowledge-base';

export const KNOWLEDGE_CATEGORIES: {
  id: KnowledgeCategory;
  label: string;
  description: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}[] = [
  {
    id: 'IT & Hardware',
    label: 'IT & Hardware',
    description: 'Laptops, monitors, peripherals, docking stations, and hardware repairs.',
    icon: 'monitor',
    colorClass: 'text-[#063F3F]',
    bgClass: 'bg-[#EBF5EE]',
  },
  {
    id: 'Software & Applications',
    label: 'Software & Applications',
    description: 'SaaS licensing, Figma, Slack, Jira, Zoom, and desktop tooling.',
    icon: 'layers',
    colorClass: 'text-[#0284C7]',
    bgClass: 'bg-[#E0F2FE]',
  },
  {
    id: 'Network & Connectivity',
    label: 'Network & Connectivity',
    description: 'Corporate VPN, office Wi-Fi, DNS setup, and remote access routing.',
    icon: 'wifi',
    colorClass: 'text-[#0D9488]',
    bgClass: 'bg-[#CCFBF1]',
  },
  {
    id: 'Account & Access',
    label: 'Account & Access',
    description: 'Enterprise SSO, Okta password resets, MFA recovery, and permissions.',
    icon: 'key',
    colorClass: 'text-[#D97706]',
    bgClass: 'bg-[#FEF3C7]',
  },
  {
    id: 'Security',
    label: 'Security',
    description: 'Phishing reporting, 2FA keys, endpoint protection, and incident alerts.',
    icon: 'shield',
    colorClass: 'text-[#DC2626]',
    bgClass: 'bg-[#FEE2E2]',
  },
  {
    id: 'Engineering & Development',
    label: 'Engineering & Development',
    description: 'GitHub Enterprise, SSH keys, Docker, CI/CD pipelines, and AWS access.',
    icon: 'code',
    colorClass: 'text-[#7C3AED]',
    bgClass: 'bg-[#EDE9FE]',
  },
  {
    id: 'HR & Workplace',
    label: 'HR & Workplace',
    description: 'Employee onboarding, benefits access, desk setup, and travel guidelines.',
    icon: 'users',
    colorClass: 'text-[#059669]',
    bgClass: 'bg-[#D1FAE5]',
  },
  {
    id: 'Marketing & Operations',
    label: 'Marketing & Operations',
    description: 'Brand asset requests, campaign collateral reviews, and expense filing.',
    icon: 'fileText',
    colorClass: 'text-[#DB2777]',
    bgClass: 'bg-[#FCE7F3]',
  },
];

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-101',
    title: 'How to Reset Your Enterprise SSO & Okta Password',
    category: 'Account & Access',
    excerpt:
      'Step-by-step instructions for resetting expired credentials, setting up self-service password recovery, and unfreezing locked accounts.',
    content: `## Overview
All TicketGo and corporate tools use unified Okta Single Sign-On (SSO). If your password has expired or your account is temporarily locked due to failed attempts, follow this verified self-service procedure.

---

### Step 1: Access the Self-Service Portal
1. Navigate to \`https://identity.ticketgo.io\` in an incognito browser window.
2. Below the primary sign-in form, click **"Need help signing in?"** and select **"Forgot Password?"**.
3. Enter your primary corporate email address (\`username@ticketgo.io\` or company domain) and click **"Reset via Email"** or **"Reset via SMS"**.

---

### Step 2: Verify Your Identity
- **Email Verification**: Check your recovery inbox for a secure one-time password reset link (valid for 15 minutes).
- **Push Notification**: If you have the Okta Verify app installed on your enrolled mobile device, confirm the push request and verify the matching 2-digit challenge number.

---

### Step 3: Set a Compliant Password
Your new password must satisfy corporate identity standards:
- Minimum **14 characters** in length
- At least one uppercase letter (A-Z) and one lowercase letter (a-z)
- At least one numeral (0-9) and one special symbol (\`!@#$%^&*\`)
- Cannot match any of your previous 5 passwords

---

### Still Having Trouble?
If your multi-factor authentication (MFA) device was replaced or you cannot receive the recovery challenge, you may require IT desk verification. Create a ticket under **Account & Access** to request an identity verification callback.`,
    keywords: ['password', 'sso', 'okta', 'login', 'reset', 'credentials', 'locked', 'mfa', 'account'],
    updatedAt: '2 days ago',
    readingTime: '3 min read',
    viewCount: 2480,
    relatedArticleIds: ['kb-110', 'kb-103', 'kb-105'],
  },
  {
    id: 'kb-102',
    title: 'Connecting to Corporate GlobalProtect VPN & Troubleshooting 502/Gateway Errors',
    category: 'Network & Connectivity',
    excerpt:
      'Instructions for establishing secure remote access via GlobalProtect VPN and resolving connection dropouts or SSL certificate errors.',
    content: `## Quick Summary
Remote team members must connect to the corporate Palo Alto GlobalProtect VPN gateway to access internal VPC subnets, staging environments, and internal dashboard tooling.

---

### Connecting for the First Time
1. Open the **GlobalProtect** client from your system tray or application launcher.
2. Ensure the portal address is configured to:
   \`vpn.internal.ticketgo.io\`
3. Click **Connect**. Your default browser will launch an Okta SSO authentication prompt.
4. Complete the biometric or 2-factor confirmation. Once authenticated, the shield icon turns solid blue.

---

### Troubleshooting Common Errors

#### 1. "Gateway Not Reachable" or "Network Error 502"
- Disconnect from non-corporate proxy servers or personal VPNs.
- Flush your local DNS cache:
  - **macOS**: \`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder\`
  - **Windows**: \`ipconfig /flushdns\` in PowerShell.
- Switch to the alternate regional gateway by selecting **Settings → Gateway Selection → US-East-Backup**.

#### 2. "Authentication Token Expired"
- In GlobalProtect Settings, click **Settings → Account → Refresh Connection**.
- Re-authenticate via the fresh browser prompt.

---

### Best Practices for High Bandwidth
- Video conferencing (Zoom, Google Meet) and public SaaS tools (Slack, Figma) utilize split tunneling and do not require heavy VPN routing.
- If experiencing high latency during video calls, ensure split tunneling is toggled ON under GlobalProtect Preferences.`,
    keywords: ['vpn', 'globalprotect', 'network', 'gateway', '502', 'connection', 'remote', 'wifi', 'dns'],
    updatedAt: 'Yesterday',
    readingTime: '4 min read',
    viewCount: 3120,
    relatedArticleIds: ['kb-108', 'kb-104', 'kb-101'],
  },
  {
    id: 'kb-103',
    title: 'Requesting Software Licenses and Application Access (Figma, GitHub, Slack, Jira)',
    category: 'Software & Applications',
    excerpt:
      'Guidelines for requesting standard enterprise tool seats, upgrading developer licenses, and manager approval workflows.',
    content: `## Standard Tool Catalog
All active team members receive standard access to Google Workspace, Slack, and Zoom upon onboarding. Additional productivity and technical software requires approval based on role allocation:

| Application | Eligible Departments | Allocation Type |
| :--- | :--- | :--- |
| **Figma Professional** | Design, Product, Frontend Eng | Manager sign-off required |
| **GitHub Enterprise** | Engineering, QA, DevOps | Automatic via Engineering Team |
| **Jira & Confluence** | All Departments | Standard Self-Service |
| **AWS IAM Sandbox** | Backend, Infra, Data | Architecture review required |
| **Tableau Creator** | Analytics, Growth, Finance | Department budget approval |

---

### How to Submit a License Request
1. Check if the tool is pre-approved for your department in Okta Self-Service Catalog.
2. In Okta Dashboard, click **Add Apps → Request App**.
3. If the tool is not listed in Okta self-service, submit an internal **Ticket** with:
   - **Type**: \`General Request\` or \`Task\`
   - **Department**: Target Department (e.g. Design or Engineering)
   - **Business Justification**: State your active project and why the license is required.
   - **Manager Email**: Your direct supervisor for budget authorization.

---

### Approval Turnaround SLA
- **Standard licenses (Figma, GitHub)**: Approved within 4 business hours.
- **High-tier or custom tooling**: Requires department head approval (1-2 business days).`,
    keywords: ['software', 'license', 'figma', 'github', 'jira', 'slack', 'apps', 'access', 'tools'],
    updatedAt: '3 days ago',
    readingTime: '3 min read',
    viewCount: 1890,
    relatedArticleIds: ['kb-104', 'kb-101', 'kb-107'],
  },
  {
    id: 'kb-104',
    title: 'Local Development Environment Setup & SSH Key Configuration for GitHub Enterprise',
    category: 'Engineering & Development',
    excerpt:
      'Complete guide for configuring SSH ed25519 keys, GPG signing, Node.js runtime environments, and repo clone access.',
    content: `## Prerequisites
Before cloning private organization repositories, you must generate a cryptographically secure SSH key pair and associate it with your GitHub Enterprise profile.

---

### Step 1: Generate an ED25519 Key Pair
Open your terminal and run the following command (substitute with your corporate email):

\`\`\`bash
ssh-keygen -t ed25519 -C "your.name@ticketgo.io"
\`\`\`

When prompted for passphrase, provide a strong passphrase or save it to your local macOS Keychain / Windows Credential Manager.

---

### Step 2: Add SSH Key to ssh-agent
\`\`\`bash
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add -K ~/.ssh/id_ed25519
\`\`\`

---

### Step 3: Register Public Key on GitHub
1. Copy the public key to clipboard:
   \`\`\`bash
   pbcopy < ~/.ssh/id_ed25519.pub
   # or on Windows:
   Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
   \`\`\`
2. Navigate to **GitHub → Settings → SSH and GPG keys**.
3. Click **New SSH key**, paste your key, and label it with your work machine name (e.g., \`Work-MacBook-M3\`).
4. Click **Configure SSO** next to your key and authorize the \`ticketgo-org\` organization.

---

### Step 4: Verify Connection
Test your setup:
\`\`\`bash
ssh -T git@github.com
# Hi username! You've successfully authenticated...
\`\`\`

If you receive \`Permission denied (publickey)\`, confirm that you authorized SSO for the key in GitHub settings.`,
    keywords: ['engineering', 'github', 'ssh', 'git', 'keys', 'development', 'ed25519', 'terminal', 'code'],
    updatedAt: '5 days ago',
    readingTime: '5 min read',
    viewCount: 2210,
    relatedArticleIds: ['kb-111', 'kb-103', 'kb-102'],
  },
  {
    id: 'kb-105',
    title: 'How to Identify and Report Suspected Phishing Emails and Security Incidents',
    category: 'Security',
    excerpt:
      'Protocol for recognizing social engineering attempts, isolating infected devices, and reporting suspicious messages to the InfoSec team.',
    content: `## Critical Incident Reminder
TicketGo security and IT administrators **will never** ask for your plaintext password, MFA one-time passcode, or ask you to purchase gift cards via email, Slack, or SMS.

---

### Telltale Indicators of Phishing
1. **Urgent or Threatening Tone**: Phrases like *"Immediate account suspension within 1 hour"* or *"Wire transfer required immediately"*.
2. **Mismatched Sender Domains**: The display name says "Alex Morgan (CEO)" but the sending address is \`alex.m-company-notice@gmail-auth.net\`.
3. **Suspicious Attachments**: Unprompted \`.zip\`, \`.html\`, or macro-enabled \`.xlsm\` documents disguised as invoices or payroll updates.
4. **Credential Harvesting Links**: Hovering over buttons reveals unexpected third-party URL redirections.

---

### How to Report Suspicious Emails
- **In Google Workspace / Outlook**: Click the **"Report Phishing"** button in your email client's toolbar. This sends headers directly to the automated SOC quarantine pipeline.
- **In Slack**: Do not click links or download files. Forward the permalink to \`#security-alerts\` or DM the Security Triage bot.

---

### What to Do If You Clicked a Link or Entered Credentials
1. **Disconnect immediately**: Turn off Wi-Fi or unplug your Ethernet cable.
2. **Reset credentials from another trusted device**: Change your Okta password immediately.
3. **Notify Security Emergency Team**: Create a Ticket with **Type**: \`Incident\` and **Priority**: \`Critical\`, and notify the on-call SRE lead in \`#incident-room\`.`,
    keywords: ['security', 'phishing', 'incident', 'scam', 'suspicious', 'infosec', 'email', 'reporting', 'hack'],
    updatedAt: '1 week ago',
    readingTime: '4 min read',
    viewCount: 2890,
    relatedArticleIds: ['kb-110', 'kb-101', 'kb-106'],
  },
  {
    id: 'kb-106',
    title: 'New Employee IT Onboarding Checklist & Hardware Delivery Protocol',
    category: 'HR & Workplace',
    excerpt:
      'Essential first-week technology setup guide, day-one equipment configuration, and workplace benefits orientation.',
    content: `## Welcome to TicketGo!
This guide walks new employees through their first 48 hours of workstation configuration, security compliance, and account provisioning.

---

### Day 1: Hardware Arrival & Unboxing
1. Your company laptop arrives in tamper-evident packaging. Inspect the seal before opening.
2. Power on your machine and connect to home/office Wi-Fi.
3. When prompted, select **Remote Management (MDM)** and log in using the temporary Okta credentials provided via SMS by your People Ops lead.
4. Allow 15–20 minutes for MDM to deploy company certificates, SentinelOne endpoint defense, and standard software packages.

---

### Day 1 Checklist
- [ ] Reset temporary Okta password and enroll primary mobile device in Okta Verify.
- [ ] Connect to \`vpn.internal.ticketgo.io\` using GlobalProtect.
- [ ] Sign into Google Workspace, Slack, and complete 2FA verification.
- [ ] Set your profile avatar and timezone in Slack.
- [ ] Introduce yourself in the \`#welcome-lobby\` channel!

---

### Day 2: Tooling & Team Access
- Meet with your onboarding buddy to review repository and project permissions.
- If you require specialized licenses (e.g. Figma, AWS, JetBrains), see guide **[kb-103: Requesting Software Licenses]**.
- Ensure direct deposit and tax withholding forms are submitted in the HR portal.`,
    keywords: ['onboarding', 'hr', 'new hire', 'laptop', 'welcome', 'checklist', 'workplace', 'setup'],
    updatedAt: '4 days ago',
    readingTime: '4 min read',
    viewCount: 1650,
    relatedArticleIds: ['kb-101', 'kb-109', 'kb-103'],
  },
  {
    id: 'kb-107',
    title: 'Submitting Marketing Campaign Assets and Brand Collateral Review Requests',
    category: 'Marketing & Operations',
    excerpt:
      'Standards for requesting product screenshots, brand design reviews, social media graphics, and campaign copy approvals.',
    content: `## Brand Request Workflow
To ensure brand consistency across external channels, all customer-facing collateral, slide decks, social graphics, and product release marketing assets must follow the TicketGo brand review procedure.

---

### When Is a Review Required?
- Public website landing pages or blog illustrations
- Sales presentation slide decks presented to Tier-1 enterprise accounts
- Press release graphics and social media campaign collateral
- Email marketing templates sent to 1,000+ external recipients

---

### How to Submit a Review Ticket
Create a Ticket with the following parameters:
- **Type**: \`Task\`
- **Department**: \`Marketing\`
- **Project**: Your campaign or release initiative (e.g., *Q4 Growth Campaign*)
- **Due Date**: Minimum **3 business days** prior to public launch
- **Attachments**: Link to Figma frame, Google Slides draft, or high-res PNG assets.

---

### Brand Assets Library
Approved SVG logos, typography tokens, official color hex codes, and product mockup templates can be downloaded from the internal Brand Drive folder: \`https://assets.internal.ticketgo.io/brand\`.`,
    keywords: ['marketing', 'brand', 'campaign', 'assets', 'design', 'review', 'collateral', 'social'],
    updatedAt: '6 days ago',
    readingTime: '3 min read',
    viewCount: 980,
    relatedArticleIds: ['kb-103', 'kb-112', 'kb-106'],
  },
  {
    id: 'kb-108',
    title: 'Troubleshooting Office Wi-Fi Connectivity and 802.1X Certificate Errors',
    category: 'Network & Connectivity',
    excerpt:
      'Resolving certificate trust prompts, IP lease exhaustion, and slow connection speeds on TicketGo-Corporate wireless networks.',
    content: `## Office Wireless Networks
TicketGo office facilities provide three distinct Wi-Fi networks:

1. **TicketGo-Corporate**: High-speed, encrypted 802.1X network for managed corporate laptops only.
2. **TicketGo-IoT**: Dedicated 2.4GHz network for printers, meeting room displays, and hardware testing.
3. **TicketGo-Guest**: Isolated network with captive portal for visitors and contractors.

---

### Connecting to TicketGo-Corporate
1. Select **TicketGo-Corporate** from your Wi-Fi menu.
2. When prompted for credentials, use your **Okta username** and current password.
3. If prompted to accept the certificate \`radius.internal.ticketgo.io\` issued by \`TicketGo Enterprise Root CA\`, click **Trust / Always Allow**.

---

### Resolving Common Wi-Fi Issues

#### Certificate Expired or Untrusted Error
If your machine fails 802.1X certificate validation:
- Open **Terminal** and renew your machine profile certificates:
  \`\`\`bash
  sudo profiles renew -type enrollment
  \`\`\`
- Reconnect to the network and accept the updated certificate prompt.

#### "Self-Assigned IP (169.254.x.x)"
- Toggle Wi-Fi OFF for 5 seconds, then ON.
- If the issue persists, renew your DHCP lease:
  - **macOS**: System Settings → Network → Wi-Fi → Details → TCP/IP → **Renew DHCP Lease**.
  - **Windows**: \`ipconfig /renew\` in PowerShell.`,
    keywords: ['wifi', 'network', 'office', 'certificate', '802.1x', 'connectivity', 'dhcp', 'internet'],
    updatedAt: '1 week ago',
    readingTime: '3 min read',
    viewCount: 1420,
    relatedArticleIds: ['kb-102', 'kb-109', 'kb-101'],
  },
  {
    id: 'kb-109',
    title: 'Standard Laptop Replacement, Peripheral Procurement & Monitor Setup',
    category: 'IT & Hardware',
    excerpt:
      'Hardware refresh cycle policies, ordering ergonomic keyboards/mice, docking station compatibility, and dual-monitor displays.',
    content: `## Hardware Refresh Policies
TicketGo provides high-performance workstations to all full-time employees. Standard workstation lifecycles:
- **Laptops (Apple MacBook Pro / Dell XPS Developer Edition)**: 3-year refresh cycle.
- **Monitors & Docking Stations**: 4-year refresh cycle or upon damage.
- **Peripherals (Keyboards, Mice, Webcams)**: Available upon request from IT stockroom.

---

### Requesting Peripherals & Ergo Equipment
Employees are entitled to one ergonomic setup package:
- Choice of external mechanical keyboard or Apple Magic Keyboard
- Logitech MX Master wireless mouse or trackpad
- CalDigit Thunderbolt 4 dock or Dell universal dual-display hub
- Dual 27-inch 4K IPS monitors with adjustable arms

To request peripherals, submit a ticket under **Type**: \`General Request\` with **Department**: \`IT & Hardware\`.

---

### Dual 4K Monitor Troubleshooting
If external displays flicker or fail to wake from sleep:
1. Ensure the Thunderbolt cable is connected directly to the primary host port on your laptop, not via unpowered hubs.
2. Update display driver firmware via the manufacturer utility.
3. On Apple Silicon Macs, ensure **Displays → Advanced → Prevent automatic sleeping when display is off** is toggled appropriately.`,
    keywords: ['hardware', 'laptop', 'monitor', 'keyboard', 'mouse', 'dock', 'peripherals', 'replacement'],
    updatedAt: '2 weeks ago',
    readingTime: '4 min read',
    viewCount: 1750,
    relatedArticleIds: ['kb-106', 'kb-108', 'kb-103'],
  },
  {
    id: 'kb-110',
    title: 'Configuring 2-Factor Authentication (FIDO2 & Authenticator App)',
    category: 'Security',
    excerpt:
      'Enrolling secondary authentication devices, YubiKey hardware keys, and generating emergency bypass codes.',
    content: `## Multi-Factor Authentication Requirements
All TicketGo accounts require minimum 2 authentication factors to access corporate assets. We recommend hardware FIDO2 keys (YubiKey) or biometric Touch ID / Windows Hello.

---

### Enrolling a New Device in Okta Verify
1. Log into \`https://identity.ticketgo.io\` on your laptop.
2. Click your name in the top right → **Settings → Extra Verification**.
3. Under **Okta Verify**, click **Set Up**.
4. Scan the QR code using the Okta Verify app on your iOS or Android device.
5. Confirm by selecting **Enable Push Notifications** and biometric verification.

---

### Enrolling a YubiKey Hardware Security Key
1. Under **Extra Verification**, find **Security Key or Biometric Authenticator**.
2. Click **Set Up** and insert your YubiKey into an available USB port.
3. Touch the golden contact sensor on your YubiKey when prompted by your browser.
4. Label your key (e.g., \`YubiKey 5C NFC Primary\`).

---

### Generating Emergency Backup Codes
Keep emergency backup codes stored in a secure physical location:
- In Okta Settings, select **Get Backup Codes**.
- Save or print the 10 one-time emergency codes. Each code can be used once if your primary mobile device is lost or discharged.`,
    keywords: ['2fa', 'mfa', 'security', 'yubikey', 'okta verify', 'fido2', 'authenticator', 'protection'],
    updatedAt: '1 week ago',
    readingTime: '3 min read',
    viewCount: 2050,
    relatedArticleIds: ['kb-101', 'kb-105', 'kb-104'],
  },
  {
    id: 'kb-111',
    title: 'Engineering Production Deployment Pipeline & Release Sign-Off Procedure',
    category: 'Engineering & Development',
    excerpt:
      'Standard operating procedure for staging verification, automated canary analysis, changelog generation, and production deployments.',
    content: `## Deployment Architecture
Production releases at TicketGo follow automated trunk-based continuous delivery managed through GitHub Actions and ArgoCD across multiple cloud clusters.

---

### Pre-Deployment Checklist
- [ ] All PRs merged into \`main\` must have passing unit, integration, and E2E test suites.
- [ ] Code changes must receive at least 2 peer reviews from code owners.
- [ ] Database migrations must be backwards-compatible (expand/contract pattern).
- [ ] Feature flags configured in LaunchDarkly with 0% initial targeting.

---

### Staging Verification
Deploy to staging before scheduled production windows:
\`\`\`bash
gh workflow run deploy-staging.yml -f branch=main
\`\`\`
Verify health metrics at \`https://staging-metrics.internal.ticketgo.io\` for at least 15 minutes.

---

### Production Canary Deployment
1. Trigger the canary release workflow in GitHub Actions.
2. The deployment automatically routes **5% of production traffic** to the canary pods.
3. ArgoCD monitors HTTP 5xx error rates and p99 latency for 10 minutes.
   - If error rate exceeds 0.1%, automated rollback initiates immediately.
   - If health criteria pass, promotion to 100% progresses across all availability zones.
4. Post release notes in \`#engineering-releases\` tagging the relevant product managers.`,
    keywords: ['engineering', 'deployment', 'release', 'production', 'pipeline', 'argocd', 'canary', 'devops'],
    updatedAt: '3 days ago',
    readingTime: '5 min read',
    viewCount: 1580,
    relatedArticleIds: ['kb-104', 'kb-102', 'kb-105'],
  },
  {
    id: 'kb-112',
    title: 'Expense Report Submission & Corporate Card Receipt Guidelines',
    category: 'Marketing & Operations',
    excerpt:
      'Guidelines for monthly corporate card reconciliations, travel per diems, software expense submissions, and approval deadlines.',
    content: `## Expense Policy Summary
TicketGo reimburses legitimate business expenses incurred while conducting company operations. Monthly reconciliations must be finalized within **5 business days** of the statement close.

---

### Eligible Reimbursable Expenses
- **Travel & Lodging**: Pre-approved flights, hotel rooms within corporate rate caps, and ground transportation.
- **Meals with Clients or Team Events**: Maximum $65 per person for team dinners with itemized receipt.
- **Home Office Internet Stipend**: $50/month remote connectivity stipend applied automatically via payroll.
- **Books & Learning**: Up to $500/year professional development allowance.

---

### How to File an Expense Report
1. Open the internal Finance portal at \`https://expenses.internal.ticketgo.io\`.
2. Click **Create New Report** and select the appropriate cost center.
3. Upload itemized receipts (credit card slips alone are not acceptable).
4. Add a concise business justification for each line item.
5. Submit for direct manager review.

---

### Reimbursement Timelines
- Approved reports submitted by the 15th of the month are paid on the subsequent payroll cycle.
- For questions regarding rejected receipts or corporate card limit adjustments, create a Ticket with **Department**: \`Finance & Operations\`.`,
    keywords: ['finance', 'expense', 'reimbursement', 'travel', 'receipts', 'operations', 'money', 'budget'],
    updatedAt: '2 weeks ago',
    readingTime: '3 min read',
    viewCount: 1120,
    relatedArticleIds: ['kb-107', 'kb-106', 'kb-103'],
  },
];

/**
 * Helper lookup functions
 */
export function getArticleById(id: string): KnowledgeArticle | undefined {
  const normalizedId = id.trim().toLowerCase();
  return MOCK_KNOWLEDGE_ARTICLES.find(
    (a) => a.id.toLowerCase() === normalizedId
  );
}

export function getRelatedArticles(article: KnowledgeArticle): KnowledgeArticle[] {
  return article.relatedArticleIds
    .map((id) => getArticleById(id))
    .filter((a): a is KnowledgeArticle => a !== undefined);
}

export function getPopularArticles(limit: number = 4): KnowledgeArticle[] {
  return [...MOCK_KNOWLEDGE_ARTICLES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}
