function Task(description, delegate) {
    this.description = description;
    this.delegate = delegate;
};

Task.prototype.render = function() {
    var line_item = $("<li/>"),
        checkbox  = $("<input type='checkbox'/>"),
        label     = $("<label/>");

    checkbox.on("click", $.proxy(this.check, this));

    label.text(this.description);
    line_item.append(checkbox);
    line_item.append(label);

    return line_item;
};

Task.prototype.check = function() {
    this.delegate.remove(this);
};
