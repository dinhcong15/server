var express = require('express');

class NodeData {
  constructor() {
    this.node ={
        room: "default",
        temp: 0,
        humi: 0
    }
  }
  
  data(arr) {
      this.node.room = arr.room;
      this.node.temp = arr.temp;
      this.node.humi = arr.humi;
  }

  print(){
      console.log("PRINT")
      console.log(this.node)
  }
}

module.exports = NodeData;