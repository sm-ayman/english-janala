// lesson-loader
const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};
// word-loader
const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLevelWord(json.data));
};
// display-lesson
const displayLesson = (lessons) => {
  // 1. get the container & empty it
  const levelContainer = document.getElementById("level-conatainer");
  levelContainer.innerHTML = "";
  // 2. get each lessons
  for (const lesson of lessons) {
    // 3. create Element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
                        <i class="fa-solid fa-book"></i> Lesson - ${lesson.level_no}
                    </button>`;
    // 4. append the element to the container
    levelContainer.append(btnDiv);
  }
};
// display-level-word
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    // alert("no words detected!");
    wordContainer.innerHTML = `<div class="text-center p-20 mx-auto col-span-full flex flex-col gap-y-4">
                <img src='./assets/alert-error.png' class="w-25 mx-auto animate-bounce"/>
                <p class="text-[#79716B] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="font-secondary font-semibold text-3xl">নেক্সট Lesson এ যান।</h3>
            </div>`;
  }
  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm text-center px-5 py-8 space-y-4">
                <h2 class="font-bold text-xl">${word.word}</h2>
                <p class="font-semibold">Meaning/Pronunciation</p>
                <div class="text-2xl font-medium font-secondary">"${word.meaning} / ${word.pronunciation}"</div>
                <div class="flex justify-between">
                    <button class="btn !bg-[#E7F3FE] hover:!bg-[#3B25C1] hover:!text-white"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn !bg-[#E7F3FE] hover:!bg-[#3B25C1] hover:!text-white"><i class="fa-solid fa-play"></i></button>
                </div>
        </div>
    `;
    wordContainer.append(wordCard);
  });
};
// 33-4 to be continued - 12:00
loadLessons();
