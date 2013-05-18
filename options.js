var   $FirstInput = $('input[name="word"]:first')
    , $Container = $('#input-container')
;

function saveOptions(p_oEvent) {

    var   aSearchTerms = []
        , $AllInputs = $('input[name="word"]')
        , $Status = $('#status')
    ;

    p_oEvent.preventDefault();

    $AllInputs.each(function(p_i, p_oInput){
        var sWord = $(p_oInput).val().trim();

        if(sWord !== '' && aSearchTerms.indexOf(sWord) === -1){
            aSearchTerms.push($(p_oInput).val());
        }
    });

    localStorage['Pinterest-HidePins'] = JSON.stringify(aSearchTerms);

    restoreOptions(aSearchTerms, true);

    $Status.removeClass('hidden').addClass('success show-me').html('Options Saved.');

    setTimeout(function() {
        $Status.removeClass('success show-me').addClass('hidden');
        }, 3750
    );

    setTimeout(function() {
        $Status.html('&nbsp;');
        }, 4300
    );
}

function addInput(p_sWord){
    var $NewInput = $FirstInput.clone();

    $NewInput.val(p_sWord);
    $FirstInput.val('');

    $Container.append($NewInput);
    $Container.append($FirstInput);

    $FirstInput.focus();
}

function restoreOptions(p_aSearchTerms, p_bReset) {
    var aSearchTerms = p_aSearchTerms || JSON.parse(localStorage['Pinterest-HidePins'] || '[]');

    if(p_bReset === true){
        $Container.find('input').remove().append($FirstInput);
    }

    $.each(aSearchTerms, function(p_sIndex, p_sWord){
        addInput(p_sWord)
    });
}

$('#Pinterest-HidePins-Options-Form').on('submit', saveOptions);

restoreOptions();

$('button[type="button"]').on('click', function(){
    addInput($FirstInput.val())
});


//EOF
