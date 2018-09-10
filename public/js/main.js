const SQUARE_SIZE = 100;

let pressedKeys = {};

$(document).on('keydown', function (e) {
    if(e.keyCode === 27) { //escape
        closeDialog();
    }

    pressedKeys[e.keyCode] = true;
}).on('keyup', function (e) {
    delete pressedKeys[e.keyCode];
});

$('[title]').tooltip();

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function spaceBeforeCapitals(text) {
    return text.replace(/([A-Z])/g, ' $1').trim();
}

function showToast(toastType, message, options = {}) {
    let func = toastr[toastType] || toastr.success;
    toastr.options = {
        "debug": false,
        "positionClass": "toast-top-left",
        "onclick": null,
        "fadeIn": 300,
        "fadeOut": 1000,
        "timeOut": 3000
    };

    func(message);
}

function isDialogOpen() {
    return $('.dialog').length;
}

function showDialog(title) {
    closeDialog();
    let $dialog = $('<div class="dialog"><div class="dialog-content"></div></div>');
    let $dialogContent = $dialog.find('.dialog-content');
    let $editor = $('#editor');
    $('body').append($dialog);
    $dialog.css({
        width: $editor.prop('clientWidth') + 17,
        height: $editor.prop('clientHeight') + 17
    });

    if(title)
        $dialogContent.append('<div class="dialog-header"><h5>' + htmlEncode(title) + '</h5><i class="fa fa-close close-dialog"></i></div>');

    $dialogContent.append('<div class="dialog-body"></div>');
    $dialog.on('click', '.close-dialog', function() {
        closeDialog();
    });

    $dialog.on('click', function(e) {
        if($(e.target).is($dialog))
            closeDialog();
    });

    return $dialog;
}

function closeDialog() {
    $('.dialog').remove();
    Object.keys(animationPreviewIntervals).forEach(intervalId => {
        clearInterval(animationPreviewIntervals[intervalId]);
    });
}