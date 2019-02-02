function Frame(copy){
    const size = 27; 
    this.data = new Array(size).fill(false);
    if(copy instanceof Frame){
        for(var i = 0; i<size; i++){
            this.data[i] = copy.getElement[i];
        }
    }
	this.getElement = function(index){
		return this.data[index];
	}
	this.setElement = function(index,value){
        this.data[index] = value;
    }
    this.invertElement = function(index){
        this.data[index] = !this.data[index];
    }
}