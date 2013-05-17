;(function(){
    console.log('Script Loaded');

    var aSearchTerms = [];

    /* Make sure we've got jQuery */
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
            console.log('jQuery Loaded');
            p_oCallback(jQuery);
        } else {
            window.setTimeout(
                  function() {jQueryLoader(p_oCallback);}
                , 100
            );
        }
    };

    function init($) {
        console.log('Init Called');
        var $Candidates;

        function addStyles(){
            console.log('Style Added');
        // @TODO: These should be replaced by a call including the CSS file (if it is not already present)
            var   sTransition = 'transition: opacity 0.85s ease-in-out 0.5s;'
                , sStylesheet = ''
                    + '.unwanted-pinterest-pin {'
                    + '    '
                    + '}'
                    + '.unwanted-pinterest-pin .unwanted-pin-hider:hover {'
                    + '    opacity: 0;'
                    + '}'
                    + '.unwanted-pinterest-pin .unwanted-pin-hider {'
                    + '    height: 100%;'
                    + '    background-color: rgba(238, 238, 238, 0.85);'
                    + '    position: absolute;'
                    + '    top: 0;'
                    + '    width: 100%;'
                    + '    z-index: 1;'
                    + ''
                    + '    -webkit-' + sTransition
                    + '       -moz-' + sTransition
                    + '        -ms-' + sTransition
                    + '         -o-' + sTransition
                    + '            ' + sTransition
                    + '}'
            ;

            $('head').append('<style>'+sStylesheet+'</style>');
        }

        function addCandidate(p_$Pin) {
            if (typeof $Candidates === 'undefined') {
                $Candidates = p_$Pin;
            } else {
                $Candidates.add(p_$Pin);
            }
        }

        function decorateCandidate(p_$Pin, p_sWord, p_sColor) {
            var $Hider = $('<div class="unwanted-pin-hider">' + p_sWord + '</div>');

            $Hider.click(function(){
                $Hider.remove();
            });

            p_$Pin
                .addClass('unwanted-pinterest-pin')
                .append($Hider)
            ;
        }

        function hidePins(p_aSearchTerms){
            console.log('HidePins Called');

            p_aSearchTerms = p_aSearchTerms || [];

            var   $AllPins = $('.pin, .Pin').not('unwanted-pinterest-pin');

            $AllPins.each(function(){
                var   $Pin = $(this)
                    , sText = $Pin.text().toLowerCase()
                ;

                // Check pin's TEXT first
                $.each(p_aSearchTerms, function(p_i, p_sWord){
                    var sWord = p_sWord.toLowerCase();

                    if(sText.indexOf(sWord) > -1 && $Pin.hasClass('unwanted-pinterest-pin') === false){
                        addCandidate($Pin);
                        decorateCandidate($Pin, p_sWord);
                        return false;
                    }
                });

                // Check a pins LINK as a fallback
                $.each(p_aSearchTerms, function(p_i, p_sWord){
                    var sWord = p_sWord.toLowerCase();
                    
                    if($Pin.find('a.attributionItem[href*="' + sWord + '"]').length > 0  && $Pin.hasClass('unwanted-pinterest-pin') === false){
                        addCandidate($Pin);
                        decorateCandidate($Pin, p_sWord);
                        return false;
                    }
                });
            });
        }

        // Run!
        if(    typeof chrome !== 'undefined' 
            && typeof chrome.extension !== 'undefined'
        ){
            console.log('-- Chrome Extension');    
            // Tell the Chrome Extension we are here
            chrome.extension.sendRequest({}, function(p_oResponse) {
                aSearchTerms = p_oResponse.aSearchTerms || [];
                hidePins(aSearchTerms);
            });
        }else if(false){
            console.log('-- Firefox Addon');
        } else {
            console.log('-- Favelet');
			addStyles();
            // Make sure pins added through AJAX are also hidden
            $(document.body).ajaxStop(function(){
                hidePins(aSearchTerms);
            });
            hidePins(aSearchTerms);
        }
    }

    jQueryLoader(init);
}());

//EOF
