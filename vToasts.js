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
        toast: function (options) {
            // Temp function, while DOM hasn't loaded yet
            if (document.readyState !== 'complete') {
                console.warn("vToasts hasn't loaded yet!\nYour toast will be toasted once DOMContentLoaded has fired.");

                // Running when DOMContentLoaded has fired
                window.addEventListener('DOMContentLoaded', function () {

                    // Checking if vToasts holder exists in the DOM so we can append our toasts
                    if (document.getElementById('vtoasts-holder') === null) {
                        var observer = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                if (mutation.addedNodes.length === 0) {
                                    return;
                                }

                                if (document.getElementById('vtoasts-holder') !== null) {
                                    vToasts.toast(options);
                                    observer.disconnect();
                                }
                                console.log(mutation.addedNodes);
                            });
                        });

                        observer.observe(document.body, {
                            childList: true,
                            subtree: true,
                            attributes: false,
                            characterData: false
                        });

                    } else {
                        vToasts.toast(options);
                    }
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
        bindTitle: bindTitle,
        // default titles
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
        vToasts.holder = holder;
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
        vToasts.title[keyVal] = newTitle;
    }

    function toast(args) {
        // Testing if API is being respected
        if (typeof args !== 'object' || typeof args.type === 'undefined' ||
            (
                typeof args.title === 'undefined' &&
                typeof args.content === 'undefined' &&
                typeof args.icon === 'undefined'
            )
        ) {
            console.warn('You need to have the correct parameters to get a proper toast!');
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
        if (typeof args.timeout === 'number') {
            setTimeout(hide, args.timeout);
        } else if (args.timeout !== 'infinite') {
            setTimeout(hide, 3000);
        }

        // vToasts API - hide the toast
        function hide() {
            vtElem.className += ' vtoasts-slideOut';
            vtElem.addEventListener('animationend', remove);
        }

        // vToasts API - remove the toast after it's fully hidden
        function remove() {
            // To avoid memory leaks, especially on older browsers
            vtElem.removeEventListener('animationend', remove);
            vtElem.parentElement.removeChild(vtElem);
            vToasts.toastArr.splice(vToasts.toastArr.indexOf(toast), 1);
        }

        vtElem.onclick = hide;

        // Toast is created, so now we can append it to the page
        vToasts.toastArr.push(toast);
        vToasts.holder.appendChild(vtElem);
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
