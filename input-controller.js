//
// These objects carefully manage the keyboard input event listeners for a
// simple character-driven game.
//
// Primarily, they allow you to turn off the flow of (possibly unwanted)
// keyboard events while your game model is updating.
//
// After state is updated, input events are easily re-enabled.
// The objects also provide visual management of the input element itself
// to disallow input during model updates and between rounds of play
//
// See the unit test driver at the bottom for ideas on how to integrate
// with your application.
//

function FormInputController() {}
FormInputController.prototype.formId = undefined;
FormInputController.prototype.inputId = undefined;
FormInputController.prototype.eventType = "input";
FormInputController.prototype.hideViewOnDisable = true;
FormInputController.prototype.reFocusOnUnhide = true;
FormInputController.prototype.inputCallback = undefined;
FormInputController.prototype.init = function(
  formId,
  inputId,
  eventType,
  hideViewOnDisable,
  reFocusOnUnhide
) {
  this.formId = formId;
  this.inputId = inputId;
  this.eventType = eventType;
  this.hideViewOnDisable = hideViewOnDisable;
  this.reFocusOnUnhide = reFocusOnUnhide;
};
FormInputController.prototype.enableInput = function() {
  console.log("fic: enableInput");
  if (this.hideViewOnDisable) {
    this.enableInputView();
  }
  this.enableInputListener();
};
FormInputController.prototype.enableInputView = function() {
  console.log("fic: enableInputView");
  this.inputId.style.visibility = "visible";
  if (this.reFocusOnUnhide) {
    this.inputId.focus();
  }
  this.formId.reset();
};
FormInputController.prototype.enableInputListener = function() {
  console.log("fic: enableInputListener");
  this.inputId.addEventListener(this.eventType, this.inputCallback, false);
};
FormInputController.prototype.disableInput = function() {
  console.log("fic: disableInput");
  this.disableInputListener();
  if (this.hideViewOnDisable) {
    this.disableInputView();
  }
};
FormInputController.prototype.disableInputView = function() {
  console.log("fic: disableInputView");
  this.inputId.style.visibility = "hidden";
};
FormInputController.prototype.disableInputListener = function() {
  console.log("fic: disableInputListener");
  this.inputId.removeEventListener(this.eventType, this.inputCallback);
};

function GameInputController() {}
GameInputController.prototype.resultsId = undefined;
GameInputController.prototype = new FormInputController();
GameInputController.prototype.__proto__ = FormInputController.prototype;
GameInputController.prototype.timeoutCallback = undefined;
GameInputController.prototype.winTimeoutmSecs = 3000;
GameInputController.prototype.loseTimeoutmSecs = 6000;
GameInputController.prototype.init = function(
  formId,
  inputId,
  resultsId,
  eventType,
  hideViewOnDisable,
  reFocusOnUnhide,
  winTimeoutmSecs,
  lossTimeoutmSecs
) {
  this.formId = formId;
  this.inputId = inputId;
  this.resultsId = resultsId;
  this.eventType = eventType;
  this.hideViewOnDisable = hideViewOnDisable;
  this.reFocusOnUnhide = reFocusOnUnhide;
  this.winTimeoutmSecs = winTimeoutmSecs;
  this.lossTimeoutmSecs = lossTimeoutmSecs;
};
GameInputController.prototype.getTimeoutmSecs = function() {
  return this.timeoutmSecs;
};
GameInputController.prototype.setTimeoutmSecs = function(mSecs) {
  this.timeoutmSecs = mSecs;
};

//============================================================================

function UnitTestGameInputController() {

  // Instantiate the game input controller.
  gic = new GameInputController();

  // Initialize game input controller.
  let fid = document.getElementById("guessed-letter-form");
  let uid = document.getElementById("guessed-letter-input");
  let rid = document.getElementById("results");
  let eventType = "input";
  let hideViewOnDisable = true;
  let reFocusOnUnhide = true;
  let wTimeoutmSecs = 3000; // msecs timeout
  let lTimeoutmSecs = 5000;
  gic.init(
    fid,
    uid,
    rid,
    eventType,
    hideViewOnDisable,
    reFocusOnUnhide,
    wTimeoutmSecs,
    lTimeoutmSecs
  );

  // Wire up the input and timeout callbacks appropriate
  // for your game.
  gic.inputCallback = getInputCallback(gic);
  gic.timeoutCallback = getTimeoutCallback(gic);

  console.log("UnitTestGameInputController: gic = ", gic);
  let stateCounter = 0;

  // Enable input events.
  gic.enableInputListener();
  gic.inputId.focus();

  // Define the input callback for your game.
  function getInputCallback(gic) {
    function innerCallback(e) {
      console.log("innerCallback");

      // Disable input events.
      gic.disableInput();

      // Update the state of your game.
      let newState = updateState(e);

      switch (newState) {
        case "win":
          // Process win case.
          newState = "reset";
          gic.resultsId.textContent="you won";
          setTimeout(gic.timeoutCallback, gic.winTimeoutmSecs);
          break;
        case "loss":
          // Process loss case.
          newState = "reset";
          gic.resultsId.textContent="you lost";
          setTimeout(gic.timeoutCallback, gic.lossTimeoutmSecs);
          break;
        default:
          // Re-enable input listener otherwise.
          gic.enableInput();
      }
    }
    return innerCallback;
  }

  // Logic to update your game's state/model.
  function updateState(e) {
    let state = "";
    var ch = e.data.toLowerCase();
    if (ch >= "a" && ch <= "z") {
      console.log("updateState: valid char: ", ch);
      stateCounter++;
      if (stateCounter == 3) {
        stateCounter = 0;
        state = "win";
        console.log(state);
      }
    }
    return state;
  }

  // Logic to run between (win/loss) rounds of play.
  function getTimeoutCallback(gic) {
    function innerCallback() {
      //
      // Update with app-specific logic here.
      //
      console.log("timeout");
      gic.resultsId.textContent="";

      // Re-enable input events for next round of play.
      gic.enableInput();
    }
    return innerCallback;
  }

} // end UnitTesGameInputController()

// Run unit tests.
// UnitTestGameInputController();
