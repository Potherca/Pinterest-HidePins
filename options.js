// Saves options to localStorage.
function saveOptions() {

    var   aSearchTerms = []
        , $Input = $('input[name="word"]')
        , $Status = $('#status')
    ;

    $Input.each(function(p_i, p_oInput){
        var sWord = $(p_oInput).val();
        console.log(sWord);
        if(sWord !== '' && aSearchTerms.indexOf(sWord) === -1){
            aSearchTerms.push($(p_oInput).val());
        }
    });

    console.log(aSearchTerms);
    
    localStorage['Pinterest-HidePins'] = JSON.stringify(aSearchTerms);

    $Status.html('Options Saved.').addClass('hide-me');

    //alert('wait');
}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
    var aSearchTerms = JSON.parse(localStorage['Pinterest-HidePins']);

    console.log(typeof aSearchTerms, aSearchTerms);
    
    if (aSearchTerms) {
        var   $Input = $('input[name="word"]')
            , $Container = $('#input-container')
        ;

        $.each(aSearchTerms, function(p_sIndex, p_sWord){
            var $NewInput = $Input.clone();
            $NewInput.val(p_sWord);
            $Container.append($NewInput);
        });
        
        $Container.append($Input);

        $('button[type="button"]').on('click', function(){
            var $NewInput = $Input.clone();
            $Container.append($NewInput);
            $NewInput.val($Input.val());
            $Input.val('');
            $Container.append($Input);
        });
    }
}

$('#Pinterest-HidePins-Options-Form').on('submit', saveOptions);
$(restoreOptions);

//EOF
