module.exports = function () {
  this.queue = [];
  this.timer = null;

  this.enqueue = (operation) => {
    this.queue.push(operation);
  };

  this.run = (func, suggestedChunkSize, suggestedTimeout) => {
    const timeout = suggestedTimeout || 10000;
    const chunkSize = suggestedChunkSize || 100;

    this.timer = setInterval(() => {
      const items = this.queue.splice(0, chunkSize);

      func(items);
    }, timeout);
  };
};