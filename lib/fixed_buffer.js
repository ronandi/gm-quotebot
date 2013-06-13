function FixedBuffer(size) {
    this.limit = size;
    this.buffer = [];
}

FixedBuffer.prototype.add = function(elem) {
    if(this.buffer.length == this.limit) {
        this.buffer.shift();
    }
    this.buffer.push(elem);
}

FixedBuffer.prototype.getLast = function() {
    return this.buffer[this.buffer.length-1];
}

FixedBuffer.prototype.isEmpty = function() {
    return this.buffer.length == 0;
}
