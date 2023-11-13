window.addEventListener("DOMContentLoaded", main);

/**
 * @type {HTMLHeadingElement} Is a h1 text element
 */
let message = document.createElement("h1");

/**
 * @type {HTMLButtonElement} Defines a button element
 */
let playAgain = document.createElement("button");
playAgain.textContent = "Play Again?";

/**
 * @type {string} String that will call for an mp3 file later on
 */
let audio;

/**The first function to run calls the startGame function.*/
function main() {
  startGame();
}

/**First declares all existing dom elements from index.html and hides the
 * elements that should only be displayed when the scenes array runs.
 * Also creates a click event for the start button which removes all elements
 * on the start page and calls the function to show the first scene in "scenes".*/
function startGame() {
  //hämtar med nedstående klasser (till höger) och ger dessa variabelnamn i js
  const startH1 = document.querySelector(".startH1");
  const startH3 = document.querySelector(".startH3");
  const startH4 = document.querySelector(".startH4");
  const startP = document.querySelectorAll(".startP");

  //hämtar hem id för knapparna i scenerna
  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");
  const addAssetButton = document.getElementById("asset-b");
  const addAssetButton2 = document.getElementById("asset-b2");

  //gör så att knapparna inte syns på startsidan
  leftButton.style.display = "none";
  rightButton.style.display = "none";
  addAssetButton.style.display = "none";
  addAssetButton2.style.display = "none";

  startH1.textContent = start.h1; //hämtar hem alla textelementen i objektet för aktiv scen och visar dessa
  startH3.textContent = start.h3;
  startH4.textContent = start.h4;

  //hämtar hem alla startP element som finns i objektet genom att loopa igenom och öka med ett för varje gång det finns ett till element och skriver sedan ut dessa
  for (let i = 0; i < startP.length; i++) {
    startP[i].textContent = start["p" + (i + 1)];
  }

  //hämtar hem bodyn och ger den namnet body för att sedan byta bakgrundbilden till den som finns i objektet start
  const body = document.querySelector("body");
  body.style.backgroundImage = start.backgroundImage;

  //skapar variabelnamn till startGameButton
  const startGameButton = document.getElementById("startGameButton");

  //skapar en anonym funktion som anropar funktionen renderScene
  startGameButton.addEventListener("click", function () {
    //spelar musik på första scenen
    playAudio("src/sounds/startMusic.mp3");

    //hämtar alla element på startsidan
    const startRoomElements = document.querySelectorAll(".startRoom");

    //loopar igenom med alla element på startsidan medforeach och ta bort alla element
    startRoomElements.forEach(function (element) {
      element.remove();
    });
    //öppnar upp scen 1
    renderScene();
  });
}

/**Creates the variable that retrieves different sounds and displays it in the DOM.
 * Checks through an if statement if a sound is already playing when a new sound arrives.
 * If so, the first sound is paused and removed from the DOM.
 *
 * @param {HTMLAudioElement} audioSrc url link that fetches the music
 * */
function playAudio(audioSrc) {
  //funktion som spelar och pausar ljud
  //befintligt ljud pausas om något redan spelas
  if (audio) {
    audio.pause();
    document.body.removeChild(audio);
  }
  //spelar upp ljudet från filen som valt i playAudio och skickar detta till domen
  audio = new Audio(audioSrc);
  audio.play();
  document.body.appendChild(audio);
}

/**Gets elements for the scenes and declares them in Javascript.
 *  Creates click events for the button on the right and left and
 * calls many functions required for the game to function properly. */
function renderScene() {
  //skapar variabler som hämtar de föränderliga elementen i js så som text och knappar, bakgrundsbild
  const text = document.getElementById("text");
  const buttonLeft = document.getElementById("leftButtonText");
  const buttonRight = document.getElementById("rightButtonText");
  const footer = document.getElementById("footer");
  const body = document.body;

  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");
  const addAssetButton = document.getElementById("asset-b");
  const addAssetButton2 = document.getElementById("asset-b2");
  const assetImage = document.getElementById("asset-image");
  const asset2Image = document.getElementById("asset-image2");
  const inventoryFooter = document.getElementById("inventory");

  setDisplayStyle(
    leftButton,
    rightButton,
    text,
    buttonLeft,
    buttonRight,
    body,
    footer
  );

  const scene = scenes[activeSceneIndex]; //skapar variabel som hämtar hem den aktiva scenen spelaren befinner sig på i arrayen scenes

  text.textContent = scene.text; //hämtar hem alla textelementen i objektet för aktiv scen och visar dessa
  buttonLeft.textContent = scene.buttonLeft.text;
  buttonRight.textContent = scene.buttonRight.text;
  body.style.backgroundImage = scene.backgroundImage; //ändrar style för bodyn backgrundbild utefter aktivt element

  collectJoinAndDisplayAssets(
    addAssetButton,
    addAssetButton2,
    assetImage,
    asset2Image,
    inventoryFooter,
    scene
  );

  //när man klickar på buttonLeft (vänster knapp) går man till scenen som objektets egenskap kallar på ett scenindex i arrayen för scener
  buttonLeft.onclick = function () {
    //pausar musiken
    playAudio("");
    goNextScene(scene.buttonLeft.nextSceneIndex);
  };

  buttonRight.onclick = function () {
    playAudio("");
    // om aktivt scenindex är 2 (köket) och användaren INTE har nyckeln i sitt inventory
    getIntoBedroom(scene);
    checkInventoryForWinLose(leftButton, rightButton);
    checkForPhone();
  };

  showButton(leftButton, rightButton);
  powerButton();
  loseAndWin();
}

/**Checks if the user is in the kitchen and does not have the key in
 * his/hers inventory. If this is true, a message is displayed to the user
 * that he/she needs the key to proceed. If the user has the key and is in
 * the kitchen, he/she can continue without a message.
 *
 * @param {object} scene Fetches the active scene
 * */
function getIntoBedroom(scene) {
  //kollar ifall användaren har nyckeln i sitt inventory, annars säger den åt hen att hämta den i scen 0.
  if (activeSceneIndex === 2 && !inventory.includes(scenes[0].asset2)) {
    message.className = "messageN";
    message.textContent =
      "You need the key to go in there.. Hint: look around the porch.";
    text.style.display = "none";

    setTimeout(function () {
      document.body.removeChild(message);
      text.style.display = "block";
    }, 4000);
    document.body.appendChild(message);
  } else {
    //användaren har rätt objekt, gå till nästa scen
    goNextScene(scene.buttonRight.nextSceneIndex);
  }
}

/**Through an else if statement, finds out whether the user is in the bedroom
 * and has the phone in his inventory or not. If the user has the phone,
 * a message is displayed that the police are being called, if not, the message
 * instead reads that the player should pick up the phone that is on the porch. */
function checkForPhone() {
  //kollar om användaren har telefonen i sitt inventory när den befinenr sig i sovrummet och har olika beteende beroende på det.
  if (activeSceneIndex === 3 && !inventory.includes(scenes[0].asset)) {
    playAgain.className = "playAgain";
    message.className = "message";
    message.textContent =
      "You should really try to find the phone to be able to call the police.. Hint: Go to the porch.";
    text.style.display = "none";

    setTimeout(function () {
      document.body.removeChild(message);
    }, 4000);
    document.body.appendChild(message);
  } else if (activeSceneIndex === 3 && inventory.includes(scenes[0].asset)) {
    message.textContent =
      "Good thing you had the phone to call the police!\r\n'Hello officer! There's a dead woman in the bedroom at 104 Crazy Street in Palm Springs, come quick, I'm afraid the killer is still in the house!'";
    text.style.display = "none";

    setTimeout(function () {
      document.body.removeChild(message);
    }, 6000);
    document.body.appendChild(message);
  }
}

/**Finds out if the user is in the lit bathroom (end scene). If the user is,
 * the function checks if there is a gun and bullets in the inventory.
 * If there is, a gunshot sound is played and a message that the player has won
 * by shooting the killer is displayed. If not, a message is displayed instead
 * stating that the user has lost and died and gone to heaven while playing a failure sound.
 *
 * @param {HTMLButtonElement} leftButton Is a HTML button element
 * @param {HTMLButtonElement} rightButton Is a HTML button element
 * */
function checkInventoryForWinLose(leftButton, rightButton) {
  //kollar av inventory i den slutliga scenen om man väljer att attackera mördare.
  //skapar ny h1tag och ger den klassen message
  message.className = "message";
  playAgain.className = "playAgain";

  //om man är i scenen med index 5
  if (activeSceneIndex === 5) {
    //och det ligger en pistol och kulor i ens inventory
    if (
      inventory.includes("src/inventoryitems/gun.png") &&
      inventory.includes("src/inventoryitems/bullets.png")
    ) {
      message.textContent =
        "Victory!! You managed to attack the killer with your gun and bullets. You have won and neutralized the killer!";

      footer.style.display = "none";
      text.style.display = "none";
      leftButton.style.display = "none";
      rightButton.style.display = "none";

      document.body.appendChild(message);
      document.body.appendChild(playAgain);
      newGame(playAgain);
      playAudio("src/sounds/gunshot.mp3");
    } else {
      message.textContent =
        "Loser!! You hadn't found the gun and the bullets, which allowed the killer to attack you first. You unfortunately died, but at least you went to heaven.";
      footer.style.display = "none";
      text.style.display = "none";
      leftButton.style.display = "none";
      rightButton.style.display = "none";
      document.body.style.backgroundImage = 'url("src/losegame.png")';

      document.body.appendChild(message);
      document.body.appendChild(playAgain);
      newGame(playAgain);
      playAudio("src/sounds/fail.mp3");
    }
  }
}

/**In this function there is a condition that checks if asset and asset2
 * exist on the object in the scene, if it does it is rendered, if not it is hidden.
 * Also checks if users have already added it to inventory, if they
 * have then the item is hidden.Also gives asset and asset2 click event which causes
 * them to be added to inventory and emit sound when the player picks them up. */
function collectJoinAndDisplayAssets(
  addAssetButton,
  addAssetButton2,
  assetImage,
  asset2Image,
  inventoryFooter,
  scene
) {
  /* villkor som kollar om asset och asset2 finns på objektet i scenen, gör den de så renderas den ut, om inte döljs den.
  kollar också om användare redan har lagt till den i inventory, har den de så döljs knappen.*/
  if (scene.asset && inventory.indexOf(scene.asset) === -1) {
    assetImage.src = scene.asset;
    addAssetButton.style.display = "block";
  } else {
    addAssetButton.style.display = "none";
  }

  if (scene.asset2 && inventory.indexOf(scene.asset2) === -1) {
    asset2Image.src = scene.asset2;
    addAssetButton2.style.display = "block";
  } else {
    addAssetButton2.style.display = "none";
  }

  //anonyma funktioner vad som händer när man klickar på först asset sen asset2
  addAssetButton.onclick = function () {
    if (inventory.indexOf(scene.asset) !== -1) {
      //asset finns redan i inventoy. vill inte lägga till igen
    } else {
      //asset finns inte så lägg till den med hjälp av .push()
      inventory.push(scene.asset);
      playAudio("src/sounds/pickup.mp3");
      //dölj asset knappen eftersom användare plockat upp den.
      addAssetButton.style.display = "none";

      //skapar element för bilden i scenens asset som läggs i inventory footern
      const img = document.createElement("img");
      img.className = "inventoryImg";
      img.src = scene.asset;
      img.alt = "Asset Image";
      inventoryFooter.appendChild(img);
    }
  };

  addAssetButton2.onclick = function () {
    if (inventory.indexOf(scene.asset2) !== -1) {
    } else {
      inventory.push(scene.asset2);
      playAudio("src/sounds/pickup.mp3");
      addAssetButton2.style.display = "none";
      const img2 = document.createElement("img");
      img2.className = "inventoryImg";
      img2.src = scene.asset2;
      img2.alt = "Asset Image";
      inventoryFooter.appendChild(img2);
    }
  };
}

/**Checks if the user is on stage 6, which means it ran away from the killer.
 * If the player is there, "bad boys" is played and a message saying that you neither won nor lost is displayed. */
function loseAndWin() {
  //funktion som körs när man väljer att springa iväg i sista scenen
  const message = document.createElement("h1");
  if (activeSceneIndex === 6) {
    playAudio("src/sounds/cops.mp3");
    playAgain.className = "playAgainN";
    message.className = "messageN";
    message.textContent = "You either lose or win the game since you ran away.";

    footer.style.display = "none";
    text.style.display = "none";

    document.body.appendChild(message);
    document.body.appendChild(playAgain);
    newGame(playAgain);
  }

  /* document.body.appendChild(message);
  document.body.appendChild(playAgain); */
}

/**Determines when the right and left buttons should not be displayed
 *
 * @param {HTMLButtonElement} leftButton Is a HTML button element
 * @param {HTMLButtonElement} rightButton Is a HTML button element
 */
function showButton(leftButton, rightButton) {
  //tar hand om när knapparna för att förflytta sig mellan rum ska visas och inte
  //visa inte vänster knapp på scen 0, 4 eller 6
  if (
    activeSceneIndex === 0 ||
    activeSceneIndex == 4 ||
    activeSceneIndex === 6
  ) {
    leftButton.style.display = "none";
  }

  //visa inte höger knapp på scen 4 eller 6
  if (activeSceneIndex === 4 || activeSceneIndex === 6) {
    rightButton.style.display = "none";
  }
}

/**Changes the activeSceneIndex to the scene currently active in the game,
 * then runs the function that fetches all elements for the active scene.
 *
 * @param {number} sceneIndex Fetches the active sceneIndex number
 */
function goNextScene(sceneIndex) {
  //gör om det aktiva sceneindex till sidan man nu befinner sig, är man ex på scen med indexvärde 1 (vardagsrummet) och trycker på item två (högra knappen) så komemr man iom objektets egenskaper till scenen med indexvärde två (köket)
  activeSceneIndex = sceneIndex; //ändrar activesceneindex till sceneindexet som nu är aktivt
  renderScene(); //kör funktionen renderscene som hämtar hem allting för den aktiva scenen
}

/**Determines that all elements in scenes should be displayed.
 *
 * @param {HTMLButtonElement} leftButton Is a HTML button element
 * @param {HTMLButtonElement} rightButton Is a HTML button element
 * @param {string} text Gets text element
 * @param {object} buttonLeft Gets the object
 * @param {object} buttonRight Gets the object
 * @param {HTMLElement} body Fetches body HTML element
 * @param {HTMLElement} footer Fetches footer HTML element wich icludes inventory
 */
function setDisplayStyle(
  leftButton,
  rightButton,
  text,
  buttonLeft,
  buttonRight,
  body,
  footer
) {
  leftButton.style.display = "block";
  rightButton.style.display = "block";
  text.style.display = "block";
  buttonLeft.style.display = "block";
  buttonRight.style.display = "block";
  body.style.display = "content";
  footer.style.display = "block";
}

/**Make the power button for lamp only appear in the dark bathroom and
 * give it a click event that leads to the light bathroom. */
function powerButton() {
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

/**
 *Creates an on click event for the "Play Again" button.
 *
 * @param {HTMLButtonElement} playAgain Button that asks if the player wants to play again
 */
function newGame(playAgain) {
  playAgain.addEventListener("click", function () {
    window.location.href = "http://127.0.0.1:5501/index.html";
  });
}
