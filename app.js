// Pochamma Agro Target Assistant - Complete Female Voice Solution
let currentLang = "en";
let isListening = false;
let recognition;
let synth = window.speechSynthesis;
let femaleVoice = null;

// Enhanced responses
const responses = {
  en: {
    hello: "Namaste! I'm Pochamma, your Agro Target Assistant. How can I help with farming today?",
    howare: "I'm doing well! Ready to assist with your farming questions.",
    time: `Current time is ${new Date().toLocaleTimeString("en-IN")}.`,
    date: `Today is ${new Date().toLocaleDateString("en-IN", { 
      weekday: "long", year: "numeric", month: "long", day: "numeric" 
    })}.`,
    joke: "Why did the scarecrow win an award? Because he was outstanding in his field! 😄",
    weather: "Check your local weather on our site—it varies by region.",
    news: "You can find the latest farm news in our 'Blog' section.",
    tip: "A good tip: always test your soil pH before fertilizers.",
    bye: "Goodbye! Have a great day!",
    thanks: "You're welcome! Happy to help.",
    delivery: "Deliveries take 2–3 business days based on your location.",
    payment: "We accept UPI, Razorpay, debit/credit cards.",
    register: "Register via 'Create Account'; fill all fields and select your role.",
    farmer: "Farmers can register as 'Farmer' and access crop recommendations.",
    labour: "Labourers register as 'Labour' and can be hired via Hire Labour section.",
    products: "We offer organic, liquid, bio fertilizers, natural mixes, micronutrient mixes, soil conditioners.",
    urea: "Urea is a popular nitrogen fertilizer. Check its page for price and pack sizes.",
    npk: "NPK mixes contain balanced nitrogen, phosphorus, and potassium.",
    compost: "Vermicompost is a rich organic fertilizer produced naturally.",
    order: "Check Orders dashboard to view and manage your past orders.",
    invoice: "After checkout, you can download invoice from the Invoice page.",
    track: "Use your invoice ID on the Orders page to track status.",
    return: "Returns accepted within 7 days via our support section.",
    refund: "Refunds are processed after quality checks, within 5–7 days.",
    croprec: "Use our Crop Recommendation tool—select soil pH and get suggested crops.",
    hire: "Use the 'Hire Labour' section to find and hire workers.",
    support: "You can reach support via the Contact Us page or live chat.",
    hours: "We operate Monday–Saturday, 9 AM–6 PM.",
    location: "We deliver across most Indian PIN codes—enter yours at checkout.",
    price: "Prices per product are on products page; tax and shipping calculated at checkout.",
    account: "Use phone number and password to log in to your account.",
    profile: "In Dashboard, go to 'My Profile' to update details.",
    default: "Sorry, I didn't understand. Please ask about fertilizers, crops, or site features."
  },
  te: {
    hello: "నమస్తే! నేను పోచమ్మ, మీ వ్యవసాయ లక్ష్య సహాయకురాలు. ఈరోజు వ్యవసాయంలో ఎలా సహాయం చేయగలను?",
    howare: "నేను బాగున్నాను! మీ వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.",
    time: `ప్రస్తుత సమయం ${new Date().toLocaleTimeString("te-IN")}.`,
    date: `ఈ రోజు ${new Date().toLocaleDateString("te-IN", { 
      weekday: "long", year: "numeric", month: "long", day: "numeric" 
    })}.`,
    joke: "ఎందుకు భూతాలం అవార్డ్ గెలిచింది? ఎందుకంటే అది ఫీల్డులో అద్భుతంగా ఉండింది! 😄",
    weather: "ప్రాంతానికి అనుగుణంగా వాతావరణం మారుతుంది. మా వెబ్‌సైట్‌లో చూడండి.",
    news: "తాజా వ్యవసాయ వార్తలు మా బ్లాగ్ సెక్షన్‌లో చూడవచ్చు.",
    tip: "భూమి పిహెచ్ పరీక్షించడమంటే మంచి వ్యవసాయ పద్ధతి.",
    bye: "సెలవు! మంచి రోజు గడపండి!",
    thanks: "సహాయం చేయడం సంతోషంగా ఉంది.",
    delivery: "మీ ప్రాంతం ఆధారంగా డెలివరీకి 2-3 రోజులు పడుతుంది.",
    payment: "మేము UPI, Razorpay, డెబిట్/క్రెడిట్ కార్డులు అంగీకరిస్తాము.",
    register: "‘Create Account’ ద్వారా నమోదు చేసుకోండి; అన్ని వివరాలు నింపండి.",
    farmer: "రైతులు 'Farmer' గా రిజిస్టర్ అయి పంట సూచనలు పొందవచ్చు.",
    labour: "లేబరర్లు 'Labour' గా రిజిస్టర్ అయి జాబ్ పొందవచ్చు.",
    products: "మేము ఆర్గానిక్, లిక్విడ్, బయో ఎరువులు, మైక్రోన్యూట్రియంట్లు అందిస్తున్నాము.",
    urea: "యూరియా అనేది ప్రసిద్ధ నైట్రోజన్ ఎరువు.",
    npk: "NPK మిక్సులు నైట్రోజన్, ఫాస్ఫరస్, పొటాషియం కలిగి ఉంటాయి.",
    compost: "వెర్మికంపోస్ట్ సహజంగా తయారైన ఆర్గానిక్ ఎరువు.",
    order: "మీ ఆర్డర్లు Orders పేజీలో చూడండి.",
    invoice: "Checkout తర్వాత ఇన్వాయిస్ డౌన్లోడ్ చేసుకోండి.",
    track: "ఇన్వాయిస్ ID తో ఆర్డర్ ట్రాక్ చేయండి.",
    return: "7 రోజులలో రిటర్న్‌లు అందుబాటులో ఉన్నాయి.",
    refund: "రిఫండ్ 5-7 రోజుల్లో ప్రాసెస్ అవుతుంది.",
    croprec: "Crop Recommendation టూల్ ఉపయోగించి పంట ఎంచుకోండి.",
    hire: "Hire Labour ద్వారా కార్మికులను నియమించుకోండి.",
    support: "Contact Us లేదా Live Chat ద్వారా సహాయం పొందండి.",
    hours: "సోమ-శని, ఉదయం 9 నుంచి సాయంత్రం 6 వరకు పని చేస్తాము.",
    location: "భారతదేశంలోని చాలా ప్రాంతాలకు సరఫరా అందుబాటులో ఉంది.",
    price: "ధరలు products పేజీలో చూడండి.",
    account: "ఫోన్ & పాస్‌వర్డ్ తో లాగిన్ అవ్వండి.",
    profile: "Dashboard లో 'My Profile' లో వివరాలు నవీకరించండి.",
    default: "నాకు స్పష్టంగా అర్థం కాలేదు. దయచేసి ఎరువులు, పంటలు లేదా సైట్ సౌకర్యాల గురించి అడగండి."
  }
};

// Initialize speech synthesis with guaranteed female voice
function initSpeech() {
  if (!synth) {
    console.warn("Speech synthesis not supported");
    addBotMessage(currentLang === "en" ? 
      "Voice output is not supported in your browser" : 
      "మీ బ్రౌజర్‌లో వాయిస్ అవుట్పుట్‌కు మద్దతు లేదు");
    return;
  }

  function loadVoices() {
    const voices = synth.getVoices();
    console.log("Available voices:", voices);

    // For English - we can be more aggressive in finding female voice
    if (currentLang === "en") {
      // Try known female voices first
      femaleVoice = voices.find(v => v.name.includes("Zira")) || // Windows
                   voices.find(v => v.name.includes("Google UK English Female")) || // Chrome
                   voices.find(v => v.name.includes("Samantha")) || // Mac
                   voices.find(v => v.name.includes("Female") && v.lang.startsWith("en")) ||
                   voices.find(v => v.name.includes("Woman") && v.lang.startsWith("en")) ||
                   voices.find(v => !v.name.includes("Male") && v.lang.startsWith("en"));
    }
    // For Telugu - we have to work with what's available
    else {
      femaleVoice = voices.find(v => (v.name.includes("Female") || !v.name.includes("Male")) && 
                                    (v.lang.startsWith("te") || v.lang === "hi-IN")) ||
                   voices.find(v => v.lang.startsWith("te"));
    }

    if (!femaleVoice) {
      femaleVoice = voices.find(v => v.lang.startsWith(currentLang === "te" ? "te" : "en"));
      console.warn("Could not find ideal female voice, using fallback:", femaleVoice?.name);
      if (currentLang === "te") {
        showVoiceInstructions();
      }
    } else {
      console.log("Using voice:", femaleVoice.name);
    }
  }

  // Multiple loading attempts for Chrome
  synth.onvoiceschanged = loadVoices;
  loadVoices();
  setTimeout(loadVoices, 1000);
  setTimeout(loadVoices, 3000); // Extra delay for slow voice loading
}

// Speak text with guaranteed female characteristics
function speak(text) {
  if (!synth) return;
  
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Language settings
  utterance.lang = currentLang === "te" ? "te-IN" : "en-US";
  
  // Voice selection
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  // Female voice characteristics
  utterance.pitch = currentLang === "en" ? 1.3 : 1.2;  // Higher pitch for English
  utterance.rate = 0.9;   // Slightly slower
  utterance.volume = 1.0;

  utterance.onerror = (e) => {
    console.error("Speech error:", e.error);
    
    // Fallback to default speech without voice selection
    if (e.error === 'voice-not-found') {
      const fallbackUtterance = new SpeechSynthesisUtterance(text);
      fallbackUtterance.lang = utterance.lang;
      fallbackUtterance.pitch = 1.2;
      synth.speak(fallbackUtterance);
    }
  };

  synth.speak(utterance);
}

// Initialize voice recognition
function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported");
    document.getElementById("voice-btn").style.display = "none";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onstart = () => {
    isListening = true;
    document.getElementById("voice-btn").classList.add("listening");
  };
  
  recognition.onend = () => {
    isListening = false;
    document.getElementById("voice-btn").classList.remove("listening");
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("chat-input").value = transcript;
    document.getElementById("chat-form").dispatchEvent(new Event("submit"));
  };
  
  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    addMessage(currentLang === "en" ? 
      "Sorry, I didn't catch that. Please try again." : 
      "క్షమించండి, నేను వినలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.", false);
  };
}

// Add message to chat
function addMessage(text, isUser = false) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "bot"}`;
  
  // Add Telugu class if text contains Telugu characters
  if (/[\u0C00-\u0C7F]/.test(text)) {
    messageDiv.classList.add("telugu");
  }
  
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Speak only bot responses
  if (!isUser) {
    speak(text);
  }
}

// Show typing indicator
function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing";
  typingDiv.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingDiv;
}

// Get bot response
function getResponse(message) {
  const msg = message.toLowerCase();
  const langResponses = responses[currentLang];
  
  // Check for exact matches first
  for (const key in langResponses) {
    if (msg === key || msg.includes(key)) {
      return langResponses[key];
    }
  }
  
  // Check for common farming terms
  if (currentLang === "en") {
    if (msg.includes("fertilizer") || msg.includes("urea") || msg.includes("npk")) {
      return langResponses.products;
    }
    if (msg.includes("crop") || msg.includes("plant")) {
      return langResponses.croprec;
    }
  } else {
    if (msg.includes("ఎరువు") || msg.includes("యూరియా")) {
      return langResponses.products;
    }
    if (msg.includes("పంట") || msg.includes("మొక్క")) {
      return langResponses.croprec;
    }
  }
  
  return langResponses.default;
}

// Show voice setup instructions
function showVoiceInstructions() {
  const content = currentLang === "en" ? 
    `<h4>For Female Voice in English:</h4>
    <p><b>Windows:</b> Use "Microsoft Zira" voice (comes preinstalled)</p>
    <p><b>Mac:</b> Use "Samantha" voice</p>
    <p><b>Android:</b> Install "Google Text-to-speech" and select English (UK) female</p>
    <p><b>Chrome:</b> Uses "Google UK English Female" by default</p>
    
    <h4>For Telugu Female Voice:</h4>
    <p>1. Open Windows Settings > Time & Language > Language</p>
    <p>2. Add Telugu language if not already added</p>
    <p>3. Go to Speech settings and install Telugu text-to-speech</p>
    <p>4. Refresh this page after installation</p>
    <p><b>Note:</b> Some browsers may not support Telugu female voice</p>` :
    
    `<h4>తెలుగు స్త్రీ స్వరం కోసం:</h4>
    <p>1. Windows సెట్టింగ్‌లు > టైమ్ & లాంగ్వేజ్ > లాంగ్వేజ్</p>
    <p>2. తెలుగు భాషను జోడించండి</p>
    <p>3. స్పీచ్ సెట్టింగ్‌లకు వెళ్లి తెలుగు టెక్స్ట్-టు-స్పీచ్‌ను ఇన్‌స్టాల్ చేయండి</p>
    <p>4. ఇన్‌స్టాలేషన్ తర్వాత ఈ పేజీని రిఫ్రెష్ చేయండి</p>
    <p><b>గమనిక:</b> కొన్ని బ్రౌజర్‌లు తెలుగు స్త్రీ స్వరానికి మద్దతు ఇవ్వకపోవచ్చు</p>`;
    
  document.getElementById('instructions-content').innerHTML = content;
  document.getElementById('voice-instructions').style.display = 'block';
}

// Initialize the chatbot
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const langToggle = document.getElementById("lang-toggle");
  const voiceBtn = document.getElementById("voice-btn");
  const voiceHelpBtn = document.getElementById("voice-help-btn");
  const closeInstructions = document.getElementById("close-instructions");

  // Initialize speech features
  initSpeech();
  initVoiceRecognition();
  
  // Set up event listeners
  closeInstructions.addEventListener("click", () => {
    document.getElementById('voice-instructions').style.display = 'none';
  });
  
  voiceHelpBtn.addEventListener("click", showVoiceInstructions);
  
  // Welcome message
  setTimeout(() => {
    addMessage(currentLang === "en" ? 
      "Namaste! I'm Pochamma, your Agro Target Assistant. Ask me about farming or our services." : 
      "నమస్తే! నేను పోచమ్మ, మీ వ్యవసాయ లక్ష్య సహాయకురాలు. వ్యవసాయం లేదా మా సేవల గురించి అడగండి.", false);
    
    // Check if we have a good voice
    setTimeout(() => {
      if (!femaleVoice || (currentLang === "te" && !femaleVoice.name.includes("Female"))) {
        addMessage(currentLang === "en" ?
          "Tip: For best voice experience, please install female voices in your system settings (click the help icon)." :
          "సలహా: మెరుగైన వాయిస్ అనుభవం కోసం, దయచేసి మీ సిస్టమ్ సెట్టింగ్‌లలో స్త్రీ స్వరాలను ఇన్‌స్టాల్ చేయండి (హెల్ప్ ఐకాన్‌పై క్లిక్ చేయండి).", false);
      }
    }, 1500);
  }, 500);

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    input.value = "";
    
    // Show typing indicator
    const typing = showTyping();
    
    // Simulate thinking delay
    setTimeout(() => {
      typing.remove();
      const response = getResponse(message);
      addMessage(response, false);
    }, 800 + Math.random() * 800);
  });

  // Language toggle
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "te" : "en";
    langToggle.textContent = currentLang === "en" ? "తెలుగు" : "English";
    
    // Update placeholder
    input.placeholder = currentLang === "en" ? 
      "Type your message..." : "మీ సందేశం ఇక్కడ టైప్ చేయండి...";
    
    // Reinitialize speech with new language
    initSpeech();
    
    // Confirmation message
    addMessage(currentLang === "en" ? 
      "Language switched to English. How can I help with your farming targets?" : 
      "భాష తెలుగుకు మార్చబడింది. మీ వ్యవసాయ లక్ష్యాలకు ఎలా సహాయం చేయగలను?", false);
  });

  // Voice input
  voiceBtn.addEventListener("click", () => {
    if (!recognition) {
      addMessage(currentLang === "en" ? 
        "Voice input is not supported in your browser" : 
        "మీ బ్రౌజర్‌లో వాయిస్ ఇన్పుట్‌కు మద్దతు లేదు", false);
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.lang = currentLang === "en" ? "en-IN" : "te-IN";
        recognition.start();
      } catch (err) {
        console.error("Recognition error:", err);
      }
    }
  });
});