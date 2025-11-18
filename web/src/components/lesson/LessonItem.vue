<template>
  <a v-if="status === 'active'" :href="'/learn/' + lesson.identifier"
     class="block bg-red-600 p-6 rounded-2xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl group">

    <div class="flex justify-between items-center mb-3">
      <div>
        <p class="text-2xl font-bold text-white">{{ lesson.title }}</p>
        <p class="text-white opacity-90">{{ lesson.subtitle }}</p>
      </div>
      <span class="text-5xl opacity-50">#{{ lesson.orderIndex }}</span>
    </div>

    <AppButton
        variant="white"
        tag="div"
        class="mt-4"
    >
      {{ callToAction }}
    </AppButton>

  </a>

  <a v-else-if="status === 'completed'" :href="lesson.href"
     class="flex items-center bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg hover:scale-105">

    <div class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-inner">
      <span class="text-2xl">✅</span>
    </div>
    <div class="ml-4">
      <p class="font-bold text-lg text-gray-700">{{ lesson.title }}</p>
      <p class="text-sm text-gray-500">Completed!</p>
    </div>
  </a>

  <div v-else
       class="flex items-center bg-white p-4 rounded-2xl shadow-md opacity-60">

    <div class="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
      <span class="text-2xl">🔒</span>
    </div>
    <div class="ml-4">
      <p class="font-bold text-lg text-gray-400">{{ lesson.title }}</p>
    </div>
  </div>
</template>

<script setup>

import AppButton from "@/components/app/AppButton.vue";

defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  status: {
    type: String, // 'active', 'completed', 'locked'
    required: true,
  }
});

// Configuration for phrases and their occurrence probability
const phrases = [
  // Standard Phrases (High Weight)
  { text: "🚀 Start learning!", weight: 10 },
  { text: "🔥 Let's go!", weight: 10 },
  { text: "📚 Dive in!", weight: 10 },
  { text: "💪 You got this!", weight: 10 },
  { text: "🧠 Level up!", weight: 10 },
  { text: "✨ Begin now", weight: 10 },

  { text: "🌌 Start learning, you must", weight: 1 },
  { text: "🛸 This is the way... to learn", weight: 1 },
  { text: "☄️ Punch it, Chewie! (Start)", weight: 1 },
  { text: "⚔️ The Force is strong with this lesson", weight: 1 },

  { text: "🖖 Learn a lot and prosper", weight: 1 },
  { text: "👉 Make it so: Start Lesson", weight: 1 },
  { text: "🚀 Engage Learning Mode!", weight: 1 },
  { text: "🔭 To boldly learn what no one has...", weight: 1 },

  { text: "⚡ I choose this lesson!", weight: 1 },
  { text: "🧢 Gotta learn 'em all!", weight: 1 },
  { text: "🛑 It's super effective! (Start)", weight: 1 },

  { text: "🗡️ It's dangerous to go alone! Learn this.", weight: 1 }, // Zelda
  { text: "🍄 Your lesson is in this castle!", weight: 1 }, // Mario
  { text: "🎮 Press Start to Play", weight: 1 }, // Generic Gaming
  { text: "🦖 Clever girl... (Start Lesson)", weight: 1 }, // Jurassic Park
  { text: "🚀 To infinity... and learning!", weight: 1 }, // Toy Story
  { text: "🧙‍♂️ You shall pass!", weight: 1 }, // LOTR
  { text: "💊 Take the Red Pill (Start)", weight: 1 }, // Matrix
];

const getWeightedPhrase = () => {
  const totalWeight = phrases.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const phrase of phrases) {
    if (random < phrase.weight) {
      return phrase.text;
    }
    random -= phrase.weight;
  }
  return phrases[0].text;
};

const callToAction = getWeightedPhrase();
</script>