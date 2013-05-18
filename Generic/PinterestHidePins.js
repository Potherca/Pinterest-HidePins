;(function(){
    console.log('BlindsForPinterest -- Script Loaded');

    var aSearchTerms = [];

    /* Make sure we've got jQuery */
    // @TODO: The jQuery loader can be removed as jQuery will always be available
    //        For browser extension we load it ourselves and on Pinterest it is
    //        Already available, otherwise our hijacking the AJAX postSend would
    //        never work...
    if(typeof jQuery === 'undefined'){
        var oScriptNode, oPage;

        oScriptNode = document.createElement('script');
        oScriptNode.type = 'text/javascript';
        oScriptNode.async = true;
        oScriptNode.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';

        oPage = document.getElementsByTagName('head')[0]
            || document.getElementsByTagName('body')[0]
        ;

        oPage.appendChild(oScriptNode);
    }
    
    function jQueryLoader(p_oCallback) {
        if (window.jQuery) {
            console.log('BlindsForPinterest -- jQuery Loaded');
            p_oCallback(jQuery);
        } else {
            window.setTimeout(
                  function() {jQueryLoader(p_oCallback);}
                , 100
            );
        }
    };

    function init($) {
        console.log('BlindsForPinterest -- Init Called');
        var iTotalCandidates = 0;

        function addStyles(){
            console.log('BlindsForPinterest -- addStyles called');
            var oStyleLink, oPage;

            oStyleLink = document.createElement('link');
            oStyleLink.rel = 'stylesheet';
            oStyleLink.type = 'text/css';
            oStyleLink.href = 'http://potherca.github.com/Pinterest-HidePins/Generic/PinterestHidePins.css';
            oPage = document.getElementsByTagName('head')[0]
                || document.getElementsByTagName('body')[0]
            ;

            oPage.appendChild(oStyleLink);
        }

        function decorateCandidate(p_$Pin, p_sWord, p_sColor) {
            var $Hider = $('<div class="unwanted-pin-hider"><span>' + p_sWord + '</span></div>');

            $Hider.click(function(){
                $Hider.remove();
            });

            p_$Pin
                .addClass('unwanted-pinterest-pin')
                .append($Hider)
            ;
        }

        function hidePins(p_aSearchTerms){
            var   $AllPins
                , iCandidates = 0
            ;

            console.log('BlindsForPinterest -- HidePins Called, searchterms: ' + JSON.stringify(p_aSearchTerms));

            p_aSearchTerms = p_aSearchTerms || [];

            $AllPins = $('.pin, .Pin').not('.unwanted-pinterest-pin');

            $AllPins.each(function(){
                var   $Pin = $(this)
                    , sText = $Pin.text().toLowerCase()
                ;

                // Check pin's TEXT first
                $.each(p_aSearchTerms, function(p_i, p_sWord){
                    if(p_sWord !== ''){
                        var sWord = p_sWord.toLowerCase();

                        if(sText.indexOf(sWord) > -1 && $Pin.hasClass('unwanted-pinterest-pin') === false){
                            iCandidates++;
                            decorateCandidate($Pin, p_sWord);
                            return false;
                        }
                    }
                });

                // Check a pins LINK as a fallback
                $.each(p_aSearchTerms, function(p_i, p_sWord){
                    if(p_sWord !== ''){
                        var sWord = p_sWord.toLowerCase();

                        if($Pin.find('a.attributionItem[href*="' + sWord + '"]').length > 0  && $Pin.hasClass('unwanted-pinterest-pin') === false){
                            iCandidates++;
                            decorateCandidate($Pin, p_sWord);
                            return false;
                        }
                    }
                });
            });

            iTotalCandidates += iCandidates;

            console.log('BlindsForPinterest -- HidePins -- Pins Found: ' + $AllPins.length + ', Pins Hidden: ' + iCandidates + ', Total Hidden: ' + iTotalCandidates);

        }

        // Run!
        if(    typeof chrome !== 'undefined' 
            && typeof chrome.extension !== 'undefined'
        ){
            console.log('BlindsForPinterest -- Init -- Chrome Extension');
            // Tell the Chrome Extension we are here
            chrome.extension.sendRequest({}, function(p_oResponse) {
                aSearchTerms = p_oResponse.aSearchTerms || [];
                hidePins(aSearchTerms);
            });
        }else if(false){
            console.log('BlindsForPinterest -- Init -- Firefox Addon');
        } else {
            console.log('BlindsForPinterest -- Init -- Favelet');

            var $Body, sSearchTerms;
            
            $Body = $(document.body);
            
            sSearchTerms = $('script[src*="/PinterestHidePins.js"]').attr('data-aSearchTerms') || alert('Could not find any words to hide Pins for!');
            aSearchTerms = JSON.parse(sSearchTerms || '[]');

            addStyles();
            
            // Make sure pins added through AJAX are also hidden
            $Body.ajaxStop(function(){
                hidePins(aSearchTerms);
            });
            // Add PAge Branding
            $Body.append(
                  '<a href="http://potherca.github.io/Pinterest-HidePins/"' 
                + ' class="PinterestHidePins-PageBrand"'
                + ' title="Blinds - Hide Unwanted Pinterest Pins - Click to Visit Homepage"'
                + '></a>'
            );
            
            hidePins(aSearchTerms);
        }

        window.hidePins = hidePins;
    }

    jQueryLoader(init);
}());

//EOF
