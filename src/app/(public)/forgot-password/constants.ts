export const jsonLdForgotPassword = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Forgot Password | APXTeck",
  "description": "Reset your APXTeck account password securely.",
  "url": "https://apxteck.com/forgot-password",
  "mainEntity": {
    "@type": "Action",
    "name": "Reset Password",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://apxteck.com/forgot-password",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    }
  }
};
