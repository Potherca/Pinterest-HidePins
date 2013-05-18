// Saves options to localStorage.
function saveOptions(p_oEvent) {

    var   aSearchTerms = []
        , $Input = $('input[name="word"]')
        , $Status = $('#status')
    ;

    p_oEvent.preventDefault();

    $Input.each(function(p_i, p_oInput){
        var sWord = $(p_oInput).val();

        if(sWord !== '' && aSearchTerms.indexOf(sWord) === -1){
            aSearchTerms.push($(p_oInput).val());
        }
    });

    localStorage['Pinterest-HidePins'] = JSON.stringify(aSearchTerms);

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

function restoreOptions() {
    var aSearchTerms = JSON.parse(localStorage['Pinterest-HidePins'] || '[]');

    var   $Input = $('input[name="word"]')
        , $Container = $('#input-container')
    ;

    function addInput(p_sWord){
        var $NewInput = $Input.clone();

        $NewInput.val(p_sWord);
        $Input.val('');

        $Container.append($NewInput);
        $Container.append($Input);
        $Input.focus();
    }

    $.each(aSearchTerms, function(p_sIndex, p_sWord){
        addInput(p_sWord)
    });


    $('button[type="button"]').on('click', function(){
        addInput($Input.val())
    });
}

$('#Pinterest-HidePins-Options-Form').on('submit', saveOptions);
$(restoreOptions);

//EOF
