describe('Onboarding and Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the login screen by default when unauthenticated', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('should navigate to registration, fill details, and show verification', async () => {
    await element(by.id('nav-register-button')).tap();
    await expect(element(by.id('registration-screen'))).toBeVisible();
    
    await element(by.id('input-email')).typeText('test@example.com');
    await element(by.id('input-password')).typeText('Password123!');
    await element(by.id('input-name')).typeText('Little Buddha');
    await element(by.id('input-birthyear')).typeText('2015');
    
    // Close keyboard
    await element(by.id('input-birthyear')).tapReturnKey();
    
    await element(by.id('btn-register')).tap();
    // Assuming navigation to verification screen
    await expect(element(by.id('verification-screen'))).toBeVisible();
  });
});
