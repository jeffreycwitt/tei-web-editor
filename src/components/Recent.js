var Recent = {
  files: [],
  set: function(file){
    if (!this.files.includes(file)){
      this.files.push(file);
    }
  }
}

export default Recent;
