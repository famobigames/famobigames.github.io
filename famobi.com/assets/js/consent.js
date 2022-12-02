window.consentModule = function(){

    function module() { 
    }

    var modulePrototype = module.prototype;
    
    var CONSENT_STORAGE_KEY = "fa-games-consent-given";

    modulePrototype.init = function() {
        if (document.readyState === "complete" || document.readyState === "interactive"
                || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
            initConsentBox();
        } else {
            document.addEventListener("DOMContentLoaded", initConsentBox);
        }
    }

    function initConsentBox() {

        if (hasStoredConsent() || typeof OptanonWrapper == 'function')
            return;

        injectStyle();

        var consentBoxHolder = document.createElement("div");
        var consentBox = document.createElement("div");
        var consentBoxLogo = document.createElement("div");
        var consentMessage = document.createElement("p");
        var consentButton = document.createElement("button");
        var consentLinks = document.createElement("p");

        consentBoxHolder.classList.add("consent-box-holder");
        consentBox.classList.add("consent-box");
        consentBoxLogo.classList.add("consent-box-logo");
        consentMessage.classList.add("consent-box-message");
        consentButton.classList.add("consent-box-button");
        consentLinks.classList.add("consent-box-links");

        consentMessage.innerHTML = '<strong>Data Privacy Information:</strong> Our games store your highscores and game progress, track your gaming behaviour and display ads based on your interests. We save an anonymous cookie so we can recognize you. Click on the OK button if you agree and are at least 16 years of age.</p>';
        consentLinks.innerHTML = '<a href="https://famobi.com/vendors/" target="_blank" data-famobi-href="">Ad Vendors</a>&nbsp;<span>&amp;</span>&nbsp;<a href="https://famobi.com/privacy/" target="_blank" data-famobi-href="">Privacy Policy</a>';

        consentButton.type = "button";
        consentButton.innerHTML = "OK";
        consentButton.addEventListener("click", function(){
            consentBoxHolder.style.display = "none";
            maskPage(false);
            storeConsent();
        });

        consentBoxHolder.appendChild(consentBox);
        consentBox.appendChild(consentBoxLogo);
        consentBox.appendChild(consentMessage);
        consentBox.appendChild(consentButton);
        consentBox.appendChild(consentLinks);

        document.body.insertBefore(consentBoxHolder, document.body.firstChild);
        maskPage(true);
    };

    function injectStyle() {
        document.querySelector('head').innerHTML += `
        
                <style type="text/css">
                    @import "https://fonts.googleapis.com/css?family=Open+Sans:400,600,800&display=swap";

                    .consent-box-holder {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        z-index: 1000;
                        margin: 0;
                        padding: 0;
                        border: 0;
                        font: inherit;
                        font-size: 100%;
                        vertical-align: baseline;
                    }
                    .consent-box-holder p {
                        margin: .6875em 0 0 0;
                        font-size: 100%;
                        font-family: "Open Sans",sans-serif;
                        -webkit-font-smoothing: antialiased;
                        color: #00596d;
                        font-weight: 400;
                    }
                    .consent-box-holder strong {
                        font-weight: 600;
                    }
                    .consent-box-holder a {
                        color: #e44c25;
                        text-decoration: none;
                    }
                    .consent-box {
                        background-color: white;
                        opacity: 1;
                        max-width: 30em;
                        border-radius: 1em;
                        box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.35);
                        padding: 1em;
                        margin: 1em;
                        font-size: medium;
                        text-align: center;
                    }
                    .consent-box-message {
                        text-align: left;
                    }
                    .consent-box-button {
                        display: inline-block;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
                        text-decoration: none;
                        padding: 10px 20px;
                        border: 2px solid #8a8a8a;
                        border-radius: 10px;
                        font-weight: 400;
                        font-size: 120%;
                        white-space: nowrap;
                        border-color: #378E00;
                        background-color: #378E00;
                        color: #fff;
                    }
                    .consent-box-logo {
                        display: inline-block;
                        width: 7.5em;
                        height: 3em;
                        background: url(https://img.cdn.famobi.com/_famobi_logos/FamobiLogo_Typo.svg) no-repeat 0 0;
                        background-size: auto 3em;
                        border: none;
                    }
                    body > :not(.consent-box-holder) {
                        transition-property: opacity;
                        transition-duration: 0.5s;
                    }
                </style>;
            `
    }

    function maskPage(enabled) {
        try {
            var topmostContent = document.querySelectorAll("body > :not(.consent-box-holder)");
            for (var element of topmostContent) {
                element.style.filter = enabled ? "blur(6px)" : "none";
                element.style.opacity = enabled ? "0.6" : "1";
            }
        } catch(e) {
            console.warn("cannot mask/unmask page", e);
        }
    }

    function storeConsent() {
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(true));
        } catch(e) {
            console.log("could not store consent state in local storage");
        }
    }

    function hasStoredConsent() {
        var hasConsent = false;
        try {
            hasConsent = !!JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY));
        } catch(e) {
            console.log("could not retrieve consent state from local storage");
        }     
        return hasConsent;   
    }

    var M = new module();
    M.init();
    
    return M;
}();