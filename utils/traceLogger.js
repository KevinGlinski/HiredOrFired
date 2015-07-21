function TraceLogger() {
 	//Trace the function doing the calling and the message to be logged
	this.log = function logWithTrace(message, isScope){
		var stack = (new Error()).stack;
		var stackEntries = stack.split("\n"); //Break stack into individual lines
		var functionNameRegex = "[^\\s*at].* ";// Trims out all but the function name and it's marent object, Ex, Apple.grow
		if(isScope){
            var functionTrace = stackEntries[3].match(functionNameRegex); //Third entry is constant because of header, scope function, and the function calling
        }else{
            var functionTrace = stackEntries[2].match(functionNameRegex); //Second entry is constant because of header, and this function calling
        }
		console.log(functionTrace + " => " + message);
	}

    this.scope = function scopeTrace(){
        this.log("", true);
    }
};

module.exports =  new TraceLogger();