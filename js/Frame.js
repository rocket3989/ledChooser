function Frame(copy){
    const size = 27; 
    this.data = new Array(size).fill(false);
    if(copy instanceof Frame){
        for(var i = 0; i<size; i++){
            this.data[i] = copy.getElement(i);
        }
    }
    if($.type(copy) === "string"){
        let val = parseInt(copy,16);
        console.log(val);
        for(pow = 0;pow < 27;pow++){
            if(Math.pow(2,31-pow) <= val){
                this.data[pow] = true;
                val -= Math.pow(2,31-pow);
            }
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