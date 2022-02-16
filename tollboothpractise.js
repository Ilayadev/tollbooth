var time=24*60*60*1000;
tollbooth = {
    t1001: {
        id: 't1001',
        pair: 't1002',
        passedveh: {
            TN1001: { time: (40 * 60 * 60 * 1000) },
            TN1002: { time:(2 * 60 * 60 * 1000) },
            TN1003: { time: (1 * 60 * 60 * 1000) }

        },
        vehicles: ['TN2479', 'TN1001', 'TN1002', 'TN1003'],
        direction: 'lr',
        queue: 'nellithoopu'

    },
    t1002: {
        id: 't1002',
        pair: 't1001',
        passedveh: {
            TN1001: {time: (3* 60 * 60 * 1000) },
            TN1004: { time: (3 * 60 * 60 * 1000) },
            TN1005: { time: (5 * 60 * 60 * 1000) },
            TN1006: { time: (1 * 60 * 60 * 1000) }
        },
        vehicles: ['TN1004', 'TN1005', 'TN1006'],
        direction: 'rl',
        queue: 'karumputhoopu'

    },   

}

function tolls(currenttoll) {
    var parent = document.querySelector('.container');
    var main = document.createElement('div');
    parent.appendChild(main);
    if (currenttoll.direction !== 'lr') {
        main.style.transform = 'rotate(180deg)'
    }
    var que = document.createElement('div');
    que.className = currenttoll.queue;
    que.classList.add('queue');
    var toll = document.createElement('div');
    toll.className = 'road';
    var tollboo = document.createElement('div');
    tollboo.className = 'toll';
    tollboo.innerHTML='TOLLBOOTH';
    toll.appendChild(tollboo);
    main.appendChild(que);
    main.appendChild(toll);
    function creatingcars(el, vehno, f) {
        var cars = document.createElement('div');
        cars.className = 'car';
        cars.id = vehno;
        el.appendChild(cars);
        cars.innerHTML = vehno;
        var charges = document.createElement('div');
        charges.className = 'charges';
        cars.appendChild(charges);
        if (f == 1) {
            toll.appendChild(cars);
            cars.addEventListener('click', starting)
        }
        function starting() {
            var vehid = currenttoll.vehicles.shift();
            var element = document.getElementById(vehid);
            element.style.left = '40%';
            element.style.transition = '1s';
            setTimeout(() => {
                element.style.left = '60%';
                element.style.transition = '2s';
                billing(currenttoll, vehid)
            }, 1000);
            setTimeout(() => {
                element.style.left = '90%';
                element.style.transition = '0.5s';
            }, 3000);
            setTimeout(() => {
                var pairboothid = currenttoll.pair;
                var pairbooth = tollbooth[pairboothid];
                var pairque = pairbooth.queue;
                element.removeEventListener('click', starting);
                document.getElementsByClassName(pairque)[0].appendChild(element);
                element.style.left = '0%';
                var firstel = toll.appendChild(que.children[0])
                firstel.addEventListener('click', starting);
            }, 4000);


        }
    } var totalvehicles = currenttoll.vehicles.length;
    for (var i = 1; i <= totalvehicles; i++) {
        var id = currenttoll.vehicles[i - 1];
        creatingcars(que, id, i);
    }
}
function creatingtoll() {
    var booth = Object.keys(tollbooth);
    var booths = booth.length;
    for (var i = 0; i < booths; i++) {
        tolls(tollbooth[booth[i]])
    }
}
function billing(toll, veh) {
    var charges;
    var pairboothid = toll.pair;
    var pairbooth = tollbooth[pairboothid];
    pairbooth.vehicles.push(veh);
    if (toll.passedveh[veh] == undefined) {
        if (pairbooth.passedveh[veh] == undefined) {
            // console.log('new car is entering')
            toll.passedveh[veh] = { time:(3 * 60 * 60 * 1000) };
            charges = 50;
        } else {
            var pairvehtime = pairbooth.passedveh[veh].time;
            if (pairvehtime < time) {
                // console.log('the vehicle  enter before 24 hrs from pair');
                charges = 30;
            } else {
                // console.log('the vehicle  enter after 24 hrs from pair');
                charges = 50;
            }
        }
    }
    else {
        var vehtime = toll.passedveh[veh].time;
        if (vehtime < time) {
            // console.log('the vehicle  enter before 24 hrs within samebooth');
            charges = 0;
        }
        else {
            if (pairbooth.passedveh[veh] == undefined) {
               charges=50;

            } else {
                var pairvehtime = pairbooth.passedveh[veh].time;
                if (pairvehtime < time) {
                    // console.log('the vehicle  enter before 24 hrs from pair');
                    charges = 30;
                }
                else {
                    // console.log('the vehicle  enter after 24 hrs from pair');
                    charges = 50;
                }
            }
        }
    }
    document.getElementById(veh).children[0].innerHTML = charges;
}
