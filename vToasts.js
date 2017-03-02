(function (root, factory) {
    // Implementing the factory pattern
    if (typeof exports === 'object') {
        // commonjs
        module.exports = factory();
    } else {
        // adding vToasts to the window
        root.vToasts = factory();
    }
})(this, function () {
    var vToasts, incrementalID;

    vToasts = {
        // Temp function, while DOM hasn't loaded yet
        toast: function (options) {
            if (document.readyState !== 'complete') {
                console.warn("vToasty hasn't loaded yet!\nYour toast will be toasted once DOMContentLoaded has fired.");
                window.addEventListener('DOMContentLoaded', function () {
                    vToasty.toast(options);
                });
            }
        },
        bindType: bindType,
        // default types
        type: {
            success: 'SUCCESS',
            info: 'INFO',
            warn: 'WARN',
            error: 'ERROR'
        }
    };

    // Waiting for the DOM to be ready
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }

    //Init func
    function init() {
        // init required variables
        incrementalID = 0;
        // create our wrapper element
        var wrapper = document.createElement('div');
        wrapper.id = 'vToatsWrapper';
        document.body.appendChild(wrapper);

        // Binding all the functions
        vToasts.toast = toast;
        vToasts.info = info;
        vToasts.success = success;
        vToasts.warn = warn;
        vToasts.error = error;
    }

    function bindType(newType, keyVal) {
        vToasts.type[keyVal] = newType;
    }

    function toast(args) {
        var toastElem = document.createElement('div');

        function hide() {
            toastElem.className += ' vtoasts-fadeOut';
            toastElem.addEventListener('animationend', remove);
        }

        function remove() {
            // To avoid memory leaks, especially on older browsers
            toastElem.removeEventListener('animationend', remove);
            toastElem.parentElement.removeChild(toastElem);
        }
    }

    function info() {
        toast({
            type: vToasts.type.info
        });
    }

    function success() {
        toast({
            type: vToasts.type.success
        });
    }

    function warn() {
        toast({
            type: vToasts.type.warn
        });
    }

    function error() {
        toast({
            type: vToasts.type.error
        });
    }

    return vToasts;
});