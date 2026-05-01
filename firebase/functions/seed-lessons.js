const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { GoogleGenAI } = require('@google/genai');

const PRODUCTION_PROJECT_ID = 'little-buddha-ff838';

function enableEmulatorEnv() {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
}

function disableEmulatorEnv() {
  delete process.env.FIRESTORE_EMULATOR_HOST;
  delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  delete process.env.STORAGE_EMULATOR_HOST; // firebase-admin secretly injects this under the hood!
}

// ── Emulator App ──
enableEmulatorEnv();
const emulatorApp = admin.initializeApp({
  projectId: "little-buddha-ff838",
  storageBucket: "little-buddha-ff838.firebasestorage.app"
}, 'emulator');
const emulatorDb = getFirestore(emulatorApp);
const emulatorBucket = getStorage(emulatorApp).bucket();

// ── Production App ──
disableEmulatorEnv();
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
let credential;
try {
  credential = admin.credential.cert(require(keyPath));
} catch (e) {
  console.error("Missing serviceAccountKey.json for production!");
  process.exit(1);
}

const { Storage } = require('@google-cloud/storage');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const prodApp = admin.initializeApp({
  projectId: PRODUCTION_PROJECT_ID,
  credential,
}, 'production');
const prodDb = getFirestore(prodApp);

// Use native Storage library to bypass firebase-admin emulator caching bug
const prodStorage = new Storage({
  projectId: PRODUCTION_PROJECT_ID,
  keyFilename: keyPath,
});
const prodBucket = prodStorage.bucket(`${PRODUCTION_PROJECT_ID}.firebasestorage.app`);

// Google Cloud Text-to-Speech client (uses the same service account key)
const ttsClient = new TextToSpeechClient({ keyFilename: keyPath });

async function generateTTS(text) {
  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Neural2-F', // Warm, natural female voice suitable for children's stories
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.9,  // Slightly slower for young listeners
      pitch: 1.0,
    },
  });
  return Buffer.from(response.audioContent);
}

async function generateImageBuffer(text) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const fallback = async () => {
    const res = await fetch(`https://placehold.co/600x400/png?text=Illustration+Scene`);
    return Buffer.from(await res.arrayBuffer());
  };

  if (!GEMINI_API_KEY) {
    console.warn("  [!] GEMINI_API_KEY is missing. Using placeholder image.");
    return fallback();
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const shortText = text.substring(0, 150).replace(/\n/g, ' ');
    const prompt = `A soft, beautiful children's book digital illustration. Warm pastel colors, gentle brushwork. Scene: ${shortText}`;

    console.log(`    Requesting Gemini image generation...`);
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: prompt,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      p => p.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imagePart) {
      throw new Error('No image part returned from Gemini');
    }

    console.log(`    Image generated successfully!`);
    return Buffer.from(imagePart.inlineData.data, 'base64');
  } catch (err) {
    console.error('  [!] Gemini image generation failed, using placeholder:', err.message);
    return fallback();
  }
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

    const textContentLesson4_stillwater = `Have you ever met a really wise friend who tells the best stories? Imagine a big, fluffy panda named Stillwater who moves into your neighborhood! Stillwater has soft black-and-white fur and the gentlest eyes you have ever seen. He loves to sit quietly under a tall tree, sipping tea, and sharing wonderful stories with the children who visit him.

  One day, Stillwater told a story about a kind old man named Uncle Ry. Uncle Ry lived in a tiny, simple house with almost nothing inside. One night, a thief snuck into his home looking for something to steal. But there was nothing valuable to take! Uncle Ry felt so sorry for the thief that he took off his own coat and gave it to him, saying, "Here, please take this so you do not leave empty-handed." After the thief left, Uncle Ry sat by his window and looked up at the beautiful, glowing moon. He smiled and whispered, "I wish I could have given him this wonderful moon." Uncle Ry taught us that the most beautiful things in life, like the moon, the stars, and love, cannot be stolen because they belong to everyone.

  Stillwater also told the story of A Heavy Load. Two friends were walking down a muddy road when they saw someone who needed help crossing a big puddle. The first friend carried the person across without thinking twice. The second friend got upset because he thought his friend should not have done that. Hours later, the second friend was still grumbling and angry. The first friend looked at him gently and said, "I already put that person down a long time ago. Why are you still carrying them?" This story teaches us something very important: when something bothers us, we can choose to let it go instead of carrying angry feelings around all day like a heavy backpack full of rocks.

  Stillwater's stories remind us that we do not need lots of toys or things to be happy. True happiness comes from being generous, from letting go of anger, and from noticing the beautiful world around us. The next time you feel upset about something, try being like Uncle Ry. Look up at the sky and notice something beautiful. Or try being like the first friend on the muddy road, and simply let go of what is bothering you. You will feel so much lighter, as if you could float right up to the clouds! Stillwater the panda would be very proud of you.`;

    const textContentLesson5_pebble = `Have you ever picked up a smooth, pretty pebble from the ground and held it in your hand? There was a very wise teacher named Thich Nhat Hanh who taught children a magical way to use small pebbles to feel calm, strong, and happy. He called it the Pebble Meditation, and it is like having four tiny superheroes right in your pocket!

  Here is how it works. First, you find four small pebbles. They can be any pebbles you like, maybe round ones, sparkly ones, or colorful ones from the garden. You put them in a little pouch or a small bag that fits right in your pocket. Whenever you need to feel better, you take them out and hold them one at a time.

  The first pebble is the Flower Pebble. When you hold it, you say to yourself, "I am a flower. I feel fresh." Flowers are beautiful and bright, and guess what? So are you! You do not even have to try because your smile and your kind heart already make you bloom like the prettiest flower in the garden. Take a deep breath in and imagine you smell the sweetest rose. Breathe out and let your whole body feel fresh and new.

  The second pebble is the Mountain Pebble. Hold it tightly and say, "I am a mountain. I feel solid and strong." Mountains are tall and steady. They do not wobble when the wind blows, and they do not shake when the rain falls. When you feel nervous or scared, hold your Mountain Pebble and imagine you are as strong and unshakable as the biggest mountain in the world. Nothing can knock you down because you are solid as a rock!

  The third pebble is the Water Pebble. Hold it gently and say, "I am still water. I can see things clearly." When a lake is calm and still, you can see all the way to the bottom. But when the water is splashing everywhere, everything looks blurry and mixed up. Your mind works the same way! When you stop and breathe and become very still, you can think clearly and make good choices.

  The fourth and final pebble is the Space Pebble. Hold it and say, "I am space. I feel free." Space is huge and open, like the big blue sky that goes on forever and ever. When you feel crowded or squished by too many worries, imagine you are as wide and open as the sky itself. There is plenty of room for all your feelings, and that makes you free. You can do this pebble meditation anywhere, anytime. It is your secret peaceful power!`;

    const textContentLesson6_moody = `Have you ever had one of those really, really bad days where everything goes wrong? Maybe you woke up from a scary dream, your sibling took your favorite toy, you missed your ride, and then you tripped and scraped your knee. That is exactly what happened to a young cow named Peter in a story called Moody Cow Meditates.

  Peter was having the worst day ever. He was so angry and frustrated that his friends started calling him "Moody Cow." His face was scrunched up like a raisin, his fists were balled up tight, and his tummy felt like it was full of buzzing, angry bees. He did not want to talk to anyone. He did not want to play. He just wanted to stomp and shout and be grumpy forever.

  But then, Peter's wise and loving grandfather came to visit. Grandfather did not yell at Peter or tell him to stop being upset. Instead, he smiled warmly and said, "Come with me. I want to show you something magical." He took Peter to the kitchen and pulled out a big, clear glass jar. He filled it with water and then added a spoonful of sparkly glitter. "This jar is like your mind," Grandfather explained. "Now shake it up really hard!" Peter shook the jar as hard as he could, and the glitter swirled everywhere in a wild, sparkly tornado. He could not see through the water at all!

  "This is what your mind looks like when you are angry or upset," Grandfather said gently. "All those swirling sparkles are your mad thoughts spinning around and around. Now set the jar down on the table and just watch." Peter set the jar down and waited. Slowly, very slowly, the glitter began to drift down. The sparkles floated softly to the bottom of the jar like tiny snowflakes falling on a quiet winter night. The water became clear again, and Peter could see right through it.

  "That is what happens when you take a moment to breathe and be still," Grandfather said. "Your angry thoughts settle down, and your mind becomes clear and calm again." Peter took a big, deep breath. Then another. And another. He felt his shoulders relax, his fists uncurl, and his tummy stop buzzing. He was still Peter, but now he felt peaceful instead of moody. You can make your own mind jar at home with water and glitter. Whenever you feel grumpy, shake it up, set it down, and breathe while you watch it clear. Your calm is always waiting for you, just like Peter discovered.`;

    const textContentLesson7_monkey = `Long, long ago, in a beautiful forest beside a wide, sparkling river, there lived a great Monkey King. He was the leader of eighty thousand monkeys, and he loved every single one of them as if they were his own family. The Monkey King was strong, brave, and very wise. His troop lived in an enormous mango tree that grew the sweetest, most delicious mangoes in the entire world.

  The Monkey King knew that if humans ever tasted these magical mangoes, they would want the tree for themselves. So he told his monkeys, "We must make sure no mango ever falls into the river, because the water will carry it downstream to the human kingdom." The monkeys worked hard to pick every mango before it could drop. But one tiny mango, hidden behind a clump of leaves where a little ant had built its nest, was missed. It ripened, turned golden, and tumbled into the river with a gentle splash.

  The mango floated all the way down to the kingdom of a human king called Brahmadatta. When the king tasted it, his eyes went wide. "This is the most wonderful fruit I have ever eaten! I must find the tree that grows these!" He gathered his soldiers and followed the river upstream until they found the great mango tree, filled with thousands of monkeys. "Surround the tree!" the king ordered. "We will take this tree for ourselves!"

  The monkeys were terrified. They were trapped with soldiers and archers all around them. But the Monkey King did not panic. He looked at his frightened family and said, "Do not worry. I will save you." With a mighty leap, he jumped across the river to a tall tree on the other side. He tied a strong vine around his waist, leaped back, and stretched his long body between the two trees, creating a living bridge.

  "Climb across my back to safety!" he called out. One by one, all eighty thousand monkeys scrambled across the Monkey King's body to freedom. His arms ached, his back hurt, but he held on tight until every last monkey was safe. King Brahmadatta watched from below in amazement. He had never seen such bravery and love. He gently rescued the exhausted Monkey King and said, "You are the greatest leader I have ever known. You gave everything to protect those you love." The Monkey King smiled weakly and whispered, "A true leader puts others before himself." This story teaches us that real strength is not about being the biggest or the toughest. Real strength is caring about others so much that you would do anything to keep them safe.`;

    const textContentLesson8_wonder = `Have you ever looked up at the night sky and wondered why the stars twinkle? Have you ever watched a caterpillar and asked, "How does it know to become a butterfly?" Have you ever stared at the rain and thought, "Where does all that water come from?" If you have, then you already know one of the most wonderful feelings in the whole world. It is called wonder.

  There is a girl named Eva who loves to go on walks with her mom. On their walks, they see all sorts of amazing things. They see leaves changing color in the fall, tiny ants carrying crumbs ten times their size, fluffy clouds shaped like animals drifting across the sky, and flowers opening up to greet the morning sun. Every time Eva sees something incredible, she asks her mom, "Why does that happen?" And sometimes, her mom gives her a great answer. But sometimes, her mom says something even more magical. She says, "I do not know! Isn't that wonderful?"

  At first, this might sound strange. How can not knowing something be wonderful? But think about it this way: if we already knew everything about everything, there would be nothing left to discover! The mysteries of the world are like unopened presents waiting for us to explore them. Not knowing is the very beginning of every adventure, every invention, and every great idea.

  Some of the smartest people who ever lived were the ones who were brave enough to say, "I don't know, but I want to find out!" They looked at the stars and wondered what they were made of. They watched apples fall from trees and wondered why things drop down instead of floating up. They stared at the ocean and wondered what lived at the very bottom. All of these questions led to incredible discoveries!

  You have a superpower, and it is your curiosity. Every single question you ask makes your brain grow bigger and stronger. Do not be afraid to wonder. Do not be embarrassed to say, "I don't know." Because not knowing is not a weakness. It is the sparkly, exciting beginning of learning something new. The universe is full of mysteries just waiting for someone like you to explore them. So the next time you see something amazing, let yourself feel that tingly feeling of wonder. Sit with it, smile at it, and say, "I wonder!" That is the bravest and most beautiful thing you can do. Keep wondering, keep asking, keep exploring. The world needs your curious heart.`;

    const textContentLesson9_kindness = `Imagine you are standing by a calm, still pond. The water is smooth and glassy, like a giant mirror reflecting the sky. Now pick up a small pebble and toss it gently into the water. What happens? Splash! Tiny ripples spread out from where the pebble landed, growing bigger and bigger, reaching farther and farther across the pond. Those ripples are just like kindness. Every kind thing you do, no matter how small, sends ripples out into the world that touch other people in ways you might never even see.

  There is a story about a girl named Chloe and a new student named Maya who joined her class at school. Maya was quiet and shy. She wore old, worn-out clothes and carried toys that were a little different from what the other kids had. Maya tried again and again to make friends. She smiled at Chloe, she asked to play, and she tried to join in at recess. But Chloe and the other children ignored her. They whispered about her clothes and turned away when she came near.

  Then one day, Maya stopped coming to school. She was gone. After she left, Chloe's teacher, Ms. Albert, brought a big bowl of water and some small stones to class. She asked each child to drop a stone into the water and watch what happened. The children saw the beautiful ripples spreading out, wave after wave after wave. "Each act of kindness is like one of these stones," Ms. Albert explained. "It creates ripples that spread far beyond what you can see."

  Chloe's heart felt heavy. She thought about all the times she could have smiled at Maya, all the times she could have shared a snack or said, "Come play with us!" But those moments were gone, and Maya was not coming back. Chloe realized something very important that day: kindness is not something you can save for later. It is something you must give right now, in this very moment, because you might not get another chance.

  This story teaches us a powerful lesson. You do not need to do something big or grand to make a difference. A smile, a friendly hello, saving a seat for someone who is alone, sharing your crayons, or simply saying "I like your drawing" can create ripples of kindness that spread further than you will ever know. Every single day, you have the chance to drop a pebble of kindness into the world. So do it today! Be the person who smiles first, who includes everyone, and who never lets an opportunity to be kind pass by. Your ripples will change the world, one small splash at a time.`;

    const textContentLesson10_rabbit = `A very, very long time ago, in a peaceful forest filled with tall trees and gentle streams, there lived four best friends: a wise rabbit, a playful monkey, a clever otter, and a sneaky jackal. The rabbit was the wisest of them all. He was always reminding his friends to be generous and kind to everyone they met.

  One special day, the rabbit gathered his friends together and said, "Tomorrow is a holy day. Let us each find something wonderful to give to anyone who comes by and is hungry." The friends agreed and set out to find gifts. The otter dove into the cool river and caught seven beautiful red fish. The monkey swung through the trees and gathered a big pile of sweet, ripe mangoes. The jackal searched and found a pot of creamy yogurt and a plump lizard.

  But the little rabbit looked down at his paws and felt worried. He only ate grass, and who would want a bundle of plain old grass? The rabbit thought very carefully and made a brave and incredible decision. He said to himself, "If someone comes to me hungry, I will offer the only thing I truly have. I will offer myself." His heart was so pure and so full of love that he was ready to give everything he had.

  Now, high above the clouds, the King of the Heavens, whose name was Sakka, felt a warm glow on his golden throne. He looked down and saw the little rabbit's amazingly generous heart. "I must go see this for myself," Sakka said. He disguised himself as a tired, hungry traveler and visited each animal. The otter offered fish, the monkey offered mangoes, and the jackal offered his yogurt. Then Sakka came to the rabbit.

  "Kind rabbit, I am so hungry. Do you have anything for me?" the traveler asked. The brave little rabbit nodded. "I will give you everything I have," he said softly. Sakka made a small fire, but just before the rabbit could step in, something magical happened. The fire felt as cool as a gentle breeze! Not a single whisker was harmed. Sakka threw off his disguise and revealed his shining, heavenly form. "Little rabbit," he said with tears in his eyes, "your heart is the most generous in all the world. I want everyone to remember your kindness forever."

  So Sakka painted the image of the brave little rabbit on the glowing face of the moon. And that is why, even today, when you look up at the full moon on a clear night, you can see the shape of a rabbit right there on its surface! The Rabbit on the Moon reminds us that true giving comes from the heart. You do not need to have the biggest gift or the most expensive present. What matters most is how much love you put into your giving. Even the smallest act of kindness, given with a full heart, can shine as brightly as the moon itself.`;

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

    const textContentLesson_fourTruths = `Have you ever wondered why life sometimes feels hard, even when everything seems like it should be fine? Maybe you got the new video game you wanted, but after a week you are already bored and want something else. Or maybe you aced a test, but instead of feeling great, you are already stressed about the next one. The Buddha noticed this same pattern over 2,500 years ago, and he came up with a simple but powerful explanation called the Four Noble Truths.

  The First Noble Truth is called Dukkha, which means "suffering" or "unsatisfactoriness." But don't worry, it doesn't mean life is always terrible! It means that no matter how good things get, there is always a little itch, a little feeling that something is missing. Think of it like this: you know that feeling when you finish a really amazing book or TV show? There is this weird emptiness afterward. That's dukkha. It is the gap between what we have and what we wish we had.

  The Second Noble Truth is Samudaya, which means "the cause of suffering." The Buddha said our suffering comes from craving, which means constantly wanting things to be different from how they are. We want more, we want better, we want things to last forever. It is like being on a treadmill that never stops. You keep running toward the next thing, but you never actually arrive anywhere.

  The Third Noble Truth is Nirodha, which means "the end of suffering." This is the good news! The Buddha said it IS possible to step off that treadmill. When you stop clinging to things, when you learn to enjoy them without desperately needing them, you find a deep, lasting peace that doesn't depend on getting the next new thing.

  The Fourth Noble Truth is Magga, which means "the path." This is the Buddha's roadmap for how to actually get to that peaceful place. It is called the Noble Eightfold Path, and it includes things like thinking clearly, speaking kindly, and paying attention to the present moment. You don't have to be perfect at it. It is a practice, like learning an instrument. The more you work at it, the better you get. The Four Noble Truths aren't about being sad or giving up fun. They are about understanding why we sometimes feel stuck, and knowing there is a clear way forward.`;

    const textContentLesson_eightfoldPath = `Imagine you are trying to get to an incredible destination, maybe a hidden waterfall deep in a forest or the final boss level of the hardest video game ever made. You know it exists, and you really want to get there. But what if you had no map, no GPS, and no guide? You would wander around in circles, getting frustrated and lost. Over 2,500 years ago, the Buddha found that incredible destination, a place of lasting inner peace, and then he drew a map so that everyone else could find it too. He called this map the Noble Eightfold Path.

  Think of the Eightfold Path as having eight directions on a compass. They are not eight separate steps you do one after another, like climbing stairs. Instead, they all work together at the same time, like the different instruments in a band. Each one makes the others sound better. The first two directions are about Wisdom. Right View means seeing the world as it really is, not just how you wish it was. Right Intention means making sure your goals come from kindness and not from selfishness or anger.

  The next three directions are about Ethics, which is how you behave in the world. Right Speech means being honest and kind with your words. Think about the last text message you sent. Was it truthful? Was it helpful? Right Action means doing things that help rather than harm. And Right Livelihood means that when you grow up and get a job, you choose one that does not hurt other people or the planet.

  The last three directions are about training your Mind. Right Effort means putting energy into growing your good qualities and shrinking your bad habits, kind of like practicing free throws to get better at basketball while also working to stop fouling. Right Mindfulness means paying attention to what is happening right now, instead of zoning out or worrying about tomorrow. And Right Concentration means learning to focus your mind deeply, like when you are so absorbed in a book that you don't even hear someone calling your name.

  Here is the cool part: you do not have to be a monk or live in a monastery to follow this path. You can practice it right now, today. When you choose your words carefully online, that is Right Speech. When you pay attention in class instead of daydreaming, that is Right Mindfulness. When you decide to help a friend instead of ignoring them, that is Right Action. The Eightfold Path is not about being perfect. It is about trying every day to be a little bit wiser, a little bit kinder, and a little bit more aware. That is how you find your way to that hidden waterfall of peace.`;

    const textContentLesson_impermanence = `Think about the last trend that swept through your school. Maybe it was a viral dance on TikTok, a new slang word everyone was using, or a type of candy that everyone had to have. For a while, it felt like it would last forever. But then, almost overnight, it vanished and something new took its place. This cycle of things appearing, existing for a while, and then fading away is one of the most important teachings in Buddhism. It is called Anicca, which is a Pali word that means "impermanence."

  Impermanence means that nothing in the universe stays the same forever. Absolutely nothing. The weather changes, seasons change, your body grows taller, your friendships evolve, and even mountains slowly crumble over millions of years. Think of a sandcastle at the beach. You might spend an hour building the most amazing castle with towers and a moat. But when the tide comes in, the waves wash it away. That does not mean it was pointless to build it! You can still enjoy making it and admiring it. But clinging to it and crying because the ocean did what oceans do only adds unnecessary sadness.

  The Buddha taught that a lot of our unhappiness comes from pretending things are permanent when they are not. We get a new phone and think it will always feel shiny and exciting. We make a best friend and assume they will always be around. We have a great day and expect tomorrow to be just as good. When those things change, as they always do, we feel disappointed and even angry. But the problem was never the change itself. The problem was our expectation that things would stay the same.

  Here is where it gets really cool. Impermanence is not just bad news. It is also incredibly good news! If you are having a terrible day, that day is impermanent too. If you failed a test, that failure is not permanent. If you are going through a tough time with a friend, that difficulty will change. Impermanence means that no dark cloud hangs around forever. There is always a chance for something new and better to come along.

  The next time something changes in your life and it bothers you, try this: instead of fighting the change, just notice it. Say to yourself, "This is impermanence, and that is okay." You can still feel sad or frustrated, but underneath those feelings, you will start to notice a quiet calmness. That calmness comes from understanding how the world actually works. Impermanence is not something to be afraid of. It is the engine that keeps life interesting, fresh, and full of possibility.`;

    const textContentLesson_karma = `You have probably heard the word "karma" before, maybe in a movie or a meme. People often say things like, "That's karma!" when something bad happens to someone who was being mean. But the real meaning of karma in Buddhism is much deeper and more interesting than just "what goes around comes around." The Pali word "kamma" actually means "action" or "deed," and the Buddha taught that every intentional action you take plants a seed that will eventually grow into a result.

  Think of your mind as a garden. Every thought you think, every word you say, and every action you take is like planting a seed in that garden. Kind thoughts and generous actions plant flowers and fruit trees. Mean words and selfish behavior plant thorny weeds. You might not see the results right away, just like a real garden takes time to grow. But over days, weeks, and months, those seeds sprout. Your garden becomes whatever you have been planting, whether you realize it or not.

  One of the most important parts of karma is the word "intentional." The Buddha said it is your intention behind the action that matters most. If you accidentally step on someone's foot, that is very different from stomping on it on purpose. If you share your lunch because you genuinely want to help a hungry friend, that plants a much stronger positive seed than sharing it only because a teacher told you to. Karma is about what is happening inside your heart and mind, not just what it looks like from the outside.

  Here is something else that makes karma really powerful: you are never stuck with a bad garden. Even if you have been planting weeds for a while, you can start planting flowers right now, today. Every single moment gives you a brand new chance to choose a better action. The Buddha never said karma is punishment. It is simply how things work, like gravity. If you drop a ball, it falls. If you plant a sunflower seed, a sunflower grows. Your actions work the same way.

  The coolest thing about understanding karma is that it puts you in the driver's seat of your own life. You are not waiting for some outside force to reward you or punish you. You are creating your own future with every choice you make. So the next time you are about to say something unkind or do something you know is wrong, pause for one second and ask yourself, "What kind of seed am I about to plant?" That one second of pause is one of the most powerful tools you will ever have.`;

    const textContentLesson_deerKing = `Long ago, in a vast forest bordered by a sparkling river, there lived two herds of deer. One herd was led by a golden deer called Nigrodha, whose coat shone like polished amber in the sunlight. He was wise, patient, and deeply loved by every deer in his herd. The other herd was led by a deer named Branch, who was bold and proud. Both herds lived peacefully in the forest until a human king named Brahmadatta discovered their grazing grounds and became obsessed with hunting deer.

  King Brahmadatta ordered his soldiers to build a great park and trap both herds inside it. Every day, the king and his hunters would enter the park and chase the deer, shooting arrows at whichever ones they could catch. The deer were terrified. They ran in panic, crashing into each other, breaking their legs, and hurting themselves even when the arrows missed. More deer were injured from the chaos of running than from the arrows themselves.

  Nigrodha could not bear to watch his herd suffer like this. He went to Branch and proposed a plan. "Let us make an agreement with the king," he said. "Instead of this terrifying hunt every day, one deer will volunteer to go to the king each day, alternating between our herds. This way, the rest can live in peace without the constant fear and stampede." Branch agreed, and Nigrodha bravely walked to the king and spoke to him directly. The king was amazed by his courage and accepted the arrangement.

  The system worked for a while, until the day came when a mother deer from Branch's herd was chosen. She had just given birth to a tiny fawn. "Please," she begged Branch, "let someone else go today. My baby is too young to survive without me. Just give me a few days." But Branch coldly refused. "The rules are the rules," he said. Desperate, the mother deer went to Nigrodha. Without a moment of hesitation, Nigrodha said, "I will go in your place." He walked calmly to King Brahmadatta and knelt before him.

  The king was shocked. "You are the leader! Why would you offer yourself?" Nigrodha replied, "A mother needed her life today more than I needed mine. A true leader does not ask others to make sacrifices he would not make himself." The king was so moved that tears rolled down his cheeks. He freed Nigrodha, then freed both herds, and eventually declared the entire forest a protected sanctuary where no animal could ever be hunted again. This story teaches us that courage is not about being fearless. It is about caring so deeply for others that you are willing to stand up for them, even when it costs you everything.`;

    const textContentLesson_fourSights = `About 2,500 years ago, in a kingdom at the foot of the Himalayan mountains, a prince named Siddhartha Gautama lived inside a magnificent palace. His father, King Suddhodana, loved his son so much that he tried to protect him from every kind of pain. The palace had beautiful gardens, the finest food, talented musicians, and everything a young person could want. Siddhartha had never seen anyone who was sick, old, or suffering. His father made absolutely sure of it.

  But Siddhartha was curious. He wanted to know what life was like beyond the palace walls. So one day, he convinced his chariot driver, Channa, to take him into the city. What happened next changed his life forever. On his first trip, Siddhartha saw an old man, bent over and wrinkled, struggling to walk. "What happened to him?" Siddhartha asked, horrified. Channa replied, "That is old age, my prince. It happens to everyone who lives long enough." Siddhartha was stunned. No one had ever told him that people grow old.

  On his second trip out, Siddhartha saw a sick person lying by the road, groaning in pain. On his third trip, he witnessed a funeral procession, with a family weeping as they carried a loved one who had died. Each sight hit him like a lightning bolt. He realized that no matter how rich or powerful someone is, they cannot escape old age, sickness, and death. His perfect palace life suddenly felt like an illusion, a beautiful bubble that would eventually pop.

  But then, on his fourth trip, Siddhartha saw something completely different. He saw a wandering monk, dressed in simple robes, walking peacefully through the crowded streets with a calm, gentle smile on his face. Despite owning almost nothing, this monk radiated a peace that Siddhartha had never felt inside his luxurious palace. "Who is that man?" he asked. "He is a seeker," Channa answered. "He has given up worldly comforts to search for the truth about suffering and how to end it."

  That fourth sight sparked something inside Siddhartha. He realized that hiding from suffering was not the answer. The real answer was to understand it and find a way through it. This moment was so powerful that it led Siddhartha to leave his palace, become a wandering seeker himself, and eventually become the Buddha, the "Awakened One." The story of the Four Sights teaches us that we cannot hide from the hard parts of life. But instead of being afraid, we can be curious. We can ask "why," seek answers, and find our own inner peace, not by running from reality, but by facing it with courage and compassion.`;

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
        id: "lesson-0-7-stillwater",
        title: "Stillwater the Wise Panda",
        textContent: textContentLesson4_stillwater,
        audioRef: "audio/lesson-0-7-stillwater.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Generosity brings happiness", "Let go of anger", "The best things in life are free"],
        discussionQuestions: ["What would you give to someone who needed help?", "Can you think of a time you let go of something that upset you?"]
      },
      {
        id: "lesson-0-7-pebble",
        title: "The Magic Pebble Meditation",
        textContent: textContentLesson5_pebble,
        audioRef: "audio/lesson-0-7-pebble.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Flower: feel fresh", "Mountain: feel strong", "Water: think clearly", "Space: feel free"],
        discussionQuestions: ["Which pebble is your favorite?", "When would you use the Mountain Pebble?"]
      },
      {
        id: "lesson-0-7-moody",
        title: "Moody Cow and the Mind Jar",
        textContent: textContentLesson6_moody,
        audioRef: "audio/lesson-0-7-moody.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Everyone has bad days", "Breathe and be still", "Your calm is always inside you"],
        discussionQuestions: ["What do you do when you feel grumpy?", "Would you like to make your own mind jar?"]
      },
      {
        id: "lesson-0-7-monkey",
        title: "The Brave Monkey King",
        textContent: textContentLesson7_monkey,
        audioRef: "audio/lesson-0-7-monkey.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["True leaders protect others", "Bravery means helping those you love", "Real strength is caring"],
        discussionQuestions: ["How would you help your friends if they were in trouble?", "What makes a good leader?"]
      },
      {
        id: "lesson-0-7-wonder",
        title: "The Joy of Wondering",
        textContent: textContentLesson8_wonder,
        audioRef: "audio/lesson-0-7-wonder.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Curiosity is a superpower", "It is okay to not know", "Wondering is the start of learning"],
        discussionQuestions: ["What is something you wonder about?", "What question would you ask the universe?"]
      },
      {
        id: "lesson-0-7-ripples",
        title: "Ripples of Kindness",
        textContent: textContentLesson9_kindness,
        audioRef: "audio/lesson-0-7-ripples.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Kindness spreads like ripples", "Be kind right now", "Small acts make a big difference"],
        discussionQuestions: ["Can you think of a small kindness you did today?", "How does it feel when someone is kind to you?"]
      },
      {
        id: "lesson-0-7-rabbit",
        title: "The Rabbit on the Moon",
        textContent: textContentLesson10_rabbit,
        audioRef: "audio/lesson-0-7-rabbit.mp3",
        targetAgeTier: "0-7",
        summaryPoints: ["Give with your heart", "You do not need big gifts", "True generosity shines forever"],
        discussionQuestions: ["What is the kindest thing you have ever given?", "Can you see the rabbit when you look at the moon?"]
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
        id: "lesson-8-12-four-truths",
        title: "The Four Noble Truths",
        textContent: textContentLesson_fourTruths,
        audioRef: "audio/lesson-8-12-four-truths.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Dukkha: life has unsatisfactoriness", "Craving is the cause", "Peace is possible", "The Eightfold Path is the way"],
        discussionQuestions: ["Can you think of a time you got something you wanted but still felt unsatisfied?", "How is craving like a treadmill?", "What does it mean to enjoy something without clinging to it?"]
      },
      {
        id: "lesson-8-12-eightfold-path",
        title: "The Noble Eightfold Path",
        textContent: textContentLesson_eightfoldPath,
        audioRef: "audio/lesson-8-12-eightfold-path.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Eight directions, not eight steps", "Wisdom, Ethics, and Mind work together", "You can practice it right now, today"],
        discussionQuestions: ["Which part of the Eightfold Path do you think is hardest for kids your age?", "Can you think of a time you used Right Speech without knowing it?", "How is the Eightfold Path like a GPS?"]
      },
      {
        id: "lesson-8-12-impermanence",
        title: "Nothing Lasts Forever: Understanding Impermanence",
        textContent: textContentLesson_impermanence,
        audioRef: "audio/lesson-8-12-impermanence.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Everything changes, always", "Clinging causes extra suffering", "Bad times are impermanent too", "Change keeps life interesting"],
        discussionQuestions: ["What is something you used to love that you have now outgrown?", "How can impermanence actually be good news?", "What is something that changed in your life that turned out better than expected?"]
      },
      {
        id: "lesson-8-12-karma",
        title: "Karma: Your Mind is a Garden",
        textContent: textContentLesson_karma,
        audioRef: "audio/lesson-8-12-karma.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Every action plants a seed", "Intention matters most", "You can always start fresh", "You create your own future"],
        discussionQuestions: ["What kind of seeds have you been planting lately?", "Why does intention matter more than the action itself?", "What would you like your mind-garden to look like?"]
      },
      {
        id: "lesson-8-12-deer-king",
        title: "The Deer King: A Jataka Tale of Courage",
        textContent: textContentLesson_deerKing,
        audioRef: "audio/lesson-8-12-deer-king.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["True leaders protect others", "Courage means standing up for what is right", "Compassion can change even the hardest hearts"],
        discussionQuestions: ["What makes Nigrodha different from Branch as a leader?", "Have you ever stood up for someone who needed help?", "Why was the king moved to tears?"]
      },
      {
        id: "lesson-8-12-four-sights",
        title: "The Four Sights: How Siddhartha Woke Up",
        textContent: textContentLesson_fourSights,
        audioRef: "audio/lesson-8-12-four-sights.mp3",
        targetAgeTier: "8-12",
        summaryPoints: ["Hiding from problems does not solve them", "Curiosity leads to understanding", "True peace comes from facing reality"],
        discussionQuestions: ["Why do you think Siddhartha's father tried to hide suffering from him?", "Which of the Four Sights would have affected you the most?", "How can being curious about hard things help you grow?"]
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
      const paragraphs = lesson.textContent.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);
      const pages = [];

      let pageIndex = 1;
      for (const paragraph of paragraphs) {
        const pageAudioRef = `audio/${lesson.id}-page-${pageIndex}.mp3`;
        const pageImageRef = `images/${lesson.id}-page-${pageIndex}.jpg`;
        disableEmulatorEnv();
        const [prodAudioExists] = await prodBucket.file(pageAudioRef).exists();

        if (prodAudioExists) {
          enableEmulatorEnv();
          const [emuAudioExists] = await emulatorBucket.file(pageAudioRef).exists();
          if (!emuAudioExists) {
            console.log(`  Downloading audio ${pageAudioRef} from prod to stage in emulator...`);
            disableEmulatorEnv();
            const [audioBuffer] = await prodBucket.file(pageAudioRef).download();
            enableEmulatorEnv();
            await emulatorBucket.file(pageAudioRef).save(audioBuffer, { contentType: 'audio/mpeg' });
          } else {
            console.log(`  Audio ${pageAudioRef} already exists in emulator. Skipping.`);
          }
        } else {
          console.log(`  Generating audio for ${pageAudioRef}...`);
          const audioBuffer = await generateTTS(paragraph);

          enableEmulatorEnv();
          await emulatorBucket.file(pageAudioRef).save(audioBuffer, { contentType: 'audio/mpeg' });
          disableEmulatorEnv();
          await prodBucket.file(pageAudioRef).save(audioBuffer, { contentType: 'audio/mpeg' });
          console.log(`  Successfully uploaded ${pageAudioRef} to emulator and prod!`);
        }

        disableEmulatorEnv();
        const [prodImgExists] = await prodBucket.file(pageImageRef).exists();

        if (prodImgExists) {
          enableEmulatorEnv();
          const [emuImgExists] = await emulatorBucket.file(pageImageRef).exists();
          if (!emuImgExists) {
            console.log(`  Downloading image ${pageImageRef} from prod to stage in emulator...`);
            disableEmulatorEnv();
            const [imgBuffer] = await prodBucket.file(pageImageRef).download();
            enableEmulatorEnv();
            await emulatorBucket.file(pageImageRef).save(imgBuffer, { contentType: 'image/jpeg' });
          } else {
            console.log(`  Image ${pageImageRef} already exists in emulator. Skipping.`);
          }
        } else {
          console.log(`  Generating image for ${pageImageRef}...`);
          const imgBuffer = await generateImageBuffer(paragraph);

          enableEmulatorEnv();
          await emulatorBucket.file(pageImageRef).save(imgBuffer, { contentType: 'image/jpeg' });
          disableEmulatorEnv();
          await prodBucket.file(pageImageRef).save(imgBuffer, { contentType: 'image/jpeg' });
          console.log(`  Successfully uploaded ${pageImageRef} to emulator and prod!`);
        }

        pages.push({
          text: paragraph,
          audioRef: pageAudioRef,
          imageRef: pageImageRef
        });
        pageIndex++;
      }

      // Transform lesson object for Firestore
      const firestoreLesson = { ...lesson };
      delete firestoreLesson.textContent;
      delete firestoreLesson.audioRef;
      firestoreLesson.pages = pages;

      // Save to both Firestores
      enableEmulatorEnv();
      await emulatorDb.collection("lessons").doc(lesson.id).set(firestoreLesson);
      disableEmulatorEnv();
      await prodDb.collection("lessons").doc(lesson.id).set(firestoreLesson);

      console.log(`Created lesson document: ${lesson.title} (${lesson.targetAgeTier}) in both emulator and prod.`);
    }
    console.log("Lessons and audio seeded successfully into emulator and production!");
  } catch (err) {
    console.error("Error seeding lessons:", err);
  }
}

seed();
