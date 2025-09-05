// lesson-loader
const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
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
    btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}"
     onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                        <i class="fa-solid fa-book"></i> Lesson - ${lesson.level_no}
                    </button>`;
    // 4. append the element to the container
    levelContainer.append(btnDiv);
  }
};

// word-loader
const loadLevelWord = (id) => {
  loadingSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive();
      const activeBtn = document.getElementById(`lesson-btn-${id}`);
      activeBtn.classList.add("active");
      displayLevelWord(json.data);
    });
};
// display-level-word
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    // alert("no words detected!");
    wordContainer.innerHTML = `<div class="text-center lg:p-20 mx-auto col-span-full flex flex-col gap-y-4">
                <img src='./assets/alert-error.png' class="lg:w-25 w-10 mx-auto animate-bounce"/>
                <p class="text-[#79716B] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="font-secondary font-semibold text-3xl">নেক্সট Lesson এ যান।</h3>
            </div>`;
  }
  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm text-center px-5 py-8 space-y-4 h-full">
                <h2 class="font-bold text-xl">${
                  word.word ? word.word : "শব্দ পাওয়া যায়নি"
                }</h2>
                <p class="font-semibold">Meaning/Pronunciation</p>
                <div class="text-2xl font-medium font-secondary">"${
                  word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
                } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"
    }"</div>
                <div class="flex justify-between">
                    <button onclick="loadWordDetail(${
                      word.id
                    })" class="btn !bg-[#E7F3FE] hover:!bg-[#3B25C1] hover:!text-white"><i class="fa-solid fa-circle-info"></i></button>
                    <button onClick={pronounceWord('${
                      word.word
                    }')} class="btn !bg-[#E7F3FE] hover:!bg-[#3B25C1] hover:!text-white"><i class="fa-solid fa-play"></i></button>
                </div>
        </div>
    `;
    wordContainer.append(wordCard);
  });
  loadingSpinner(false);
};
// remove active from levelBtn
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

// word-detail-loader
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  // console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// display-word-detail
const displayWordDetails = (wordDetails) => {
  const wordDetailsContainer = document.getElementById(
    "word-details-container"
  );
  wordDetailsContainer.innerHTML = `<div class="p-3">
                            <h3 class="font-bold text-2xl mb-3">${
                              wordDetails.word
                            } ( <i class="fa-solid fa-microphone-lines"></i>
                                : ${wordDetails.pronunciation})
                            </h3>
                            <h5 class="font-semibold">Meaning</h5>
                            <p class="font-medium mb-2">${
                              wordDetails.meaning
                            }</p>
                            <h5 class="font-semibold">Parts Of Speech</h5>
                            <p class="font-medium mb-2">${
                              wordDetails.partsOfSpeech
                            }</p>
                            <h5 class="font-semibold">Example</h5>
                            <p class="font-medium mb-2">${
                              wordDetails.sentence
                            }</p>
                            <h5 class="font-semibold">সমার্থক শব্দ গুলো</h5>
                            <div class="flex gap-x-2 mt-1">
                                
                                ${displaySynonyms(wordDetails.synonyms)}
                            </div>
                        </div>`;
  document.getElementById("word_details_modal").showModal();
};
// to display the synonyms creating elements
const displaySynonyms = (arr) => {
  const btnElements = arr.map(
    (el) => `<button class="btn !bg-[#EDF7FF]">${el}</button>`
  );
  return btnElements.join(" ");
};

// loading-spinner
const loadingSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const wordContainer = document.getElementById("word-container");
  if (status == true) {
    spinner.classList.remove("hidden");
    wordContainer.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    wordContainer.classList.remove("hidden");
  }
};

loadLessons();

// search-vocab
document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value;
  // console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const allWords = data.data;
      // console.log(allWords);
      const filteredWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      // console.log(filteredWords);
      displayLevelWord(filteredWords);
    });
});

// pronounce-word
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
