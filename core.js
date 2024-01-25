// Copyright 2021 The Regents of the University of California

// Created by Adam Smith (amsmith@ucsc.edu)
// Department of Computational Media, UC Santa Cruz

// Unless otherwise stated, all files in this project
// except README.md, rules.js, and story.yaml are in 
// the state they were provided to students as part of
// a data structures course assignment.

let worldSpecName = document.currentScript.dataset.world;
let persistenceKey = "lastScene";
let currentScene;

if (window.self != window.top) {
  /* global toolsContainer persistenceCheckbox */
  toolsContainer.style.visibility = "visible";

  if (sessionStorage[persistenceKey]) {
    persistenceCheckbox.checked = true;
  }

  persistenceCheckbox.onchange = () => {
    if (persistenceCheckbox.checked) {
      sessionStorage.setItem(persistenceKey, currentScene);
    } else {
      sessionStorage.removeItem(persistenceKey);
    }
  };
}

(async function() {
  let response = await fetch(worldSpecName);
  let text = await response.text();
  setupInteraction(text);
})();

let engine = {
  setTitle: function () {
    
  },
  
}

function setupInteraction(text) {
  /* global startStory */
  let story = startStory(text);

  if (story === undefined) {
    console.error("The startStory returned undefined value!");
  }

  let { title, initialScene } = story;

  if (title === undefined) {
    console.error("Story had no title!");
  }

  if (typeof title != "string") {
    console.error("Story title was not a string!");
  }

  if (initialScene === undefined) {
    console.error("Story had no initialScene!");
  }

  if (typeof initialScene != "string") {
    console.error("The story's initialScene was not a string!");
  }

  /* global titleContainer */
  titleContainer.innerText = title;
  document.title = title;

  if (sessionStorage.getItem(persistenceKey)) {
    currentScene = sessionStorage.getItem(persistenceKey);
    console.log(
      "Restoring scene",
      currentScene,
      "because you asked for state to be persisted."
    );
  } else {
    currentScene = initialScene;
  }
  updateDisplay();
}

function updateDisplay() {
  console.log("Showing scene:", currentScene);

  if (persistenceCheckbox.checked) {
    sessionStorage.setItem(persistenceKey, currentScene);
  }

  /* global startScene */
  let sceneObj = startScene(currentScene);
  if (sceneObj === undefined) {
    console.error(
      "The startScene function returned an undefined value for ",
      sceneObj
    );
  }

  let { imageUrl, caption, choices } = sceneObj;

  if (imageUrl === undefined) {
    console.error("Scene had no imageUrl!");
  }

  if (typeof imageUrl != "string") {
    console.error("Scene's imageUrl was not a string!");
  }

  if (caption === undefined) {
    console.error("Scene had no caption!");
  }
  if (typeof caption != "string") {
    console.error("Scene's caption was not a string!");
  }

  if (choices === undefined) {
    console.error(
      "Scene had no choices! (If you want to indicate an ending scene, return an empty array, [], as the choices.)"
    );
  }

  if (!Array.isArray(choices)) {
    console.error("Scene's choices was not an array!");
  }

  /* global imageContainer */
  imageContainer.innerHTML = "";
  let img = document.createElement("img");
  img.src = imageUrl;
  img.title = currentScene;
  imageContainer.appendChild(img);

  /* global captionContainer */
  captionContainer.innerHTML = caption;

  /* global choicesContainer */
  choicesContainer.innerHTML = "";
  let ul = document.createElement("ul");

  if (choices.length > 0) {
    for (let item of choices) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = "javascript:void(0);";
      let { text, target } = item;

      if (text === undefined) {
        console.error("Choice ", item, "had no text!");
      }

      if (target === undefined) {
        console.error("Choice ", item, "had no target!");
      }

      a.innerHTML = item.text;
      a.onclick = () => {
        currentScene = item.target;
        updateDisplay();
      };
      li.appendChild(a);
      ul.appendChild(li);
    }

    choicesContainer.appendChild(ul);
  } else {
    let a = document.createElement("a");
    a.href = "javascript:void(0);";
    a.classList.add("restartMessage");
    a.innerHTML = "The end. (Click to start story again.)";
    a.onclick = () => {
      sessionStorage.removeItem(persistenceKey);
      window.location.reload();
    };
    choicesContainer.appendChild(a);
  }
}
