describe('Story Consumption Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to lesson details, display the story, summary, and questions', async () => {
    // Wait for the home screen to load the lesson list
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('lesson-item-0'))).toBeVisible();
    
    // Tap the first lesson to navigate to the detail view
    await element(by.id('lesson-item-0')).tap();
    await expect(element(by.id('lesson-detail-screen'))).toBeVisible();
    
    // Verify content sections exists
    await expect(element(by.id('lesson-title'))).toBeVisible();
    await expect(element(by.id('lesson-content'))).toBeVisible();
    
    // Scroll down to see summary and questions
    await element(by.id('lesson-scroll-view')).scrollTo('bottom');
    await expect(element(by.id('lesson-summary'))).toBeVisible();
    await expect(element(by.id('lesson-questions'))).toBeVisible();
  });
  
  it('should render the audio player controls', async () => {
    // Tap the lesson to view details
    await element(by.id('lesson-item-0')).tap();
    // Ensure the player is rendered
    await expect(element(by.id('audio-player-container'))).toBeVisible();
    await expect(element(by.id('btn-play-pause'))).toBeVisible();
  });
});
