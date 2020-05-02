var Annotiser = function (DOMObj) {
    this.DOMObj = DOMObj;
    this.annotations = [];
    
    this.attachEvents(DOMObj);
    
    this.addAnnotationWidgetsToDOM(DOMObj)
    return this;
};
var An = Annotiser;

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

An.prototype.addAnnotationWidgetsToDOM = function (obj) {
      
}

An.prototype.attachEvents = function (DOMObj) {

    this.attachMouseDown(DOMObj);
    this.attachMouseMove(DOMObj)
    this.attachMouseUp(DOMObj);
    this.attachDoubleClick(DOMObj);
};
An.prototype.attachMouseDown = function (obj, callback) {
    var self = this;
    if (!callback) {
        callback = function (event) {
            self.isSelectionStart = true;
        }
    }
    obj.addEventListener('mousedown', callback, false);

};
An.prototype.attachMouseMove = function (obj, callback) {
    var self = this;
    if (!callback) {
        callback = function (event) {
            if (self.isSelectionStart)
                self.isSelecting = true;
        }
    }
    obj.addEventListener('mousemove', callback, false);
}
An.prototype.attachMouseUp = function (obj, callback) {
    var self = this;
    if (!callback) {
        callback = function (event) {
            self.isSelectionStart = false;
            if (self.isSelecting) {
                self.startAnnotating(event);
                self.isSelecting = false;
            }
        }
    }
    obj.addEventListener('mouseup', callback);
};
An.prototype.attachDoubleClick = function (obj, callback) {
    if (isMobile.any()) {
        obj.addEventListener('selectionchange', callback, false);
    }
    else {
        obj.addEventListener('dblclick', callback, false);
    }

};
An.prototype.bringAnnotiserWindow = function (pos) {

};
An.prototype.startAnnotating = function (event) {
    var self = this;
    self.bringAnnotiserWindow({ pageX: event.pageX, pageY: event.pageY });
    self.dispatchEvent(self.DOMObj, 'AnnotiserWindowAppeared', event);
    self.saveAnnotation();
};

An.prototype.dispatchEvent = function (DOMObj, eventName, data) {
    var event;
    event = new CustomEvent(eventName, data);
    DOMObj.dispatchEvent(event);

};

An.prototype.saveAnnotation = function () {
    var self = this,
        selectionObj = window.getSelection(),
        range = selectionObj.getRangeAt(0),
        startOffset = range.startOffset,
        endOffset = range.endOffset,
        annotiserObj = {
            dataText: range.extractContents().textContent,
            parentElement: selectionObj.focusNode.parentElement,
            offset: { start: startOffset, end: endOffset },
            range: range,
            classtoApply : 'hl-color'
        };

    if(!annotiserObj.dataText) return;  

    self.highLight(annotiserObj);
    self.annotations.push(annotiserObj);
    self.dispatchEvent(self.DOMObj, 'Annotised', annotiserObj);
};

An.prototype.highLight = function (obj) {

    var span = document.createElement('span'),
        classtoApply = obj.classtoApply;

    span.className = classtoApply;
    span.innerHTML = obj.dataText;
    obj.range.insertNode(span);
};

/* Pollyfill for customEvent*/
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, true, true, params);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();