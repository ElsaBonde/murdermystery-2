window.addEventListener("DOMContentLoaded", main);

function main() {
  startGame();
}

function startGame() {
  //hämtar med nedstående klasser (till höger) och ger dessa variabelnamn i js
  const startH1 = document.querySelector(".startH1");
  const startH3 = document.querySelector(".startH3");
  const startH4 = document.querySelector(".startH4");
  const startP = document.querySelectorAll(".startP");

  //hämtar hem id för knapparna i scenerna
  const button1 = document.getElementById("item-1-b");
  const button2 = document.getElementById("item-2-b");
  //gör så att knapparna inte syns på startsidan
  button1.style.display = "none";
  button2.style.display = "none";

  startH1.textContent = start.h1; //hämtar hem alla textelementen i objektet för aktiv scen och visar dessa
  startH3.textContent = start.h3;
  startH4.textContent = start.h4;

  //hämtar hem alla startP element som finns i objektet genom att loopa igenom och öka med ett för varje gång det finns ett till element och skriver sedan ut dessa
  for (let i = 0; i < startP.length; i++) {
    startP[i].textContent = start["p" + (i + 1)];
  }

  //hämtar hem bodyn och ger den namnet startPage för att sedan byta bakgrundbilden till den som finns i objektet start
  const startPage = document.querySelector("body");
  startPage.style.backgroundImage = start.backgroundImage;

  //skapar variabelnamn till startGameButton
  const startGameButton = document.getElementById("startGameButton");

  //skapar en anonym funktion som anropar funktionen renderScene
  startGameButton.addEventListener("click", function () {
    //hämtar alla element på startsidan
    const startRoomElements = document.querySelectorAll(".startRoom");

    //loopar igenom och ta bort alla element på startsidan och öppnar sedan upp scen 1
    startRoomElements.forEach(function (element) {
      element.remove();
    });
    renderScene();
  });
}

function renderScene() {
  //skapar variabler som hämtar de föränderliga elementen i js så som text och knappar, bakgrundsbild
  const text = document.getElementById("text");
  const item1 = document.getElementById("item-1");
  const item2 = document.getElementById("item-2");
  const body = document.body;

  const button1 = document.getElementById("item-1-b");
  const button2 = document.getElementById("item-2-b");

  button1.style.display = "block";
  button2.style.display = "block";
  text.style.display = "block";
  item1.style.display = "block";
  item2.style.display = "block";
  body.style.display = "content";

  const scene = scenes[activeSceneIndex]; //skapar variabel som hämtar hem den aktiva scenen spelaren befinner sig på i arrayen scenes

  text.textContent = scene.text; //hämtar hem alla textelementen i objektet för aktiv scen och visar dessa
  item1.textContent = scene.item1.text;
  item2.textContent = scene.item2.text;
  body.style.backgroundImage = scene.backgroundImage; //ändrar style för bodyn backgrundbild utefter aktivt element

  //när man klickar på item1 (vänster knapp) går man till scenen som objektets egenskap kallar på ett scenindex i arrayen för scener
  item1.onclick = function () {
    goNextScene(scene.item1.nextSceneIndex);
  };
  item2.onclick = function () {
    goNextScene(scene.item2.nextSceneIndex);
  };

  //visa inte vänster knapp på scen 0, 4 eller 6
  if (activeSceneIndex === 0 || activeSceneIndex == 4 || activeSceneIndex === 6) {
    button1.style.display = "none";
  } 
  
  //visa inte höger knapp på scen 4 eller 6
  if (activeSceneIndex === 4 || activeSceneIndex === 6) {
    button2.style.display = "none";
  }

  //skapar variabel för lampknappen
  const powerSwitchButton = document.getElementById("powerSwitch");
  if (activeSceneIndex === 4) {
    powerSwitchButton.style.display = "block"; //visa lampknapp om användaren är i det mörka badrummet
  } else {
    powerSwitchButton.style.display = "none"; //visa den inte ifall användaren är i något annat rum
  }

  //när man klickar på knappen så tänds rummet, dvs nästa sceneindex 5 renderas
  powerSwitchButton.addEventListener("click", function () {
    activeSceneIndex = 5;
    renderScene();
  });
}

//gör om det aktiva sceneindex till sidan man nu befinner sig, är man ex på scen med indexvärde 1 (vardagsrummet) och trycker på item två (högra knappen) så komemr man iom objektets egenskaper till scenen med indexvärde två (köket)
function goNextScene(sceneIndex) {
  activeSceneIndex = sceneIndex; //ändrar activesceneindex till sceneindexet som nu är aktivt
  renderScene(); //kör funktionen renderscene som hämtar hem allting för den aktiva scenen
}
