describe('Content Discovery Flow', () => {
  beforeAll(async () => {
    // Requires a logged-in session, simulating success
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display age-appropriate content lists on the home screen', async () => {
    // Asserting we are on home screen
    await expect(element(by.id('home-screen'))).toBeVisible();

    // The LessonList component should render
    await expect(element(by.id('lesson-list-container'))).toBeVisible();
    
    // There should be at least one lesson visible
    await expect(element(by.id('lesson-item-0'))).toBeVisible();
  });
});
