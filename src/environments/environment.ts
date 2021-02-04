// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: '/api/',
  GOOGLE_ID: '1049403244521-u22c7cqslgbmd26ovlskpf1n58i39p85.apps.googleusercontent.com',
  FACEBOOK_ID: '1049403244521-u22c7cqslgbmd26ovlskpf1n58i39p85.apps.googleusercontent.com',
  paypalSandboxId : 'AXG7SxD3vnp1YfY77SRmSxWpM-CcSbkV0IjyK20xRuiIp5M78asYYQE13gWIvFWX7XpPGiqkVpkzeZJk',
  paypalEnvironment: 'sandbox',
  paypalLiveId: 'xxxxxxxxxxxxxx',
  stripePublishableKey : 'pk_test_51I1SRRBmOF177dL8ieemvQmYogEfrnCIk16BoH7jEWmIAI7mAuezi2qb95WqKUnvVQf0cGBjokxkIcFhLyUikCDU00WLjVVIoT',
  BUCKET_NAME: 'boilerplate-s3-upload',
  S3_USER_KEY: 'AKIAWJO53WPWLMBXMCUZ',
  S3_USER_SECRET: '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',
};
