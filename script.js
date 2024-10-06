const formPreventDefault = (formNode) => {
  if(!formNode && !formNode.tagName === "FORM") return

  formNode.addEventListener("submit", e => {
    e.preventDefault();
    e.stopPropagation();
  })
}

const getNodeElement = (node = document, selector) => {
  // expect node to localize search of the element. selector for example "[data-set='name']"
  try {
    const el = node.querySelector(selector);
    if(!el) {
      console.warn("getNodeElement didn't find element with given selector: ", selector);
      return
    }
    return el
  } catch (error) {
    console.error("getNodeElement: ", error);
  }
}

const getActiveStepIndex = (arr, className = "active") => {
  // expect array to return index of element by filtering via class name
  try {
    return arr.findIndex(el => el.classList.contains(className));
  } catch (error) {
    console.error("getCurrentActiveIndex ", error);
  }
}

const getActiveStepNodeElement = (arr, index) => {
  // expect array to return Node Element by filtering via class name
  try {
    if(!arr || isNaN(index)) {
      console.warn("getActiveStepNodeElement: array is not provided or index in NaN: ", index);
      return
    }

    return arr[index];
  } catch (error) {
    console.error("getCurrentActiveIndex ", error);
  }
}

const toggleActiveClass = (arr, index, className = "active") => {
  // expect array of node elements, index of active element, and class to add/remove
  try {
    arr.forEach(el => {
      el?.classList.remove(className);
    });
  
    arr[index]?.classList.add(className)
  } catch (error) {
    console.error("toggleActiveClass ", error);
  }
}

const toggleButton = (btnNode, condition = false) => {
  // function turn off and hide button OFF/ON
  // expect condition "true" ? "false" to show/hide the button
  if(!btnNode) return

  btnNode.disabled = !condition;
  btnNode.style.display = (condition) ? "inline-block" : "none";
}

const checkInputsValidity = (stepNode) => {
  // expect step node to check if there required inputs and they are valid
  try {
    if(!stepNode) return

    const inputs = [...stepNode.querySelectorAll("input[required]")];
    return inputs.every(input => input.reportValidity());
  } catch (error) {
    console.error("checkInputsValidity: ", error);
  }
}

const multiStepForm = document.querySelector('[data-multi-step-form]');
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')];

const previousBtn = getNodeElement(multiStepForm, "[data-previous]");
const nextBtn = getNodeElement(multiStepForm, "[data-next]");
const submitBtn = getNodeElement(multiStepForm, "[data-submit]");

// default variables
let currentStep = getActiveStepIndex(formSteps);
let currentStepNode = undefined;

// if no active set as active step first fieldset
if(currentStep < 0) {
  currentStep = 0;
};

// hide submit button if not last step
if(currentStep !== formSteps.length-1) {
  toggleButton(submitBtn, false);
}

toggleActiveClass(formSteps, currentStep);

const updateNavButtons = () => {
  // Function to update control buttons state. disable if button from one of the steps sides.
  try {

    (currentStep <= 0) ? toggleButton(previousBtn, false) 
    : toggleButton(previousBtn, true);

    (currentStep >= formSteps.length-1) ? toggleButton(nextBtn, false) 
    : toggleButton(nextBtn, true);

  } catch (error) {
    console.error("updateNavButtons: ", error);
  }
}
updateNavButtons();

// Turn off default form submit and event propagination
formPreventDefault(multiStepForm);

// navigation action listener (handler)
multiStepForm.addEventListener("click", (e) => {
  const next = e.target.matches("[data-next]");
  const prev = e.target.matches("[data-previous]");
  // check click event on target to prevent run on side "clicks"
  if(!next && !prev) return

  if(currentStep === formSteps.length-1) {
    toggleButton(submitBtn, true);
  }

  currentStepNode = getActiveStepNodeElement(formSteps, currentStep);
  const isStepValid = checkInputsValidity(currentStepNode);
  if(!isStepValid) {
    return
  }

  if(prev) {
    currentStep -= 1
  }
  if(next) {
    currentStep += 1
  }

  if(currentStep === formSteps.length-1) {
    toggleButton(submitBtn, true);
  }

  toggleActiveClass(formSteps, currentStep);
  updateNavButtons();
})
