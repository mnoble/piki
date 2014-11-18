function TaskList() {
    this.STORAGE_KEY = "piki";
    this.tasks = [];
    this.setEvents();
};

TaskList.prototype.setEvents = function() {
    $("#content").on("keydown", $.proxy(this.keydown, this));
};

TaskList.prototype.keydown = function(event) {
    var task;

    if (event.which != 13) {
        return;
    }

    task = $("#content").text();
    $("#content").text("");

    this.add(task);
};

TaskList.prototype.add = function(task) {
    task = new Task(task, this);
    $("#tasks").append(task.render());

    this.tasks.push(task.description);
    this.save();
};

TaskList.prototype.remove = function(task) {
    this.tasks.pop(task.description);
    this.render();
};

TaskList.prototype.render = function() {
    var _this = this;

    $("#tasks").empty();

    this.tasks.forEach(function(task) {
        $("#tasks").append(new Task(task, _this).render());
    });
};

TaskList.prototype.save = function() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
};

TaskList.prototype.load = function() {
    this.tasks = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    this.render();
};
