Array.prototype.shuffle = function() {
    var swapbucket = this.length, randomelem, tempswap, tempelem;
    while (swapbucket--) {
        randomelem = Math.floor(Math.random() * (swapbucket + 1));
        tempelem = this[randomelem];
        tempswap = this[swapbucket];
        this[randomelem] = tempswap;
        this[swapbucket] = tempelem;
    }
}

module.exports = Array;
