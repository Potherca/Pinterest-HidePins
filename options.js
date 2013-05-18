// Saves options to localStorage.
function saveOptions() {

    var   aSearchTerms = []
        , $Input = $('input[name="word"]')
        , $Status = $('#status')
    ;

    $Input.each(function(p_i, p_oInput){
        var sWord = $(p_oInput).val();

        if(sWord !== '' && aSearchTerms.indexOf(sWord) === -1){
            aSearchTerms.push($(p_oInput).val());
        }
    });

    localStorage['Pinterest-HidePins'] = JSON.stringify(aSearchTerms);

    $Status.html('Options Saved.').addClass('hide-me');

    //alert('wait');// uncomment to see console logs.
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
