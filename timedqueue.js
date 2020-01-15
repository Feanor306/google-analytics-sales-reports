//https://codereview.stackexchange.com/questions/148363/time-delayed-function-queue
//SPECIAL THANKS AND CREDIT TO BLINDMAN67
//for providing this simple solution

// singleton. Assuming you only need one copy of timed queue
const timedQueue = (function(){
    var API;                // internal referance to interface
    const queue = [];       // array to hold functions
    var task = null;        // the next task to run
    var tHandle;            // To stop pending timeout 
    function next(){  // runs current scheduled task and  creates timeout to schedule next
        if(task !== null){          // is task scheduled??
            task.func();            // run it
            task = null;            // clear task
        }
        if(queue.length > 0){       // are there any remain tasks??
            task = queue.shift();   // yes set as next task
            tHandle = setTimeout(next,task.time) // schedual when
        }else{
            API.done = true;
        }
    }
    return API = {
        add : function(func,time){
            queue.push({func : func, time: time});
        },
        start : function(){
            if(queue.length > 0 && API.done){
                API.done = false;   // set state flag
                tHandle = setTimeout(next,0);
            }
        },
        clear : function(){
            task = null;            // remove pending task
            queue.length = 0;       // empty queue
            clearTimeout(tHandle);  // clear timeout
            API.done = true;        // set state flag
        },
        done : true,
    }
})();