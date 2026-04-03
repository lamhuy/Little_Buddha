const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

admin.initializeApp({ 
  projectId: "demo-little-buddha",
  storageBucket: "demo-little-buddha.appspot.com" 
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function generateTTS(text) {
  // Using Google Translate TTS as a free, open endpoint for dummy audio. Max 200 chars.
  const shortText = text.substring(0, 200); 
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(shortText)}`;
  const response = await fetch(ttsUrl);
  if (!response.ok) throw new Error(`TTS Fetch Failed: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function seed() {
  try {
    const textContentLesson1 = `When you feel upset, take a deep breath like a big frog! Hold it in... ribbit! Now let it out slowly. Do this 3 times. 

  Imagine you are sitting on a wide, green lily pad in the middle of a calm, cool pond. The sun is shining brightly above you, warming your skin. A gentle breeze ripples the water, making the surface dance with tiny, glittering waves. As you sit there, you notice how perfectly still you can be. Frogs are masters of stillness. They don't rush around or worry about what happened yesterday or what will happen tomorrow. They just sit, breathe, and notice the world around them. 

  When you breathe in, imagine your belly rounding out like a frog inflating its vocal sac. Inhale the fresh, clean air of the pond... one, two, three. Now slowly exhale, letting go of any tight, squiggly feelings inside you... three, two, one. Feel your shoulders drop and relax. Do you hear the sound of the water? Do you feel the soft breeze on your cheeks? 

  As you continue to breathe deeply and slowly, you realize that you hold a special superpower inside you. This superpower is calm. Whenever you feel angry, sad, or overwhelmed, you can close your eyes and visit this quiet pond in your mind. You can become the calm frog. Let your breathing be slow and heavy. Notice how the air feels cool as it enters your nose and warm as it gently leaves your mouth. Let your worries scatter like tiny bugs flying away into the distance. 

  It is okay to have big feelings, but it is also wonderful to know how to give your mind a break. Your breath is always with you, like a trusted friend waiting to help you find your steady center. So, whenever life feels too loud or too fast, remember the lily pad. Remember the still, sparkling water. Remember your deep, slow frog breaths. Inhale the calm, exhale the noise. Inhale the peace, exhale the rush. You are safe, you are still, and you are ready for whatever comes next. 

  Keep breathing. Let the ripples fade. You are just like that frog—quiet, peaceful, and completely present in this beautiful moment. Every time you breathe in, you breathe in quiet energy. Every time you breathe out, you push away any frustration or hurry. You can do this at school, before bed, or anytime you need a minute of absolute peace. The pond is always here for you, and so is your breath.`;

    const textContentLesson2 = `Once upon a time, young Prince Siddhartha found a swan that was hurt. He gently pulled out the arrow and gave it a safe place to heal. He taught everyone that life belongs to the one who saves it, not the one who tries to hurt it. Let's remember to be kind to all animals, just like the prince. 

  The prince, even as a small boy, knew that every living creature felt pain and joy just like humans do. When he saw the poor bird fall from the sky, his heart ached with compassion. He didn't think about his royal clothes getting dirty or the fact that swans can sometimes be frighteningly large; he only saw a creature that needed immediate help. 

  Wrapping the swan gently in his soft garments, he carried it to a quiet part of the palace gardens. He smoothed its ruffled, pure white feathers and spoke to it in low, soothing tones so it wouldn't be afraid. He understood that animals don't understand our words, but they perfectly understand our tone of voice and the gentleness of our hands. 

  His cousin, who had shot the arrow, came running and demanded the bird, saying 'I shot it, so it belongs to me!' But Siddhartha stood firm. He looked quietly at his older cousin and said, 'Life belongs to the one who loves and preserves it, not to the one who tried to destroy it.' The wise men of the court were called to settle the argument, and after hearing both boys, they agreed with the young prince. 

  This single act of kindness resonated throughout the entire kingdom, teaching everyone that true strength comes not from conquering others, but from showing mercy and compassion. We can easily bring this wisdom into our own lives. When we see a bug trapped inside, we can gently help it back outdoors instead of squashing it. When we see a dog that looks scared, we can give it space instead of rushing to pet it. 

  Every single day gives us an opportunity to be a little more like the compassionate prince. We are all connected in this big, beautiful world, and extending kindness to animals also teaches us to be kinder to each other. Kindness is like a tiny seed that, when planted, grows into a massive, blossoming tree that provides shade and shelter for everyone. Let your tree grow tall. Treat animals with the love and respect they deserve, and watch how it transforms your own heart into something as pure and beautiful as the white swan.`;

    const textContentLesson3 = `Deep inside a palace, there was a magical garden where it always felt like summer. Flowers bloomed in every color! But the young prince realized that real beauty isn't just about perfect weather. It's about having a warm, sunny heart that can find joy anywhere, even when it rains. 

  The king, Siddhartha's father, wanted his son to be perfectly happy all the time. He ordered his gardeners to create a space so spectacular that the prince would never experience sadness, cold, or discomfort. They built high walls to block out the harsh winter winds. They planted exotic trees that never lost their leaves, and exotic lotus flowers that seemed to glow in the artificial warmth. Fountains bubbled with crystal clear water, and colorful birds sang melodies all day long. From the outside, it was a paradise. 

  However, the prince soon grew curious. He noticed that outside the garden walls, the seasons changed. The leaves turned bright orange and fell to the ground, only to be reborn as fresh, green buds in the spring. He saw that true life was full of cycles—happy times and challenging times, sunny days and stormy nights. He realized that living in a fake, perfectly controlled environment wasn't true happiness. 

  True happiness comes from within. It is the ability to walk through a dark, rainy day and still appreciate the smell of the damp earth and the sound of the droplets tapping against the roof. The prince taught us that our minds are the real gardens. If we cultivate our inner garden properly, we can grow peace and happiness regardless of what is happening outside. We can plant seeds of gratitude for the simple things, like a warm blanket, a kind friend, or a tasty meal. We can water these seeds with positive thoughts and mindful breathing. 

  When anger or sadness creeps in like weeds, we don't have to panic. We can just notice them, accept that they are there, and gently pull them out by returning to our breath. The Garden of Perpetual Summer reminds us that we don't need a perfect palace to be happy. We carry the sun inside our own hearts. By choosing to look for the good, to spread kindness, and to remain calm during life's inevitable storms, we make our own perpetual summer wherever we go.`;

    const textContentLesson4 = `When school gets stressful or things feel overwhelming, find a quiet space. Close your eyes and focus entirely on the sound of your own breath. Growing up is challenging, and the transition between childhood and teenage years can feel like navigating a ship through a torrential storm. Between harder classes, navigating changing friendships, and the endless noise of social media or video games, your brain rarely gets a chance to truly rest. 

  Finding your inner focus is not about ignoring your problems or pretending everything is perfect; it's about giving yourself the mental space to handle those challenges effectively. Think of your mind like a jar of muddy water that has just been shaken up. When the water is swirling violently, you can't see clearly. Every thought, worry, and emotion is a fleck of mud clouding your vision. 

  If you try to force the water to be still by grabbing the jar and squeezing it, you only shake it more. The only way to clear the water is to set the jar down on a table and just wait. Slowly, gently, the mud begins to settle at the bottom, and the water becomes perfectly clear. This is precisely what happens when you practice inner focus. By sitting down, closing your eyes, and zeroing in on a single sensation—like the rise and fall of your chest, or the feeling of air passing through your nostrils—you give your mental 'mud' a chance to settle. 

  It might feel boring or difficult at first. Your mind will try to wander back to that upcoming math test or a disagreement with a friend. That is completely normal! When it happens, don't be angry with yourself. Just gently say "thinking" in your mind, and bring your attention right back to your breath. Every time you bring your focus back, you are strengthening your brain's "muscle" for concentration. 

  Over time, you will find it easier to pay attention in class, easier to stay calm when you are frustrated, and easier to fall asleep at night. You don't need any special equipment or completely silent rooms to do this. You can find your inner focus while riding the bus, while waiting for the bell to ring, or lying in bed. It is a powerful tool you carry with you everywhere, ready to anchor you whenever the waves of life get a little too rough.`;

    const textContentLesson5 = `Anxiety is a normal part of growing up. Try the 5-4-3-2-1 grounding technique to snap out of spiraling thoughts. Navigating the teenage years brings a tidal wave of changes: academic pressures mount, social dynamics become infinitely more complicated, and expectations from parents, teachers, and even yourself can feel suffocatingly heavy. 

  Anxiety is your body's natural alarm system, a relic from primitive times designed to keep you safe from immediate physical danger like a charging animal. The problem is that today, that same intense physical alarm triggers over things like exams, social media posts, or uncertain futures. Your heart might race, your stomach might tie itself into knots, and your brain might spin out of control imagining the worst-case scenarios. 

  The key to handling this is not to fight the anxiety, but to ground yourself back in the present reality. When you feel a panic spiral starting, the 5-4-3-2-1 technique is a psychological circuit breaker. First, pause and look around to find 5 things you can see. Name them silently: a blue pen, a crack in the wall, a cloud outside, your shoe, the corner of your desk. 

  Next, find 4 things you can physically feel. Touch the rough texture of your jeans, feel the chair pressing against your back, the solid ground beneath your feet, the cool air from an AC vent. Then, listen for 3 things you can hear. Maybe it's the hum of the refrigerator, a distant car, or the ticking of a clock. Identify 2 things you can smell—perhaps a hint of laundry detergent on your clothes or the scent of rain outside. Finally, find 1 thing you can taste, even if it's just the lingering flavor of toothpaste or chewing gum. 

  By forcing your brain to process intense sensory input across all five senses, you literally hijack the neural pathways that are fueling the anxiety loop. You pull your mind away from the terrifying "what ifs" of the future, and slam it right back into the inescapable reality of the "right now." In this exact second, you are safe. In this exact second, you are breathing. 

  Along with grounding, learning to observe your thoughts without judging them is a profound skill. Imagine your anxious thoughts as dark clouds passing across the sky. You are not the clouds; you are the sky. The clouds can be ugly and stormy, but they always pass, while the sky remains perfectly intact underneath. You have the resilience to survive these storms. Be kind to yourself, talk to someone you trust when the burden feels too heavy, and remember that this period of overwhelming change is temporary. You are building emotional muscles that will serve you for the rest of your life.`;

    const lessons = [
      {
        id: "lesson-0-7",
        title: "Mindful Breathing for Kids",
        textContent: textContentLesson1,
        audioRef: "audio/lesson-0-7.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Breathe in", "Breathe out"],
        discussionQuestions: ["How do you feel now?"]
      },
      {
        id: "lesson-0-7-swan",
        title: "The Prince and the Wounded Swan",
        textContent: textContentLesson2,
        audioRef: "audio/lesson-0-7-swan.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Be gentle to animals", "Help those who are hurt", "Every life is precious"],
        discussionQuestions: ["Have you ever helped an animal?", "How does it feel to be kind?"]
      },
      {
        id: "lesson-0-7-garden",
        title: "The Garden of Perpetual Summer",
        textContent: textContentLesson3,
        audioRef: "audio/lesson-0-7-garden.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Find joy anywhere", "A sunny heart matters most", "Beauty is inside"],
        discussionQuestions: ["What makes your heart feel sunny?", "Can you be happy on a rainy day?"]
      },
      {
        id: "lesson-8-12",
        title: "Finding Your Inner Focus",
        textContent: textContentLesson4,
        audioRef: "audio/lesson-8-12.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Find quiet", "Focus on breath"],
        discussionQuestions: ["Where is your quiet space?"]
      },
      {
        id: "lesson-13-18",
        title: "Navigating Teenage Anxiety",
        textContent: textContentLesson5,
        audioRef: "audio/lesson-13-18.mp3",
        targetAgeTier: "13-18",
        summaryPoints: ["5-4-3-2-1 technique", "Snap out of spirals"],
        discussionQuestions: ["What triggers your spirals?"]
      }
    ];

    for (const lesson of lessons) {
      // 1. Save to Firestore
      await db.collection("lessons").doc(lesson.id).set(lesson);
      console.log(`Created lesson document: ${lesson.title} (${lesson.targetAgeTier})`);

      // 2. Generate and Save Audio to Storage
      console.log(`  Generating audio for ${lesson.audioRef}...`);
      const audioBuffer = await generateTTS(lesson.textContent);
      
      const file = bucket.file(lesson.audioRef);
      await file.save(audioBuffer, {
        contentType: 'audio/mpeg'
      });
      console.log(`  Successfully uploaded ${lesson.audioRef} to Storage Emulator!`);
    }
    console.log("Lessons and audio seeded successfully into the emulator!");
  } catch (err) {
    console.error("Error seeding lessons:", err);
  }
}

seed();
