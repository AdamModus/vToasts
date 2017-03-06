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
                console.warn("vToasts hasn't loaded yet!\nYour toast will be toasted once DOMContentLoaded has fired.");
                window.addEventListener('DOMContentLoaded', function () {
                    vToasts.toast(options);
                });
            }
        },
        bindType: bindType,
        // default types
        type: {
            success: 'success',
            info: 'info',
            warn: 'warn',
            error: 'error'
        },
        title: {
            success: 'Sucess',
            info: 'Info',
            warn: 'Warning',
            error: 'Error'
        },
        toastArr: []
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
        // create our holder element
        var holder = document.createElement('div');
        holder.id = 'vtoasts-holder';
        document.body.appendChild(holder);

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

    function bindTitle(newTitle, keyVal) {
        vToasts.title[newTitle, keyVal];
    }

    function toast(args) {
        // Testing if API is being respected
        if (typeof args !== 'object' || typeof obj.type === 'undefined' ||
            (
                typeof obj.title === 'undefined' &&
                typeof obj.content === 'undefined' &&
                typeof obj.icon === 'undefined'
            )
        ) {
            return;
        }

        // Creating the toast element
        var vtElem = document.createElement('div');
        vtElem.className = 'vtoasts-toast vtoasts-slideIn vtoast-' + vToasts.type[args.type];

        // icon
        if (typeof args.icon === 'string') {
            var vtIcon = document.createElement('img');
            vtIcon.className = 'vtoast-icon';
            vtIcon.src = args.icon;
            vtElem.appendChild(vtIcon);
        }

        // title
        if (typeof args.title === 'string') {
            // Title delivered by client
            var vtTitle = document.createElement('span');
            vtTitle.className = 'vtoast-title';
            vtTitle.innerHTML = args.title;
            vtElem.appendChild(vtTitle);
        } else if (typeof vToasts.title[type] === 'string') {
            // Default title matching the type
            var vtTitle = document.createElement('span');
            vtTitle.className = 'vtoast-title';
            vtTitle.innerHTML = vToasts.title[type];
            vtElem.appendChild(vtTitle);
        }

        // content
        if (typeof args.content === 'string') {
            var vtContent = document.createElement('p');
            vtContent.className = 'vtoast-content';
            vtContent.innerHTML = args.content;
            vtElem.appendChild(vtContent);
        }

        // callback
        if (typeof args.callback === 'function') {
            toast.addEventListener('click', args.callback);
        }

        // timeout
        if (typeof options.timeout === 'number') {
            setTimeout(vToasts.hide, options.timeout);
        }

        // vToasts API - hide the toast
        function hide() {
            vtElem.className += ' vtoast-slideOut';
            vtElem.addEventListener('animationend', remove);
        }

        // vToasts API - remove the toast after it's fully hidden
        function remove() {
            // To avoid memory leaks, especially on older browsers
            vtElem.removeEventListener('animationend', remove);
            vToasts.toastArr
            vtElem.parentElement.removeChild(vtElem);
        }

        // Toast is created, so now we can append it to the page
        vToasts.toastArr.push(toast);
        holder.appendChild(vtElem);
    }

    function info(content) {
        toast({
            type: vToasts.type.info,
            content: content
        });
    }

    function success(content) {
        toast({
            type: vToasts.type.success,
            content: content
        });
    }

    function warn(content) {
        toast({
            type: vToasts.type.warn,
            content: content
        });
    }

    function error(content) {
        toast({
            type: vToasts.type.error,
            content: content
        });
    }

    return vToasts;
});


